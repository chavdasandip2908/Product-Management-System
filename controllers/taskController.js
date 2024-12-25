const Task = require('../models/Task');
const Product = require('../models/Product');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { product_id } = req.body;

        // Check if the referenced product exists
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Referenced product not found' });
        }

        const task = new Task(req.body);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all tasks with searching and pagination
exports.getTasks = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const query = search
            ? { description: { $regex: search, $options: 'i' } }
            : {};

        const tasks = await Task.find(query)
            .populate('product_id', 'name description') // Populate product details
            .sort({ createAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Task.countDocuments(query);

        res.json({
            tasks,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('product_id', 'name description');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search tasks by description or product reference (optional)
exports.searchTasks = async (req, res) => {
    const { query } = req.query; // Get the search query from user input

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const tasks = await Task.find({
            $or: [
                { description: { $regex: query, $options: 'i' } },
                { product_id: { $regex: query, $options: 'i' } } // Optional: Adjust if product_id is referenced
            ]
        }).populate('product_id', 'name description'); // Populate product details

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No matching tasks found' });
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const { product_id } = req.body;

        // Check if the referenced product exists
        if (product_id) {
            const product = await Product.findById(product_id);
            if (!product) {
                return res.status(404).json({ message: 'Referenced product not found' });
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { ...req.body, modifyAt: Date.now() },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
