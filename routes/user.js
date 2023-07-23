const express = require('express');
const router = express.Router();
const ValidateToken = require('../middlewares/validateTokenHandler');
const validateUserType = require('../middlewares/validateUserType');
const userController = require('../controllers/userController');

router.route('/prefetch').get(ValidateToken, userController.prefetch);
router.route('/update_c').put(ValidateToken, userController.updateCurrentUser);
router.route('/uploadpic').post(ValidateToken, userController.uploadProfilePic);
router.route('/addDoctor').post(ValidateToken, userController.addDoctor);
router.route('/getDoctors').get(ValidateToken, validateUserType.validateAdminType, userController.getDoctors);
router.route('/getDoctor/:id').get(ValidateToken, userController.getDoctor);
router.route('/updateDoctor/:id').put(ValidateToken, userController.updateDoctor);
router.route('/deleteDoctor/:id').delete(ValidateToken, userController.deleteDoctor);
router.route('/restoreDoctor/:id').put(ValidateToken, userController.restoreDoctor);

module.exports = router;