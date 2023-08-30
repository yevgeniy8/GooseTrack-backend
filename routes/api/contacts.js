const express = require('express');

const contactsMethods = require('../../models/contacts');

const schema = require('../../schema/schema');

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
            next();
            return;
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
            return res.status(400).json({
                message: `missing required ${error.message
                    .split(' ')[0]
                    .slice(1, -1)} field`,
            });
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
            next();
            return;
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
            return res.status(400).json({
                message: 'missing fields',
            });
        }

        const contact = await contactsMethods.updateContact(
            req.params.contactId,
            req.body
        );

        if (!contact) {
            next();
            return;
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
