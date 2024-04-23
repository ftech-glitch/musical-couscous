const express = require("express");
const upload = require("../middleware/multer");
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
router.post("/", upload.single("cover"), authUser, createPlaylist);
router.put("/:id", upload.single("cover"), authUser, editPlaylist);
router.delete("/:id", authUser, deletePlaylist);

module.exports = router;
