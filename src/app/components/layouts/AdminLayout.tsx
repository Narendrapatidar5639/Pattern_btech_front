import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Upload, FileText, LogOut, 
  Menu, ChevronRight, Sun, Moon, Monitor
} from "lucide-react";
import { Toaster } from "../ui/sonner";
// IMPORT: Ensure this path matches where your actual ThemeProvider is
import { ThemeProvider } from "../../contexts/ThemeProvider"; 

export function AdminLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Local state for the toggle UI, though global theme will handle the logic
  const [pageTheme, setPageTheme] = useState<"dark" | "light">("dark");

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Upload Papers", path: "/admin/upload", icon: Upload },
    { name: "Reports", path: "/admin/reports", icon: FileText },
  ];

  const isAdminAuthPage = location.pathname === "/admin" || location.pathname === "/admin/";

  // Wrap everything in the Provider to prevent the "destructure theme" error
  return (
    <ThemeProvider>
      <div className={`min-h-screen flex font-sans ${pageTheme === 'dark' ? 'bg-[#02020a] text-white' : 'bg-gray-50 text-slate-900'}`}>
        
        {/* Only show Sidebar if NOT on the login page */}
        {!isAdminAuthPage && (
          <aside className={`
            fixed lg:sticky top-0 left-0 z-40 w-72 h-screen bg-[#050510] border-r border-white/5
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}>
            <div className="p-8">
              <Link to="/" className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 p-1 border border-white/10 overflow-hidden">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col text-white">
                  <span className="text-xl font-black italic tracking-tighter">Pattern<span className="text-indigo-500">BTech</span></span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Admin Core</span>
                </div>
              </Link>
            </div>

            <nav className="px-4 mt-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <div className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${active ? "bg-indigo-600/10 text-white border border-indigo-500/20" : "text-gray-500 hover:text-gray-200"}`}>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${active ? "text-indigo-500" : ""}`} />
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
                  window.location.href = "/admin"; // Force reload to clear states
                }}
                className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl text-gray-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <LogOut className="w-4 h-4" /> Terminate Session
              </button>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {!isAdminAuthPage && (
            <header className="h-16 border-b border-white/5 bg-[#050510]/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
              <button className="lg:hidden p-2 text-gray-400" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/5">
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
    </ThemeProvider>
  );
}