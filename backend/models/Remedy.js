const mongoose = require("mongoose");

const remedySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Symptoms for recommendation system
    symptoms: [
      {
        type: String,
      },
    ],

    ingredients: [
      {
        type: String,
        required: true,
      },
    ],

    steps: [
      {
        type: String,
        required: true,
      },
    ],

    benefits: {
      type: String,
    },

    precautions: {
      type: String,
    },

    healthCategory: {
      type: String,
      required: true,
    },

    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    image: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ⭐ Users who saved this remedy
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Remedy", remedySchema);