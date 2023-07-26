const asyncHandler = require('express-async-handler');
const constants = require('../constants/constants');

const validateAdminType = asyncHandler( (req, res, next) => {

    if( Number(req.user.user_type) !== constants.userType.ADMIN ) {
        res.status(401);
        throw new Error('This user does not have permission to access this route');
    }
    next();
});

const validateDoctorType = asyncHandler( (req, res, next) => {

    if( Number(req.user.user_type) !== constants.userType.DOCTOR ) {
        res.status(401);
        throw new Error('This user does not have permission to access this route')
    }
});

const validatePatientType = asyncHandler( (req, res, next) => {

    if( Number(req.user.user_type) !== constants.userType.PATIENT ) {
        res.status(401);
        throw new Error('This user does not have permission to access this route');
    }
});

module.exports = { validateAdminType, validateDoctorType, validatePatientType };