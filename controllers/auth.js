const bcrypt = require('bcryptjs');
const { User } = require('../models/user');
const { HttpError, ctrlWrapper } = require('../helpers');
const { nanoid } = require('nanoid');

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const newUser = await User.create({
        ...req.body,
        password: hashPassword,

        verificationToken,
    });

    res.status(201).json({
        user: { email: newUser.email },
    });
};

module.exports = {
    register: ctrlWrapper(register),
};
