const userSchema = require('../schema/user');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    const { error } = userSchema.userRegister.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'Email in use' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        const doc = await User.create({ ...req.body, password: passwordHash });
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

const login = async (req, res, next) => {
    const { error } = userSchema.userRegister.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ message: 'Email or password is wrong' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(401)
                .json({ message: 'Email or password is wrong' });
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
            return res.status(401).json({ message: 'Not authorized' });
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
            return res.status(401).json({ message: 'Not authorized' });
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
        return res.status(400).json({ error: error.message });
    }

    const user = await User.findByIdAndUpdate(_id, req.body, { new: true });

    if (!user) {
        return next();
    }

    res.status(200).json(user);
};

module.exports = {
    register,
    login,
    logout,
    getCurrent,
    updateStatusUser,
};
