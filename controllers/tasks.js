const { Task } = require('../models/task');

const { HttpError, ctrlWrapper } = require('../helpers');

const getAll = async (req, res, next) => {
    const owner = req.user._id;
    const { date } = req.query;

    if (/^\d{4}-\d{2}$/.test(date) || /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const dateParts = date.split('-');
        const normalizeDate = dateParts.slice(0, 2).join('-');

        const startOfMonth = normalizeDate + '-01';
        const endOfMonth = normalizeDate + '-31';

        const result = await Task.find(
            {
                owner,
                date: {
                    $gte: startOfMonth,
                    $lte: endOfMonth,
                },
            },
            '-createdAt -updatedAt'
        );

        return res.json(result);
    }

    return res.status(400).json({ error: 'Bad Request' });
};

const add = async (req, res) => {
    const body = req.body;
    const owner = req.user._id;
    const result = await Task.create({ ...body, owner });
    if (!result) {
        throw HttpError(400);
    }
    res.status(201).json(result);
};

const edit = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const result = await Task.findByIdAndUpdate(id, body, {
        new: true,
    });
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.json(result);
};

const del = async (req, res) => {
    const { id } = req.params;
    const result = await Task.findByIdAndDelete(id);
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.status(200).json({ message: 'task deleted' });
};

module.exports = {
    getAll: ctrlWrapper(getAll),
    add: ctrlWrapper(add),
    edit: ctrlWrapper(edit),
    del: ctrlWrapper(del),
};
