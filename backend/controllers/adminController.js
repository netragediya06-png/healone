const User = require("../models/User");


/* ===================================
   GET ALL SPECIALISTS
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

    console.error("GET SPECIALISTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch specialists",
      error: error.message
    });

  }

};



/* ===================================
   GET PENDING SPECIALISTS
=================================== */

exports.getPendingSpecialists = async (req, res) => {

  try {

    const specialists = await User.find({
      role: "specialist",
      verificationStatus: "pending"
    })
    .select("-password")
    .sort({ createdAt: -1 });

    res.status(200).json(specialists);

  } catch (error) {

    console.error("GET PENDING SPECIALISTS ERROR:", error);

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

    const specialist = await User.findById(id);

    if (!specialist) {
      return res.status(404).json({
        message: "Specialist not found"
      });
    }

    if (specialist.role !== "specialist") {
      return res.status(400).json({
        message: "User is not a specialist"
      });
    }

    specialist.verificationStatus = "approved";
    specialist.isVerified = true;

    await specialist.save();

    res.status(200).json({
      message: "Specialist approved successfully",
      specialist
    });

  } catch (error) {

    console.error("APPROVE SPECIALIST ERROR:", error);

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
    const { reason } = req.body;

    const specialist = await User.findById(id);

    if (!specialist) {
      return res.status(404).json({
        message: "Specialist not found"
      });
    }

    if (specialist.role !== "specialist") {
      return res.status(400).json({
        message: "User is not a specialist"
      });
    }

    specialist.verificationStatus = "rejected";
    specialist.isVerified = false;

    if (reason) {
      specialist.rejectionReason = reason;
    }

    await specialist.save();

    res.status(200).json({
      message: "Specialist rejected successfully",
      specialist
    });

  } catch (error) {

    console.error("REJECT SPECIALIST ERROR:", error);

    res.status(500).json({
      message: "Failed to reject specialist",
      error: error.message
    });

  }

};



/* ===================================
   SPECIALIST STATISTICS (ADMIN)
=================================== */

exports.getSpecialistStats = async (req, res) => {

  try {

    const stats = await User.aggregate([

      {
        $match: { role: "specialist" }
      },

      {
        $group: {
          _id: "$verificationStatus",
          count: { $sum: 1 }
        }
      }

    ]);

    res.json(stats);

  } catch (error) {

    console.error("SPECIALIST STATS ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};