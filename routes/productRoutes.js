const express = require('express');
const {
    createProduct,
    getPaginatedProducts,
    getProductById,
    searchProducts,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const paginate = require('../middleware/pagination'); // Import the pagination middleware
const Product = require('../models/Product'); // Import the Product model

const router = express.Router();

// Route to create a product
router.post('/', createProduct);

// Route to get all products with pagination
router.get('/', paginate(Product), getPaginatedProducts);

// Route to get a product by ID
router.get('/:id', getProductById);

// Route to search products
router.get('/search', searchProducts);

// Route to update a product
router.put('/:id', updateProduct);

// Route to delete a product
router.delete('/:id', deleteProduct);

module.exports = router;
