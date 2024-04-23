const express = require("express");
const router = express.Router();
const {
  createPlaylist,
  editPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylistById,
} = require("../controllers/playlists");

router.get("/", getAllPlaylists);
router.get("/:id", getPlaylistById);
router.post("/", createPlaylist);
router.put("/:id", editPlaylist);
router.delete("/:id", deletePlaylist);

module.exports = router;
