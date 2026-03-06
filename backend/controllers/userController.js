const User = require("../models/User");
const bcrypt = require("bcryptjs");


/* ===========================================
   REGISTER USER / SPECIALIST
=========================================== */
const registerUser = async (req, res) => {
  try {

    const { fullName, email, password, phone, role } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Prevent admin registration
    if (role === "admin") {
      return res.status(403).json({
        message: "Admin registration is not allowed"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role: role || "user",

      isVerified: role === "specialist" ? false : true,
      verificationStatus: role === "specialist" ? "pending" : "approved",
      isBlocked: false
    });

    res.status(201).json({
      message:
        role === "specialist"
          ? "Specialist registration submitted for admin approval"
          : "User registered successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("Register error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};



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

    res.status(500).json({
      message: error.message
    });

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

    res.status(500).json({
      message: error.message
    });

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

    res.status(500).json({
      message: error.message
    });

  }
};



/* ===========================================
   EXPORT CONTROLLERS
=========================================== */
module.exports = {
  registerUser,
  getAllUsers,
  blockUser,
  deleteUser
};