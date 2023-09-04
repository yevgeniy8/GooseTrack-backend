const express = require('express');

const ContactController = require('../../controllers/contact');

const router = express.Router();

router.get('/', ContactController.getAll);

router.get('/:contactId', ContactController.getById);

router.post('/', ContactController.create);

router.delete('/:contactId', ContactController.remove);

router.put('/:contactId', ContactController.update);

router.patch('/:contactId/favorite', ContactController.updateStatusContact);

module.exports = router;
