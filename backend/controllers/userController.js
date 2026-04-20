const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
/* ===========================================
   GET ALL NORMAL USERS (ADMIN)
=========================================== */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $nin: ["admin", "specialist"] },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===========================================
   BLOCK / UNBLOCK USER (ADMIN)
=========================================== */
const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Cannot block admin",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ message: error.message });
  }
};

const uploadProfileImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "healone_profiles",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );

    stream.end(fileBuffer);
  });
};

/* ===========================================
   UPDATE PROFILE IMAGE (USER)
=========================================== */
const updateProfileImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    // 🔥 Upload to Cloudinary
    const imageUrl = await uploadProfileImage(req.file.buffer);

    // 🔥 Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: imageUrl },
      { new: true },
    ).select("-password");

    res.status(200).json({
      success: true,
      profilePhoto: user.profilePhoto,
      user,
    });
  } catch (error) {
    console.error("Profile image update error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===========================================
   DELETE USER (ADMIN)
=========================================== */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Cannot delete admin",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: error.message });
  }
};
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    let profilePhoto = "";

    // 🔥 IMAGE UPLOAD
    if (req.file) {
      profilePhoto = await uploadProfileImage(req.file.buffer);
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      profilePhoto, // ✅ IMPORTANT
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================================
   GET SPECIALISTS (PUBLIC)
=========================================== */
const getSpecialists = async (req, res) => {
  try {
    const specialists = await User.find({
      role: "specialist",
      isBlocked: false,
      verificationStatus: "approved", // optional but recommended
    })
      .select("-password")
      .limit(parseInt(req.query.limit) || 8)
      .sort({ createdAt: -1 });

    res.status(200).json(specialists);
  } catch (error) {
    console.error("Get specialists error:", error);
    res.status(500).json({ message: error.message });
  }
};
/* ===========================================
   TOGGLE WISHLIST YOGA ❤️
=========================================== */
const toggleWishlistYoga = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { yogaId } = req.body;

    if (!yogaId) {
      return res.status(400).json({ message: "Yoga ID required" });
    }

    const exists = user.wishlistYoga.includes(yogaId);

    if (exists) {
      user.wishlistYoga = user.wishlistYoga.filter(
        (id) => id.toString() !== yogaId,
      );
    } else {
      user.wishlistYoga.push(yogaId);
    }

    await user.save();

    res.json({
      success: true,
      message: exists ? "Removed from wishlist" : "Added to wishlist",
    });
  } catch (error) {
    console.error("Wishlist Yoga Error:", error);
    res.status(500).json({ message: "Wishlist error" });
  }
};
/* ===========================================
   TOGGLE SAVE YOGA 🔖
=========================================== */
const toggleSaveYoga = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { yogaId } = req.body;

    if (!yogaId) {
      return res.status(400).json({ message: "Yoga ID required" });
    }

    const exists = user.savedYoga.includes(yogaId);

    if (exists) {
      user.savedYoga = user.savedYoga.filter((id) => id.toString() !== yogaId);
    } else {
      user.savedYoga.push(yogaId);
    }

    await user.save();

    res.json({
      success: true,
      message: exists ? "Removed from saved" : "Saved successfully",
    });
  } catch (error) {
    console.error("Save Yoga Error:", error);
    res.status(500).json({ message: "Save error" });
  }
};
/* ===========================================
   GET SAVED YOGA
=========================================== */
const getSavedYoga = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedYoga");

    res.json(user.savedYoga);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved yoga" });
  }
};
/* ===========================================
   GET WISHLIST YOGA
=========================================== */
const getWishlistYoga = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlistYoga");

    res.json(user.wishlistYoga);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist yoga" });
  }
};

const toggleWishlistRemedy = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { remedyId } = req.body;

    const exists = user.wishlistRemedies.includes(remedyId);

    if (exists) {
      user.wishlistRemedies = user.wishlistRemedies.filter(
        (id) => id.toString() !== remedyId,
      );
    } else {
      user.wishlistRemedies.push(remedyId);
    }

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wishlist remedy error" });
  }
};

const toggleSaveRemedy = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { remedyId } = req.body;

    const exists = user.savedRemedies.includes(remedyId);

    if (exists) {
      user.savedRemedies = user.savedRemedies.filter(
        (id) => id.toString() !== remedyId,
      );
    } else {
      user.savedRemedies.push(remedyId);
    }

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Save remedy error" });
  }
};

const getSavedRemedies = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedRemedies");

    res.json(user.savedRemedies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved remedies" });
  }
};

const getWishlistRemedies = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlistRemedies");

    res.json(user.wishlistRemedies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist remedies" });
  }
};
/* ===========================================
   TOGGLE WISHLIST PRODUCT ❤️
=========================================== */
const toggleWishlistProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    const exists = user.wishlistProducts.includes(productId);

    if (exists) {
      user.wishlistProducts = user.wishlistProducts.filter(
        (id) => id.toString() !== productId
      );
    } else {
      user.wishlistProducts.push(productId);
    }

    await user.save();

    res.json({
      success: true,
      message: exists
        ? "Removed from wishlist"
        : "Added to wishlist",
    });

  } catch (error) {
    console.error("Wishlist Product Error:", error);
    res.status(500).json({ message: "Wishlist product error" });
  }
};
const getWishlistProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlistProducts");

    res.json(user.wishlistProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist products" });
  }
};
/* ===========================================
   GET MY PROFILE (FULL DATA)
=========================================== */
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    res.status(200).json(user);

  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ===========================================
   UPDATE MY PROFILE (USER)
=========================================== */
const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 BASIC
    user.fullName = req.body.fullName || user.fullName;
    user.phone = req.body.phone || user.phone;

    // 🔹 LOCATION
    user.location = {
      ...user.location,
      ...req.body.location,
    };

    // 🔹 LANGUAGES
    if (req.body.languagesSpoken) {
      user.languagesSpoken = req.body.languagesSpoken;
    }

    // 🔹 BIO
    user.bio = req.body.bio || user.bio;

    // 🔹 SPECIALIST DATA
    if (user.roles.includes("specialist")) {
      user.professionalDetails = {
        ...user.professionalDetails,
        ...req.body.professionalDetails,
      };

      user.organizationDetails = {
        ...user.organizationDetails,
        ...req.body.organizationDetails,
      };

      user.facilities = req.body.facilities || user.facilities;
      user.treatmentApproach =
        req.body.treatmentApproach || user.treatmentApproach;

      user.availability = {
        ...user.availability,
        ...req.body.availability,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  blockUser,
  updateProfileImageController,
  deleteUser,
  getSpecialists,
  toggleWishlistYoga,
  toggleSaveYoga,
  getSavedYoga,
  getWishlistYoga,
  toggleWishlistRemedy,
  toggleSaveRemedy,
  getSavedRemedies,
  getWishlistRemedies,
  toggleWishlistProduct,
  getWishlistProducts,
  getMyProfile,
   updateMyProfile,
};
