const express = require("express");
const {
  getAllUsers,
  registerUser,
  loginUser,
  refresh,
  loginArtist,
  getAllArtists,
  editUser,
  editArtist,
} = require("../controllers/auth");
const router = express.Router();

router.get("/users", getAllUsers);
router.get("/artists", getAllArtists);
router.put("/user/:user_id", editUser);
router.put("/artist/:artist_id", editArtist);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refresh);
router.post("/login/artist", loginArtist);

module.exports = router;
