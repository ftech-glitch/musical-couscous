const express = require("express");
const { albumUpload } = require("../middleware/multer");
const { authArtist, authUser } = require("../middleware/auth");
const {
  getAlbumById,
  getAllAlbums,
  createAlbum,
  editAlbum,
  deleteAlbum,
  getAlbumsByArtist,
} = require("../controllers/albums");

const router = express.Router();

router.get("/", authUser, getAllAlbums);
router.get("/:album_id", authUser, getAlbumById);
router.get("/artist/:artist_id", authUser, getAlbumsByArtist);
router.post(
  "/:artist_id",
  albumUpload.single("cover"),
  authArtist,
  createAlbum
);
router.put(
  "/:album_id/:artist_id",
  albumUpload.single("cover"),
  authArtist,
  editAlbum
);
router.delete("/:album_id/:artist_id", authArtist, deleteAlbum);

module.exports = router;
