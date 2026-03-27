const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ======================
// GET USER CART
// ======================
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// ADD TO CART
// ======================
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product || product.stock <= 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const index = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (index > -1) {
      // stock check
      if (cart.items[index].quantity < product.stock) {
        cart.items[index].quantity += 1;
      }
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    res.json(updatedCart);

  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ======================
// UPDATE QUANTITY
// ======================
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Stock limit exceeded" });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    res.json(updatedCart);

  } catch (error) {
    console.error("UPDATE QUANTITY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ======================
// REMOVE ITEM
// ======================
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    res.json(updatedCart);

  } catch (error) {
    console.error("REMOVE ITEM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ======================
// CLEAR CART (BONUS 🔥)
// ======================
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ message: "Cart cleared" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};