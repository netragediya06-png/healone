const mongoose = require("mongoose");

const wellnessProgramSchema = new mongoose.Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    specialist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    durationDays: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      default: 0
    },

    image: String,

    status: {
      type: Boolean,
      default: true
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    level: {
  type: String,
  enum: ["beginner", "intermediate", "advanced"]
}
  },
  { timestamps: true }
);

module.exports = mongoose.model("WellnessProgram", wellnessProgramSchema);