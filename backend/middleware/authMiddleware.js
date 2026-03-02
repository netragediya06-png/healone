const User = require("../models/User");

// ===============================
// PROTECT MIDDLEWARE
// ===============================
const protect = async (req, res, next) => {
  try {
    const userId = req.headers.userid; // temporary header-based auth

    if (!userId) {
      return res.status(401).json({
        message: "Not authorized. No user ID provided.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }
    if (user.isBlocked) {
  return res.status(403).json({
    message: "Your account has been blocked by admin.",
  });
}

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("PROTECT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// ADMIN ONLY MIDDLEWARE
// ===============================
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }
  next();
};

// ===============================
// SPECIALIST ONLY
// ===============================
const specialistOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "specialist") {
    return res.status(403).json({
      message: "Access denied. Specialist only.",
    });
  }
  next();
};

// ===============================
// APPROVED SPECIALIST ONLY
// ===============================
const specialistApprovedOnly = (req, res, next) => {
  if (
    !req.user ||
    req.user.role !== "specialist" ||
    req.user.verificationStatus !== "approved"
  ) {
    return res.status(403).json({
      message:
        "Access denied. Your specialist account is not approved yet.",
    });
  }
  next();
};

// ===============================
// FLEXIBLE ROLE AUTHORIZATION
// ===============================
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }
    next();
  };
};

module.exports = {
  protect,
  adminOnly,
  specialistOnly,
  specialistApprovedOnly,
  authorize,
};