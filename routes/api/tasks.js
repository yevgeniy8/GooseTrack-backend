const express = require('express');
const ctrl = require('../../controllers/tasks');
const { isValidId, validateBody, auth } = require('../../middlewares');
const { shemas } = require('../../models/task');

const router = express.Router();

router.get('/', auth, ctrl.getAll);

router.post('/', auth, validateBody(shemas.addShema), ctrl.add);

router.patch('/:tasksId', auth, isValidId, ctrl.edit);

router.delete('/:tasksId', auth, isValidId, ctrl.del);

module.exports = router;
