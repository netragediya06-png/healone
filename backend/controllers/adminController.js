const User = require("../models/User");

/* ===================================
   GET ALL PENDING SPECIALISTS
=================================== */

exports.getPendingSpecialists = async (req, res) => {
  try {
    const specialists = await User.find({
      role: "specialist",
      verificationStatus: "pending",
    });

    res.status(200).json(specialists);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
        isVerified: true,
      },
      { new: true }
    );

    if (!specialist) {
      return res.status(404).json({ message: "Specialist not found" });
    }

    res.status(200).json({
      message: "Specialist approved successfully",
      specialist,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
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
        isVerified: false,
      },
      { new: true }
    );

    if (!specialist) {
      return res.status(404).json({ message: "Specialist not found" });
    }

    res.status(200).json({
      message: "Specialist rejected successfully",
      specialist,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};