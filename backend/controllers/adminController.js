const User = require("../models/User");


/* ===================================
   GET ALL SPECIALISTS (ALL STATUS)
=================================== */
exports.getAllSpecialists = async (req, res) => {
  try {

    const specialists = await User.find({
      role: "specialist"
    })
    .select("-password")
    .sort({ createdAt: -1 });

    res.status(200).json(specialists);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch specialists",
      error: error.message
    });

  }
};



/* ===================================
   GET ALL PENDING SPECIALISTS
=================================== */
exports.getPendingSpecialists = async (req, res) => {

  try {

    const specialists = await User.find({
      role: "specialist",
      verificationStatus: "pending"
    })
    .select("-password");

    res.status(200).json(specialists);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch pending specialists",
      error: error.message
    });

  }

};



/* ===================================
   APPROVE SPECIALIST
=================================== */
exports.approveSpecialist = async (req, res) => {

  try {

    const { id } = req.params;

    const specialist = await User.findByIdAndUpdate(
      id,
      {
        verificationStatus: "approved",
        isVerified: true
      },
      { new: true }
    ).select("-password");

    if (!specialist) {
      return res.status(404).json({
        message: "Specialist not found"
      });
    }

    res.status(200).json({
      message: "Specialist approved successfully",
      specialist
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to approve specialist",
      error: error.message
    });

  }

};



/* ===================================
   REJECT SPECIALIST
=================================== */
exports.rejectSpecialist = async (req, res) => {

  try {

    const { id } = req.params;

    const specialist = await User.findByIdAndUpdate(
      id,
      {
        verificationStatus: "rejected",
        isVerified: false
      },
      { new: true }
    ).select("-password");

    if (!specialist) {
      return res.status(404).json({
        message: "Specialist not found"
      });
    }

    res.status(200).json({
      message: "Specialist rejected successfully",
      specialist
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to reject specialist",
      error: error.message
    });

  }

};