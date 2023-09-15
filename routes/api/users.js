const express = require('express');

const UserControllers = require('../../controllers/user');

const auth = require('../../middlewares/auth');

const upload = require('../../middlewares/upload');

const router = express.Router();

router.post('/register', UserControllers.register);

router.post('/login', UserControllers.login);

router.post('/logout', auth, UserControllers.logout);

router.get('/current', auth, UserControllers.getCurrent);

router.patch('/', auth, UserControllers.updateStatusUser);

router.patch(
    '/avatars',
    auth,
    upload.single('avatar'),
    UserControllers.updateAvatar
);

module.exports = router;
