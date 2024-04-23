const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

// Initialize multer
const upload = multer({ storage });

module.exports = upload;
