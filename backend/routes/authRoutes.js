const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const upload = require("../middleware/upload");

/* =========================
   REGISTER USER / SPECIALIST
========================= */

router.post(
  "/register",
  upload.single("profilePhoto"), // upload image
  authController.register
);

/* =========================
   LOGIN USER
========================= */

router.post(
  "/login",
  authController.login
);

module.exports = router;