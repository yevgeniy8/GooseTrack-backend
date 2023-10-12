const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { HttpError } = require('../helpers');

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
                return next(HttpError(401, 'Not authorized'));
            }

            const user = await User.findById(decode.id);
            if (!user || !user.token || token !== user.token) {
                return next(HttpError(401, 'Not authorized'));
            }
            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
};

module.exports = auth;
