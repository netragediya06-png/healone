const express = require("express");
const router = express.Router();

const SubCategory = require("../models/SubCategory");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

const { protect, authorize } = require("../middleware/authMiddleware");


// ==========================
// CREATE SUBCATEGORY
// ==========================
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  async (req, res) => {

    try {

      let imageUrl = "";

      if (req.file) {

        const result = await new Promise((resolve, reject) => {

          const stream = cloudinary.uploader.upload_stream(
            { folder: "healone_subcategories" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          stream.end(req.file.buffer);

        });

        imageUrl = result.secure_url;

      }

      const subCategory = await SubCategory.create({
        name: req.body.name,
        category: req.body.category,
        image: imageUrl,
        status: true
      });

      res.status(201).json(subCategory);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// ==========================
// GET ALL SUBCATEGORIES
// ==========================
router.get("/", async (req, res) => {

  try {

    const subCategories = await SubCategory.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(subCategories);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ==========================
// GET SUBCATEGORIES BY CATEGORY
// ==========================
router.get("/category/:categoryId", async (req, res) => {

  try {

    const subCategories = await SubCategory.find({
      category: req.params.categoryId
    });

    res.json(subCategories);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ==========================
// DELETE SUBCATEGORY
// ==========================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req, res) => {

    try {

      await SubCategory.findByIdAndDelete(req.params.id);

      res.json({
        message: "SubCategory deleted"
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);


module.exports = router;