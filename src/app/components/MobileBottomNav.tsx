import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Activity, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function MobileBottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const profilePath = isAuthenticated ? "/selection" : "/auth";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[90] md:hidden border-t border-white/10 bg-[#02020a]/95 backdrop-blur-xl safe-area-pb"
      aria-label="Mobile navigation"
    >
      <div className="relative flex items-center justify-between px-8 h-16 max-w-lg mx-auto">
        {/* Home — left */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[3rem] transition-colors ${
            isActive("/") ? "text-indigo-400" : "text-gray-500 hover:text-white"
          }`}
        >
          <Home className="w-5 h-5" strokeWidth={isActive("/") ? 2.5 : 2} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
        </Link>

        {/* Analysis — center (elevated) */}
        <Link
          to="/selection"
          className="absolute left-1/2 -translate-x-1/2 -top-5 flex flex-col items-center"
        >
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg shadow-indigo-600/40 border transition-all ${
              isActive("/selection") || isActive("/papers") || isActive("/dashboard")
                ? "bg-indigo-600 border-indigo-400 scale-105"
                : "bg-indigo-600/90 border-indigo-500/50 hover:bg-indigo-500"
            }`}
          >
            <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span
            className={`mt-1 text-[9px] font-black uppercase tracking-wider ${
              isActive("/selection") || isActive("/papers") || isActive("/dashboard")
                ? "text-indigo-400"
                : "text-gray-500"
            }`}
          >
            Analysis
          </span>
        </Link>

        {/* Profile — right */}
        <Link
          to={profilePath}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[3rem] transition-colors ${
            isActive(profilePath) ? "text-indigo-400" : "text-gray-500 hover:text-white"
          }`}
        >
          <User className="w-5 h-5" strokeWidth={isActive(profilePath) ? 2.5 : 2} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
