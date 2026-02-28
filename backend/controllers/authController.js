const User = require("../models/User");

/* =========================
   REGISTER
========================= */

exports.register = async (req, res) => {
  try {
    const { name, email, role, profession, experience } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let approvalStatus = "none";

    if (role === "specialist") {
      approvalStatus = "pending";
    }

    const user = await User.create({
      name,
      email,
      role,
      profession,
      experience,
      approvalStatus,
    });

    res.status(201).json({
      message:
        role === "specialist"
          ? "Specialist registration submitted. Waiting for admin approval."
          : "User registered successfully.",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
   LOGIN
========================= */

exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔒 Block unapproved specialists
    if (
      user.role === "specialist" &&
      user.approvalStatus !== "approved"
    ) {
      return res.status(403).json({
        message: "Your specialist account is under review by admin.",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
