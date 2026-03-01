const User = require("../models/User");

/* ===================================
   GET ALL APPROVED SPECIALISTS (PUBLIC)
=================================== */

exports.getApprovedSpecialists = async (req, res) => {
  try {
    const specialists = await User.find({
      role: "specialist",
      verificationStatus: "approved",
    }).select(
      "-password -documents -verificationStatus -isVerified"
    );

    res.status(200).json(specialists);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};