const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Remedy = require("../models/Remedy");

const { protect, authorize } = require("../middleware/authMiddleware");


// ==============================
// ADMIN DASHBOARD STATS
// ==============================
router.get(
  "/stats",
  protect,
  authorize("admin"),
  async (req, res) => {

    try {

      const totalProducts = await Product.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalUsers = await User.countDocuments();
      const totalRemedies = await Remedy.countDocuments();

      const pendingOrders = await Order.countDocuments({
        status: "pending"
      });

      const completedOrders = await Order.countDocuments({
        status: "completed"
      });

      const cancelledOrders = await Order.countDocuments({
        status: "cancelled"
      });


      // Monthly orders
      const monthlyOrders = await Order.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);


      // Remedies by category
      const remediesByCategory = await Remedy.aggregate([
        {
          $group: {
            _id: "$healthCategory",
            count: { $sum: 1 }
          }
        }
      ]);


      res.json({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRemedies,

        pendingOrders,
        completedOrders,
        cancelledOrders,

        monthlyOrders,
        remediesByCategory
      });

    } catch (error) {

      console.log("Dashboard Error:", error);

      res.status(500).json({
        message: error.message
      });

    }

  }
);

module.exports = router;