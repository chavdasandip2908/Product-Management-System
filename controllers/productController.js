const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all products with searching and pagination
exports.getProducts = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const query = search
            ? { name: { $regex: search, $options: 'i' } }
            : {};

        const products = await Product.find(query)
            .sort({ createAt: -1 }) // Sort by creation date descending
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.json({
            products,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search products by name or description
exports.searchProducts = async (req, res) => {
    const { query } = req.query; // Get the search query from user input

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No matching products found' });
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, modifyAt: Date.now() },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPaginatedProducts = (req, res) => {
    const { results } = res.paginatedResults; // Access paginated results
    res.json(results);
};
