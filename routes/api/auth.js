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

// const { Router } = require('express');
// const tryCatchWrapper = require('../helpers/try-catch-wrapper');
// const { googleAuth, googleRedirect } = require('./auth.controller');
// const router = Router();

router.get('/google', ctrl.googleAuth);

router.get('/google-redirect', ctrl.googleRedirect);

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
