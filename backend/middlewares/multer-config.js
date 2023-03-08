const multer = require("multer");

const mimeTypes = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/bmp": "bmp",
    "image/webp": "webp"
};

try {
    const fileFilter = (req, file, callback) => {
        const extension = mimeTypes[file.mimetype];
        if(Object.values(mimeTypes).includes(extension)) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    };
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, "images");
        },
        filename: (req, file, callback) => {
            const nameFormated = file.originalname.split(" ").join("_").split(".").join("_");
            const extension = mimeTypes[file.mimetype];
            callback(null, nameFormated + Date.now() + "." + extension);
        }
    });
    module.exports = multer({storage, fileFilter}).single("imageFile");

} catch(error) {
    console.log(error.message);
};

