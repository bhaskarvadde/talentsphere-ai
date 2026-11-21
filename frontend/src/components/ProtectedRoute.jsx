import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    const fallback = user?.role === "RECRUITER" ? "/recruiter" : "/candidate";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
