const Feedback = require("../models/Feedback");

/* ===========================================
   ADD FEEDBACK
=========================================== */
exports.addFeedback = async (req, res) => {
  try {
    const { message, targetType, specialistId } = req.body;

    const newFeedback = new Feedback({
      user: req.user._id,
      message,
      targetType,
      specialist: targetType === "specialist" ? specialistId : null,
    });

    await newFeedback.save();

    res.status(200).json({
      success: true,
      message: "Feedback saved successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};


/* ===========================================
   GET FEEDBACK (ROLE BASED)
=========================================== */
exports.getAllFeedback = async (req, res) => {
  try {
    let data;

    // 🔥 ADMIN → see ALL feedback
    if (req.user.roles.includes("admin")) {
      data = await Feedback.find()
        .populate("user", "fullName email")
        .populate("specialist", "fullName")
        .sort({ createdAt: -1 });
    }

    // 🔥 SPECIALIST → see only their feedback
    else if (req.user.roles.includes("specialist")) {
      data = await Feedback.find({
        targetType: "specialist",
        specialist: req.user._id,
      })
        .populate("user", "fullName email")
        .populate("specialist", "fullName")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching feedback",
    });
  }
};