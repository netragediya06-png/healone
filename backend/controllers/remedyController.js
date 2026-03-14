const Remedy = require("../models/Remedy");

/* ======================================================
   CREATE REMEDY
====================================================== */
exports.createRemedy = async (req, res) => {
  try {

    const {
      title,
      description,
      symptoms,
      ingredients,
      steps,
      category
    } = req.body;

    const image = req.file ? req.file.originalname : "";

    const remedy = new Remedy({
      title,
      description,
      symptoms: typeof symptoms === "string" ? JSON.parse(symptoms) : symptoms,
      ingredients: typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients,
      steps: typeof steps === "string" ? JSON.parse(steps) : steps,
      category,
      image,
      createdBy: req.user._id,
      status: req.user.role === "admin" ? "approved" : "pending"
    });

    const savedRemedy = await remedy.save();

    res.status(201).json(savedRemedy);

  } catch (error) {
    console.log("CREATE REMEDY ERROR:", error);   // ⭐ IMPORTANT
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   GET ALL REMEDIES (ADMIN)
====================================================== */
exports.getAllRemedies = async (req, res) => {
  try {
    const remedies = await Remedy.find().populate("createdBy", "name");
    res.json(remedies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   GET APPROVED REMEDIES
====================================================== */
exports.getApprovedRemedies = async (req, res) => {
  try {
    const remedies = await Remedy.find({ status: "approved" });
    res.json(remedies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   GET MY REMEDIES (SPECIALIST)
====================================================== */
exports.getMyRemedies = async (req, res) => {
  try {
    const remedies = await Remedy.find({ createdBy: req.user._id });
    res.json(remedies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   UPDATE REMEDY
====================================================== */
exports.updateRemedy = async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
    }

    const {
      title,
      description,
      symptoms,
      ingredients,
      steps,
      category
    } = req.body;

    remedy.title = title || remedy.title;
    remedy.description = description || remedy.description;
    remedy.category = category || remedy.category;

    if (symptoms) remedy.symptoms = JSON.parse(symptoms);
    if (ingredients) remedy.ingredients = JSON.parse(ingredients);
    if (steps) remedy.steps = JSON.parse(steps);

    if (req.file) remedy.image = req.file.originalname;

    const updated = await remedy.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   UPDATE REMEDY STATUS (ADMIN)
====================================================== */
exports.updateRemedyStatus = async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
    }

    remedy.status = req.body.status;

    const updated = await remedy.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   DELETE REMEDY
====================================================== */
exports.deleteRemedy = async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
    }

    await remedy.deleteOne();

    res.json({ message: "Remedy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   SEARCH REMEDIES BY SYMPTOM
====================================================== */
exports.searchRemediesBySymptom = async (req, res) => {
  try {
    const { symptom } = req.query;

    const remedies = await Remedy.find({
      symptoms: { $regex: symptom, $options: "i" },
      status: "approved"
    });

    res.json(remedies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   SAVE REMEDY
====================================================== */
exports.saveRemedy = async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
    }

    req.user.savedRemedies.push(remedy._id);
    await req.user.save();

    res.json({ message: "Remedy saved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   UNSAVE REMEDY
====================================================== */
exports.unsaveRemedy = async (req, res) => {
  try {
    req.user.savedRemedies = req.user.savedRemedies.filter(
      (id) => id.toString() !== req.params.id
    );

    await req.user.save();

    res.json({ message: "Remedy removed from saved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   GET SAVED REMEDIES
====================================================== */
exports.getSavedRemedies = async (req, res) => {
  try {
    await req.user.populate("savedRemedies");

    res.json(req.user.savedRemedies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};