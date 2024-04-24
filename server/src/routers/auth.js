const express = require("express");
const {
  getAllUsers,
  registerUser,
  loginUser,
  refresh,
  loginArtist,
  getAllArtists,
} = require("../controllers/auth");
const router = express.Router();

router.get("/users", getAllUsers);
router.get("/artists", getAllArtists);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refresh);
router.post("/login/artist", loginArtist);

module.exports = router;
