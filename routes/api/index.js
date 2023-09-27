const express = require('express');

// const authRoutes = require('./auth');
const taskRoutes = require('./tasks');

const router = express.Router();

router.use('/tasks', taskRoutes);
// router.use('/auth', authRoutes);

module.exports = router;
