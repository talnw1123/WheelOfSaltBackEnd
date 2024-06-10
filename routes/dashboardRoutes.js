const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/total-users', dashboardController.getTotalUsers);
router.get('/total-products', dashboardController.getTotalProducts);
router.get('/total-stock', dashboardController.getTotalStock);
router.get('/total-amount-today', dashboardController.getTotalAmountToday);

module.exports = router;
