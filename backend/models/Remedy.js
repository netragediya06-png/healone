const mongoose = require("mongoose");

const remedySchema = new mongoose.Schema(
{
  // ===============================
  // BASIC INFO
  // ===============================
  title: {
    type: String,
    required: true,
    trim: true
  },

  subtitle: {
    type: String,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  // ===============================
  // HEALTH & TAGGING
  // ===============================
  symptoms: [
    {
      type: String,
      lowercase: true,
      trim: true
    }
  ],

  tags: [
    {
      type: String,
      lowercase: true,
      trim: true
    }
  ],

  doshaAffinity: [
    {
      type: String,
      enum: ["VATA", "PITTA", "KAPHA"]
    }
  ],

  // ===============================
  // INGREDIENTS (ADVANCED STRUCTURE)
  // ===============================
  ingredients: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: String
      },
      purpose: {
        type: String
      }
    }
  ],

  // ===============================
  // STEPS
  // ===============================
  steps: [
    {
      type: String,
      required: true
    }
  ],

  // ===============================
  // BENEFITS & PRECAUTIONS
  // ===============================
  benefits: [
    {
      type: String
    }
  ],

  precautions: [
    {
      type: String
    }
  ],

  // ===============================
  // USAGE DETAILS
  // ===============================
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Advanced"],
    default: "Easy"
  },

  duration: {
    type: String // e.g. "10 mins", "5 mins + overnight soak"
  },

  preparationTime: {
    type: Number // optional (minutes)
  },

  bestTimeToUse: {
    type: String
  },

  usage: {
    type: String
  },

  // ===============================
  // MEDIA
  // ===============================
  image: {
    type: String
  },

  // ===============================
  // RELATIONS
  // ===============================
  specialist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  relatedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],

  savedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  // ===============================
  // ANALYTICS
  // ===============================
  views: {
    type: Number,
    default: 0
  },

  downloads: {
    type: Number,
    default: 0
  },

  // ===============================
  // ADMIN CONTROL
  // ===============================
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Remedy", remedySchema);