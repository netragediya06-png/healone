const User = require("../models/User");
const uploadImage = require("../utils/uploadImage");

/* =========================
   🔥 BECOME SPECIALIST (NEW)
========================= */
exports.becomeSpecialist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "specialist") {
      return res.status(400).json({
        message: "Already a specialist",
      });
    }

    // =========================
    // 🔥 PARSE BODY
    // =========================
    const {
      organizationName,
      organizationType,
      experienceYears,
      practitionersCount,
      servicesOffered,
      specialization,
      consultationMode,
      onlineFees,
      offlineFees,
      qualification,
      university,
      yearOfCompletion,
      bio,
      expertiseSummary,
      treatmentApproach,
      startTime,
      endTime,
      languagesSpoken,
      days,
    } = req.body;

    // 🔥 FIX ARRAY
    const parsedDays = typeof days === "string" ? JSON.parse(days) : days || [];

    // =========================
    // 🔥 FILES
    // =========================
    const profilePhotoFile = req.files?.profilePhoto?.[0];
    const documentFiles = req.files?.documents || [];

    let profilePhotoUrl = user.profilePhoto;

    // 👉 Upload profile image
    if (profilePhotoFile) {
      profilePhotoUrl = await uploadImage(
        profilePhotoFile.buffer,
        "healone/users",
      );
    }

    // 👉 Upload documents
    const documentUrls = [];
    for (const file of documentFiles) {
      const url = await uploadImage(file.buffer, "healone/documents");
      documentUrls.push(url);
    }

    // =========================
    // 🔥 UPDATE USER
    // =========================
    user.role = "specialist";

    user.verification = {
      status: "pending",
    };

    user.documents = documentUrls.map((url) => ({
      url,
      uploadedAt: new Date(),
    }));

    user.isActive = false;

    user.profilePhoto = profilePhotoUrl;

    user.professionalDetails = {
      qualification,
      university,
      yearOfCompletion,
      experienceYears,
    };

    user.organizationDetails = {
      organizationName,
      organizationType,
      experienceYears,
      practitionersCount,

      // ✅ FIX ARRAY ISSUE
      servicesOffered: servicesOffered
        ? Array.isArray(servicesOffered)
          ? servicesOffered
          : [servicesOffered]
        : [],

      specialization: specialization
        ? Array.isArray(specialization)
          ? specialization
          : [specialization]
        : [],

      consultationMode,
      pricing: {
        online: onlineFees,
        offline: offlineFees,
      },
    };

    user.bio = bio;
    user.expertiseSummary = expertiseSummary;
    user.treatmentApproach = treatmentApproach;

    user.availability = {
      days: parsedDays,
      startTime,
      endTime,
    };

    user.languagesSpoken = languagesSpoken;

    console.log("🔥 BEFORE SAVE:", user);

    const savedUser = await user.save();

    console.log("✅ AFTER SAVE:", savedUser);

    res.status(200).json({
      message: "Specialist request submitted successfully",
    });
  } catch (error) {
    console.error("BECOME SPECIALIST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
/* =========================
   GET ALL SPECIALISTS
========================= */
exports.getSpecialists = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = { role: "specialist" };

    if (status) {
      filter["verification.status"] = status;
    }

    const specialists = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(specialists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* =========================
   GET SINGLE SPECIALIST
========================= */
exports.getSingleSpecialist = async (req, res) => {
  try {
    const specialist = await User.findById(req.params.id).select("-password");

    if (!specialist || specialist.role !== "specialist") {
      return res.status(404).json({
        message: "Specialist not found",
      });
    }

    res.status(200).json(specialist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* =========================
   UPDATE SPECIALIST PROFILE
========================= */
exports.updateSpecialistProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "specialist") {
      return res.status(403).json({ message: "Access denied" });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.phone = req.body.phone || user.phone;
    user.bio = req.body.bio || user.bio;
    user.languagesSpoken = req.body.languagesSpoken || user.languagesSpoken;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* =========================
   DELETE SPECIALIST
========================= */
exports.deleteSpecialist = async (req, res) => {
  try {
    const specialist = await User.findById(req.params.id);

    if (!specialist || specialist.role !== "specialist") {
      return res.status(404).json({
        message: "Specialist not found",
      });
    }

    await specialist.deleteOne();

    res.status(200).json({
      message: "Specialist deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* =========================
   APPROVE SPECIALIST
========================= */
exports.approveSpecialist = async (req, res) => {
  try {
    const specialist = await User.findById(req.params.id);

    if (!specialist || specialist.role !== "specialist") {
      return res.status(404).json({ message: "Specialist not found" });
    }

    specialist.verification.status = "approved";
    specialist.isActive = true;

    await specialist.save();

    res.json({ message: "Approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* =========================
   REJECT SPECIALIST
========================= */
exports.rejectSpecialist = async (req, res) => {
  try {
    const specialist = await User.findById(req.params.id);

    if (!specialist || specialist.role !== "specialist") {
      return res.status(404).json({ message: "Specialist not found" });
    }

    specialist.verification.status = "rejected";
    specialist.isActive = false;

    await specialist.save();

    res.json({ message: "Rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* =========================
   FILTER SPECIALISTS
========================= */
exports.getFilteredSpecialists = async (req, res) => {
  try {
    const { city, service } = req.query;

    let filter = {
      role: "specialist",
      "verification.status": "approved",
      isActive: true,
    };

    if (city) {
      filter["location.city"] = city;
    }

    if (service) {
      filter["organizationDetails.servicesOffered"] = {
        $in: [service],
      };
    }

    const specialists = await User.find(filter);

    res.json(specialists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
