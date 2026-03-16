const mongoose = require("mongoose");

const remedySchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
    trim: true
  },

  symptoms: [
    {
      type: String,
      lowercase: true,
      trim: true
    }
  ],

  ingredients: [
    {
      type: String,
      required: true
    }
  ],

  steps: [
    {
      type: String,
      required: true
    }
  ],

  benefits: String,

  precautions: String,

  healthCategory: {
    type: String,
    required: true
  },

  difficulty: {
    type: String,
    enum: ["Easy","Medium","Advanced"],
    default: "Easy"
  },

  preparationTime: Number,

  usage: String,

  tags: [
    {
      type: String,
      lowercase: true
    }
  ],

  relatedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],

  image: String,

  views: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["Pending","Approved","Rejected"],
    default: "Pending"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  savedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

},
{ timestamps: true }
);

module.exports = mongoose.model("Remedy", remedySchema);