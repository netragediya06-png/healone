const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");


/* USER ROUTES */

router.post("/", protect, createOrder);

router.get("/my", protect, getUserOrders);


/* ADMIN ROUTES */

router.get("/", protect, adminOnly, getAllOrders);

router.put("/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;