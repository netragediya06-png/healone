const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 🔗 USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📦 PRODUCTS
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true, // snapshot
        },
        price: {
          type: Number,
          required: true, // snapshot
        },
        image: {
          type: String,
          required: true, // snapshot
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // 💰 TOTAL
    totalAmount: {
      type: Number,
      required: true,
    },

    // 💳 PAYMENT
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD", "NETBANKING"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // 📍 SHIPPING ADDRESS (STRICT VALIDATION)
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },

    // 🚚 ORDER STATUS
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    // 📅 TRACKING TIMES
    deliveredAt: Date,
    cancelledAt: Date,

    // 🆔 CUSTOM ORDER ID (Nice for UI)
    orderId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// ⚡ INDEXES (Performance Boost)
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });

// ⚡ AUTO GENERATE ORDER ID
orderSchema.pre("save", function () {
  if (!this.orderId) {
    this.orderId = "ORD" + Date.now();
  }
});

module.exports = mongoose.model("Order", orderSchema);