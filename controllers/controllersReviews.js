const {
    getAllReviewsService,
    getReviewByOwnerService,
    createReviewService,
    updateReviewService,
    deleteReviewService,
} = require('../services/servicesReviews');

const { ctrlWrapper } = require('../helpers');

const {
    addReviewValidationSchema,
    updateReviewValidationSchema,
} = require('../schema/validation/reviewValidationSchema');

const getAllReviews = ctrlWrapper(async (req, res, next) => {
    const reviews = await getAllReviewsService();
    res.json({ reviews });
});

const getReviewByOwner = ctrlWrapper(async (req, res, next) => {
    const ownerId = req.user.id;

    const review = await getReviewByOwnerService(ownerId);
    if (review) {
        res.status(200).json({ review });
    } else {
        res.status(404).json({ message: 'Review not found' });
    }
});

const createReview = ctrlWrapper(async (req, res, next) => {
    const { error } = addReviewValidationSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { review, rating } = req.body;
    const { id, name, avatarURL } = req.user;
    const newReviewData = { review, rating, name, avatarURL };
    const newReview = await createReviewService(newReviewData, id);
    res.status(201).json({ review: newReview });
});

const updateReview = ctrlWrapper(async (req, res, next) => {
    const { error } = updateReviewValidationSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { review, rating } = req.body;
    const ownerId = req.user.id;

    const updatedReview = await updateReviewService(ownerId, {
        review,
        rating,
    });

    res.status(200).json({ review: updatedReview });
});

const deleteReview = ctrlWrapper(async (req, res, next) => {
    const ownerId = req.user.id;

    await deleteReviewService(ownerId);
    res.status(200).json({ message: `Review deleted successfully` });
});

module.exports = {
    getAllReviews,
    getReviewByOwner,
    createReview,
    updateReview,
    deleteReview,
};
