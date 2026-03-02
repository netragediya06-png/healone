const express = require("express");
const router = express.Router();

const {
  getUserByEmail,
  registerUser,
  getAllUsers,
  blockUser,
  deleteUser,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");


// ===========================================
// GET USER BY EMAIL (Auto Create if Not Exist)
// ===========================================
router.get("/by-email/:email", getUserByEmail);


// ===========================================
// REGISTER USER / SPECIALIST
// ===========================================
router.post("/register", registerUser);


// ===========================================
// GET ALL USERS (Admin Only)
// ===========================================
router.get("/", protect, adminOnly, getAllUsers);


// ===========================================
// BLOCK / UNBLOCK USER (Admin Only)
// ===========================================
router.put("/block/:id", protect, adminOnly, blockUser);


// ===========================================
// DELETE USER (Admin Only)
// ===========================================
router.delete("/:id", protect, adminOnly, deleteUser);


module.exports = router;