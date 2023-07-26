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

router.route('/patient').post(ValidateToken, userController.addPatient).get(ValidateToken, userController.getPatients);
router.route('/patient/:id').get(ValidateToken, userController.getPatient).put(ValidateToken, userController.updatePatient).delete(ValidateToken, userController.deletePatient);
router.route('/rpatient/:id').put(ValidateToken, userController.restorePatient);

module.exports = router;