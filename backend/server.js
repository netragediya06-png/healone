require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ===============================
// Connect Database
// ===============================
connectDB();

// ===============================
// Middlewares
// ===============================
app.use(cors());

// 🔥 IMPORTANT: Increase body limit (Fix 413 Error)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ===============================
// Routes
// ===============================
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const remedyRoutes = require("./routes/remedyRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/remedies", remedyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


// ===============================
// Test Route
// ===============================
app.get("/", (req, res) => {
  res.send("HealOne API Running");
});

// ===============================
// Optional Test User Route
// ===============================
const User = require("./models/User");

app.get("/test-user", async (req, res) => {
  try {
    const user = await User.create({
      name: "Netra",
      email: "netra@test.com",
      role: "admin",
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// Start Server
// ===============================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
