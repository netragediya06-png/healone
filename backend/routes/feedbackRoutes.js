const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback"); // make sure path is correct

// Add feedback
router.post("/add", async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all feedback
router.get("/all", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("specialistId", "name"); // populate specialist name
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete feedback by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;