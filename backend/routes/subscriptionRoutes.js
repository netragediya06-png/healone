const express = require("express");
const router = express.Router();

const {
  enrollProgram,
  getUserSubscriptions,
  getAllSubscriptions
} = require("../controllers/subscriptionController");

const { protect, authorize } = require("../middleware/authMiddleware");
router.post(
  "/",
  protect,
  authorize("user"),
  enrollProgram
);
router.get(
  "/my",
  protect,
  authorize("user"),
  getUserSubscriptions
);
router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAllSubscriptions
);
module.exports = router;