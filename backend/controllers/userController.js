const User = require("../models/User");

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
    res.status(200).json({
      message: "Register working"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  registerUser,
  getAllUsers,
  blockUser,
  deleteUser
};