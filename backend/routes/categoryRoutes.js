const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

const { protect, authorize } = require("../middleware/authMiddleware");


// ==========================
// CREATE CATEGORY (ADMIN)
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
        image: imageUrl,
      });

      res.status(201).json(category);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// ==========================
// GET ALL CATEGORIES
// ==========================
router.get("/", async (req, res) => {

  try {

    const categories = await Category.find()
      .sort({ createdAt: -1 });

    res.json(categories);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ==========================
// UPDATE CATEGORY (ADMIN)
// ==========================
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  async (req, res) => {

    try {

      let updateData = {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status === "true",
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

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// ==========================
// DELETE CATEGORY (ADMIN)
// ==========================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req, res) => {

    try {

      await Category.findByIdAndDelete(req.params.id);

      res.json({
        message: "Category deleted successfully"
      });

    } catch (error) {

      res.status(400).json({
        message: error.message
      });

    }

  }
);


module.exports = router;