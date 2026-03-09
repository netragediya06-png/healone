const ProgramSubscription = require("../models/ProgramSubscription");
const WellnessProgram = require("../models/WellnessProgram");

/* ===============================
   USER ENROLL PROGRAM
================================ */

exports.enrollProgram = async (req, res) => {
  try {

    const { programId, paymentStatus } = req.body;

    const program = await WellnessProgram.findById(programId);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Prevent duplicate active subscription
    const existing = await ProgramSubscription.findOne({
      user: req.user.id,
      program: programId,
      status: "active"
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have an active subscription for this program"
      });
    }

    const startDate = new Date();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + program.durationDays);

    const subscription = await ProgramSubscription.create({
      user: req.user.id,
      program: programId,
      startDate,
      endDate,
      paymentStatus: paymentStatus || "paid",
      amountPaid: program.price,
      status: paymentStatus === "failed" ? "expired" : "active"
    });

    res.status(201).json({
      success: true,
      message: "Program enrolled successfully",
      subscription
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
      user: req.user.id
    })
      .populate("program", "title image durationDays price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions
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
      .populate("program", "title durationDays price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: subscriptions.length,
      subscriptions
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
      user: req.user.id,
      program: programId,
      paymentStatus: "paid",
      status: "active"
    });

    if (!subscription) {
      return res.status(403).json({
        access: false,
        message: "You don't have access to this program"
      });
    }

    res.status(200).json({
      access: true,
      message: "Access granted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};