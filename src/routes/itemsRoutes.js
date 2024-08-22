const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

// GET /api/items/create
router.get('/create', itemsController.createItem);

// PUT /api/items/edit/:itemId
router.put('/edit/:itemId', itemsController.editItem);

// GET /api/items/:binHolder/bin
router.get('/:binHolder/bin', itemsController.getItemsByBinHolder);

module.exports = router;