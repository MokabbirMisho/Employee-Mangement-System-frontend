import { useAuth } from "../store/AuthContext";
import { Navigate } from "react-router-dom";

const RoleBasedRoutes = ({ children, checkRole = [] }) => {
  const { user, loading } = useAuth(); // ✅ object destructuring

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // If roles are provided, enforce them
  if (
    Array.isArray(checkRole) &&
    checkRole.length > 0 &&
    !checkRole.includes(user.role)
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleBasedRoutes;
