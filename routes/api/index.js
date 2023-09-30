const express = require('express');

const taskRoutes = require('./tasks');
const authRouters = require('./auth');
const userRouters = require('./users');
const { reviewsRouter } = require('./review');

const router = express.Router();

router.use('/tasks', taskRoutes);
router.use('/auth', authRouters);
router.use('/users', userRouters);
router.use('/reviews', reviewsRouter);

module.exports = router;
