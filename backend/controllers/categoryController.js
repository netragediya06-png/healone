const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const cloudinary = require("../config/cloudinary");


// ===============================
// CREATE CATEGORY
// ===============================
exports.createCategory = async (req, res) => {

  try {

    let imageUrl = "";

    if (req.file) {

      const result = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          { folder: "healone_categories" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        stream.end(req.file.buffer);

      });

      imageUrl = result.secure_url;

    }

    const category = await Category.create({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status === "true",
      image: imageUrl
    });

    res.status(201).json(category);

  } catch (error) {

    console.error("CREATE CATEGORY ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};


// ===============================
// GET ALL CATEGORIES
// ===============================
exports.getCategories = async (req, res) => {

  try {

    const categories = await Category.aggregate([
        {
        $lookup: {
          from: "subcategories",
          localField: "_id",
          foreignField: "category",
          as: "subCategories"
        }
      },
      {
        $addFields: {
          subCategoryCount: { $size: "$subCategories" }
        }
      },
      {
        $addFields: {
          subCategoryCount: { $size: "$subCategories" }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);
    res.json(categories);

  } catch (error) {

    console.error("GET CATEGORIES ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};


// ===============================
// GET CATEGORY WITH SUBCATEGORY COUNT
// ===============================
exports.getCategoriesWithSubCount = async (req, res) => {

  try {

    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "subcategories",
          localField: "_id",
          foreignField: "category",
          as: "subcategories"
        }
      },
      {
        $addFields: {
          subCategoryCount: { $size: "$subcategories" }
        }
      },
      {
        $project: {
          subcategories: 0
        }
      }
    ]);

    res.json(categories);

  } catch (error) {

    console.error("CATEGORY COUNT ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};


// ===============================
// UPDATE CATEGORY
// ===============================
exports.updateCategory = async (req, res) => {

  try {

    let updateData = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status === "true"
    };

    if (req.file) {

      const result = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          { folder: "healone_categories" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        stream.end(req.file.buffer);

      });

      updateData.image = result.secure_url;

    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(category);

  } catch (error) {

    console.error("UPDATE CATEGORY ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};


// ===============================
// DELETE CATEGORY
// ===============================
exports.deleteCategory = async (req, res) => {

  try {

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: "Category deleted successfully"
    });

  } catch (error) {

    console.error("DELETE CATEGORY ERROR:", error);

    res.status(400).json({
      message: error.message
    });

  }

};