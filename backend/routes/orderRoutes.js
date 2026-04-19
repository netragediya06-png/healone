const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/* ================= USER ROUTES ================= */

// 🛒 Create Order
router.post("/", protect, createOrder);

// 📦 Get My Orders
router.get("/my", protect, getUserOrders);

// 📄 Get Single Order Details
router.get("/:id", protect, getOrderById);

// ❌ Cancel Order
router.put("/:id/cancel", protect, cancelOrder);


/* ================= ADMIN ROUTES ================= */

// 📊 Get All Orders (Admin)
router.get("/", protect, adminOnly, getAllOrders);

// 🔄 Update Order Status (Admin)
router.put("/:id/status", protect, adminOnly, updateOrderStatus);


module.exports = router;