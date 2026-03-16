const mongoose = require("mongoose");

const yogaSchema = new mongoose.Schema(
{
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

  difficulty: {
    type: String,
    enum: ["Beginner","Intermediate","Advanced"],
    default: "Beginner"
  },

  duration: {
    type: Number,
    required: true
  },

  caloriesBurn: {
    type: Number
  },

  rating: {
    type: Number,
    default: 0
  },

  image: String,

  videoUrl: String,

  benefits: [
    {
      type: String,
      trim: true
    }
  ],

  steps: [
    {
      type: String,
      required: true
    }
  ],

  cautions: [
    {
      type: String,
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

  specialistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  views: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["Pending","Approved","Rejected"],
    default: "Pending"
  },

  adminFeedback: String,

  savedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

},
{ timestamps: true }
);

module.exports = mongoose.model("Yoga", yogaSchema);