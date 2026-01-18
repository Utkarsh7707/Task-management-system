const express = require('express');
const { getProjects, createProject, deleteProject, getProjectStats } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getProjects).post(protect, createProject);
router.route('/:id').delete(protect, deleteProject);
router.get('/:id/stats', protect, getProjectStats);

module.exports = router;