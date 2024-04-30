const express = require("express");
const {
  getUserFavorite,
  getArtistFavorite,
  removeAlbumFromUserFavorite,
  removeAlbumFromArtistFavorite,
  addAlbumToUserFavorite,
  addAlbumToArtistFavorite,
} = require("../controllers/favorite");
const router = express.Router();
const { authUser, authArtist } = require("../middleware/auth");

router.get("/user/:user_id", authUser, getUserFavorite);
router.get("/artist/:artist_id", authArtist, getArtistFavorite);
router.delete(
  "/user/:user_id/:album_id",
  authUser,
  removeAlbumFromUserFavorite
);
router.delete(
  "/artist/:artist_id/:album_id",
  authArtist,
  removeAlbumFromArtistFavorite
);
router.post("/user/:user_id/:album_id", authUser, addAlbumToUserFavorite);
router.post(
  "/artist/:artist_id/:album_id",
  authArtist,
  addAlbumToArtistFavorite
);

module.exports = router;
