const mongoose = require("mongoose");

const remedySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Remedy", remedySchema);
