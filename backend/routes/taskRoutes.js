const express = require('express');
const { getTasks, createTask, updateTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { getMyAssignedTasks } = require('../controllers/taskController');
const router = express.Router();

router.get('/my-tasks', protect, getMyAssignedTasks);
router.get('/:projectId', protect, getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
module.exports = router;