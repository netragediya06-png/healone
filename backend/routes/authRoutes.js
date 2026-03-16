const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const upload = require("../middleware/upload");


/* =========================
   REGISTER USER / SPECIALIST
========================= */

router.post(
  "/register",
  upload.single("profilePhoto"),
  authController.register
);


/* =========================
   LOGIN
========================= */

router.post(
  "/login",
  authController.login
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


module.exports = router;