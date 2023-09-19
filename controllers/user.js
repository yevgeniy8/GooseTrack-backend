const userSchema = require('../schema/user');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const jimp = require('jimp');
const path = require('path');
const fs = require('fs').promises;
const HttpError = require('../helpers/HttpError');
const crypto = require('crypto');
const sendEMail = require('../helpers/sendEmail');

const register = async (req, res, next) => {
    const { error } = userSchema.userRegister.validate(req.body);
    if (error) {
        // throw HttpError(400, error.message);
        return res.status(400).json({ error: error.message });
    }
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, 'Email in use');
            // return res.status(409).json({ message: 'Email in use' });
        }

        const passwordHash = await bcryptjs.hash(password, 10);

        const avatarURL = gravatar.url(email);

        const verificationToken = crypto.randomUUID();

        const doc = await User.create({
            ...req.body,
            password: passwordHash,
            avatarURL,
            verificationToken,
        });

        await sendEMail({
            to: email,
            subject: `Welcome on board, ${email}`,
            html: `
        <p>To confirm your registration, please click on link below</p>
        <p>
          <a href="http://localhost:3000/users/verify/${verificationToken}">Click me</a>
        </p>
      `,
            text: `
        To confirm your registration, please click on link below\n
        http://localhost:3000/api/auth/verify/${verificationToken}
      `,
        });

        res.status(201).json({
            user: {
                email: doc.email,
                subscription: doc.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const doc = await User.findOne({ verificationToken });
        if (!doc) {
            throw HttpError(404, 'User not found');
        }

        await User.findByIdAndUpdate(doc._id, {
            verificationToken: null,
            verify: true,
        });

        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        next(error);
    }
};

const resendVerifyEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const { error } = userSchema.userEmail.validate(req.body);
        if (error) {
            throw HttpError(400, 'missing required field email');
            // return res.status(400).json({ error: error.message });
        }

        const doc = await User.findOne({ email });
        if (!doc) {
            throw HttpError(404, 'Email not found');
        }
        if (doc.verify) {
            throw HttpError(400, 'Verification has already been passed');
        }

        await sendEMail({
            to: email,
            subject: `Welcome on board, ${email}`,
            html: `
        <p>To confirm your registration, please click on link below</p>
        <p>
          <a href="http://localhost:3000/users/verify/${doc.verificationToken}">Click me</a>
        </p>
      `,
            text: `
        To confirm your registration, please click on link below\n
        http://localhost:3000/api/auth/verify/${doc.verificationToken}
      `,
        });

        res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    const { error } = userSchema.userRegister.validate(req.body);
    if (error) {
        // throw HttpError(400, error.message);
        return res.status(400).json({ message: error.message });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(401, 'Email or password is wrong');
            // return res
            //     .status(401)
            //     .json({ message: 'Email or password is wrong' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            throw HttpError(401, 'Email or password is wrong');
            // return res
            //     .status(401)
            //     .json({ message: 'Email or password is wrong' });
        }

        if (!user.verify) {
            throw HttpError(401, 'Please verify your email');
        }

        const payload = {
            id: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '23h',
        });

        await User.findByIdAndUpdate({ _id: payload.id }, { token });

        res.status(200).json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    const { _id } = req.user;
    try {
        const user = await User.findById(_id);
        if (!user) {
            throw HttpError(401, 'Not authorized');
            // return res.status(401).json({ message: 'Not authorized' });
        }
        await User.findByIdAndUpdate(_id, { token: null });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

const getCurrent = async (req, res, next) => {
    const { _id, email, subscription } = req.user;
    try {
        const user = await User.findById(_id);
        if (!user) {
            throw HttpError(401, 'Not authorized');
            // return res.status(401).json({ message: 'Not authorized' });
        }
        res.status(200).json({
            email,
            subscription,
        });
    } catch (error) {
        next(error);
    }
};

const updateStatusUser = async (req, res, next) => {
    const { _id } = req.user;
    const { error } = userSchema.userStatus.validate(req.body);
    if (error) {
        // throw HttpError(400, error.message);
        return res.status(400).json({ error: error.message });
    }

    const user = await User.findByIdAndUpdate(_id, req.body, { new: true });

    if (!user) {
        // throw HttpError(404, 'Not Found');
        return next();
    }

    res.status(200).json(user);
};

const updateAvatar = async (req, res, next) => {
    const { _id } = req.user;
    const { path: tmpUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');
    const resultUpload = path.join(avatarsDir, filename);
    jimp.read(tmpUpload)
        .then(img => {
            return img.resize(250, 250).write(resultUpload);
        })
        .catch(err => {
            console.error(err);
        });

    await fs.unlink(tmpUpload);
    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarURL }, { new: true });
    res.json({ avatarURL });
};

module.exports = {
    register,
    verifyEmail,
    resendVerifyEmail,
    login,
    logout,
    getCurrent,
    updateStatusUser,
    updateAvatar,
};
