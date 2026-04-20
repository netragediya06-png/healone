const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const { protect } = require("../middleware/authMiddleware");

/* ===========================================
   ADD FEEDBACK
=========================================== */
router.post("/add", protect, async (req, res) => {
  try {
    const { subject, message, targetType, specialistId } = req.body;

    const feedback = await Feedback.create({
      user: req.user._id,
      subject,
      message,
      targetType,
      specialist: targetType === "specialist" ? specialistId : null,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });

  } catch (err) {
    console.error("Add feedback error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ===========================================
   GET FEEDBACK (ROLE BASED)
=========================================== */
router.get("/", protect, async (req, res) => {
  try {
    let feedbacks;

    // 🔥 ADMIN → see ALL feedback
    if (req.user.roles.includes("admin")) {
      feedbacks = await Feedback.find()
        .populate("user", "fullName email")
        .populate("specialist", "fullName")
        .sort({ createdAt: -1 });
    }

    // 🔥 SPECIALIST → see ONLY their feedback
    else if (req.user.roles.includes("specialist")) {
      feedbacks = await Feedback.find({
        targetType: "specialist",
        specialist: req.user._id,
      })
        .populate("user", "fullName email")
        .populate("specialist", "fullName")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(feedbacks);

  } catch (err) {
    console.error("Fetch feedback error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ===========================================
   DELETE FEEDBACK (ADMIN ONLY)
=========================================== */
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!req.user.roles.includes("admin")) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });

  } catch (err) {
    console.error("Delete feedback error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;