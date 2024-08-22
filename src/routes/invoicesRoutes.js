const express = require('express');
const router = express.Router();
const invoicesController = require('../controllers/invoicesController');

// POST /api/invoices/bulk
router.post('/bulk', invoicesController.bulkInvoices);

// POST /api/invoices/create
router.post('/create', invoicesController.createInvoice);

// PUT /api/invoices/products/:oldInvoiceNumber/exchange
//router.put('/products/:oldInvoiceNumber/exchange', invoicesController.exchangeProducts);

// GET /api/invoices/items/:invoiceNumber
//router.get('/items/:invoiceNumber', invoicesController.getInvoiceItems);

module.exports = router;