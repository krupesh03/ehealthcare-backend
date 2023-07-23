const validateRoute = (err, res, next) => {

    try {
        if( err ) {
            throw 'Route not found';
        }
        next();
    } catch(err1) {
        res.status(404).json({ status: false, message: err1, data: [] });
    }
    
}

module.exports = validateRoute;