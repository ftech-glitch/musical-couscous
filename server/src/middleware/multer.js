const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// File filter to ensure only image files and MP3 audio files are allowed
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "audio/mpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and MP3 files are allowed"), false);
  }
};

// Create uploads directory for albums if it doesn't exist
const albumUploadDir = path.join(__dirname, "../../public/albums");
if (!fs.existsSync(albumUploadDir)) {
  fs.mkdirSync(albumUploadDir, { recursive: true });
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

const albumUpload = multer({
  storage: albumStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
});

// Create uploads directory for playlists if it doesn't exist
const playlistUploadDir = path.join(__dirname, "../../public/playlists");
if (!fs.existsSync(playlistUploadDir)) {
  fs.mkdirSync(playlistUploadDir, { recursive: true });
}

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

const playlistUpload = multer({
  storage: playlistStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
});

// Create uploads directory for audio if it doesn't exist
const audioUploadDir = path.join(__dirname, "../../public/audio");
if (!fs.existsSync(audioUploadDir)) {
  fs.mkdirSync(audioUploadDir, { recursive: true });
}

// Configure Multer storage for audio files
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const audioUpload = multer({
  storage: audioStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Example: 10 MB limit
});

module.exports = { albumUpload, playlistUpload, audioUpload };
