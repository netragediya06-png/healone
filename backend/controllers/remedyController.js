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
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve(result.secure_url);
      },
    );

    stream.end(fileBuffer);
  });
};
/* =====================================
   HELPER → PARSE JSON SAFELY
===================================== */
const parseField = (field) => {
  try {
    if (!field) return field;
    return typeof field === "string" ? JSON.parse(field) : field;
  } catch (error) {
    return field;
  }
};

/* ======================================================
   CREATE REMEDY
====================================================== */

exports.createRemedy = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      symptoms,
      ingredients,
      steps,
      benefits,
      precautions,
      difficulty,
      duration,
      preparationTime,
      bestTimeToUse,
      usage,
      tags,
      doshaAffinity,
      relatedProducts,
    } = req.body;

    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer, "healone_remedies");
    }

    const remedy = new Remedy({
      title,
      subtitle,
      description,
      category,

      symptoms: parseField(symptoms),
      ingredients: parseField(ingredients),
      steps: parseField(steps),
      benefits: parseField(benefits),
      precautions: parseField(precautions),
      tags: parseField(tags),
      doshaAffinity: parseField(doshaAffinity),

      difficulty,
      duration,
      preparationTime,
      bestTimeToUse,
      usage,

      relatedProducts,

      image: imageUrl,

      createdBy: req.user._id,
      specialist: req.user._id,

      status: req.user.role === "admin" ? "Approved" : "Pending",
    });

    const savedRemedy = await remedy.save();

    res.status(201).json(savedRemedy);
  } catch (error) {
    console.log("CREATE REMEDY ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================================
   GET ALL REMEDIES (ADMIN)
====================================================== */

exports.getAllRemedies = async (req, res) => {
  try {
    const remedies = await Remedy.find()
      .populate("createdBy", "fullName email")
      .populate("specialist", "fullName profileImage")
      .lean();

    res.json(remedies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
/* ======================================================
   GET APPROVED REMEDIES
====================================================== */

exports.getApprovedRemedies = async (req, res) => {
  try {
    const remedies = await Remedy.find({ status: "Approved" }).populate(
      "specialist",
      "fullName profileImage",
    )
    .lean();

    res.json(remedies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ======================================================
   GET SINGLE REMEDY (DETAIL PAGE)
====================================================== */
exports.getSingleRemedy = async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id).populate(
      "specialist",
      "fullName profileImage email",
    );

    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
    }

    // increase views
    remedy.views += 1;
    await remedy.save();

    res.json(remedy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ======================================================
   GET MY REMEDIES (SPECIALIST)
====================================================== */
exports.getMyRemedies = async (req, res) => {
  try {
    const remedies = await Remedy.find({
      createdBy: req.user._id,
    });

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
      return res.status(404).json({
        message: "Remedy not found",
      });
    }

    const fields = req.body;

    const allowedFields = [
      "title",
      "subtitle",
      "description",
      "category",
      "symptoms",
      "ingredients",
      "steps",
      "benefits",
      "precautions",
      "difficulty",
      "duration",
      "preparationTime",
      "bestTimeToUse",
      "usage",
      "tags",
      "doshaAffinity",
      "relatedProducts",
    ];

    allowedFields.forEach((key) => {
      if (fields[key] !== undefined) {
        remedy[key] = parseField(fields[key]);
      }
    });

    // IMAGE UPDATE
    if (req.file) {
      const imageUrl = await uploadImage(req.file.buffer, "healone_remedies");
      remedy.image = imageUrl;
    }

    // if specialist edits → back to pending
    if (req.user.role !== "admin") {
      remedy.status = "Pending";
    }

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
      status: "Approved",
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

    if (!remedy.savedBy.some(id => id.toString() === req.user._id.toString())) {
      remedy.savedBy.push(req.user._id)
      await remedy.save();
    }

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
    const remedy = await Remedy.findById(req.params.id);
    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
    }
    remedy.savedBy = remedy.savedBy.filter(
      (id) => id.toString() !== req.user._id.toString(),
    );

    await remedy.save();

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
    const remedies = await Remedy.find({
      savedBy: req.user._id,
    }).populate("specialist", "fullName profileImage");

    res.json(remedies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.incrementDownload = async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
    }

    remedy.downloads += 1;
    await remedy.save();

    res.json({ message: "Download counted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};