// /inventory-service/routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.post('/products', inventoryController.createProduct);
router.post('/stocks', inventoryController.createStock);
router.put('/stocks/increase', inventoryController.increaseStock);
router.put('/stocks/decrease', inventoryController.decreaseStock);
router.get('/stocks', inventoryController.getInventory);
router.get('/products', inventoryController.getProducts);

module.exports = router;
