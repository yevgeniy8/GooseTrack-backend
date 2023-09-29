const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/auth');

const { auth, validateBody, upload } = require('../../middlewares');

const { schemas } = require('../../models/user');

router.get('/current', auth, ctrl.getCurrent);
router.patch(
    '/edit',
    auth,
    upload.single('avatar'),
    validateBody(schemas.editUserSchema),
    ctrl.editUser
);

module.exports = router;
