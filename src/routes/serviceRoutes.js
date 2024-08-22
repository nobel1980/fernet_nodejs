const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// GET /api/settings/service/categories/all
router.get('/categories/all', serviceController.getAllServiceCategories);

module.exports = router;