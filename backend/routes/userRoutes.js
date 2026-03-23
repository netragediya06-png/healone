const express = require("express");
const router = express.Router();

const {
  registerUser,
  getAllUsers,
  blockUser,
  deleteUser,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");
const { uploadProfilePhoto } = require("../middleware/upload"); // multer upload middleware


// ===========================================
// REGISTER USER / SPECIALIST
// ===========================================
router.post(
  "/register",
  uploadProfilePhoto, // accept image
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





// routes/userRoutes.js
router.get("/specialists/top", async (req, res) => {
  try {
    const User = require("../models/User");
    const limit = parseInt(req.query.limit) || 8;

    const specialists = await User.find({ role: "specialist", isActive: true })
      .limit(limit)
      .select("fullName profilePhoto professionalDetails");

    res.json(specialists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;