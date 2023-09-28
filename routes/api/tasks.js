const express = require('express');
const ctrl = require('../../controllers/tasks');
const { isValidId, validateBody } = require('../../middlewares');
const { shemas } = require('../../models/task');

const router = express.Router();

router.get('/', ctrl.getAll);

router.post('/', validateBody(shemas.addShema), ctrl.add);

router.patch('/:tasksId', isValidId, ctrl.edit);

router.delete('/:tasksId', isValidId, ctrl.del);

module.exports = router;
