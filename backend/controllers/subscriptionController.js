const ProgramSubscription = require("../models/ProgramSubscription");
const WellnessProgram = require("../models/WellnessProgram");
exports.enrollProgram = async (req, res) => {
  try {

    const { programId } = req.body;

    const program = await WellnessProgram.findById(programId);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const startDate = new Date();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + program.durationDays);

    const subscription = await ProgramSubscription.create({
      user: req.user.id,
      program: programId,
      startDate,
      endDate
    });

    res.status(201).json({
      message: "Program enrolled successfully",
      subscription
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getUserSubscriptions = async (req, res) => {
  try {

    const subscriptions = await ProgramSubscription.find({
      user: req.user.id
    })
      .populate("program", "title image durationDays")
      .sort({ createdAt: -1 });

    res.status(200).json(subscriptions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllSubscriptions = async (req, res) => {
  try {

    const subscriptions = await ProgramSubscription.find()
      .populate("user", "fullName email")
      .populate("program", "title durationDays")
      .sort({ createdAt: -1 });

    res.status(200).json(subscriptions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
