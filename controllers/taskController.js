const Task = require('../models/Task'); // Import the Task model

// Logging helper
const log = (level, message) => console.log(`[${new Date().toISOString()}] [TASK] ${level}: ${message}`);

const createTask = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user.id; // User ID from JWT payload

        if (!title || title.trim() === '') {
            log('ERROR', `User ${userId} - Create task failed: Title missing.`);
            return res.status(400).json({ error: 'Task title is required.' });
        }

        const newTask = new Task({
            userId,
            title,
            status: 'pending' // New tasks are pending by default
        });

        await newTask.save();
        log('INFO', `User ${userId} created task: "${title}" (ID: ${newTask._id})`);
        res.status(201).json(newTask);

    } catch (err) {
        log('ERROR', `User ${req.user ? req.user.id : 'N/A'} - Create task failed: ${err.message}`);
        res.status(500).json({ error: 'Server error creating task.' });
    }
};

const getTasks = async (req, res) => {
    try {
        const userId = req.user.id; // User ID from JWT payload
        // Find tasks belonging to this user, sort by creation date descending
        const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

        log('INFO', `User ${userId} fetched ${tasks.length} tasks.`);
        res.status(200).json(tasks);

    } catch (err) {
        log('ERROR', `User ${req.user ? req.user.id : 'N/A'} - Get tasks failed: ${err.message}`);
        res.status(500).json({ error: 'Server error fetching tasks.' });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params; // From the URL parameter
        const { status } = req.body; // New status from the request body
        const userId = req.user.id; // User ID from the JWT payload

        if (!['pending', 'completed', 'deleted'].includes(status)) {
            log('ERROR', `User ${userId} - Update task ${taskId} status failed: Invalid status value: ${status}`);
            return res.status(400).json({ error: 'Invalid task status provided.' });
        }

        // Find the task by ID and ensure it belongs to the authenticated user
        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId: userId }, // Find by task ID AND user ID
            { $set: { status: status } }, // Set the new status
            { new: true, runValidators: true } // Return the updated document, run schema validators
        );

        if (!task) {
            log('WARN', `User ${userId} - Update task status failed: Task ${taskId} not found or not owned.`);
            return res.status(404).json({ error: 'Task not found or you do not have permission to update it.' });
        }

        log('INFO', `User ${userId} updated task ${taskId} to status: ${status}`);
        res.status(200).json(task);

    } catch (err) {
        log('ERROR', `User ${req.user ? req.user.id : 'N/A'} - Update task status failed: ${err.message}`);
        res.status(500).json({ error: 'Server error updating task status.' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        // Find and delete the task, ensuring it belongs to the authenticated user
        const task = await Task.findOneAndDelete({ _id: taskId, userId: userId });

        if (!task) {
            log('WARN', `User ${userId} - Delete task failed: Task ${taskId} not found or not owned.`);
            return res.status(404).json({ error: 'Task not found or you do not have permission to delete it.' });
        }

        log('INFO', `User ${userId} deleted task: ${taskId}`);
        res.status(204).send(); // No content for successful deletion

    } catch (err) {
        log('ERROR', `User ${req.user ? req.user.id : 'N/A'} - Delete task failed: ${err.message}`);
        res.status(500).json({ error: 'Server error deleting task.' });
    }
};


module.exports = {
    createTask,
    getTasks,
    updateTaskStatus,
    deleteTask
};
