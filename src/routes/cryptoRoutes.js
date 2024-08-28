const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');

// POST /api/crypto/encrypt
router.post('/encrypt', cryptoController.encryption);

// POST /api/crypto/decrypt
router.post('/decrypt', cryptoController.decryption);

module.exports = router;