import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  // Check kijiye local storage mein login data hai ya nahi
  const isAdminAuthenticated = localStorage.getItem("adminToken"); 

  if (!isAdminAuthenticated) {
    // Agar token nahi hai, toh login page par bhej do
    return <Navigate to="/admin" replace />;
  }

  // Agar authenticated hai, toh page dikhao
  return <Outlet />;
}