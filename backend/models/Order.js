const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(

{

  /* ======================
     USER
  ====================== */

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },


  /* ======================
     ORDER NUMBER
  ====================== */

  orderNumber: {
    type: String,
    unique: true
  },


  /* ======================
     PRODUCTS
  ====================== */

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },

      name: String,   // snapshot name

      price: Number,  // snapshot price

      quantity: {
        type: Number,
        default: 1
      }
    }
  ],


  /* ======================
     ORDER TOTAL
  ====================== */

  totalAmount: {
    type: Number,
    required: true
  },


  /* ======================
     PAYMENT
  ====================== */

  paymentMethod: {
    type: String,
    enum: ["COD", "UPI", "Card"],
    default: "COD"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },


  /* ======================
     ORDER STATUS
  ====================== */

  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    ],
    default: "pending"
  },


  /* ======================
     SHIPPING ADDRESS
  ====================== */

  shippingAddress: {

    fullName: {
      type: String
    },

    phone: {
      type: String
    },

    address: {
      type: String
    },

    city: {
      type: String
    },

    state: {
      type: String
    },

    pincode: {
      type: String
    }

  },


  /* ======================
     DELIVERY
  ====================== */

  trackingNumber: {
    type: String
  },

  deliveredAt: {
    type: Date
  },


  /* ======================
     NOTES
  ====================== */

  notes: {
    type: String
  }

},

{
  timestamps: true
}

);


/* ======================
   AUTO ORDER NUMBER
====================== */

orderSchema.pre("save", function (next) {

  if (!this.orderNumber) {

    const random = Math.floor(100000 + Math.random() * 900000);

    this.orderNumber = "HLN-" + random;

  }

  next();

});


module.exports = mongoose.model("Order", orderSchema);