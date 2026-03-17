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
   AUTH ROUTES
========================= */

// ✅ Register (User + Specialist)
router.post(
  "/register",
  upload.single("profilePhoto"),
  authController.register
);

// ✅ Login (User + Specialist)
router.post(
  "/login",
  authController.login
);

// ✅ Admin Login
router.post(
  "/admin-login",
  authController.adminLogin
);

// ✅ Verify Email
router.get(
  "/verify-email/:token",
  authController.verifyEmail
);

// ✅ Forgot Password
router.post(
  "/forgot-password",
  authController.forgotPassword
);

// ✅ Reset Password
router.post(
  "/reset-password/:token",
  authController.resetPassword
);


/* =========================
   🔥 SPECIALIST UPGRADE (IMPORTANT)
========================= */

// 👉 User → Become Specialist
router.post(
  "/become-specialist",
  protect,
  authController.becomeSpecialist
);


/* =========================
   PROFILE ROUTES (PROTECTED)
========================= */

// 👉 Get logged-in profile
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