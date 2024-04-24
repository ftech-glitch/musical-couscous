const express = require("express");
const {
  getAllSongs,
  getSongById,
  createSong,
  getSongsInAlbum,
  getSongsInPlaylist,
} = require("../controllers/songs");
const router = express.Router();

router.get("/", getAllSongs);
router.get("/:song_id", getSongById);
router.get("/album/:album_id", getSongsInAlbum);
router.get("/playlist/:playlist_id", getSongsInPlaylist);
router.post("/:playlist_id/:album_id", createSong);

module.exports = router;
