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
const {
  validateRegistrationData,
  validateLoginData,
  validateRefreshToken,
} = require("../validators/auth");
const { errorCheck } = require("../validators/errorCheck");
const router = express.Router();

router.get("/users", getAllUsers);
router.get("/artists", getAllArtists);
router.put("/user/:user_id", editUser);
router.put("/artist/:artist_id", editArtist);

router.post("/register", validateRegistrationData, errorCheck, registerUser);
router.post("/login", validateLoginData, errorCheck, loginUser);
router.post("/refresh", validateRefreshToken, errorCheck, refresh);
router.post("/login/artist", validateLoginData, errorCheck, loginArtist);

module.exports = router;
