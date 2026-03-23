const express = require("express");
const router = express.Router();

// ✅ IMPORTANT FIX
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/* USER */
router.post("/", protect, createOrder);
router.get("/my", protect, getUserOrders);

/* ADMIN */
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;