const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

// 11. POST /api/items/create
router.post('/create', itemsController.createItem);

// 12. PUT /api/items/edit/:itemId
router.put('/:itemId', itemsController.editItem);

// 13. GET /api/items/:binHolder/bin
router.get('/:binHolder/bin', itemsController.getItemsByBinHolder);

module.exports = router;