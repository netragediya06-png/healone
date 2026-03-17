const User = require("../models/User");
const bcrypt = require("bcryptjs");
const uploadImage = require("../utils/uploadImage");


/* =========================
   GET PROFILE
========================= */
exports.getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch profile"
    });

  }

};


/* =========================
   UPDATE PROFILE
========================= */
exports.updateProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // update fields
    user.fullName = req.body.fullName || user.fullName;
    user.phone = req.body.phone || user.phone;

    /* IMAGE UPDATE */
    if (req.file) {
      const imageUrl = await uploadImage(req.file.buffer, "healone/profile");
      user.profilePhoto = imageUrl;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: "Update failed"
    });

  }

};


/* =========================
   CHANGE PASSWORD
========================= */
exports.changePassword = async (req, res) => {

  try {

    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect"
      });
    }

    user.password = newPassword; // auto hashed by schema
    await user.save();

    res.json({
      message: "Password changed successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Password change failed"
    });

  }

};