const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true
  },

  // ⭐ Optional original price for discount display
  originalPrice: {
    type: Number
  },

  // ⭐ Rating system (future use)
  rating: {
    type: Number,
    default: 4
  },

  // ⭐ Number of reviews
  reviews: {
    type: Number,
    default: 0
  },

  // ⭐ Product label like "Best Seller", "New"
  badge: {
    type: String
  },

  stock: {
    type: Number,
    default: 0
  },

  // MAIN CATEGORY
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  // SUBCATEGORY
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true
  },

  // IMAGE URL
  image: {
    type: String
  },

  // CLOUDINARY PUBLIC ID
  imagePublicId: {
    type: String
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);