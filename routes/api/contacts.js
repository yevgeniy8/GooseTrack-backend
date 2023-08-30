const express = require('express');

const contactsMethods = require('../../models/contacts');

const schema = require('../../schema/schema');

const HttpError = require('../../helpers/HttpError');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const contacts = await contactsMethods.listContacts();
        res.json(contacts);
    } catch (error) {
        next(error);
    }
});

router.get('/:contactId', async (req, res, next) => {
    try {
        const contact = await contactsMethods.getContactById(
            req.params.contactId
        );
        if (!contact) {
            throw HttpError(404, 'Not found');
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { error } = schema.validate(req.body);
        if (error) {
            throw HttpError(400, 'missing required name field');
        }

        const { name, email, phone } = req.body;
        const contact = await contactsMethods.addContact(name, email, phone);
        res.status(201).json(contact);
    } catch (error) {
        next(error);
    }
});

router.delete('/:contactId', async (req, res, next) => {
    try {
        const contact = await contactsMethods.removeContact(
            req.params.contactId
        );
        if (!contact) {
            throw HttpError(404, 'Not found');
        }
        res.json({ message: 'contact deleted' });
    } catch (error) {
        next(error);
    }
});

router.put('/:contactId', async (req, res, next) => {
    try {
        const { error } = schema.validate(req.body);
        if (error) {
            throw HttpError(400, 'missing fields');
        }

        const contact = await contactsMethods.updateContact(
            req.params.contactId,
            req.body
        );

        if (!contact) {
            throw HttpError(404, 'Not found');
        }

        res.json(contact);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
