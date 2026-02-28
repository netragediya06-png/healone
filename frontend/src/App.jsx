import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ---------------- AUTH ---------------- */
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

/* ---------------- ADMIN ---------------- */
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Categories from "./pages/admin/Categories.jsx";
import AdminProductList from "./pages/admin/products/AdminProductList";
import AddProduct from "./pages/admin/products/AddProduct";
import EditProduct from "./pages/admin/products/EditProduct";
import ManageSpecialists from "./pages/admin/ManageSpecialists";

/* ---------------- SPECIALIST ---------------- */
import SpecialistRoute from "./pages/specialist/SpecialistRoute";
import SpecialistDashboardLayout from "./pages/specialist/layout/SpecialistDashboardLayout";
import SpecialistDashboard from "./pages/specialist/dashboard/SpecialistDashboard";
import MyRemedies from "./pages/specialist/remedies/MyRemedies";
import AddRemedy from "./pages/specialist/remedies/AddRemedy";
import EditRemedy from "./pages/specialist/remedies/EditRemedy";
// import MyYoga from "./pages/specialist/yoga/MyYoga";
// import MyPrograms from "./pages/specialist/programs/MyPrograms";

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
          <Route path="products" element={<AdminProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="specialists" element={<ManageSpecialists />} />
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
          {/* <Route path="yoga" element={<MyYoga />} />
          <Route path="programs" element={<MyPrograms />} /> */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
