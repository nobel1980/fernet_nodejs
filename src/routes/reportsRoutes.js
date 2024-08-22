const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

// POST /api/reports/monthly/sales/report
router.post('/monthly/sales/report', reportsController.generateMonthlySalesReport);

// POST /api/reports/monthly/sales/summary
router.post('/monthly/sales/summary', reportsController.generateMonthlySalesSummary);

module.exports = router;