const constants = require('../constants/constants.js');

const errorHandler = (err, req, res, next) => {

    const statusCode = res.statusCode ? res.statusCode : constants.errorCodes.INTERNAL_SERVER_ERROR;
    switch(statusCode) {
        case constants.errorCodes.INTERNAL_SERVER_ERROR : 
            res.json({ status: false, message: err.message, data: err.stack })
            break;

        case constants.errorCodes.VALIDATION_ERROR : 
            res.json({ status: false, message: err.message, data: err.stack });
            break;

        case constants.errorCodes.UNAUTHORIZED : 
            res.json({ status: false, message: err.message, data: err.stack });
            break;

        case constants.errorCodes.NOT_FOUND : 
            res.json({ status: false, message: err.message, data: err.stack });
            break;

        case constants.errorCodes.FORBIDDEN : 
            res.json({ status: false, message: err.message, data: err.stack });
            break;

        default: 
            break;
    }
}

module.exports = errorHandler;