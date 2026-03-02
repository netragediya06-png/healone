const mongoose = require("mongoose");

const yogaServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // in minutes
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    mode: {
      type: String,
      enum: ["online", "offline" , "both"],
      required: true,
    },

    location: {
      type: String, // required only if offline
    },

    availableSlots: {
      type: String, // simple for now (later can be advanced)
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

module.exports = mongoose.model("YogaService", yogaServiceSchema);