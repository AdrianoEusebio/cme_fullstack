import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
