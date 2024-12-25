const express = require('express');
const {
    createTask,
    getPaginatedTasks,
    getTaskById,
    searchTasks,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const paginate = require('../middleware/pagination'); // Import the pagination middleware
const Task = require('../models/Task'); // Import the Task model

const router = express.Router();

// Route to create a task
router.post('/', createTask);

// Route to get all tasks with pagination
router.get('/', paginate(Task), getPaginatedTasks);

// Route to get a task by ID
router.get('/:id', getTaskById);

// Route to search tasks
router.get('/search', searchTasks);

// Route to update a task
router.put('/:id', updateTask);

// Route to delete a task
router.delete('/:id', deleteTask);

module.exports = router;
