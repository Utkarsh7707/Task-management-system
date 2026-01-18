const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get projects
// @route   GET /api/projects
const getProjects = async (req, res) => {
    try {
        let projects;
        
        // ADMIN LOGIC: If admin, fetch ALL projects and show who owns them
        if (req.user.role === 'admin') {
            projects = await Project.find({}).populate('owner', 'name email');
        } else {
            // USER LOGIC: Fetch only MY projects
            projects = await Project.find({ owner: req.user._id });
        }
        
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a project
// @route   POST /api/projects
const createProject = async (req, res) => {
    const { title, description } = req.body;
    try {
        const project = await Project.create({ 
            title, 
            description, 
            owner: req.user._id 
        });
        res.status(201).json(project);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // ADMIN LOGIC: Allow delete if Owner OR if Admin
        if (project.owner.toString() === req.user._id.toString() || req.user.role === 'admin') {
            await project.deleteOne();
            
            // Clean up tasks related to this project
            await Task.deleteMany({ project: req.params.id });
            
            res.json({ message: 'Project removed' });
        } else {
            res.status(401).json({ message: 'Not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Project Stats
// @route   GET /api/projects/:id/stats
const getProjectStats = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.id });
        res.json({
            total: tasks.length,
            todo: tasks.filter(t => t.status === 'Todo').length,
            inProgress: tasks.filter(t => t.status === 'In Progress').length,
            done: tasks.filter(t => t.status === 'Done').length,
        });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getProjects, createProject, deleteProject, getProjectStats };