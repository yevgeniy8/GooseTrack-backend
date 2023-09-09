const express = require('express');

const ContactController = require('../../controllers/contact');

const isValidId = require('../../middlewares/isValidId');

const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth, ContactController.getAll);

router.get('/:contactId', auth, isValidId, ContactController.getById);

router.post('/', auth, ContactController.create);

router.delete('/:contactId', auth, isValidId, ContactController.remove);

router.put('/:contactId', auth, isValidId, ContactController.update);

router.patch(
    '/:contactId/favorite',
    auth,
    isValidId,
    ContactController.updateStatusContact
);

module.exports = router;
