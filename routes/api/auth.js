const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/auth');

const { validateBody, auth } = require('../../middlewares');

const { schemas } = require('../../models/user');

// router.get(
//     '/google',
//     passport.authenticate('google', { scope: ['email', 'profile'] })
// );
// router.get(
//     '/google/callback',
//     passport.authenticate('google', { session: false }),
//     ctrl.authGoogle
// );

router.post(
    '/register',
    validateBody(schemas.emptyBody),
    validateBody(schemas.usersSchemaRegister),
    ctrl.register
);

router.post(
    '/login',
    validateBody(schemas.emptyBody),
    validateBody(schemas.usersSchemaLogin),
    ctrl.login
);

router.post('/logout', auth, ctrl.logout);

module.exports = router;

// const baseURL = 'https://goose-track-backend-q3re.onrender.com';

// <a href={`${baseURL}/users/google`}>Google</a>
