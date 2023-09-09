const express = require('express');

const UserControllers = require('../../controllers/user');

const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', UserControllers.register);

router.post('/login', UserControllers.login);

router.post('/logout', auth, UserControllers.logout);

router.get('/current', auth, UserControllers.getCurrent);

router.patch('/', auth, UserControllers.updateStatusUser)

module.exports = router;
