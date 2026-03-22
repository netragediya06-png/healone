const Order = require("../models/Order");

/* ================= CREATE ORDER ================= */
exports.createOrder = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("USER:", req.user);

    const { products, totalAmount, paymentMethod, shippingAddress } = req.body;

    // ✅ VALIDATION
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Products required" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Address required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // ✅ FIX PRODUCT STRUCTURE
    const formattedProducts = products.map((item) => {
      if (!item.product) {
        throw new Error("Product ID missing");
      }

      return {
        product: item.product,
        quantity: item.quantity,
      };
    });

    const order = new Order({
      user: req.user._id,
      products: formattedProducts,
      totalAmount,
      paymentMethod,
      shippingAddress,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      order: savedOrder,
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);

    res.status(500).json({
      message: error.message || "Order failed",
    });
  }
};


/* ================= USER ORDERS ================= */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name price image");

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};


/* ================= ADMIN ================= */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product");

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};


/* ================= UPDATE STATUS ================= */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};