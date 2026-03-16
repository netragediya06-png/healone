const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const cloudinary = require("../config/cloudinary");

/* =====================================
   CLOUDINARY IMAGE UPLOAD HELPER
===================================== */

const uploadImage = (fileBuffer, folder) => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        quality: "auto",
        fetch_format: "auto"
      },
      (error, result) => {

        if (error) return reject(error);
        resolve(result.secure_url);

      }
    );

    stream.end(fileBuffer);

  });

};


/* =====================================
   CREATE CATEGORY
===================================== */

exports.createCategory = async (req, res) => {

  try {

    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer, "healone_categories");
    }

    const category = await Category.create({

      name: req.body.name,
      description: req.body.description,
      status: req.body.status === "true" || req.body.status === true,
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


/* =====================================
   GET ALL CATEGORIES
===================================== */

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


/* =====================================
   GET CATEGORY WITH SUBCOUNT
===================================== */

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


/* =====================================
   UPDATE CATEGORY
===================================== */

exports.updateCategory = async (req, res) => {

  try {

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    let imageUrl = category.image;

    /* Upload new image if provided */

    if (req.file) {

      imageUrl = await uploadImage(
        req.file.buffer,
        "healone_categories"
      );

    }

    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;
    category.status = req.body.status === "true" || req.body.status === true;
    category.image = imageUrl;

    const updatedCategory = await category.save();

    res.json(updatedCategory);

  } catch (error) {

    console.error("UPDATE CATEGORY ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};


/* =====================================
   DELETE CATEGORY
===================================== */

exports.deleteCategory = async (req, res) => {

  try {

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    await category.deleteOne();

    res.json({
      message: "Category deleted successfully"
    });

  } catch (error) {

    console.error("DELETE CATEGORY ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};