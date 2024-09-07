// routes/health.js
const express = require('express');
const router = express.Router();
const healthMetricsController = require('../controllers/healthMetricsController');
const auth = require('../middleware/auth');

// Existing routes
router.post('/calculate-metrics', auth, healthMetricsController.calculateHealthMetrics);
router.get('/metrics', auth, healthMetricsController.getUserHealthMetrics);

// New route for generating Excel report
router.get('/excel-report', auth, healthMetricsController.generateExcelReport);

module.exports = router;