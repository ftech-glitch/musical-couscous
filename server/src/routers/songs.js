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
const router = express.Router();

router.get("/", authUser, authArtist, getAllSongs);
router.get("/:song_id", authUser, authArtist, getSongById);
router.get("/album/:album_id", authUser, authArtist, getSongsInAlbum);
router.get("/playlist/:playlist_id", authUser, authArtist, getSongsInPlaylist);
router.post("/:playlist_id/:album_id", authArtist, createSong);
router.delete("/:song_id/:album_id/:artist_id", authArtist, deleteSong);
router.put("/:song_id/:album_id/:artist_id", authArtist, editSong);

module.exports = router;
