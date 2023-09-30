const { Router } = require('express');
const auth = require('../../middlewares/auth');

const {
    getAllReviews,
    getReviewByOwner,
    createReview,
    updateReview,
    deleteReview,
} = require('../../controllers/controllersReviews');

const router = Router();

router.route('/').get(getAllReviews);
router
    .route('/own')
    .get(auth, getReviewByOwner)
    .post(auth, createReview)
    .patch(auth, updateReview)
    .delete(auth, deleteReview);

module.exports = { reviewsRouter: router };
