const mongoose = require("mongoose");

const programSubscriptionSchema = new mongoose.Schema(
  {
    // User who purchased program
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Program subscribed
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WellnessProgram",
      required: true,
    },

    // Payment status
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // Subscription dates
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // Subscription state
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },

    // Amount paid (important for admin analytics)
    amountPaid: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProgramSubscription", programSubscriptionSchema);