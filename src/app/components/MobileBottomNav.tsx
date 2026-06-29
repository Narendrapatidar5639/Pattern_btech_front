import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Activity, User, LogOut, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const displayData = useMemo(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUser = user || localUser;

    const fullName = currentUser?.full_name || currentUser?.name || currentUser?.displayName || "Neural User";
    const email = currentUser?.email || "active.session@pattern.tech";

    return { fullName, email };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    setProfileOpen((open) => !open);
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

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
        <div ref={profileRef} className="relative min-w-[3rem]">
          <button
            type="button"
            onClick={handleProfileClick}
            className={`flex flex-col items-center justify-center gap-0.5 w-full transition-colors ${
              profileOpen ? "text-indigo-400" : "text-gray-500 hover:text-white"
            }`}
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <User className="w-5 h-5" strokeWidth={profileOpen ? 2.5 : 2} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Profile</span>
          </button>

          <AnimatePresence>
            {profileOpen && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute bottom-full right-0 mb-3 w-72 rounded-2xl bg-[#05050f]/95 border border-white/10 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-3xl"
              >
                <div className="px-4 py-4 border-b border-white/5 mb-3 bg-white/[0.02] rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-emerald-500">
                      Authorized Node
                    </p>
                  </div>
                  <p className="text-base font-black italic text-white leading-tight truncate uppercase tracking-tighter">
                    {displayData.fullName}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate mt-1.5 font-medium">
                    {displayData.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
