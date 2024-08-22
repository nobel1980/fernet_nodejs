const express = require('express');
const router = express.Router();
const taxpayerController = require('../controllers/taxpayerController');

// GET /api/taxpayers
router.get('/', taxpayerController.getAllTaxpayers);

// GET /api/taxpayers/:taxpayerId
router.get('/:taxpayerId', taxpayerController.getTaxpayerById);

// POST /api/taxpayers
router.post('/', taxpayerController.createTaxpayer);

// PUT /api/taxpayers/:taxpayerId
router.put('/:taxpayerId', taxpayerController.updateTaxpayer);

// DELETE /api/taxpayers/:taxpayerId
router.delete('/:taxpayerId', taxpayerController.deleteTaxpayer);

module.exports = router;