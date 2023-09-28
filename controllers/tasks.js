const { Task } = require('../models/task');

const { HttpError, ctrlWrapper } = require('../helpers');

const getAll = async (req, res, next) => {
    const owner = req.user._id;
    // const result = await Task.find(owner, '-createdAt -updatedAt').populate(
    //     'owner'
    // );
    const result = await Task.find(owner, '-createdAt -updatedAt');

    res.json(result);
};

const add = async (req, res) => {
    const body = req.body;
    const owner = req.user._id;
    const result = await Task.create({ ...body, owner });
    if (!result) {
        throw HttpError();
    }
    res.status(201).json(result);
};

const edit = async (req, res) => {
    const { taskId } = req.params;
    const body = req.body;
    const result = await Task.findByIdAndUpdate(taskId, body, {
        new: true,
    });
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.json(result);
};

const del = async (req, res) => {
    const { taskId } = req.params;
    const result = await Task.findByIdAndDelete(taskId);
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