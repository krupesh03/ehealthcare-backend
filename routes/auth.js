const express = require('express');
const router = express.Router();
const ValidateToken = require('../middlewares/validateTokenHandler.js');
const authController = require('../controllers/authController.js');

router.route('/health').get( (req, res) => {
    res.status(200).json({ message : `The server is up and running` });
});

//login routes
router.route('/login').post(authController.login);
router.route('/change-password').put(ValidateToken, authController.changePassword);

module.exports = router;