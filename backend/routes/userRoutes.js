const express = require("express");
const router = express.Router();

const {
  registerUser,
  getAllUsers,
  blockUser,
  deleteUser,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");


// ===========================================
// REGISTER USER / SPECIALIST
// ===========================================
router.post(
  "/register",
  registerUser
);


// ===========================================
// GET ALL USERS (ADMIN ONLY)
// ===========================================
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllUsers
);


// ===========================================
// BLOCK / UNBLOCK USER (ADMIN)
// ===========================================
router.put(
  "/block/:id",
  protect,
  authorize("admin"),
  blockUser
);


// ===========================================
// DELETE USER (ADMIN)
// ===========================================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteUser
);


module.exports = router;