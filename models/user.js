const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../helpers/handleMongooseError');

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Set name for user'],
        },
        password: {
            type: String,
            required: [true, 'Set password for user'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        token: String,
        avatarURL: { type: String },
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
        },
    },
    { versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);

const usersSchemaRegister = Joi.object({
    name: Joi.string()
        .required()
        .messages({ 'any.required': 'missing required name field' }),
    email: Joi.string()
        .pattern(emailRegexp)
        .required()
        .messages({ 'any.required': 'missing required email field' }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({ 'any.required': 'missing required password field' }),
});

const usersSchemaLogin = Joi.object({
    email: Joi.string()
        .pattern(emailRegexp)
        .required()
        .messages({ 'any.required': 'missing required email field' }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({ 'any.required': 'missing required password field' }),
});

const emptyBody = Joi.object()
    .min(1)
    .messages({ 'object.min': 'Missing fields' });

const emailSchema = Joi.object({
    email: Joi.string()
        .pattern(emailRegexp)
        .required()
        .messages({ 'any.required': 'missing required email field' }),
});

const schemas = {
    usersSchemaRegister,
    usersSchemaLogin,
    emptyBody,
    emailSchema,
};

const User = model('user', userSchema);

module.exports = {
    User,
    schemas,
};
