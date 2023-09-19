const Joi = require('joi');

const userRegister = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    subscription: Joi.string(),
});

const userLogin = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
});

const userStatus = Joi.object({
    subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

const userEmail = Joi.object({
    email: Joi.string().required(),
});

module.exports = {
    userRegister,
    userLogin,
    userStatus,
    userEmail,
};
