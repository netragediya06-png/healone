const Program = require("../models/Program");
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

/* ======================================================
   CREATE PROGRAM
====================================================== */

exports.createProgram = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      durationDays,
      programLevel,
      startDate,
      endDate,
      seatsLimit,
      benefits,
      plans,
      linkedRemedies,
      linkedYoga,
      mode, // ✅ NEW
    } = req.body;

    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer, "healone_programs");
    }

    const program = new Program({
      title,
      description,
      category,
      durationDays,
      programLevel,
      startDate,
      endDate,
      seatsLimit,

      benefits: typeof benefits === "string" ? JSON.parse(benefits) : benefits,

      plans: typeof plans === "string" ? JSON.parse(plans) : plans,

      linkedRemedies,
      linkedYoga,

      coverImage: imageUrl,

      specialist: req.user._id,
      mode: mode || "online", // ✅ NEW
      isPublished: false, // ✅ NEW
      isActive: true, // ✅ NEW
      status: "pending",
    });

    const savedProgram = await program.save();

    res.status(201).json(savedProgram);
  } catch (error) {
    console.log("CREATE PROGRAM ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================================
   GET ALL PROGRAMS (ADMIN)
====================================================== */

exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().populate(
      "specialist",
      "fullName email",
    );

    res.json(programs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================================
   GET APPROVED PROGRAMS (USER)
====================================================== */

exports.getApprovedPrograms = async (req, res) => {
  try {
    const programs = await Program.find({
      status: "approved",
      isPublished: true, // ✅ NEW
      isActive: true, // ✅ NEW
    });

    res.json(programs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================================
   GET SINGLE PROGRAM
====================================================== */

exports.getProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate("specialist", "fullName email")
      .populate("linkedRemedies")
      .populate("linkedYoga");

    if (!program) {
      return res.status(404).json({
        message: "Program not found",
      });
    }

    res.json(program);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================================
   GET MY PROGRAMS (SPECIALIST)
====================================================== */

exports.getMyPrograms = async (req, res) => {
  try {
    const programs = await Program.find({
      specialist: req.user._id,
    });

    res.json(programs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================================
   UPDATE PROGRAM
====================================================== */

exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        message: "Program not found",
      });
    }

    const {
      title,
      description,
      category,
      durationDays,
      programLevel,
      startDate,
      endDate,
      seatsLimit,
      benefits,
      plans,
      linkedRemedies,
      linkedYoga,
    } = req.body;

    if (title) program.title = title;
    if (description) program.description = description;
    if (category) program.category = category;
    if (durationDays) program.durationDays = durationDays;
    if (programLevel) program.programLevel = programLevel;

    if (startDate) program.startDate = startDate;
    if (endDate) program.endDate = endDate;

    if (seatsLimit) program.seatsLimit = seatsLimit;

    if (benefits)
      program.benefits =
        typeof benefits === "string" ? JSON.parse(benefits) : benefits;

    if (plans)
      program.plans = typeof plans === "string" ? JSON.parse(plans) : plans;

    if (linkedRemedies) program.linkedRemedies = linkedRemedies;
    if (linkedYoga) program.linkedYoga = linkedYoga;

    if (req.file) {
      const imageUrl = await uploadImage(req.file.buffer, "healone_programs");

      program.coverImage = imageUrl;
    }

    const updated = await program.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================================
   UPDATE PROGRAM STATUS (ADMIN)
====================================================== */

exports.updateProgramStatus = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        message: "Program not found",
      });
    }

    program.status = req.body.status;

    // ✅ AUTO CONTROL VISIBILITY
    if (req.body.status === "approved") {
      program.isPublished = true;
      program.isActive = true;
    }
    if (req.body.status === "rejected") {
      program.isPublished = false;
    }
    // ✅ ADMIN NOTE
    if (req.body.adminFeedback) {
      program.adminFeedback = req.body.adminFeedback;
    }

    const updated = await program.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================================
   DELETE PROGRAM
====================================================== */

exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        message: "Program not found",
      });
    }

    await program.deleteOne();

    res.json({
      message: "Program deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================================
   ENROLL USER IN PROGRAM
====================================================== */

exports.enrollProgram = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        message: "Program ID required",
      });
    }
    // ✅ CHECK LOGIN
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        message: "Program not found",
      });
    }
    // ✅ ADD THIS BLOCK HERE 👇
    if (!program.enrolledUsers) {
      program.enrolledUsers = [];
    }

    if (
      program.enrolledUsers.some(
        (id) => id.toString() === req.user._id.toString(),
      )
    ) {
      return res.status(400).json({
        message: "You already enrolled in this program",
      });
    }
    // ✅ CHECK PROGRAM IS AVAILABLE
    if (!program.isPublished || !program.isActive) {
      return res.status(400).json({
        message: "Program not available",
      });
    }
    // ✅ SEAT CHECK (ONLY IF LIMIT EXISTS)
    if (program.seatsLimit > 0 && program.seatsBooked >= program.seatsLimit) {
      return res.status(400).json({
        message: "Program seats full",
      });
    }
    // ✅ UPDATE COUNTS
    program.seatsBooked += 1;
    program.totalEnrollments += 1;

    // ✅ ADD THIS
    program.enrolledUsers.push(req.user._id);
    await program.save();

    res.json({
      message: "Enrollment successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
