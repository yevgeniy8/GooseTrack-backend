const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../helpers/handleMongooseError');

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
    {
        name: {
            type: String,
            minlength: 2,
            required: [true, 'Set name for user'],
        },
        password: {
            type: String,
            minlength: 6,
            required: [true, 'Set password for user'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        skype: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            default: '',
        },
        birthday: {
            type: Date,
            min: '1920-01-01',
            default: '',
        },
        avatarURL: {
            type: String,
            default: '',
        },
        token: String,
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

// const emailSchema = Joi.object({
//     email: Joi.string()
//         .pattern(emailRegexp)
//         .required()
//         .messages({ 'any.required': 'missing required email field' }),
// });

const editUserSchema = Joi.object({
    name: Joi.string().min(2),
    birthday: Joi.date().allow('', null),
    email: Joi.string().pattern(emailRegexp).required(),
    phone: Joi.string().allow('', null),
    skype: Joi.string().allow('', null),
    avatarURL: Joi.string().allow('', null),
});

const schemas = {
    usersSchemaRegister,
    usersSchemaLogin,
    emptyBody,
    // emailSchema,
    editUserSchema,
};

const User = model('user', userSchema);

module.exports = {
    User,
    schemas,
};
