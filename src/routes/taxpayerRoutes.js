const express = require('express');
const router = express.Router();
const taxpayerController = require('../controllers/taxpayerController');

// GET /api/taxpayers/setup/outlets/<bin-number>/bin
router.get('/setup/outlets/:binNumber/bin', taxpayerController.getBinSetup);

// GET /api/taxpayers/status/:binNumber/bin
router.get('/status/:binNumber/bin', taxpayerController.getBinNumber);

module.exports = router;