const Remedy = require("../models/Remedy");

/* ======================================================
   CREATE REMEDY
   Specialist → Pending
   Admin → Auto Approved
====================================================== */
exports.createRemedy = async (req, res) => {
  try {
    let statusValue = "Pending";

    // If admin creates → auto approve
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
   GET ALL REMEDIES (ADMIN ONLY)
====================================================== */
exports.getAllRemedies = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Filter by status (Pending / Approved / Rejected)
    if (status) {
      filter.status = status;
    }

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
   GET MY REMEDIES (SPECIALIST ONLY)
====================================================== */
exports.getMyRemedies = async (req, res) => {
  try {
    const remedies = await Remedy.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

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
   UPDATE REMEDY
   Admin → Update any
   Specialist → Update own (status resets to Pending)
====================================================== */
exports.updateRemedy = async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
    }

    // Admin can update any remedy
    if (req.user.role === "admin") {
      const updated = await Remedy.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.json(updated);
    }

    // Specialist can update only own remedy
    if (
      req.user.role === "specialist" &&
      remedy.createdBy.toString() === req.user._id.toString()
    ) {
      const updated = await Remedy.findByIdAndUpdate(
        req.params.id,
        { ...req.body, status: "Pending" }, // Re-approval required
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
   UPDATE REMEDY STATUS (ADMIN ONLY)
====================================================== */
exports.updateRemedyStatus = async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
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
   Admin → Delete any
   Specialist → Delete own only
====================================================== */
exports.deleteRemedy = async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);

    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
    }

    // Admin can delete any
    if (req.user.role === "admin") {
      await remedy.deleteOne();
      return res.json({ message: "Remedy deleted by admin" });
    }

    // Specialist can delete only own
    if (
      req.user.role === "specialist" &&
      remedy.createdBy.toString() === req.user._id.toString()
    ) {
      await remedy.deleteOne();
      return res.json({ message: "Remedy deleted successfully" });
    }

    return res.status(403).json({ message: "Access denied" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
