const express = require('express');
const router = express.Router();
const taxpayersController = require('../controllers/taxpayersController');

//10.  GET /api/taxpayers/setup/outlets/<bin-number>/bin
router.get('/setup/outlets/:binNumber/bin', taxpayersController.getBinSetup);

//17.  GET /api/taxpayers/status/:binNumber/bin
router.get('/status/:binNumber/bin', taxpayersController.getBinStatus);

module.exports = router;