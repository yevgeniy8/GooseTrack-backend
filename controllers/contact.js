const Contact = require('../models/contact');
const HttpError = require('../helpers/HttpError');

const schema = require('../schema/schema');

const getAll = async (req, res, next) => {
    const { page = 1, limit = 10, favorite = null } = req.query;
    const skip = (page - 1) * limit;
    const { _id: owner } = req.user;
    const query = { owner };
    if (favorite) {
        query.favorite = favorite;
    }
    console.log(query);
    try {
        const contacts = await Contact.find(query, '-createdAt -updatedAt', {
            skip,
            limit,
        }).populate('owner', 'email');
        res.json(contacts);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.contactId);
        if (!contact) {
            throw HttpError(404, 'Not Found');
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    const { _id: owner } = req.user;
    try {
        const { error } = schema.addSchema.validate(req.body);
        if (error) {
            throw HttpError(
                400,
                `missing required ${error.message
                    .split(' ')[0]
                    .slice(1, -1)} field`
            );
        }

        const { name, email, phone } = req.body;

        const contact = {
            name,
            email,
            phone,
            owner,
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
            throw HttpError(404, 'Not Found');
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
            throw HttpError(400, 'missing fields');
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.contactId,
            req.body,
            { new: true }
        );

        if (!contact) {
            throw HttpError(404, 'Not Found');
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
            throw HttpError(400, 'missing field favorite');
        }
        const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
            new: true,
        });

        if (!contact) {
            throw HttpError(404, 'Not Found');
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
