import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) {
    // If not admin, send them back to login
    return <Navigate replace to="/admin" />;
  }

  return <Outlet />;
}