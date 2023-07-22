const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const ValidateToken = asyncHandler (async (req, res, next) => {
    try {
        
        if ( !req.route ) {
            res.status(404);
            throw new Error('Route not found');
        }
        let token;
        let authHeader = req.headers.Authorization || req.headers.authorization;
        if( authHeader && authHeader.startsWith("Bearer") ) {
            token = authHeader.split(" ")[1];
            jwt.verify( token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
                if( err ) {
                    res.status(401);
                    throw new Error('Unauthorized user');
                }
                req.user = decoded.user;
                next();
            });
        }
        if( !token ) {
            res.status(401);
            throw new Error('User is unauthorized or Token is expired');
        }

    } catch(err) {
        throw new Error(err);
    }
    
});

module.exports = ValidateToken;