const express = require("express");
const { playlistUpload } = require("../middleware/multer");
const router = express.Router();
const {
  createPlaylist,
  editPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylistById,
} = require("../controllers/playlists");
const { authUser } = require("../middleware/auth");

router.get("/", authUser, getAllPlaylists);
router.get("/:id", authUser, getPlaylistById);
router.post(
  "/:user_id",
  playlistUpload.single("cover"),
  authUser,
  createPlaylist
);
router.put(
  "/:playlist_id/:user_id",
  playlistUpload.single("cover"),
  authUser,
  editPlaylist
);
router.delete("/:playlist_id/:user_id", authUser, deletePlaylist);

module.exports = router;
