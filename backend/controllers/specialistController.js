const User = require("../models/User");

/* ===================================
   📌 GET ALL APPROVED SPECIALISTS (PUBLIC)
=================================== */
exports.getApprovedSpecialists = async (req, res) => {
  try {
    const specialists = await User.find({
      role: "specialist",
      verificationStatus: "approved",
    })
      .select("-password -documents -verificationToken -resetToken -resetTokenExpire")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: specialists.length,
      data: specialists,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ===================================
   📌 GET SINGLE SPECIALIST DETAILS
=================================== */
exports.getSingleSpecialist = async (req, res) => {
  try {
    const specialist = await User.findById(req.params.id)
      .select("-password -resetToken -resetTokenExpire");

    if (!specialist || specialist.role !== "specialist") {
      return res.status(404).json({
        success: false,
        message: "Specialist not found",
      });
    }

    res.status(200).json({
      success: true,
      data: specialist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ===================================
   📌 UPDATE SPECIALIST PROFILE
=================================== */
exports.updateSpecialistProfile = async (req, res) => {
  try {
    const specialist = await User.findById(req.user._id);

    if (!specialist || specialist.role !== "specialist") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Update basic fields
    specialist.fullName = req.body.fullName || specialist.fullName;
    specialist.phone = req.body.phone || specialist.phone;
    specialist.profilePhoto = req.body.profilePhoto || specialist.profilePhoto;

    // Update organization details
    if (req.body.organizationDetails) {
      specialist.organizationDetails = {
        ...specialist.organizationDetails,
        ...req.body.organizationDetails,
      };
    }

    // Update other fields
    specialist.bio = req.body.bio || specialist.bio;
    specialist.expertiseSummary = req.body.expertiseSummary || specialist.expertiseSummary;
    specialist.treatmentApproach = req.body.treatmentApproach || specialist.treatmentApproach;
    specialist.availableTimeSlots = req.body.availableTimeSlots || specialist.availableTimeSlots;
    specialist.languagesSpoken = req.body.languagesSpoken || specialist.languagesSpoken;

    // Location
    if (req.body.location) {
      specialist.location = {
        ...specialist.location,
        ...req.body.location,
      };
    }

    await specialist.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: specialist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ===================================
   📌 DELETE SPECIALIST (ADMIN)
=================================== */
exports.deleteSpecialist = async (req, res) => {
  try {
    const specialist = await User.findById(req.params.id);

    if (!specialist || specialist.role !== "specialist") {
      return res.status(404).json({
        success: false,
        message: "Specialist not found",
      });
    }

    await specialist.deleteOne();

    res.status(200).json({
      success: true,
      message: "Specialist deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ===================================
   📌 ADMIN: APPROVE / REJECT SPECIALIST
=================================== */
exports.updateVerificationStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved / rejected

    const specialist = await User.findById(req.params.id);

    if (!specialist || specialist.role !== "specialist") {
      return res.status(404).json({
        success: false,
        message: "Specialist not found",
      });
    }

    specialist.verificationStatus = status;
    await specialist.save();

    res.status(200).json({
      success: true,
      message: `Specialist ${status} successfully`,
      data: specialist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ===================================
   📌 GET SPECIALISTS WITH FILTER (ADVANCED)
=================================== */
exports.getFilteredSpecialists = async (req, res) => {
  try {
    const { city, service, minRating } = req.query;

    let query = {
      role: "specialist",
      verificationStatus: "approved",
    };

    // Filter by city
    if (city) {
      query["location.city"] = city;
    }

    // Filter by services (Ayurveda treatments)
    if (service) {
      query["organizationDetails.servicesOffered"] = {
        $in: [service],
      };
    }

    // Filter by rating
    if (minRating) {
      query["organizationDetails.rating"] = { $gte: Number(minRating) };
    }

    const specialists = await User.find(query)
      .select("-password")
      .sort({ "organizationDetails.rating": -1 });

    res.status(200).json({
      success: true,
      count: specialists.length,
      data: specialists,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};