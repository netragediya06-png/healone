const YogaService = require("../models/YogaService");


/* ======================================================
   CREATE YOGA SERVICE
   Specialist → Pending
   Admin → Auto Approved
====================================================== */
exports.createYogaService = async (req, res) => {
  try {
    let statusValue = "Pending";

    if (req.user.role === "admin") {
      statusValue = "Approved";
    }

    const yoga = await YogaService.create({
      ...req.body,
      status: statusValue,
      createdBy: req.user._id,
    });

    res.status(201).json(yoga);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ======================================================
   GET ALL YOGA SERVICES (ADMIN ONLY)
====================================================== */
exports.getAllYogaServices = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    const services = await YogaService.find(filter)
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await YogaService.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      services,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ======================================================
   GET MY YOGA SERVICES (SPECIALIST ONLY)
====================================================== */
exports.getMyYogaServices = async (req, res) => {
  try {
    const services = await YogaService.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ======================================================
   GET APPROVED YOGA SERVICES (PUBLIC)
====================================================== */
exports.getApprovedYogaServices = async (req, res) => {
  try {
    const services = await YogaService.find({
      status: "Approved",
    })
      .populate("createdBy", "fullName")
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ======================================================
   UPDATE YOGA SERVICE
   Admin → Any
   Specialist → Own (status resets to Pending)
====================================================== */
exports.updateYogaService = async (req, res) => {
  try {
    const yoga = await YogaService.findById(req.params.id);

    if (!yoga) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Admin can update any
    if (req.user.role === "admin") {
      const updated = await YogaService.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.json(updated);
    }

    // Specialist can update own only
    if (
      req.user.role === "specialist" &&
      yoga.createdBy.toString() === req.user._id.toString()
    ) {
      const updated = await YogaService.findByIdAndUpdate(
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
   UPDATE YOGA STATUS (ADMIN ONLY)
====================================================== */
exports.updateYogaStatus = async (req, res) => {
  try {
    const yoga = await YogaService.findById(req.params.id);

    if (!yoga) {
      return res.status(404).json({ message: "Service not found" });
    }

    yoga.status = req.body.status;
    await yoga.save();

    res.json(yoga);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ======================================================
   DELETE YOGA SERVICE
   Admin → Any
   Specialist → Own
====================================================== */
exports.deleteYogaService = async (req, res) => {
  try {
    const yoga = await YogaService.findById(req.params.id);

    if (!yoga) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Admin can delete any
    if (req.user.role === "admin") {
      await yoga.deleteOne();
      return res.json({ message: "Service deleted by admin" });
    }

    // Specialist can delete own only
    if (
      req.user.role === "specialist" &&
      yoga.createdBy.toString() === req.user._id.toString()
    ) {
      await yoga.deleteOne();
      return res.json({ message: "Service deleted successfully" });
    }

    return res.status(403).json({ message: "Access denied" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};              