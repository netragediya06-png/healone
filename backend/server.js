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

// Increase body size limit (for images/docs)
app.use(express.json());
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
const specialistRoutes = require("./routes/specialistRoutes");
const yogaServiceRoutes = require("./routes/yogaServiceRoutes"); // ✅ NEW
const dashboardRoutes = require("./routes/dashboardRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const programRoutes = require("./routes/programRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/remedies", remedyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/specialists", specialistRoutes);
app.use("/api/yoga-services", yogaServiceRoutes); // ✅ NEW
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// ===============================
// Test Route
// ===============================
app.get("/", (req, res) => {
  res.send("HealOne API Running");
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});