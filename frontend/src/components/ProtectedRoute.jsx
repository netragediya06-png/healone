import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // If not logged in OR not admin
  if (!userId || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
