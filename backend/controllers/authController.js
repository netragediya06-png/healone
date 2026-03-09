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
      role: user.role
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
      gender,
      dateOfBirth,
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

    /* PROFILE PHOTO */
    const profilePhoto = req.body.profilePhoto || "";

    /* VALIDATION */

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password are required"
      });
    }

    /* CHECK EXISTING USER */

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    /* CREATE USER OBJECT */

    let newUser = {
      fullName,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      profilePhoto,
      role: role || "user"
    };

    /* =========================
       SPECIALIST REGISTRATION
    ========================= */

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

    }

    /* =========================
       NORMAL USER
    ========================= */

    else {

      newUser.verificationStatus = "approved";
      newUser.isVerified = true;

    }

    /* SAVE USER */

    const user = await User.create(newUser);

    /* RESPONSE */

    res.status(201).json({

      message:
        role === "specialist"
          ? "Specialist registration submitted. Waiting for admin approval."
          : "User registered successfully",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },

      token: generateToken(user)

    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error"
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
        message: "Email and password required"
      });
    }

    /* FIND USER */

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    /* CHECK PASSWORD */

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    /* CHECK BLOCK */

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account is blocked by admin"
      });
    }

    /* CHECK SPECIALIST STATUS */

    if (user.role === "specialist") {

      if (user.verificationStatus === "pending") {
        return res.status(403).json({
          message: "Your specialist account is under admin review"
        });
      }

      if (user.verificationStatus === "rejected") {
        return res.status(403).json({
          message: "Your specialist request was rejected"
        });
      }

    }

    /* LOGIN SUCCESS */

    res.status(200).json({

      message: "Login successful",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus
      },

      token: generateToken(user)

    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


/* =========================
   EXPORT
========================= */

module.exports = {
  register: exports.register,
  login: exports.login
};  