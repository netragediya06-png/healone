const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/* USER */
router.post("/", protect, orderController.createOrder);
router.get("/my", protect, orderController.getUserOrders);

/* ADMIN */
router.get("/", protect, adminOnly, orderController.getAllOrders);
router.put("/:id", protect, adminOnly, orderController.updateOrderStatus);

module.exports = router;