const express = require('express');
const productController = require('../controllers/productController');
const paginate = require('../middleware/pagination'); // Import the pagination middleware
const Product = require('../models/Product'); // Import the Product model

const router = express.Router();

// Route to create a product
router.post('/', productController.createProduct);

// Route to get all products with pagination
router.get('/', paginate(Product), productController.getPaginatedProducts);

// Route to get a product by ID
router.get('/:id', productController.getProductById);

// Route to search products
router.get('/search', productController.searchProducts);

// Route to update a product
router.put('/:id', productController.updateProduct);

// Route to delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
