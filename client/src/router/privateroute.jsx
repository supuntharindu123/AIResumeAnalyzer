// PrivateRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authcontext";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
