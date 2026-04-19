const express = require("express");
const router = express.Router();

const {
  registerUser,
  getAllUsers,
  blockUser,
  deleteUser,
  getSpecialists,
  updateProfileImageController,

  // 🔥 NEW
  toggleWishlistYoga,
  toggleSaveYoga,
  getSavedYoga,
  getWishlistYoga,
  toggleWishlistRemedy,
  toggleSaveRemedy,
  getSavedRemedies,
  getWishlistRemedies,
    toggleWishlistProduct,
  getWishlistProducts

} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");
const { uploadProfilePhoto } = require("../middleware/upload"); // multer


/* ===========================================
   REGISTER USER / SPECIALIST
=========================================== */
router.post(
  "/register",
  uploadProfilePhoto,
  registerUser
);


/* ===========================================
   UPDATE PROFILE IMAGE (USER)
=========================================== */
router.put(
  "/me/profile-image",
  protect,
  uploadProfilePhoto, // ✅ multer
  updateProfileImageController
);


/* ===========================================
   GET ALL USERS (ADMIN ONLY)
=========================================== */
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllUsers
);


/* ===========================================
   BLOCK / UNBLOCK USER (ADMIN)
=========================================== */
router.put(
  "/block/:id",
  protect,
  authorize("admin"),
  blockUser
);


/* ===========================================
   DELETE USER (ADMIN)
=========================================== */
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteUser
);


/* ===========================================
   GET SPECIALISTS (PUBLIC)
=========================================== */
router.get("/specialists", getSpecialists);


/* ===========================================
   TOP SPECIALISTS (HOME PAGE)
=========================================== */
router.get("/specialists/top", async (req, res) => {
  try {
    const User = require("../models/User");

    const limit = parseInt(req.query.limit) || 8;

    const specialists = await User.find({
      role: "specialist",
      isActive: true,
    })
      .limit(limit)
      .select("fullName profilePhoto professionalDetails");

    res.json(specialists);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/* ===========================================
   YOGA WISHLIST & SAVE
=========================================== */

// ❤️ Wishlist Yoga
router.post("/wishlist/yoga", protect, toggleWishlistYoga);

// 🔖 Save Yoga
router.post("/save/yoga", protect, toggleSaveYoga);

// 📄 Get Saved Yoga
router.get("/saved-yoga", protect, getSavedYoga);

// 📄 Get Wishlist Yoga
router.get("/wishlist-yoga", protect, getWishlistYoga);

router.post("/wishlist/remedy", protect, toggleWishlistRemedy);
router.post("/save/remedy", protect, toggleSaveRemedy);

router.get("/saved-remedies", protect, getSavedRemedies);
router.get("/wishlist-remedies", protect, getWishlistRemedies);
/* ===========================================
   PRODUCT WISHLIST
=========================================== */

// ❤️ Toggle Wishlist Product
router.post("/wishlist/product", protect, toggleWishlistProduct);

// 📄 Get Wishlist Products
router.get("/wishlist-products", protect, getWishlistProducts);


module.exports = router;