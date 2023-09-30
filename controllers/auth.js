const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const { User } = require('../models/user');
const {
    HttpError,
    ctrlWrapper,
    cloudinaryForImage,
    assignToken,
} = require('../helpers');

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const avatarURL = '../public/defoult.png';

    const newUser = await User.create({
        ...req.body,
        password: hashPassword,
        avatarURL,
        verificationToken,
    });

    //      const verifyEmail = {
    //     to: email,
    //     subject: "Verify email",
    //     html: `<a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank">Click verify email</a>`,
    //   };

    //   await sendEmail(verifyEmail);

    res.status(201).json({
        user: { email: newUser.email, name: newUser.name },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    }

    // if (!user.verify) {
    //     throw HttpError(401, 'Email not verified');
    // }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const { accessToken, refreshToken } = assignToken(user);
    await User.findByIdAndUpdate(user._id, { refreshToken });
    res.status(200).json({
        accessToken,
        user: { email: user.email, name: user.name },
    });
};

const getCurrent = async (req, res) => {
    const { email, name, birthday, phone, skype, avatarURL, token } = req.user;

    res.json({
        email,
        name,
        birthday,
        phone,
        skype,
        avatarURL,
        token,
    });
};

const editUser = async (req, res) => {
    const { body, file } = req;
    const { name, birthday, phone, skype, email, avatarURL, token } = body;
    const { _id } = req.user;

    const userData = { name, birthday, phone, skype, email, avatarURL, token };

    if (file) {
        const { avatarURL } = await cloudinaryForImage(req);
        body.avatarURL = avatarURL;
    } else {
        body.avatarURL = body.avatar;
    }

    const newUser = await User.findByIdAndUpdate(_id, userData, {
        new: true,
    });
    if (!newUser) throw HttpError(500, 'Failed');
    if (newUser) {
        const { name, email, birthday, phone, skype, avatarURL, token } =
            newUser;
        return res.status(200).json({
            message: 'Updated successfully',
            newUser: {
                name,
                email,
                birthday,
                phone,
                skype,
                avatarURL,
                token,
            },
        });
    }
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.status(204).json();
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    editUser: ctrlWrapper(editUser),
};

// "servers": [{ "url": "https://goose-track-backend-q3re.onrender.com" }],
