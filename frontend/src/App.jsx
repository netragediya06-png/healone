import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ---------------- AUTH ---------------- */
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

/* ---------------- ADMIN ---------------- */
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Categories from "./pages/admin/Categories.jsx";
import SubCategories from "./pages/admin/AdminSubCategories.jsx";
import AdminProductList from "./pages/admin/products/AdminProductList";
import AddProduct from "./pages/admin/products/AddProduct";
import EditProduct from "./pages/admin/products/EditProduct";
import ManageSpecialists from "./pages/admin/ManageSpecialists";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRemedies from "./pages/admin/AdminRemedies";
import AdminYogaServices from "./pages/admin/AdminYogaServices";
import AdminProgramList from "./pages/admin/programs/AdminProgramList";
import AdminProgramDetail from "./pages/admin/programs/AdminProgramDetail";
import AdminSubscriptions from "./pages/admin/programs/AdminSubscriptions";
import AdminOrders from "./pages/admin/AdminOrders";

/* ---------------- SPECIALIST ---------------- */
import SpecialistRoute from "./pages/specialist/SpecialistRoute";
import SpecialistDashboardLayout from "./pages/specialist/layout/SpecialistDashboardLayout";
import SpecialistDashboard from "./pages/specialist/dashboard/SpecialistDashboard";
import MyRemedies from "./pages/specialist/remedies/MyRemedies";
import AddRemedy from "./pages/specialist/remedies/AddRemedy";
import EditRemedy from "./pages/specialist/remedies/EditRemedy";

/* ---------------- USER (Lovable UI) ---------------- */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

/* USER PAGES */
import Index from "./pages/user/Index";
import Products from "./pages/user/Products";
import ProductDetail from "./pages/user/ProductDetail";
import About from "./pages/user/About";
import Contact from "./pages/user/Contact";
import FAQ from "./pages/user/FAQ";
import Privacy from "./pages/user/Privacy";
import Blog from "./pages/user/Blog";
import Remedies from "./pages/user/Remedies";
import Yoga from "./pages/user/Yoga";
import Programs from "./pages/user/Programs";
import Specialists from "./pages/user/Specialists";
import Checkout from "./pages/user/Checkout";
import DoshaQuiz from "./pages/user/DoshaQuiz";
import NotFound from "./pages/user/NotFound";

/* ---------------- USER LAYOUT ---------------- */
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= USER ROUTES ================= */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/remedies" element={<Remedies />} />
          <Route path="/yoga" element={<Yoga />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/specialists" element={<Specialists />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dosha-quiz" element={<DoshaQuiz />} />
        </Route>

        {/* ================= AUTH ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="subcategories" element={<SubCategories />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="specialists" element={<ManageSpecialists />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="remedies" element={<AdminRemedies />} />
          <Route path="yoga-services" element={<AdminYogaServices />} />
          <Route path="programs" element={<AdminProgramList />} />
          <Route path="programs/:id" element={<AdminProgramDetail />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* ================= SPECIALIST ROUTES ================= */}
        <Route
          path="/specialist"
          element={
            <SpecialistRoute>
              <SpecialistDashboardLayout />
            </SpecialistRoute>
          }
        >
          <Route index element={<SpecialistDashboard />} />
          <Route path="remedies" element={<MyRemedies />} />
          <Route path="add-remedy" element={<AddRemedy />} />
          <Route path="edit-remedy/:id" element={<EditRemedy />} />
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;