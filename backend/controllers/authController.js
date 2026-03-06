const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   GENERATE JWT TOKEN
========================= */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


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

    if (!email || !password || !fullName) {
      return res.status(400).json({
        message: "Please provide required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    let newUser = {
      fullName,
      email,
      password, // ❗ do NOT hash here
      phone,
      profilePhoto,
      role,
    };

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

      newUser.verificationStatus = "approved";
      newUser.isVerified = true;

    }

    const user = await User.create(newUser);

    res.status(201).json({
      message:
        role === "specialist"
          ? "Specialist registration submitted. Waiting for admin approval."
          : "User registered successfully",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },

      token: generateToken(user),
    });

  } catch (error) {

    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};



/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // IMPORTANT: include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

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

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked by admin.",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
      token: generateToken(user),
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};