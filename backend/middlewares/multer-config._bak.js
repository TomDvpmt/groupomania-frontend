const multer = require("multer");

module.exports = multer({dest: "images"}).single("uploaded_file");

