const Order = require("../models/Order");


/* =========================
   CREATE ORDER
========================= */
exports.createOrder = async (req, res) => {
  try {

    const { products, totalAmount, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        message: "No products in order"
      });
    }

    const order = new Order({
      user: req.user._id,
      products,
      totalAmount,
      paymentMethod: paymentMethod || "COD"
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder
    });

  } catch (error) {

    console.error("Create order error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};



/* =========================
   GET USER ORDERS
========================= */
exports.getUserOrders = async (req, res) => {

  try {

    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    console.error("Get user orders error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
exports.getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find()

      .populate("user", "name email")

      .populate("products.product", "name price image")

      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    console.error("Get all orders error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



/* =========================
   UPDATE ORDER STATUS
========================= */
exports.updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order
    });

  } catch (error) {

    console.error("Update order status error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};