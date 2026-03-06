const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
      minlength: 6,
      select: false, // hide password by default
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
    // ACCOUNT STATUS CONTROL
    // ========================
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // ========================
    // SPECIALIST PROFESSIONAL DETAILS
    // ========================
    professionalDetails: {
      specialization: String, // Ayurveda, Yoga, Herbal etc.
      experience: Number, // years
      qualification: String,
      practiceName: String,
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
    // DOCUMENTS
    // ========================
    documents: {
      idProof: String,
      certificationProof: String,
    },

    // ========================
    // WELLNESS PROFILE
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


// ========================
// PASSWORD HASHING
// ========================
userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});


// ========================
// PASSWORD COMPARE
// ========================
userSchema.methods.matchPassword = async function (enteredPassword) {

  return await bcrypt.compare(enteredPassword, this.password);

};


module.exports = mongoose.model("User", userSchema);