const mongoose = require("mongoose");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");


// ===============================
// CREATE PRODUCT
// ===============================
exports.createProduct = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.body.image && req.body.image.startsWith("data:")) {
      const uploadResponse = await cloudinary.uploader.upload(
        req.body.image,
        { folder: "healone_products" }
      );
      imageUrl = uploadResponse.secure_url;
    }

    const stockValue = Number(req.body.stock) || 0;

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      stock: stockValue,
      category: req.body.category,
      healthCategory: req.body.healthCategory,
      image: imageUrl,
      status: stockValue > 0 ? "active" : "inactive",
      createdBy: req.user._id
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===============================
// GET ALL PRODUCTS (ADMIN)
// ===============================
exports.getAdminProducts = async (req, res) => {
  try {
    const {
      search = "",
      healthCategory,
      status,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (healthCategory) {
      query.healthCategory = healthCategory;
    }

    if (status) {
      query.status = status;
    }

    const products = await Product.find(query)
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
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===============================
// GET ACTIVE PRODUCTS (USER)
// ===============================
exports.getActiveProducts = async (req, res) => {
  try {
    const {
      search = "",
      healthCategory,
      page = 1,
      limit = 10
    } = req.query;

    const query = {
      status: "active",
      stock: { $gt: 0 } // IMPORTANT: only show if in stock
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (healthCategory) {
      query.healthCategory = healthCategory;
    }

    const products = await Product.find(query)
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
    console.error("GET ACTIVE PRODUCTS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===============================
// UPDATE PRODUCT
// ===============================
exports.updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.body.image && req.body.image.startsWith("data:")) {
      const uploadResponse = await cloudinary.uploader.upload(
        req.body.image,
        { folder: "healone_products" }
      );
      req.body.image = uploadResponse.secure_url;
    }

    const updatedStock = Number(req.body.stock);

    // Auto deactivate if stock 0
    if (updatedStock <= 0) {
      req.body.status = "inactive";
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===============================
// TOGGLE PRODUCT STATUS
// ===============================
exports.toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status =
      product.status === "active" ? "inactive" : "active";

    await product.save();

    res.json({
      success: true,
      message: "Product status updated",
      product
    });

  } catch (error) {
    console.error("TOGGLE STATUS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===============================
// DELETE PRODUCT (SOFT)
// ===============================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = "inactive";
    await product.save();

    res.json({
      success: true,
      message: "Product deactivated successfully"
    });

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ===============================
// GET SINGLE PRODUCT
// ===============================
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error("GET SINGLE PRODUCT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
