const isValidId = require('./isValidId');
const validateBody = require('./validateBody');
const auth = require('./auth');
const upload = require('./upload');
const passport = require('./passport');

module.exports = {
    isValidId,
    validateBody,
    auth,
    upload,
    // passport,
};
