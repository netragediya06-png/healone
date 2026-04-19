const Order = require("../models/Order");
const Product = require("../models/Product");

/* ================= CREATE ORDER ================= */
exports.createOrder = async (req, res) => {
  try {
    const { products, paymentMethod, shippingAddress } = req.body;

    // ✅ VALIDATION
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Products required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method required" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    let totalAmount = 0;

    // ✅ FETCH REAL PRODUCT DATA
    const formattedProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product) {
          throw new Error("Product not found");
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        return {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity,
        };
      }),
    );

    const order = await Order.create({
      user: req.user._id,
      products: formattedProducts,
      totalAmount,
      paymentMethod,
      shippingAddress,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE ORDER ================= */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product",
      "name price image",
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Only owner or admin
    if (
      order.user.toString() !== req.user._id.toString() &&
      !req.user.roles.includes("admin")
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
};

/* ================= CANCEL ORDER ================= */
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["shipped", "delivered"].includes(order.status)) {
      return res.status(400).json({
        message: "Order cannot be cancelled now",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Order already cancelled",
      });
    }

    // ✅ FIX: NO VALIDATION ERROR
    await Order.findByIdAndUpdate(order._id, {
      status: "cancelled",
      cancelledAt: new Date(),
    });

    res.json({ message: "Order cancelled successfully" });

  } catch (error) {
    console.error("❌ CANCEL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= USER ORDERS ================= */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 }); // 🔥 latest first

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

/* ================= ADMIN: ALL ORDERS ================= */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName name email")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

/* ================= ADMIN: UPDATE STATUS ================= */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ❌ Prevent updating cancelled
    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot update cancelled order",
      });
    }

    // ❌ Prevent backward flow
    const flow = ["pending", "confirmed", "shipped", "delivered"];
    const currentIndex = flow.indexOf(order.status);
    const newIndex = flow.indexOf(status);

    if (newIndex < currentIndex) {
      return res.status(400).json({
        message: "Invalid status transition",
      });
    }

    order.status = status;

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
