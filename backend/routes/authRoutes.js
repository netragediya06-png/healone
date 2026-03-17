const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const {
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/profileController");

const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");


/* =========================
   REGISTER USER / SPECIALIST
========================= */
router.post(
  "/register",
  upload.single("profilePhoto"),
  authController.register
);


/* =========================
   USER + SPECIALIST LOGIN
========================= */
router.post(
  "/login",
  authController.login
);


/* =========================
   ADMIN LOGIN (NEW 🔥)
========================= */
router.post(
  "/admin-login",
  authController.adminLogin
);


/* =========================
   VERIFY EMAIL
========================= */
router.get(
  "/verify-email/:token",
  authController.verifyEmail
);


/* =========================
   FORGOT PASSWORD
========================= */
router.post(
  "/forgot-password",
  authController.forgotPassword
);


/* =========================
   RESET PASSWORD
========================= */
router.post(
  "/reset-password/:token",
  authController.resetPassword
);


/* =========================
   PROFILE ROUTES
========================= */

// 👉 Get logged-in user profile
router.get(
  "/profile",
  protect,
  getProfile
);

// 👉 Update profile
router.put(
  "/profile",
  protect,
  upload.single("profilePhoto"),
  updateProfile
);

// 👉 Change password
router.put(
  "/change-password",
  protect,
  changePassword
);


module.exports = router;