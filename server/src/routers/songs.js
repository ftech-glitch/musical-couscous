const express = require("express");
const {
  getAllSongs,
  getSongById,
  createSong,
  getSongsInAlbum,
  getSongsInPlaylist,
  deleteSong,
  editSong,
} = require("../controllers/songs");
const { authArtist, authUser } = require("../middleware/auth");
const { audioUpload } = require("../middleware/multer");
const router = express.Router();

router.get("/", authUser, getAllSongs);
router.get("/:song_id", authUser, getSongById);
router.get("/album/:album_id", authUser, getSongsInAlbum);
router.get("/playlist/:playlist_id", authUser, getSongsInPlaylist);
router.post(
  "/:playlist_id/:album_id",
  authArtist,
  audioUpload.single("audio"),
  createSong
);
router.delete("/:song_id/:album_id/:artist_id", authArtist, deleteSong);
router.put(
  "/:song_id/:album_id/:artist_id",
  authArtist,
  audioUpload.single("audio"),
  editSong
);

module.exports = router;
