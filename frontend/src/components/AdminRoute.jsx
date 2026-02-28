import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // Not logged in
  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
