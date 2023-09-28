const express = require('express');

const taskRoutes = require('./tasks');
const authRouters = require('./auth');
// const userRouters = require('./users');

const router = express.Router();

router.use('/tasks', taskRoutes);
router.use('/auth', authRouters);
// router.use('/users', userRouters);

module.exports = router;
