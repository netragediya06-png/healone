const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");


// ==========================
// CREATE CATEGORY WITH IMAGE
// ==========================
router.post("/", upload.single("image"), async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
});


// ==========================
// READ ALL
// ==========================
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});


// ==========================
// UPDATE CATEGORY WITH IMAGE
// ==========================
router.put("/:id", upload.single("image"), async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
});


// ==========================
// DELETE
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;
