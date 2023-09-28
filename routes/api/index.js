const express = require('express');

// const authRoutes = require('./auth');
const taskRoutes = require('./tasks');
const authRouters = require('./auth');

const router = express.Router();

router.use('/tasks', taskRoutes);
router.use('/auth', authRouters);

module.exports = router;
