const mongoose = require("mongoose");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");


// ===============================
// CREATE PRODUCT
// ===============================
exports.createProduct = async (req, res) => {

  try {

    // =========================
    // VALIDATE REQUIRED FIELDS
    // =========================
    const {
  name,
  description,
  price,
  originalPrice,
  rating,
  reviews,
  badge,
  category,
  subCategory,
  stock
} = req.body;

    if (!name || !description || !price || !category || !subCategory) {
      return res.status(400).json({
        success: false,
        message: "Name, description, price, category and subCategory are required"
      });
    }

    let imageUrl = "";

    // =========================
    // UPLOAD IMAGE TO CLOUDINARY
    // =========================
    if (req.file) {

      const result = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          { folder: "healone_products" },
          (error, result) => {

            if (error) reject(error);
            else resolve(result);

          }
        );

        stream.end(req.file.buffer);

      });

      imageUrl = result.secure_url;

    }

    // =========================
    // SAFE NUMBER CONVERSION
    // =========================
    const priceValue = Number(price);
    const stockValue = Number(stock) || 0;

    if (isNaN(priceValue)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number"
      });
    }

    // =========================
    // CREATE PRODUCT
    // =========================
const product = await Product.create({

  name,
  description,

  price: priceValue,
  originalPrice: Number(originalPrice) || priceValue,

  rating: Number(rating) || 4,
  reviews: Number(reviews) || 0,

  badge,

  stock: stockValue,

  category,
  subCategory,

  image: imageUrl,

  status: stockValue > 0 ? "active" : "inactive",

  createdBy: req.user ? req.user._id : null

});

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });

  } catch (error) {

    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating product"
    });

  }

};


// ===============================
// GET ALL PRODUCTS (ADMIN)
// ===============================
exports.getAdminProducts = async (req, res) => {

  try {

    const {
      search = "",
      subCategory,
      status,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    if (status) {
      query.status = status;
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("subCategory", "name")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      products
    });

  } catch (error) {

    console.error("GET ADMIN PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ===============================
// GET ACTIVE PRODUCTS (USER)
// ===============================
exports.getActiveProducts = async (req, res) => {

  try {

    const {
      search = "",
      category,        // ✅ NEW
      subcategory,
    } = req.query;

    const query = {
      status: "active",
      
    };

    // 🔍 SEARCH
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // ✅ CATEGORY FILTER
    // ✅ CATEGORY FILTER (ObjectId safe)
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = new mongoose.Types.ObjectId(category);
    }

    // ✅ SUBCATEGORY FILTER (ObjectId safe)
    if (subcategory && mongoose.Types.ObjectId.isValid(subcategory)) {
      query.subCategory = new mongoose.Types.ObjectId(subcategory);
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("subCategory", "name")
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {

    console.error("GET ACTIVE PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

const getPublicId = (imageUrl) => {

  if (!imageUrl) return null;

  const parts = imageUrl.split("/");

  const fileName = parts.pop().split(".")[0];

  const folder = parts.pop();

  return `${folder}/${fileName}`;

};


// ===============================
// UPDATE PRODUCT
// ===============================
exports.updateProduct = async (req, res) => {

  try {

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = product.image;

    // upload new image
    if (req.file) {

      // delete old image
      if (product.image) {

        const publicId = getPublicId(product.image);

        await cloudinary.uploader.destroy(publicId);

      }

      const result = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          { folder: "healone_products" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        stream.end(req.file.buffer);

      });

      imageUrl = result.secure_url;

    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: imageUrl
      },
      { new: true }
    );

    res.json({
      success: true,
      product
    });

  } catch (error) {

    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};

// ===============================
// TOGGLE PRODUCT STATUS
// ===============================
exports.toggleProductStatus = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    product.status =
      product.status === "active"
        ? "inactive"
        : "active";

    await product.save();

    res.json({
      success: true,
      message: "Product status updated",
      product
    });

  } catch (error) {

    console.error("TOGGLE PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};
// ===============================
// DELETE PRODUCT (SOFT DELETE)
// ===============================
exports.deleteProduct = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // delete image from cloudinary
    if (product.image) {

      const publicId = getPublicId(product.image);

      await cloudinary.uploader.destroy(publicId);

    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {

    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};


// ===============================
// GET SINGLE PRODUCT
// ===============================
exports.getSingleProduct = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {

    console.error("GET SINGLE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};