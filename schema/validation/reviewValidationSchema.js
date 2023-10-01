const Joi = require('joi');

const addReviewValidationSchema = Joi.object({
    review: Joi.string().min(1).max(300).required(),
    rating: Joi.number().min(1).max(5).required(),
});

const updateReviewValidationSchema = Joi.object({
    review: Joi.string().min(1).max(300),
    rating: Joi.number().min(1).max(5),
}).or('review', 'rating');

module.exports = { addReviewValidationSchema, updateReviewValidationSchema };
