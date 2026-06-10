const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
} = require(
  "../controllers/authController"
);

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.get(
  "/profile/:userId",
  getProfile
);

router.put(
  "/profile/:userId",
  updateProfile
);

router.put(
  "/change-password/:userId",
  changePassword
);

router.get("/test", (req, res) => {
  res.json({ message: "Auth route working" });
});

module.exports = router;