const express = require("express");
const router = express.Router();
const User = require("../models/User");


// ===========================================
// GET USER BY EMAIL (Auto Create if Not Exist)
// ===========================================
router.get("/by-email/:email", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.params.email });

    // 🔥 If user does not exist → create default user
    if (!user) {
      user = await User.create({
        name: req.params.email.split("@")[0],
        email: req.params.email,
        role: "user", // default role
      });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error("User route error:", error);
    res.status(500).json({ message: error.message });
  }
});


// ===========================================
// REGISTER (For Specialist / User Only)
// ===========================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // ❌ Prevent admin registration
    if (role === "admin") {
      return res.status(403).json({
        message: "Admin registration is not allowed",
      });
    }

    // Check if already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      role: role || "user", // default user
    });

    res.status(201).json(user);

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
});


// ===========================================
// GET ALL USERS (Admin Only - Optional)
// ===========================================
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
