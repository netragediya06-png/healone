const WellnessProgram = require("../models/WellnessProgram");
const User = require("../models/User");
exports.createProgram = async (req, res) => {
  try {

    const {
      title,
      description,
      category,
      durationDays,
      price
    } = req.body;

    const program = await WellnessProgram.create({
      title,
      description,
      category,
      durationDays,
      price,
      specialist: req.user.id,
      image: req.file ? req.file.path : null
    });

    res.status(201).json({
      message: "Program created and waiting for admin approval",
      program
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAdminPrograms = async (req, res) => {
  try {

    const programs = await WellnessProgram.find()
      .populate("category", "name")
      .populate("specialist", "fullName email");

    res.status(200).json(programs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getApprovedPrograms = async (req, res) => {
  try {

    const programs = await WellnessProgram.find({
      approvalStatus: "approved",
      status: true
    })
      .populate("category", "name")
      .populate("specialist", "fullName profilePhoto");

    res.status(200).json(programs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};  
exports.getSingleProgram = async (req, res) => {
  try {

    const program = await WellnessProgram.findById(req.params.id)
      .populate("category", "name")
      .populate("specialist", "fullName bio");

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.status(200).json(program);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateProgram = async (req, res) => {
  try {

    const program = await WellnessProgram.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    Object.assign(program, req.body);

    await program.save();

    res.status(200).json({
      message: "Program updated successfully",
      program
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteProgram = async (req, res) => {
  try {

    const program = await WellnessProgram.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    await program.deleteOne();

    res.status(200).json({
      message: "Program deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.approveProgram = async (req, res) => {
  try {

    const program = await WellnessProgram.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    program.approvalStatus = "approved";

    await program.save();

    res.status(200).json({
      message: "Program approved successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};