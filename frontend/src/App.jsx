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
import MyWellnessProgram from "./pages/specialist/wellness-program/MyWellnessProgram.jsx";
import MyYogaServices from "./pages/specialist/yoga/MyYogaServices";
function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= PUBLIC AUTH ROUTES ================= */}

        <Route path="/" element={<Login />} />
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

          {/* Wellness Programs */}

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

          {/* Dashboard */}

          <Route index element={<SpecialistDashboard />} />

          {/* Remedies */}

          <Route path="remedies" element={<MyRemedies />} />

          {/* Wellness Programs */}

          <Route path="programs" element={<MyWellnessProgram />} />

<Route path="yoga-services" element={<MyYogaServices />} />
        </Route>

      </Routes>

    </BrowserRouter>

  );

}

export default App;