const Task = require('../models/Task');

const getTasks = async (req, res) => {
    const tasks = await Task.find({ project: req.params.projectId });
    res.json(tasks);
};

const createTask = async (req, res) => {
    // Including new fields: dueDate, assignedTo
    const { title, priority, project, assignedTo, dueDate } = req.body; 
    try {
        const task = await Task.create({ 
            title, 
            priority, 
            project, 
            assignedTo, 
            dueDate 
        });
        res.status(201).json(task);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (error) { res.status(500).json({ message: error.message }); }
};
const getMyAssignedTasks = async (req, res) => {
    try {
        // Find tasks assigned to me AND populate the project details (so we can see Project Title)
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate('project', 'title description') 
            .sort({ createdAt: -1 }); // Newest first

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update exports
module.exports = { getTasks, createTask, updateTask, getMyAssignedTasks };