import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom"; // Fixed import to react-router-dom
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Upload, FileText, LogOut, 
  Menu, ChevronRight, Sun, Moon, Monitor
} from "lucide-react";
import { Toaster } from "../ui/sonner";
import { ThemeProvider } from "../../contexts/ThemeProvider"; // IMPORT YOUR THEME PROVIDER

export function AdminLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Internal UI toggle state
  const [pageTheme, setPageTheme] = useState<"dark" | "light">("dark");

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Upload Papers", path: "/admin/upload", icon: Upload },
    { name: "Reports", path: "/admin/reports", icon: FileText },
  ];

  const isAdminAuth = location.pathname === "/admin" || location.pathname === "/admin/";

  // If we are on the login page, just show the login without Sidebar
  if (isAdminAuth) {
    return (
      <ThemeProvider>
        <Outlet />
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    // WRAP EVERYTHING IN THEMEPROVIDER TO FIX THE 'UNDEFINED' ERROR
    <ThemeProvider>
      <div className={`min-h-screen flex font-sans selection:bg-indigo-500/30 ${pageTheme === 'dark' ? 'bg-[#02020a] text-white' : 'bg-gray-50 text-slate-900'}`}>
        
        {/* --- SIDEBAR --- */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-40
          w-72 h-screen 
          bg-[#050510] border-r border-white/5
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="p-8">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/5 p-1 border border-white/10 overflow-hidden group-hover:scale-105 transition-transform">
                  <img src="/logo.png" alt="PatternBTech" className="w-full h-full object-contain" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#050510] rounded-full" />
              </div>
              <div className="flex flex-col text-white">
                <span className="text-xl font-black italic tracking-tighter leading-none">
                  Pattern<span className="text-indigo-500">BTech</span>
                </span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">Admin Core</span>
              </div>
            </Link>
          </div>

          <nav className="px-4 mt-4 space-y-2">
            <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Modules</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="block relative group text-white">
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
                window.location.href = "/admin";
              }}
              className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl text-gray-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-rose-500/10"
            >
              <LogOut className="w-4 h-4" /> Terminate Session
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className={`h-16 border-b px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md ${pageTheme === 'dark' ? 'bg-[#050510]/50 border-white/5' : 'bg-white/70 border-gray-200'}`}>
            <button className="lg:hidden p-2 text-gray-400" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
               <Monitor className="w-3 h-3 text-indigo-500" /> System: Stable
            </div>

            <div className="flex items-center bg-black/10 dark:bg-black/40 p-1 rounded-lg border border-black/5 dark:border-white/5">
              <button 
                onClick={() => setPageTheme("light")}
                className={`p-1.5 rounded-md transition-all ${pageTheme === 'light' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPageTheme("dark")}
                className={`p-1.5 rounded-md transition-all ${pageTheme === 'dark' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </header>

          <main className="flex-1 relative">
            <div className="p-6 md:p-10 relative z-10">
               <Outlet context={{ theme: pageTheme }} />
            </div>

            <footer className={`mt-auto p-8 border-t ${pageTheme === 'dark' ? 'bg-[#050510] border-white/5 text-gray-600' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
               <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">PatternBTech • NLP Intelligence v2.0</p>
               </div>
            </footer>
          </main>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        <Toaster theme={pageTheme} richColors position="top-right" />
      </div>
    </ThemeProvider>
  );
}