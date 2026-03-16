const Yoga = require("../models/yoga");
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
   CREATE YOGA
====================================================== */

exports.createYoga = async (req, res) => {

  try {

    const {
      title,
      subtitle,
      description,
      category,
      difficulty,
      duration,
      caloriesBurn,
      videoUrl,
      benefits,
      steps,
      cautions,
      tags
    } = req.body;

    let imageUrl = "";

    if (req.file) {

      imageUrl = await uploadImage(
        req.file.buffer,
        "healone_yoga"
      );

    }

    const yoga = new Yoga({

      title,
      subtitle,
      description,
      category,
      difficulty,
      duration,
      caloriesBurn,
      videoUrl,

      benefits: typeof benefits === "string"
        ? JSON.parse(benefits)
        : benefits,

      steps: typeof steps === "string"
        ? JSON.parse(steps)
        : steps,

      cautions: typeof cautions === "string"
        ? JSON.parse(cautions)
        : cautions,

      tags: typeof tags === "string"
        ? JSON.parse(tags)
        : tags,

      image: imageUrl,

      specialistId: req.user._id,

      status: req.user.role === "admin"
        ? "Approved"
        : "Pending"

    });

    const savedYoga = await yoga.save();

    res.status(201).json(savedYoga);

  } catch (error) {

    console.log("CREATE YOGA ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   GET ALL YOGA (ADMIN)
====================================================== */

exports.getAllYoga = async (req, res) => {

  try {

    const yoga = await Yoga
      .find()
      .populate("specialistId", "fullName email");

    res.json(yoga);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   GET APPROVED YOGA (USER)
====================================================== */

exports.getApprovedYoga = async (req, res) => {

  try {

    const yoga = await Yoga.find({
      status: "Approved"
    });

    res.json(yoga);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   GET MY YOGA (SPECIALIST)
====================================================== */

exports.getMyYoga = async (req, res) => {

  try {

    const yoga = await Yoga.find({
      specialistId: req.user._id
    });

    res.json(yoga);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   UPDATE YOGA
====================================================== */

exports.updateYoga = async (req, res) => {

  try {

    const yoga = await Yoga.findById(req.params.id);

    if (!yoga) {
      return res.status(404).json({
        message: "Yoga not found"
      });
    }

    const {
      title,
      subtitle,
      description,
      category,
      difficulty,
      duration,
      caloriesBurn,
      videoUrl,
      benefits,
      steps,
      cautions,
      tags
    } = req.body;

    if (title) yoga.title = title;
    if (subtitle) yoga.subtitle = subtitle;
    if (description) yoga.description = description;
    if (category) yoga.category = category;
    if (difficulty) yoga.difficulty = difficulty;
    if (duration) yoga.duration = duration;
    if (caloriesBurn) yoga.caloriesBurn = caloriesBurn;
    if (videoUrl) yoga.videoUrl = videoUrl;

    if (benefits)
      yoga.benefits = typeof benefits === "string"
        ? JSON.parse(benefits)
        : benefits;

    if (steps)
      yoga.steps = typeof steps === "string"
        ? JSON.parse(steps)
        : steps;

    if (cautions)
      yoga.cautions = typeof cautions === "string"
        ? JSON.parse(cautions)
        : cautions;

    if (tags)
      yoga.tags = typeof tags === "string"
        ? JSON.parse(tags)
        : tags;


    /* IMAGE UPDATE */

    if (req.file) {

      const imageUrl = await uploadImage(
        req.file.buffer,
        "healone_yoga"
      );

      yoga.image = imageUrl;

    }

    const updated = await yoga.save();

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   UPDATE YOGA STATUS (ADMIN)
====================================================== */

exports.updateYogaStatus = async (req, res) => {

  try {

    const yoga = await Yoga.findById(req.params.id);

    if (!yoga) {

      return res.status(404).json({
        message: "Yoga not found"
      });

    }

    yoga.status = req.body.status;

    if (req.body.adminFeedback) {
      yoga.adminFeedback = req.body.adminFeedback;
    }

    const updated = await yoga.save();

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   DELETE YOGA
====================================================== */

exports.deleteYoga = async (req, res) => {

  try {

    const yoga = await Yoga.findById(req.params.id);

    if (!yoga) {

      return res.status(404).json({
        message: "Yoga not found"
      });

    }

    await yoga.deleteOne();

    res.json({
      message: "Yoga deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   SEARCH YOGA BY TAG
====================================================== */

exports.searchYogaByTag = async (req, res) => {

  try {

    const { tag } = req.query;

    const yoga = await Yoga.find({

      tags: { $regex: tag, $options: "i" },
      status: "Approved"

    });

    res.json(yoga);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   SAVE YOGA
====================================================== */

exports.saveYoga = async (req, res) => {

  try {

    const yoga = await Yoga.findById(req.params.id);

    if (!yoga) {

      return res.status(404).json({
        message: "Yoga not found"
      });

    }

    if (!yoga.savedBy.includes(req.user._id)) {

      yoga.savedBy.push(req.user._id);
      await yoga.save();

    }

    res.json({
      message: "Yoga saved"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   UNSAVE YOGA
====================================================== */

exports.unsaveYoga = async (req, res) => {

  try {

    const yoga = await Yoga.findById(req.params.id);

    yoga.savedBy = yoga.savedBy.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await yoga.save();

    res.json({
      message: "Yoga removed from saved"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/* ======================================================
   GET SAVED YOGA
====================================================== */

exports.getSavedYoga = async (req, res) => {

  try {

    const yoga = await Yoga.find({
      savedBy: req.user._id
    });

    res.json(yoga);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};