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

app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb",extended:true}));

// serve uploaded images

app.use("/uploads",express.static("uploads"));


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
const yogaServiceRoutes = require("./routes/yogaServiceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const programRoutes = require("./routes/programRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminProfileRoutes = require("./routes/adminProfile");


app.use("/api/categories",categoryRoutes);
app.use("/api/products",productRoutes);
app.use("/api/users",userRoutes);
app.use("/api/remedies",remedyRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/specialists",specialistRoutes);
app.use("/api/yoga-services",yogaServiceRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/subcategories",subCategoryRoutes);
app.use("/api/programs",programRoutes);
app.use("/api/subscriptions",subscriptionRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/admin",adminProfileRoutes);


// ===============================
// Test Route
// ===============================

app.get("/",(req,res)=>{
res.send("HealOne API Running");
});


// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
console.log(`Server running on port ${PORT}`);
});