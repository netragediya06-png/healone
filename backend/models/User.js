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

  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },

  dateOfBirth: {
    type: Date,
  },

  role: {
    type: String,
    enum: ["admin", "specialist", "user"],
    default: "user",
  },

  // ========================
  // GOOGLE AUTH (OPTIONAL)
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
    default: "approved",
  },

  // ========================
  // ACCOUNT STATUS
  // ========================

  isBlocked: {
    type: Boolean,
    default: false,
  },

  // ========================
  // PASSWORD RESET SYSTEM
  // ========================

  resetToken: String,

  resetTokenExpire: Date,

  // ========================
  // SPECIALIST DETAILS
  // ========================

  professionalDetails: {

    specialization: String,

    experience: Number,

    qualification: String,

    practiceName: String,

    consultationMode: {
      type: String,
      enum: ["online", "offline", "both"],
    },

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



// ========================
// GENERATE EMAIL TOKEN
// ========================

userSchema.methods.generateVerificationToken = function () {

  const token = crypto.randomBytes(32).toString("hex");

  this.verificationToken = token;

  return token;

};



// ========================
// GENERATE RESET PASSWORD TOKEN
// ========================

userSchema.methods.generateResetToken = function () {

  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetToken = resetToken;

  this.resetTokenExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;

};



module.exports = mongoose.model("User", userSchema);