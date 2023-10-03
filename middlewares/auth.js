const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { HttpError} = require('../helpers');
// const { TokenExpiredError } = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') {
        next(HttpError(401));
    }
    try {
        jwt.verify(token, JWT_SECRET, async (err, decode) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res
                        .status(401)
                        .send({ message: 'Token is expired' });
                }
            }

            if (!decode) {
                // throw HttpError(401, 'Not authorized');
                return next(HttpError(401, 'Not authorized'));
                // return res.status(401).json({ message: 'Not authorized' });
            }

            const user = await User.findById(decode.id);
            if (!user || !user.token || token !== user.token) {
                return next(HttpError(401, 'Not authorized'));

                // return res.status(401).json({ message: 'Not authorized' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
    // const { authorization = '' } = req.headers;
    // const [bearer, token] = authorization.split(' ');

    // if (bearer !== 'Bearer' || !token) {
    //     return next(HttpError(401, 'Unauthorized. No token'));
    // }

    // const payload = jwt.decode(token);
    // let fetchUser;

    // try {
    //     fetchUser = await User.findOne({ _id: payload.id });
    //     if (!fetchUser || !fetchUser.refreshToken) {
    //         return next(HttpError(401, 'Unauthorized. User not found'));
    //     }

    //     jwt.verify(token, JWT_SECRET);

    //     req.user = fetchUser;

    //     next();
    // } catch (error) {
    //     if (!(error instanceof TokenExpiredError)) {
    //         return next(HttpError(401, 'Unauthorized. Invalid token'));
    //     }

    //     try {
    //         jwt.verify(fetchUser.refreshToken, JWT_REFRESH_SECRET);

    //         const { accessToken, refreshToken } = assignToken(fetchUser);

    //         await User.findByIdAndUpdate(fetchUser._id, { refreshToken });

    //         const { email, name, birthday, phone, skype, avatarURL } =
    //             fetchUser;
    //         res.json({
    //             accessToken,
    //             email,
    //             name,
    //             birthday,
    //             phone,
    //             skype,
    //             avatarURL,
    //         });
    //     } catch (error) {
    //         return next(HttpError(401, 'Refresh token is expired'));
    //     }
    // }
    //
};

module.exports = auth;
