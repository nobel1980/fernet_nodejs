const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// GET /api/settings/info
router.get('/policies/dto', settingsController.getPolicyList);

// PUT /api/settings/update
router.get('/service/categories/all', settingsController.serviceCategory);

module.exports = router;