const { isValidObjectId } = require('mongoose');

const HttpError = require('../helpers/HttpError');

const isValidId = (req, _, next) => {
    const { id } = req.params;
    console.log(id);
    if (!isValidObjectId(id)) {
        return next(HttpError(400, `${id} is not a valid id`));
    }
    next();
};

module.exports = isValidId;
