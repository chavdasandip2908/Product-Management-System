const express = require('express');
const taskController = require('../controllers/taskController');
const paginate = require('../middleware/pagination'); // Import the pagination middleware
const Task = require('../models/Task'); // Import the Task model

const router = express.Router();

// Route to create a task
router.post('/', taskController.createTask);

// Route to get all tasks with pagination
router.get('/', paginate(Task), taskController.getPaginatedTasks);

// Route to get a task by ID
router.get('/:id', taskController.getTaskById);

// Route to search tasks
router.get('/search', taskController.searchTasks);

// Route to update a task
router.put('/:id', taskController.updateTask);

// Route to delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
