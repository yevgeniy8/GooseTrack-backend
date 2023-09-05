const Contact = require('../models/contact');

const schema = require('../schema/schema');

const getAll = async (req, res, next) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.contactId);
        if (!contact) {
            return next();
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const { error } = schema.addSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: `missing required ${error.message
                    .split(' ')[0]
                    .slice(1, -1)} field`,
            });
        }

        const { name, email, phone } = req.body;

        const contact = {
            name,
            email,
            phone,
        };
        const doc = await Contact.create(contact);
        res.status(201).json(doc);
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.contactId);
        if (!contact) {
            next();
            return;
        }
        res.json({ message: 'contact deleted' });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { error } = schema.addSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'missing fields',
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.contactId,
            req.body,
            { new: true }
        );

        if (!contact) {
            next();
            return;
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

const updateStatusContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { error } = schema.updateFavoriteSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'missing field favorite',
            });
        }
        const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
            new: true,
        });

        if (!contact) {
            next();
            return;
        }

        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    remove,
    update,
    updateStatusContact,
};
