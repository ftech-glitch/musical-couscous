const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// Create the uploads directory for albums if it doesn't exist
const albumUploadDir = path.join(__dirname, "../uploads/albums");
if (!fs.existsSync(albumUploadDir)) {
  fs.mkdirSync(albumUploadDir, { recursive: true });
}

// Create the uploads directory for playlists if it doesn't exist
const playlistUploadDir = path.join(__dirname, "../uploads/playlists");
if (!fs.existsSync(playlistUploadDir)) {
  fs.mkdirSync(playlistUploadDir, { recursive: true });
}

// Configure Multer storage for albums
const albumStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, albumUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

// Configure Multer storage for playlists
const playlistStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, playlistUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

// File filter to ensure only image files are allowed
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer configuration for albums
const albumUpload = multer({
  storage: albumStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
});

// Multer configuration for playlists
const playlistUpload = multer({
  storage: playlistStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
});

module.exports = { albumUpload, playlistUpload };
