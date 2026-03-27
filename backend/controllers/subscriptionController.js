const ProgramSubscription = require("../models/ProgramSubscription");
const Program = require("../models/Program");

/* ===============================
   USER SUBSCRIBE PROGRAM
================================ */

exports.subscribeProgram = async (req, res) => {
  try {
    const { programId, plan, paymentMethod } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({
        message: "Payment method required",
      });
    }

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const existing = await ProgramSubscription.findOne({
      user: req.user._id,
      program: programId,
      status: "active",
    });

    if (existing) {
      return res.status(400).json({
        message: "Already subscribed",
      });
    }

    const selectedPlan = program.plans.find(
      (p) => p.name === plan
    );

    if (!selectedPlan) {
      return res.status(400).json({
        message: "Invalid plan",
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + program.durationDays);

    const subscription = await ProgramSubscription.create({
      user: req.user._id,
      program: programId,
      plan: {
        name: selectedPlan.name,
        price: selectedPlan.price,
      },
      paymentMethod, // 🔥 SAVE HERE
      paymentStatus: "paid",
      amountPaid: selectedPlan.price,
      startDate,
      endDate,
      status: "active",
    });

    await Program.findByIdAndUpdate(programId, {
      $inc: {
        seatsBooked: 1,
        totalEnrollments: 1,
      },
    });

    res.status(201).json({
      success: true,
      subscription,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   USER SUBSCRIPTIONS
================================ */

exports.getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await ProgramSubscription.find({
      user: req.user._id,
    })
      .populate("program", "title coverImage durationDays")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   ADMIN ALL SUBSCRIPTIONS
================================ */

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await ProgramSubscription.find()
      .populate("user", "fullName email")
      .populate("program", "title durationDays")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: subscriptions.length,
      subscriptions,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   CHECK PROGRAM ACCESS
================================ */

exports.checkProgramAccess = async (req, res) => {
  try {
    const { programId } = req.params;

    const subscription = await ProgramSubscription.findOne({
      user: req.user._id,
      program: programId,
      paymentStatus: "paid",
      status: "active",
    });

    // ❌ no subscription
    if (!subscription) {
      return res.status(403).json({
        access: false,
        message: "No access",
      });
    }

    // ✅ expiry check
    if (subscription.endDate < new Date()) {
      subscription.status = "expired";
      await subscription.save();

      return res.status(403).json({
        access: false,
        message: "Subscription expired",
      });
    }

    res.status(200).json({
      access: true,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ===============================
   SPECIALIST PROGRAM SUBSCRIPTIONS
================================ */

exports.getSpecialistSubscriptions = async (req, res) => {
  try {
    // 1. Find programs created by this specialist
    const programs = await Program.find({
      specialist: req.user._id,
    }).select("_id title");

    const programIds = programs.map(p => p._id);

    // 2. Get subscriptions only for those programs
    const subscriptions = await ProgramSubscription.find({
      program: { $in: programIds },
    })
      .populate("user", "fullName email")
      .populate("program", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: subscriptions.length,
      subscriptions,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
