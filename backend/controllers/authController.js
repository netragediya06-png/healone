const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const uploadImage = require("../utils/uploadImage"); // ✅ added

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
    { expiresIn: "7d" },
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
      role,

      // LOCATION
      state,
      city,
      address,

      // SPECIALIST - ORG
      organizationName,
      organizationType,
      experienceYears,
      practitionersCount,
      servicesOffered,
      consultationMode,
      onlineFees,
      offlineFees,
      specialization,

      // PROFESSIONAL
      qualification,
      university,
      yearOfCompletion,

      // PROFILE
      bio,
      expertiseSummary,
      treatmentApproach,
      languagesSpoken,

      // AVAILABILITY
      days,
      startTime,
      endTime,
    } = req.body;

    // ========================
    // BASIC VALIDATION
    // ========================

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // ========================
    // PROFILE PHOTO
    // ========================

    let profilePhoto = "";

    if (req.file) {
      profilePhoto = await uploadImage(req.file.buffer, "healone/users");
    } else {
      profilePhoto = `https://ui-avatars.com/api/?name=${fullName}`;
    }

    // ========================
    // BASE USER
    // ========================

    let newUser = {
      fullName,
      email,
      password,
      phone,
      role: role || "user",
      profilePhoto,

      location: {
        state,
        city,
        address,
      },
    };

    // ========================
    // SPECIALIST LOGIC
    // ========================

    if (role === "specialist") {
      newUser.verification = {
        status: "pending",
      };

      newUser.isActive = false;

      newUser.organizationDetails = {
        organizationName,
        organizationType,
        experienceYears,
        practitionersCount,
        servicesOffered: servicesOffered
          ? Array.isArray(servicesOffered)
            ? servicesOffered
            : [servicesOffered]
          : [],

        specialization: specialization
          ? Array.isArray(specialization)
            ? specialization
            : [specialization]
          : [],
        consultationMode,
        pricing: {
          online: onlineFees,
          offline: offlineFees,
        },
      };

      newUser.professionalDetails = {
        qualification,
        university,
        yearOfCompletion,
        experienceYears,
      };

      newUser.bio = bio;
      newUser.expertiseSummary = expertiseSummary;
      newUser.treatmentApproach = treatmentApproach;
      newUser.languagesSpoken = languagesSpoken;

      newUser.availability = {
        days,
        startTime,
        endTime,
      };
    } else {
      newUser.verification = {
        status: "approved",
      };
      newUser.isActive = true;
    }

    // ========================
    // CREATE USER
    // ========================

    const token = crypto.randomBytes(32).toString("hex");

    newUser.verificationToken = token;

    const user = await User.create(newUser);

    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

    await sendEmail(
      user.email,
      "Verify your HealOne account",
      `<h2>Verify Email</h2><a href="${verifyLink}">Click here</a>`,
    );

    // ========================
    // RESPONSE
    // ========================

    res.status(201).json({
      message:
        role === "specialist"
          ? "Registration submitted. Please verify email and wait for admin approval."
          : "Registration successful. Please verify your email",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   VERIFY EMAIL
========================= */

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        message: "Account already verified",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
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

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user.role === "admin") {
      return res.status(403).json({
        message: "Invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account is blocked by admin",
      });
    }

    if (user.role === "specialist") {
      if (user.verification?.status === "pending") {
        return res.status(403).json({
          message: "Your specialist account is under admin review",
        });
      }

      if (user.verification?.status === "rejected") {
        return res.status(403).json({
          message: "Your specialist request was rejected",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          message: "Your account is not approved by admin yet",
        });
      }
    }

    res.status(200).json({
      message: "Login successful",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
      },

      token: generateToken(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
/* =========================
   ADMIN LOGIN
========================= */

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    // 🚨 Only admin allowed
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Admin account blocked",
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Admin email not verified",
      });
    }

    res.status(200).json({
      message: "Admin login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
/* =========================
   FORGOT PASSWORD
========================= */

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 3600000;

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "HealOne Password Reset",
      `
      <h2>Reset Your Password</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      `,
    );

    res.status(200).json({
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
   RESET PASSWORD
========================= */

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
