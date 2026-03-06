const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAdminProducts,
  getActiveProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");


// ==========================
// ADMIN CREATE PRODUCT
// ==========================
router.post(
  "/",
  protect,
  authorize("admin"),
  createProduct
);


// ==========================
// ADMIN VIEW ALL PRODUCTS
// ==========================
router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAdminProducts
);


// ==========================
// PUBLIC ACTIVE PRODUCTS
// ==========================
router.get(
  "/",
  getActiveProducts
);


// ==========================
// GET SINGLE PRODUCT
// ==========================
router.get(
  "/:id",
  getSingleProduct
);


// ==========================
// ADMIN UPDATE PRODUCT
// ==========================
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateProduct
);


// ==========================
// ADMIN DELETE PRODUCT
// ==========================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProduct
);


module.exports = router;