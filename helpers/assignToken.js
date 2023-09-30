const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
// const {
//     ACCESS_TOKEN_SECRET,
//     REFRESH_TOKEN_SECRET,
//     ACCESS_TOKEN_EXPIRES_IN,
//     REFRESH_TOKEN_EXPIRES_IN,
// } = process.env;

const assignToken = user => {
    const payload = {
        id: user._id,
        email: user.email,
    };
    const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '5m',
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: '24h',
    });
    return {
        accessToken,
        refreshToken,
    };
};

module.exports = assignToken;
