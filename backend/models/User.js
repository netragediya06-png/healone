const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ========================
    // BASIC ACCOUNT INFO
    // ========================
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    profilePhoto: {
      type: String, // Cloudinary URL
    },

    role: {
      type: String,
      enum: ["admin", "specialist", "user"],
      default: "user",
    },

    // ========================
    // VERIFICATION SYSTEM
    // ========================
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    // ========================
    // SPECIALIST PROFESSIONAL DETAILS
    // ========================
    professionalDetails: {
      specialization: String, // Ayurveda, Yoga, Herbal etc.
      experience: Number, // in years
      qualification: String, // Certification / Degree
      practiceName: String, // Clinic or Brand name
      consultationMode: {
        type: String,
        enum: ["online", "offline", "both"],
      },
    },

    // ========================
    // LOCATION DETAILS
    // ========================
    location: {
      state: String,
      city: String,
      address: String,
      pincode: String,
    },

    // ========================
    // DOCUMENTS (ADMIN ONLY VIEW)
    // ========================
    documents: {
      idProof: String, // Cloudinary URL
      certificationProof: String, // Cloudinary URL
    },

    // ========================
    // WELLNESS PROFILE INFO
    // ========================
    bio: String,
    expertiseSummary: String,
    treatmentApproach: String,

    consultationFees: Number,
    availableTimeSlots: String,
    languagesSpoken: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);