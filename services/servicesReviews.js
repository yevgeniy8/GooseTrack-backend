const { Review } = require('../models/reviews');
const { User } = require('../models/user');
const { HttpError } = require('../helpers');

const getAllReviewsService = async () => {
    try {
        const reviews = await Review.find().exec();

        const updatedReviews = await Promise.all(
            reviews.map(async review => {
                const user = await User.findOne({
                    _id: review.user.owner,
                }).exec();
                if (user) {
                    review.user.avatarURL = user.avatarURL;
                }
                return review;
            })
        );

        return updatedReviews;
    } catch (error) {
        throw HttpError(500, 'Internal Server Error');
    }
};

const getReviewByOwnerService = async ownerId => {
    const review = await Review.findOne({ 'user.owner': ownerId }).exec();

    if (!review) {
        throw HttpError(404, 'Review not found');
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
        user: { owner: ownerId, name, avatarURL },
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
        throw HttpError(404, 'Review not found');
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
