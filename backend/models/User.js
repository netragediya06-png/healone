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
    index: true,
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

  // 🔥 NEW (ADVANCED ADMIN VERIFICATION SYSTEM)
  verification: {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
    adminNote: String,
  },  

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
  isActive: {
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
      enum: ["academy", "clinic", "panchakarma_center", "sanstha", "hospital"],
    },

    establishedYear: Number,

    registrationNumber: String,

    practitionersCount: Number, // number of doctors/therapists

    experienceYears: Number, // total experience of org

    servicesOffered: [String], // Panchakarma, Detox, Skin, etc.

    // 🔥 NEW
    specialization: [String],

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
  // 👨‍⚕️ PROFESSIONAL DETAILS (NEW)
  // ========================

  professionalDetails: {
    qualification: String,
    university: String,
    yearOfCompletion: Number,
    registrationNumber: String,
    experienceYears: Number,
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
  // DOCUMENTS (UPGRADED)
  // ========================

 documents: [
  {
    url: {
      type: String,
      required: function () {
        return this.role === "specialist";
      }
    },
    verified: {
      type: Boolean,
      default: false
    }
  }
],
  // ========================
  // AYURVEDA PROFILE CONTENT
  // ========================

  bio: String,

  expertiseSummary: String,

  treatmentApproach: String,

  facilities: [String],

  // 🔥 UPDATED
  availability: {
    days: [String],
    startTime: String,
    endTime: String,
  },

  // OLD field (kept safe)
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
// SYNC VERIFICATION STATUS
// ========================

userSchema.pre("save", function () {
  if (this.verification?.status) {
    this.verificationStatus = this.verification.status;
  }
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

// ========================
// INDEX FOR FAST QUERY
// ========================

userSchema.index({ role: 1, "verification.status": 1 });
module.exports = mongoose.model("User", userSchema);