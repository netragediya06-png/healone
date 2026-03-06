const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ===============================
// PROTECT ROUTES (JWT VERIFY)
// ===============================
const protect = async (req, res, next) => {

  try {

    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. No token provided."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked by admin."
      });
    }

    req.user = user;

    next();

  } catch (error) {

    console.error("JWT ERROR:", error);

    res.status(401).json({
      message: "Token invalid or expired"
    });

  }

};



// ===============================
// ADMIN ONLY
// ===============================
const adminOnly = (req, res, next) => {

  if (!req.user || req.user.role !== "admin") {

    return res.status(403).json({
      message: "Access denied. Admin only."
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
      message: "Access denied. Specialist only."
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
      message: "Access denied. Specialist not approved."
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
        message: "Access denied"
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
  authorize
};