const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') {
        return res.status(401).json({ message: 'Not authorized' });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res
                        .status(401)
                        .send({ message: 'Token is expired' });
                }
            }

            const user = await User.findById(decode.id);
            if (!user || !user.token || token !== user.token) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
};

module.exports = auth;
