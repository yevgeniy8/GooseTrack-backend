const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/auth');

router.post('/register', ctrl.register);

module.exports = router;

// router.post('/login');

// router.post('/logout');
