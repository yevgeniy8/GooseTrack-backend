const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { HttpError, ctrlWrapper, cloudinaryForImage } = require('../helpers');
const { JWT_SECRET, BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } =
    process.env;

const queryString = require('querystring');
const axios = require('axios');

let LOCAL_URL = '';
const googleAuth = async (req, res) => {
    LOCAL_URL = req.headers.referer;
    const stringifiedParams = queryString.stringify({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: `${BASE_URL}/auth/google-redirect`,
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '),
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
    });
    return res.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
    );
};

const googleRedirect = async (req, res) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);
    const code = urlParams.code;

    console.log(code);
    const tokenData = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: `${BASE_URL}/auth/google-redirect`,
            grant_type: 'authorization_code',
            code,
        },
    });
    const userData = await axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {
            Authorization: `Bearer ${tokenData.data.access_token}`,
        },
    });
    console.log(userData);

    const user = await User.findOne({ email: userData.data.email });
    if (!user) {
        const newUser = await User.create({
            name: userData.data.name,
            email: userData.data.email,
        });
        const payload = {
            id: newUser._id,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
        await User.findByIdAndUpdate(newUser._id, { token });
        return res.redirect(`${LOCAL_URL}GooseTrack/login?token=${token}`);
    } else {
        const payload = {
            id: user._id,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
        await User.findByIdAndUpdate(user._id, { token });
        return res.redirect(`${LOCAL_URL}GooseTrack/login?token=${token}`);
    }
};

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        ...req.body,
        password: hashPassword,
    });
    const payload = {
        id: newUser._id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    await User.findByIdAndUpdate(newUser._id, { token });

    res.status(201).json({
        token,
        user: { email: newUser.email, name: newUser.name },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const payload = {
        id: user._id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token,
        user: {
            email: user.email,
            name: user.name,
            birthday: user.birthday,
            phone: user.phone,
            skype: user.skype,
            avatarURL: user.avatarURL,
        },
    });
};

const getCurrent = async (req, res) => {
    const { email, name, birthday, phone, skype, avatarURL } = req.user;

    res.json({
        email,
        name,
        birthday,
        phone,
        skype,
        avatarURL,
    });
};

const editUser = async (req, res) => {
    const { body, file, user } = req;

    if (file) {
        const { avatarURL } = await cloudinaryForImage(req);
        body.avatarURL = avatarURL;
    } else {
        body.avatarURL = body.avatar;
    }

    const newUser = await User.findByIdAndUpdate(
        user._id,
        {
            $set: body,
        },
        {
            new: true,
        }
    );
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
    googleAuth: ctrlWrapper(googleAuth),
    googleRedirect: ctrlWrapper(googleRedirect),
};
