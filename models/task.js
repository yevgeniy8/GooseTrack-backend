const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../helpers/handleMongooseError');

const timeRegexp = /^\d{2}:\d{2}$/;
const dateRegexp = /^\d{4}-\d{2}-\d{2}$/;
const priorityList = ['low', 'medium', 'high'];
const categoryList = ['to-do', 'in-progress', 'done'];

const taskSchema = new Schema(
    {
        title: {
            type: String,
            maxlength: 250,
            required: true,
        },
        start: {
            type: String,
            match: timeRegexp,
            required: true,
        },
        end: {
            type: String,
            match: timeRegexp,
            required: true,
        },
        priority: {
            type: String,
            enum: priorityList,
            required: true,
        },
        date: {
            type: String,
            match: dateRegexp,
            required: true,
        },
        category: {
            type: String,
            enum: categoryList,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    },
    { versionKey: false, timestamps: true }
);

taskSchema.post('save', handleMongooseError);

// const emptyBody = Joi.object()
//     .min(1)
//     .messages({ 'object.min': 'Missing fields' });

// const emptyBodyFavorite = Joi.object()
//     .min(1)
//     .messages({ 'object.min': 'Missing field favorite' });

const addShema = Joi.object({
    title: Joi.string().required(),
    start: Joi.string().required().pattern(timeRegexp),
    end: Joi.string().required().pattern(timeRegexp),
    priority: Joi.string()
        .required()
        .valid(...priorityList),
    date: Joi.string().required().pattern(dateRegexp),
    category: Joi.string()
        .required()
        .valid(...categoryList),
});

// const updateFavoriteShema = Joi.object({
//     favorite: Joi.boolean().required(),
// });

const shemas = {
    addShema,
    //     updateFavoriteShema,
    //     emptyBody,
    //     emptyBodyFavorite,
};

const Task = model('task', taskSchema);

module.exports = {
    Task,
    shemas,
};
