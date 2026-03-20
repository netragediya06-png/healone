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
      ref: "Program",
      required: true,
    },
    plan: {
      name: String,
      price: Number,
    },
    // Payment status
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    amountPaid: {
      type: Number,
      default: 0,
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
   paymentMethod: {
  type: String,
  enum: ["Razorpay", "UPI", "GPay", "PhonePe"],
  default: "UPI",
},
  },
  { timestamps: true },
);
// ✅ prevent duplicate subscription
programSubscriptionSchema.index(
  { user: 1, program: 1, status: 1 },
  { unique: true }
);


module.exports = mongoose.model(
  "ProgramSubscription",
  programSubscriptionSchema,
);
