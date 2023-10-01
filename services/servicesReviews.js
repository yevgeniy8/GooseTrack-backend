const { Review } = require('../models/reviews');
const { HttpError } = require('../helpers');

const getAllReviewsService = async () => {
    return await Review.find().exec();
};

const getReviewByOwnerService = async ownerId => {
    const review = await Review.findOne({ 'user.owner': ownerId }).exec();

    if (!review) {
        throw new HttpError(404, 'Review not found');
    }
    return review;
};

const createReviewService = async (
    { review, rating, name, avatarURL },
    ownerId
) => {
    const existingReview = await Review.findOne({
        'user.owner': ownerId,
    }).exec();

    if (existingReview) {
        throw HttpError(409, 'User can only create one review');
    }

    const newReview = await Review.create({
        review,
        rating,
        user: { owner: ownerId, name, avatarURL }, // Создаем объект user с вложенными полями
    });

    return newReview;
};

const updateReviewService = async (ownerId, body) => {
    const { review, rating } = body;

    const updatedReview = await Review.findOneAndUpdate(
        { 'user.owner': ownerId },
        { $set: { review, rating } },
        { new: true }
    );

    return updatedReview;
};

const deleteReviewService = async ownerId => {
    const deletedReview = await Review.findOneAndRemove({
        'user.owner': ownerId,
    });

    if (!deletedReview) {
        throw new HttpError(404, 'Review not found');
    }

    return deletedReview;
};

module.exports = {
    getAllReviewsService,
    getReviewByOwnerService,
    createReviewService,
    updateReviewService,
    deleteReviewService,
};
