const validateRoute = (err, res, next) => {

    try {
        if( err ) {
            throw 'Route not found';
        }
        next();
    } catch(excErr) {
        res.status(404).json({ status: false, message: excErr, data: [] });
    }
    
}

module.exports = validateRoute;