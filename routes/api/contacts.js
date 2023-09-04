const express = require('express');

const ContactController = require('../../controllers/contact');

const isValidId = require('../../middlewares/isValidId');

const router = express.Router();

router.get('/', ContactController.getAll);

router.get('/:contactId', isValidId, ContactController.getById);

router.post('/', ContactController.create);

router.delete('/:contactId', isValidId, ContactController.remove);

router.put('/:contactId', isValidId, ContactController.update);

router.patch(
    '/:contactId/favorite',
    isValidId,
    ContactController.updateStatusContact
);

module.exports = router;
