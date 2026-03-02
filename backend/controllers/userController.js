const User = require("../models/User");


// ===========================================
// GET USER BY EMAIL (Auto Create if Not Exist)
// ===========================================
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    let user = await User.findOne({ email });

    // If user does not exist → create default user
    if (!user) {
      user = await User.create({
        fullName: email.split("@")[0],
        email,
        password: "firebase-auth", // placeholder
        phone: "0000000000", // placeholder
        role: "user",
      });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error("User route error:", error);
    res.status(500).json({ message: error.message });
  }
};



// ===========================================
// REGISTER USER / SPECIALIST
// ===========================================
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    // Prevent admin registration
    if (role === "admin") {
      return res.status(403).json({
        message: "Admin registration is not allowed",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      role: role || "user",
    });

    res.status(201).json(user);

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
};



// ===========================================
// GET ALL NORMAL USERS (Admin Only)
// ===========================================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $nin: ["admin", "specialist"] }
    }).select("-password");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ===========================================
// BLOCK / UNBLOCK USER (Admin Only)
// ===========================================
const blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot block admin" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ===========================================
// DELETE USER (Admin Only)
// ===========================================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete admin" });
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ===========================================
// EXPORT ALL CONTROLLERS
// ===========================================
module.exports = {
  getUserByEmail,
  registerUser,
  getAllUsers,
  blockUser,
  deleteUser,
};