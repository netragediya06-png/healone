const Remedy = require("../models/Remedy");

/* ======================================================
   CREATE REMEDY
   Specialist → Pending
   Admin → Auto Approved
====================================================== */
exports.createRemedy = async (req, res) => {
  try {
    let statusValue = "Pending";

    if (req.user.role === "admin") {
      statusValue = "Approved";
    }

    const remedy = await Remedy.create({
      ...req.body,
      status: statusValue,
      createdBy: req.user._id,
    });

    res.status(201).json(remedy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   GET ALL REMEDIES (ADMIN)
====================================================== */
exports.getAllRemedies = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const remedies = await Remedy.find(filter)
      .populate("relatedProducts")
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Remedy.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      remedies,
    });

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
    })
      .populate("relatedProducts")
      .sort({ createdAt: -1 });

    res.json(remedies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   GET APPROVED REMEDIES (PUBLIC)
====================================================== */
exports.getApprovedRemedies = async (req, res) => {
  try {
    const remedies = await Remedy.find({ status: "Approved" })
      .populate("relatedProducts")
      .sort({ createdAt: -1 });

    res.json(remedies);
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
      status: "Approved",
      symptoms: { $regex: symptom, $options: "i" }
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
      return res.status(404).json({ message: "Remedy not found" });
    }

    if (req.user.role === "admin") {
      const updated = await Remedy.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.json(updated);
    }

    if (
      req.user.role === "specialist" &&
      remedy.createdBy.toString() === req.user._id.toString()
    ) {
      const updated = await Remedy.findByIdAndUpdate(
        req.params.id,
        { ...req.body, status: "Pending" },
        { new: true }
      );
      return res.json(updated);
    }

    return res.status(403).json({ message: "Access denied" });

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

    const allowedStatuses = ["Pending", "Approved", "Rejected"];

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    remedy.status = req.body.status;
    await remedy.save();

    res.json(remedy);

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

    if (req.user.role === "admin") {
      await remedy.deleteOne();
      return res.json({ message: "Remedy deleted by admin" });
    }

    if (
      req.user.role === "specialist" &&
      remedy.createdBy.toString() === req.user._id.toString()
    ) {
      if (remedy.status === "Approved") {
        return res.status(403).json({
          message: "Cannot delete approved remedy. Contact admin.",
        });
      }

      await remedy.deleteOne();
      return res.json({ message: "Remedy deleted successfully" });
    }

    return res.status(403).json({ message: "Access denied" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   SAVE REMEDY ❤️
====================================================== */
exports.saveRemedy = async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
    }

    if (!remedy.savedBy.includes(req.user._id)) {
      remedy.savedBy.push(req.user._id);
      await remedy.save();
    }

    res.json({ message: "Remedy saved successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   UNSAVE REMEDY ❌
====================================================== */
exports.unsaveRemedy = async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
    }

    remedy.savedBy = remedy.savedBy.filter(
      userId => userId.toString() !== req.user._id.toString()
    );

    await remedy.save();

    res.json({ message: "Remedy removed from saved list" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   GET SAVED REMEDIES (USER)
====================================================== */
exports.getSavedRemedies = async (req, res) => {
  try {
    const remedies = await Remedy.find({
      savedBy: req.user._id,
      status: "Approved"
    }).sort({ createdAt: -1 });

    res.json(remedies);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};