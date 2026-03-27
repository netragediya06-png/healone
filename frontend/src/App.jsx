import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

/* ---------------- AUTH ---------------- */
import Login from "./pages/user/UserLogin.jsx"; // ✅ FIXED
import Register from "./pages/user/Register.js";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import SpecialistRegister from "./pages/specialist/specialist-register/SpecialistRegister.js";

/* ---------------- ADMIN AUTH ---------------- */
import AdminLogin from "./pages/auth/AdminLogin.jsx";

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
import AdminRemedies from "./pages/admin/AdminRemedies.js";
import AdminYogaServices from "./pages/admin/AdminYogaServices";
import AdminProgramList from "./pages/admin/programs/AdminProgramList";
import AdminProgramDetail from "./pages/admin/programs/AdminProgramDetail";
import AdminSubscriptions from "./pages/admin/programs/AdminSubscriptions";
import AdminOrders from "./pages/admin/AdminOrders";

/* ---------------- SPECIALIST ---------------- */
import SpecialistRoute from "./pages/specialist/SpecialistRoute";
import SpecialistDashboardLayout from "./pages/specialist/layout/SpecialistDashboardLayout";
import SpecialistDashboard from "./pages/specialist/dashboard/SpecialistDashboard";
import MyRemedies from "./pages/specialist/remedies/MyRemedies.js";
import AddRemedy from "./pages/specialist/remedies/AddRemedy.js";
import EditRemedy from "./pages/specialist/remedies/EditRemedy.js";
import AddYoga from "./pages/specialist/Yoga/AddYoga.jsx";
import MyYogaList from "./pages/specialist/Yoga/MyYogaList";
import EditYoga from "./pages/specialist/Yoga/EditYoga";
import CreateProgram from "./pages/specialist/wellness-program/CreateProgram.jsx";
import EditProgram from "./pages/specialist/wellness-program/EditProgram.jsx";
import MyPrograms from "./pages/specialist/wellness-program/MyPrograms.jsx";
import SpecialistSubscriptions from "./pages/specialist/SpecialistSubscriptions";

/* ---------------- USER (Lovable UI) ---------------- */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
// import ProfileView from "@/components/profile/ProfileView";
// import ProfileEdit from "@/components/profile/ProfileEdit";

/* USER PAGES */
import Index from "./pages/user/Index";
import Products from "./pages/user/Products";
// import ProductDetail from "./pages/user/ProductDetail";
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
import VerifyEmail from "./pages/user/VerifyEmail";
import NotFound from "./pages/user/NotFound";
import SubscribePage from "./pages/user/SubscribePage.js";
import MySubscriptions from "./pages/user/MySubscriptions.js";
import ProgramDetail from "./pages/user/ProgramDetail.js";
import ProfileView from "./components/ProfileView"; // ✅ path adjusted
import ProfileEdit from "./components/ProfileEdit"; // ✅ path adjusted
import ProductDetail from "./pages/user/ProductDetail";
/* ---------------- USER LAYOUT ---------------- */
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

/* ---------------- AUTH LAYOUT ---------------- */
function AuthLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

/* ---------------- ADMIN AUTH LAYOUT ---------------- */
function AdminAuthLayout() {
  return <Outlet />;
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
          <Route path="/subscribe/:programId" element={<SubscribePage />} />
          <Route path="/my-subscriptions" element={<MySubscriptions />} />
          <Route path="/program/:programId" element={<ProgramDetail />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Route>

        {/* ================= AUTH ROUTES ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          {/* user login */}
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/become-specialist" element={<SpecialistRegister />} />
        </Route>

        {/* ================= ADMIN LOGIN ================= */}
        <Route element={<AdminAuthLayout />}>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
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
          <Route path="yoga" element={<AdminYogaServices />} />
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

          <Route path="yoga" element={<MyYogaList />} />
          <Route path="add-yoga" element={<AddYoga />} />
          <Route path="edit-yoga/:id" element={<EditYoga />} />

          <Route path="programs" element={<MyPrograms />} />
          <Route path="create-program" element={<CreateProgram />} />
          <Route path="edit-program/:id" element={<EditProgram />} />
          {/* 🔥 NEW */}
          <Route path="subscriptions" element={<SpecialistSubscriptions />} />
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
