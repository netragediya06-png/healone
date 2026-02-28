const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  createProduct,
  getAdminProducts,
  getActiveProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

router.post("/", protect, adminOnly, createProduct);
router.get("/admin/all", protect, adminOnly, getAdminProducts);
router.get("/", getActiveProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
