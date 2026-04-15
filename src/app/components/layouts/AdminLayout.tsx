import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Upload, FileText, LogOut, 
  Menu, X, ChevronRight, Sun, Moon, Monitor
} from "lucide-react";
import { Toaster } from "../ui/sonner";

export function AdminLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pageTheme, setPageTheme] = useState<"dark" | "light">("dark");

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Upload Papers", path: "/admin/upload", icon: Upload },
    { name: "Reports", path: "/admin/reports", icon: FileText },
  ];

  const isAdminAuthPage = location.pathname === "/admin" || location.pathname === "/admin/";

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${pageTheme === 'dark' ? 'bg-[#02020a] text-white' : 'bg-gray-50 text-slate-900'}`}>
      
      {/* SIDEBAR */}
      {!isAdminAuthPage && (
        <>
          {/* Mobile Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
            )}
          </AnimatePresence>

          <aside className={`
            fixed lg:sticky top-0 left-0 z-50
            w-72 h-screen bg-[#050510] border-r border-white/5
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}>
            <div className="p-8 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 p-1 border border-white/10">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col text-white">
                  <span className="text-lg font-black italic tracking-tighter">Pattern<span className="text-indigo-500">BTech</span></span>
                </div>
              </Link>
              <button className="lg:hidden text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="px-4 mt-4 space-y-2">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <div className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${active ? "bg-indigo-600/10 text-white border border-indigo-500/20" : "text-gray-500 hover:text-gray-200"}`}>
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${active ? "text-indigo-500" : ""}`} />
                        <span className="text-sm font-bold">{item.name}</span>
                      </div>
                      {active && <ChevronRight className="w-4 h-4 text-indigo-500" />}
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <button 
                onClick={() => {
                  localStorage.removeItem("isAdmin");
                  window.location.href = "/admin";
                }}
                className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl text-gray-500 hover:text-rose-500 transition-all font-black text-[10px] uppercase tracking-widest border border-white/5"
              >
                <LogOut className="w-4 h-4" /> Terminate Session
              </button>
            </div>
          </aside>
        </>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {!isAdminAuthPage && (
          <header className={`h-16 border-b px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md ${pageTheme === 'dark' ? 'bg-[#050510]/50 border-white/5' : 'bg-white/70 border-gray-200'}`}>
            <button className="lg:hidden p-2 text-gray-400" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
               <Monitor className="w-3 h-3 text-indigo-500" /> System: Stable
            </div>

            <div className="flex items-center bg-black/10 dark:bg-black/40 p-1 rounded-lg border border-white/5">
              <button onClick={() => setPageTheme("light")} className={`p-1.5 rounded-md ${pageTheme === 'light' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}><Sun className="w-4 h-4" /></button>
              <button onClick={() => setPageTheme("dark")} className={`p-1.5 rounded-md ${pageTheme === 'dark' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}><Moon className="w-4 h-4" /></button>
            </div>
          </header>
        )}

        <main className="flex-1 relative">
          <Outlet context={{ theme: pageTheme }} />
        </main>
      </div>

      <Toaster theme={pageTheme} richColors position="top-right" />
    </div>
  );
}