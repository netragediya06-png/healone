const express = require("express");
const router = express.Router();

const {
  register,
  login
} = require("../controllers/authController");


// ============================
// REGISTER USER / SPECIALIST
// ============================
router.post(
  "/register",
  register
);


// ============================
// LOGIN USER
// ============================
router.post(
  "/login",
  login
);


module.exports = router;