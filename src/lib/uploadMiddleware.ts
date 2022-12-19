import multer from 'multer';
import path from 'path';
import * as mime from 'mime-types';


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${path.join(__dirname, '../../public/')}`)
    },
    filename: function (req, file, cb) {
        cb(null,`${ Date.now().toString()}.${mime.extension(file.mimetype)}`) //Appending .jpg
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});


export default upload;