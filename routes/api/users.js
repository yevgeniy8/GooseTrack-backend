const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/auth');

const { auth, validateBody } = require('../../middlewares');

const { schemas } = require('../../models/user');

router.get('/current', auth, ctrl.getCurrent);
router.patch(
    '/edit',
    auth,
    validateBody(schemas.editUserSchema),
    ctrl.editUser
);

module.exports = router;
