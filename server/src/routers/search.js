const express = require("express");
const router = express.Router();
const { searchHandler } = require("../controllers/search");
const { authUser } = require("../middleware/auth");

router.get("/", authUser, searchHandler);

module.exports = router;
