const errorCodes = {
    INTERNAL_SERVER_ERROR: 500,
    VALIDATION_ERROR : 400,
    UNAUTHORIZED: 401,
    NOT_FOUND : 404,
    FORBIDDEN : 403,
};

const profilePicFolder = 'profilePics';

const userType = {
    ADMIN: 1,
    DOCTOR: 2,
    PATIENT: 3
};

const emailValidateRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

module.exports = { errorCodes, profilePicFolder, userType, emailValidateRegex };