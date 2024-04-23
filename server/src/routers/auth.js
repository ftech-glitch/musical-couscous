const express = require("express");
const {
  getAllUsers,
  registerUser,
  loginUser,
  refresh,
} = require("../controllers/auth");
const router = express.Router();

// users
router.get("/users", getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refresh);

module.exports = router;
