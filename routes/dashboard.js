const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/validateTokenHandler');
const summaryController = require('../controllers/summaryController');

router.route('/').get(validateToken, summaryController.dashboardData);

module.exports = router;