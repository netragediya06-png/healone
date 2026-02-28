import { Navigate } from "react-router-dom";

function SpecialistRoute({ children }) {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (!userId || role !== "specialist") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default SpecialistRoute;
