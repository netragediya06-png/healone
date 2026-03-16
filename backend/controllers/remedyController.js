const Remedy = require("../models/Remedy");
const cloudinary = require("../config/cloudinary");


/* =====================================
   CLOUDINARY IMAGE UPLOAD HELPER
===================================== */

const uploadImage = (fileBuffer, folder) => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        quality: "auto",
        fetch_format: "auto"
      },
      (error, result) => {

        if (error) return reject(error);

        resolve(result.secure_url);

      }
    );

    stream.end(fileBuffer);

  });

};


/* ======================================================
   CREATE REMEDY
====================================================== */

exports.createRemedy = async (req, res) => {

  try {

    const {
      title,
      symptoms,
      ingredients,
      steps,
      benefits,
      precautions,
      healthCategory,
      difficulty,
      preparationTime,
      usage,
      tags,
      relatedProducts
    } = req.body;

    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadImage(
        req.file.buffer,
        "healone_remedies"
      );
    }

    const remedy = new Remedy({

      title,

      symptoms: typeof symptoms === "string"
        ? JSON.parse(symptoms)
        : symptoms,

      ingredients: typeof ingredients === "string"
        ? JSON.parse(ingredients)
        : ingredients,

      steps: typeof steps === "string"
        ? JSON.parse(steps)
        : steps,

      benefits,
      precautions,

      healthCategory,
      difficulty,
      preparationTime,
      usage,

      tags: typeof tags === "string"
        ? JSON.parse(tags)
        : tags,

      relatedProducts,

      image: imageUrl,

      createdBy: req.user._id,

      status: req.user.role === "admin"
        ? "Approved"
        : "Pending"

    });

    const savedRemedy = await remedy.save();

    res.status(201).json(savedRemedy);

  } catch (error) {

    console.log("CREATE REMEDY ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   GET ALL REMEDIES (ADMIN)
====================================================== */

exports.getAllRemedies = async (req, res) => {

  try {

    const remedies = await Remedy
      .find()
      .populate("createdBy", "fullName email");

    res.json(remedies);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   GET APPROVED REMEDIES
====================================================== */

exports.getApprovedRemedies = async (req, res) => {

  try {

    const remedies = await Remedy.find({
      status: "Approved"
    });

    res.json(remedies);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   GET MY REMEDIES (SPECIALIST)
====================================================== */

exports.getMyRemedies = async (req, res) => {

  try {

    const remedies = await Remedy.find({
      createdBy: req.user._id
    });

    res.json(remedies);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   UPDATE REMEDY
====================================================== */

exports.updateRemedy = async (req, res) => {

  try {

    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({
        message: "Remedy not found"
      });
    }

    const {
      title,
      symptoms,
      ingredients,
      steps,
      benefits,
      precautions,
      healthCategory,
      difficulty,
      preparationTime,
      usage,
      tags,
      relatedProducts
    } = req.body;

    if (title) remedy.title = title;
    if (benefits) remedy.benefits = benefits;
    if (precautions) remedy.precautions = precautions;

    if (healthCategory) remedy.healthCategory = healthCategory;
    if (difficulty) remedy.difficulty = difficulty;
    if (preparationTime) remedy.preparationTime = preparationTime;
    if (usage) remedy.usage = usage;

    if (symptoms)
      remedy.symptoms = typeof symptoms === "string"
        ? JSON.parse(symptoms)
        : symptoms;

    if (ingredients)
      remedy.ingredients = typeof ingredients === "string"
        ? JSON.parse(ingredients)
        : ingredients;

    if (steps)
      remedy.steps = typeof steps === "string"
        ? JSON.parse(steps)
        : steps;

    if (tags)
      remedy.tags = typeof tags === "string"
        ? JSON.parse(tags)
        : tags;

    if (relatedProducts)
      remedy.relatedProducts = relatedProducts;


    /* IMAGE UPDATE */

    if (req.file) {

      const imageUrl = await uploadImage(
        req.file.buffer,
        "healone_remedies"
      );

      remedy.image = imageUrl;

    }

    const updated = await remedy.save();

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   UPDATE REMEDY STATUS (ADMIN)
====================================================== */

exports.updateRemedyStatus = async (req, res) => {

  try {

    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {

      return res.status(404).json({
        message: "Remedy not found"
      });

    }

    remedy.status = req.body.status;

    const updated = await remedy.save();

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   DELETE REMEDY
====================================================== */

exports.deleteRemedy = async (req, res) => {

  try {

    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {

      return res.status(404).json({
        message: "Remedy not found"
      });

    }

    await remedy.deleteOne();

    res.json({
      message: "Remedy deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

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
      status: "Approved"

    });

    res.json(remedies);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   SAVE REMEDY
====================================================== */

exports.saveRemedy = async (req, res) => {

  try {

    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {

      return res.status(404).json({
        message: "Remedy not found"
      });

    }

    if (!remedy.savedBy.includes(req.user._id)) {

      remedy.savedBy.push(req.user._id);
      await remedy.save();

    }

    res.json({
      message: "Remedy saved"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   UNSAVE REMEDY
====================================================== */

exports.unsaveRemedy = async (req, res) => {

  try {

    const remedy = await Remedy.findById(req.params.id);

    remedy.savedBy = remedy.savedBy.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await remedy.save();

    res.json({
      message: "Remedy removed from saved"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   GET SAVED REMEDIES
====================================================== */

exports.getSavedRemedies = async (req, res) => {

  try {

    const remedies = await Remedy.find({
      savedBy: req.user._id
    });

    res.json(remedies);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};