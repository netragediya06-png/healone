import { Navigate } from "react-router-dom";

function SpecialistRoute({ children }) {

  const token = localStorage.getItem("token");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const activeRole = localStorage.getItem("activeRole");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not a specialist user
  if (!roles.includes("specialist")) {
    return <Navigate to="/" replace />;
  }

  // ❌ User didn't select specialist mode
  if (activeRole !== "specialist") {
    return <Navigate to="/" replace />;
  }

  // ✅ Access granted
  return children;
}

export default SpecialistRoute;