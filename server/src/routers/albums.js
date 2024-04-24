const express = require("express");
const upload = require("../middleware/multer");
const { authArtist } = require("../middleware/auth");
const {
  getAlbumById,
  getAllAlbums,
  createAlbum,
  editAlbum,
  deleteAlbum,
} = require("../controllers/albums");
const router = express.Router();

router.get("/", authArtist, getAllAlbums);
router.get("/:id", authArtist, getAlbumById);
router.post("/:artist_id", upload.single("cover"), authArtist, createAlbum);
router.put("/:album_id/:artist_id", authArtist, editAlbum);
router.delete("/:album_id/:artist_id", authArtist, deleteAlbum);

module.exports = router;
