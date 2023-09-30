const { Review } = require('../models/reviews');

const getAllReviewsService = async () => {
    return await Review.find().exec();
};

const getReviewByOwnerService = async ownerId => {
    return await Review.findOne({ owner: ownerId }).exec();
};

const createReviewService = async (
    { review, rating, name, avatarURL },
    ownerId
) => {
    const existingReview = await Review.findOne({ owner: ownerId }).exec();

    if (existingReview) {
        throw new Error('User can only create one review');
    }

    const newReview = await Review.create({
        review,
        rating,
        owner: ownerId,
        name,
        avatarURL,
    });

    return newReview;
};

const updateReviewService = async (ownerId, body) => {
    const { review, rating } = body;

    const updatedReview = await Review.findOneAndUpdate(
        { owner: ownerId },
        { $set: { review, rating } },
        { new: true }
    );

    return updatedReview;
};

const deleteReviewService = async ownerId => {
    const deletedReview = await Review.findOneAndRemove({
        owner: ownerId,
    });

    if (!deletedReview) {
        throw new Error('Review not found');
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
