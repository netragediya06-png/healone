const ProgramSubscription = require("../models/ProgramSubscription");
const Program = require("../models/Program");

/* ===============================
   USER SUBSCRIBE PROGRAM
================================ */

exports.subscribeProgram = async (req, res) => {
  try {
    const { programId, plan } = req.body;

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // ✅ prevent duplicate active subscription
    const existing = await ProgramSubscription.findOne({
      user: req.user._id,
      program: programId,
      status: "active",
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have an active subscription for this program",
      });
    }

    // ✅ check plans exist
    if (!program.plans || program.plans.length === 0) {
      return res.status(400).json({
        message: "No plans available for this program",
      });
    }

    // ✅ validate selected plan
    const selectedPlan = program.plans.find(
      (p) => p.name === plan
    );

    if (!selectedPlan) {
      return res.status(400).json({
        message: "Invalid plan selected",
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
      paymentStatus: "paid", // 💡 simple for now
      amountPaid: selectedPlan.price,
      startDate,
      endDate,
      status: "active",
    });

    // ✅ update program analytics
    await Program.findByIdAndUpdate(programId, {
      $inc: {
        seatsBooked: 1,
        totalEnrollments: 1,
      },
    });

    res.status(201).json({
      success: true,
      message: "Program subscribed successfully",
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