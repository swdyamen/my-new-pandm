// src/components/AuthGuard.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function AuthGuard({ children, requireAuth = true }) {
  const { user, loading } = useAuth();

  if (loading) {
    // You can create a nicer loading spinner
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If requireAuth is true and user is not logged in, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // If requireAuth is false and user is logged in (for login page)
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AuthGuard;
