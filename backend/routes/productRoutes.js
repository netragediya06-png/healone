const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createProduct,
  getAdminProducts,
  getActiveProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");


// ==========================
// ADMIN CREATE PRODUCT
// ==========================
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
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

router.put(
  "/toggle/:id",
  protect,
  authorize("admin"),
  toggleProductStatus
);

module.exports = router;