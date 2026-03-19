const User = require("../models/User");
const uploadImage = require("../utils/uploadImage");

/* ===================================
   UPLOAD DOCUMENTS
=================================== */

exports.uploadDocuments = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.role !== "specialist") {
      return res.status(403).json({
        message: "Only specialists can upload documents"
      });
    }

    // ========================
    // FILES FROM MULTER
    // ========================

    const files = req.files;

    let updatedDocs = {};

    // ID Proof
    if (files.idProof) {
      const url = await uploadImage(files.idProof[0].buffer, "healone/docs");
      updatedDocs["documents.idProof.url"] = url;
    }

    // Degree
    if (files.degreeCertificate) {
      const url = await uploadImage(files.degreeCertificate[0].buffer, "healone/docs");
      updatedDocs["documents.degreeCertificate.url"] = url;
    }

    // License
    if (files.licenseCertificate) {
      const url = await uploadImage(files.licenseCertificate[0].buffer, "healone/docs");
      updatedDocs["documents.licenseCertificate.url"] = url;
    }

    // Clinic Proof
    if (files.clinicProof) {
      const url = await uploadImage(files.clinicProof[0].buffer, "healone/docs");
      updatedDocs["documents.clinicProof.url"] = url;
    }

    // ========================
    // UPDATE USER
    // ========================

    await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedDocs },
      { new: true }
    );

    res.status(200).json({
      message: "Documents uploaded successfully"
    });

  } catch (error) {
    console.error("UPLOAD DOC ERROR:", error);

    res.status(500).json({
      message: "Failed to upload documents"
    });
  }
};
/* ===================================
   UPLOAD PROFILE PHOTO
=================================== */

exports.uploadProfilePhoto = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const url = await uploadImage(
      req.file.buffer,
      "healone/profile"
    );

    user.profilePhoto = url;

    await user.save();

    res.status(200).json({
      message: "Profile photo uploaded successfully",
      profilePhoto: url
    });

  } catch (error) {
    console.error("PROFILE UPLOAD ERROR:", error);

    res.status(500).json({
      message: "Failed to upload profile photo"
    });
  }
};