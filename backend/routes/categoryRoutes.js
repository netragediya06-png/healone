  const express = require("express");
  const router = express.Router();

  const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getCategoriesWithSubCount
  } = require("../controllers/categoryController");

  const { uploadCategoryImage } = require("../middleware/upload");
  const { protect, authorize } = require("../middleware/authMiddleware");


  // ==========================
  // CREATE CATEGORY (ADMIN)
  // ==========================
  router.post(
    "/",
    protect,
    authorize("admin"),
    uploadCategoryImage,
    createCategory
  );


  // ==========================
  // GET ALL CATEGORIES
  // ==========================
  router.get(
    "/",
    getCategories
  );


  // ==========================
  // GET CATEGORIES WITH SUBCATEGORY COUNT
  // ==========================
  router.get(
    "/with-subcount",
    protect,
    authorize("admin"),
    getCategoriesWithSubCount
  );


  // ==========================
  // UPDATE CATEGORY (ADMIN)
  // ==========================
  router.put(
    "/:id",
    protect,
    authorize("admin"),
    uploadCategoryImage,
    updateCategory
  );


  // ==========================
  // DELETE CATEGORY (ADMIN)
  // ==========================
  router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteCategory
  );

  module.exports = router;