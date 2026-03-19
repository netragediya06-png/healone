const User = require("../models/User");

/* ===================================
   GET ALL SPECIALISTS
=================================== */

exports.getAllSpecialists = async (req, res) => {
  try {
    const specialists = await User.find({
      role: "specialist",
      "verification.status": "approved",
      isActive: true,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(specialists);
  } catch (error) {
    console.error("GET SPECIALISTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch specialists",
      error: error.message,
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
      "verification.status": "pending",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(specialists);
  } catch (error) {
    console.error("GET PENDING SPECIALISTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch pending specialists",
      error: error.message,
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
        message: "Specialist not found",
      });
    }

    if (specialist.role !== "specialist") {
      return res.status(400).json({
        message: "User is not a specialist",
      });
    }
    if (specialist.verification.status === "approved") {
      return res.status(400).json({
        message: "Already approved",
      });
    }

    specialist.verification.status = "approved";
    specialist.isActive = true;

    specialist.verification.reviewedAt = new Date();
    specialist.verification.reviewedBy = req.user?._id || null;

    await specialist.save();

    res.status(200).json({
  message: "Specialist approved successfully",
  specialist: {
    id: specialist._id,
    fullName: specialist.fullName,
    email: specialist.email,
    status: specialist.verification.status
  }
});
  } catch (error) {
    console.error("APPROVE SPECIALIST ERROR:", error);

    res.status(500).json({
      message: "Failed to approve specialist",
      error: error.message,
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
        message: "Specialist not found",
      });
    }

    if (specialist.role !== "specialist") {
      return res.status(400).json({
        message: "User is not a specialist",
      });
    }
    if (specialist.verification.status === "rejected") {
      return res.status(400).json({
        message: "Already rejected",
      });
    }

    specialist.verification.status = "rejected";
    specialist.isActive = false;

    specialist.verification.adminNote = reason;
    specialist.verification.reviewedAt = new Date();
    specialist.verification.reviewedBy = req.user?._id || null;

    await specialist.save();

    res.status(200).json({
  message: "Specialist Rejected successfully",
  specialist: {
    id: specialist._id,
    fullName: specialist.fullName,
    email: specialist.email,
    status: specialist.verification.status
  }
});
  } catch (error) {
    console.error("REJECT SPECIALIST ERROR:", error);

    res.status(500).json({
      message: "Failed to reject specialist",
      error: error.message,
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
        $match: { role: "specialist" },
      },

      {
        $group: {
          _id: "$verification.status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    console.error("SPECIALIST STATS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getApprovedSpecialists = async (req, res) => {
  try {

    const specialists = await User.find({
      role: "specialist",
      "verification.status": "approved"
    })
    .select("-password")
    .sort({ createdAt: -1 });

    res.status(200).json(specialists);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch approved specialists"
    });
  }
};  