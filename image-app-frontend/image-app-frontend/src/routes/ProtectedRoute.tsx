import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useUserStore((state) => state.auth);

  if (!user?.accessToken) {
    // If no access token → redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
}
