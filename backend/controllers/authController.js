const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* =========================
   REGISTER
========================= */

exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      profilePhoto,
      role,

      professionalDetails,
      location,
      documents,
      bio,
      expertiseSummary,
      treatmentApproach,
      consultationFees,
      availableTimeSlots,
      languagesSpoken,
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = {
      fullName,
      email,
      password: hashedPassword,
      phone,
      profilePhoto,
      role,
    };

    // 🌿 If Specialist
    if (role === "specialist") {
      newUser.verificationStatus = "pending";
      newUser.isVerified = false;

      newUser.professionalDetails = professionalDetails;
      newUser.location = location;
      newUser.documents = documents;

      newUser.bio = bio;
      newUser.expertiseSummary = expertiseSummary;
      newUser.treatmentApproach = treatmentApproach;

      newUser.consultationFees = consultationFees;
      newUser.availableTimeSlots = availableTimeSlots;
      newUser.languagesSpoken = languagesSpoken;
    } else {
      // Normal user auto-approved
      newUser.verificationStatus = "approved";
      newUser.isVerified = true;
    }

    const user = await User.create(newUser);

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
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔒 Block unapproved specialists
    if (user.role === "specialist") {
      if (user.verificationStatus === "pending") {
        return res.status(403).json({
          message: "Your specialist account is under admin review.",
        });
      }

      if (user.verificationStatus === "rejected") {
        return res.status(403).json({
          message: "Your specialist account request was rejected.",
        });
      }
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};