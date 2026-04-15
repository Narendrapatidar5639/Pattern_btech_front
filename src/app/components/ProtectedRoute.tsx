import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if admin session exists
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) {
    // Agar admin nahi hai, toh direct /admin (login) par bhej do
    // 'replace' isliye taaki user back button daba kar wapas na aa sake
    return <Navigate to="/admin" replace />;
  }

  // Agar children pass kiye hain (Layout), toh wo render karo, nahi toh Outlet
  return children ? <>{children}</> : <Outlet />;
}