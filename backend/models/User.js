const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
    index: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  phone: {
    type: String,
    required: true,
  },

  profilePhoto: {
    type: String,
    default: "",
  },

  role: {
    type: String,
    enum: ["admin", "specialist", "user"],
    default: "user",
  },

  // ========================
  // GOOGLE AUTH
  // ========================

  googleId: {
    type: String,
  },

  // ========================
  // EMAIL VERIFICATION
  // ========================

  isVerified: {
    type: Boolean,
    default: false,
  },

  verificationToken: String,

  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  // ========================
  // ACCOUNT STATUS
  // ========================

  isBlocked: {
    type: Boolean,
    default: false,
  },

  // ========================
  // PASSWORD RESET
  // ========================

  resetToken: String,
  resetTokenExpire: Date,

  // ========================
  // 🏛️ AYURVEDA ORGANIZATION DETAILS
  // ========================

  organizationDetails: {

    organizationName: {
      type: String,
      required: function () {
        return this.role === "specialist";
      }
    },

    organizationType: {
      type: String,
      enum: ["academy", "clinic", "panchakarma_center", "sanstha"],
    },

    establishedYear: Number,

    registrationNumber: String,

    practitionersCount: Number, // number of doctors/therapists

    experienceYears: Number, // total experience of org

    servicesOffered: [String], // Panchakarma, Detox, Skin, etc.

    consultationMode: {
      type: String,
      enum: ["online", "offline", "both"],
    },

    // Pricing
    pricing: {
      online: Number,
      offline: Number,
    },

    // Stats for UI
    rating: {
      type: Number,
      default: 0,
    },

    totalPatientsServed: {
      type: Number,
      default: 0,
    },

    // Media
    gallery: [String], // center images

  },

  // ========================
  // LOCATION
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
    registrationCertificate: String,
  },

  // ========================
  // AYURVEDA PROFILE CONTENT
  // ========================

  bio: String, // About organization

  expertiseSummary: String,

  treatmentApproach: String, // holistic healing etc

  facilities: [String], // steam, massage rooms etc

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


// ========================
// EMAIL TOKEN
// ========================

userSchema.methods.generateVerificationToken = function () {

  const token = crypto.randomBytes(32).toString("hex");
  this.verificationToken = token;

  return token;
};


// ========================
// RESET TOKEN
// ========================

userSchema.methods.generateResetToken = function () {

  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetToken = resetToken;
  this.resetTokenExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


module.exports = mongoose.model("User", userSchema);