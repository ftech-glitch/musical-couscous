const express = require("express");
const {
  getAllSongs,
  getSongById,
  createSong,
  getSongsInAlbum,
  getSongsInPlaylist,
  deleteSong,
  editSong,
  addSongToPlaylist,
  removeSongFromPlaylist,
} = require("../controllers/songs");
const { authArtist, authUser } = require("../middleware/auth");
const { audioUpload } = require("../middleware/multer");
const router = express.Router();

router.get("/", authUser, getAllSongs);
router.get("/:song_id", authUser, getSongById);
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

router.get("/playlist/:playlist_id", authUser, getSongsInPlaylist);
router.post("/:song_id/:playlist_id/add", authUser, addSongToPlaylist);
router.delete(
  "/:song_id/:playlist_id/:user_id/remove",
  authUser,
  removeSongFromPlaylist
);

router.get("/album/:album_id", authUser, getSongsInAlbum);

module.exports = router;
