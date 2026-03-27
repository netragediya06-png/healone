const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateQuantity);
router.post("/remove", protect, removeItem);
router.post("/clear", protect, clearCart); // optional

module.exports = router;