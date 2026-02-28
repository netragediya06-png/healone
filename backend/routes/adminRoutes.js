const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get pending specialists
router.get("/specialists/pending", async (req, res) => {
  try {
    const specialists = await User.find({
      role: "specialist",
      approvalStatus: "pending",
    });

    res.json(specialists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve specialist
router.put("/specialists/:id/approve", async (req, res) => {
  try {
    const specialist = await User.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "approved" },
      { new: true }
    );

    res.json({
      message: "Specialist approved successfully",
      specialist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject specialist
router.put("/specialists/:id/reject", async (req, res) => {
  try {
    const specialist = await User.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "rejected" },
      { new: true }
    );

    res.json({
      message: "Specialist rejected",
      specialist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
