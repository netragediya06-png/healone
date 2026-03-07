const mongoose = require("mongoose");

const programSubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WellnessProgram",
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active"
    },
      paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "paid"
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProgramSubscription", programSubscriptionSchema);