const express = require("express");
const router = express.Router();

const Remedy = require("../models/Remedy");
const Yoga = require("../models/YogaService");
const Program = require("../models/Program");

router.get("/dashboard", async (req, res) => {

  try {

    const totalRemedies = await Remedy.countDocuments();
    const totalYoga = await Yoga.countDocuments();
    const totalPrograms = await Program.countDocuments();

    res.json({
      totalRemedies,
      totalYoga,
      totalPrograms
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

module.exports = router;