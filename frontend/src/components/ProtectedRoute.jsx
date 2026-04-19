import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {

  const token = localStorage.getItem("token");

  // ✅ GET ROLES ARRAY
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // ❌ No roles
  if (!roles.length) {
    return <Navigate to="/" replace />;
  }

  // ❌ Role not allowed
  const hasAccess = allowedRoles.some(role =>
    roles.includes(role)
  );

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}

export default ProtectedRoute;