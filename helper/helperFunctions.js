const multer = require('multer');
const path = require('path');

const uploadFileFunction = (destFolderName, fieldname) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/' + destFolderName);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = path.extname(file.originalname).toLowerCase();
            cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
        }
    });
    const uploadFileFilter = function (req, file, cb) {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if( !file ) {
            return cb('Image is missing', false);
        }
        if( fileExtension !== '.png' && fileExtension !== '.jpeg' && fileExtension !== '.jpg' ) {
            return cb('Only png, jpeg and jpg images are allowed', false);
        }
        cb(null, true);
    }

    return multer({ storage : storage, fileFilter : uploadFileFilter }).single(fieldname);
}
        
module.exports = { uploadFileFunction };