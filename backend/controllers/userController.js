const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
/* ===========================================
   GET ALL NORMAL USERS (ADMIN)
=========================================== */
const getAllUsers = async (req, res) => {
  try {

    const users = await User.find({
      role: { $nin: ["admin", "specialist"] }
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
        message: "User not found"
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Cannot block admin"
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`
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
      }
    );

    stream.end(fileBuffer);
  });
};

/* ===========================================
   DELETE USER (ADMIN)
=========================================== */
const deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Cannot delete admin"
      });
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully"
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
      message: error.message
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


module.exports = {
  registerUser,
  getAllUsers,
  blockUser,
  deleteUser,
  getSpecialists
};