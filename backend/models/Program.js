const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
{
  // =============================
  // BASIC PROGRAM INFORMATION
  // =============================
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    trim: true
  },

  durationDays: {
    type: Number,
    required: true
  },

  programLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },

  coverImage: {
    type: String
  },

  // =============================
  // PROGRAM SCHEDULE
  // =============================
  startDate: {
    type: Date
  },

  endDate: {
    type: Date
  },

  // =============================
  // SEAT MANAGEMENT
  // =============================
  seatsLimit: {
    type: Number,
    default: 0
  },

  seatsBooked: {
    type: Number,
    default: 0
  },

  // =============================
  // PROGRAM BENEFITS (UI BULLETS)
  // =============================
  benefits: [
    {
      type: String,
      trim: true
    }
  ],

  // =============================
  // PROGRAM PLANS (Basic/Premium/VIP)
  // =============================
  plans: [
    {
      name: {
        type: String,
        required: true
      },

      price: {
        type: Number,
        required: true
      },

      billingType: {
        type: String,
        enum: ["one-time", "monthly"],
        default: "one-time"
      },

      features: [
        {
          type: String
        }
      ],

      popular: {
        type: Boolean,
        default: false
      }
    }
  ],

  // =============================
  // LINK EXISTING CONTENT
  // =============================
  linkedRemedies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Remedy"
    }
  ],

  linkedYoga: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Yoga"
    }
  ],

  // =============================
  // PROGRAM CREATOR
  // =============================
  specialist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // =============================
  // ADMIN APPROVAL SYSTEM
  // =============================
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "draft"
  },

  adminFeedback: {
    type: String,
    default: ""
  },

  // =============================
  // PROGRAM ANALYTICS
  // =============================
  totalEnrollments: {
    type: Number,
    default: 0
  },
  enrolledUsers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],

  rating: {
    type: Number,
    default: 0
  },

  reviewCount: {
    type: Number,
    default: 0
  },
// =============================
// VISIBILITY CONTROL
// =============================
isPublished: {
  type: Boolean,
  default: false
},

mode: {
  type: String,
  enum: ["online", "offline", "both"],
  default: "online"
},

isActive: {
  type: Boolean,
  default: true
}
},

{
  timestamps: true
});

module.exports = mongoose.model("Program", programSchema);