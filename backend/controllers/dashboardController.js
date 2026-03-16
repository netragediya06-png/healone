const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Remedy = require("../models/Remedy");

exports.getDashboardStats = async (req, res) => {

  try {

    // ===============================
    // BASIC COUNTS
    // ===============================

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRemedies = await Remedy.countDocuments();

    // ===============================
    // ORDER STATUS
    // ===============================

    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    // ===============================
    // MONTHLY ORDERS
    // ===============================

    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // ===============================
    // REMEDIES BY CATEGORY
    // ===============================

    const remediesByCategory = await Remedy.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    // ===============================
    // RECENT ORDERS
    // ===============================

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "fullName");

    const formattedOrders = recentOrders.map(o => ({
      userName: o.user?.fullName || "Unknown",
      status: o.status,
      amount: o.totalAmount
    }));

    // ===============================
    // RECENT USERS
    // ===============================

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullName role");

    // ===============================
    // TOP PRODUCTS
    // ===============================

    const topProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(5)
      .select("title sold price");

    const formattedProducts = topProducts.map(p => ({
      title: p.title,
      sales: p.sold,
      revenue: p.sold * p.price
    }));

    // ===============================
    // ACTIVITIES
    // ===============================

    const activities = [
      { message: "New user registered", time: "2 min ago" },
      { message: "Order placed successfully", time: "10 min ago" },
      { message: "Product added by admin", time: "30 min ago" },
      { message: "Specialist approved", time: "1 hour ago" }
    ];

    // ===============================
    // REVENUE
    // ===============================

    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const revenue = totalRevenue[0]?.revenue || 0;

    // ===============================
    // RESPONSE
    // ===============================

    res.json({

      totalProducts,
      totalOrders,
      totalUsers,
      totalRemedies,

      pendingOrders,
      completedOrders,
      cancelledOrders,

      monthlyOrders,
      remediesByCategory,

      recentOrders: formattedOrders,
      recentUsers,

      topProducts: formattedProducts,
      activities,

      todayRevenue: revenue / 30,
      monthRevenue: revenue,
      avgOrder: revenue / totalOrders || 0,
      conversion: 4.2

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Dashboard stats error"
    });

  }

};