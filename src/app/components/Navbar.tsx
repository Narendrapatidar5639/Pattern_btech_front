import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Sun, Moon, LogOut, 
  LayoutDashboard, User as UserIcon, ShieldCheck, Zap, 
  Home, Settings, Info, Mail, Activity
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeProvider";

interface NavLink {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isGlobalDark = theme === "dark";

  // --- ROBUST USER DATA EXTRACTION ---
  const displayData = useMemo(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUser = user || localUser;

    const fullName = currentUser?.full_name || currentUser?.displayName || "Neural User";
    const email = currentUser?.email || "active.session@pattern.tech";
    
    const initials = fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || "U";

    return { fullName, email, initials, raw: currentUser };
  }, [user]);

  // Prevent Body Scroll when Mobile Menu is Open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  // Click outside logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect for glassy transition
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Analysis", path: "/selection", icon: <Activity className="w-4 h-4" /> },
    { name: "Mechanism", path: "/how-it-works", icon: <Settings className="w-4 h-4" /> },
    { name: "About", path: "/about", icon: <Info className="w-4 h-4" /> },
    { name: "Contact", path: "/contact", icon: <Mail className="w-4 h-4" /> },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
        scrolled 
          ? "py-2 bg-[#02020a]/85 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
          : "py-5 bg-[#02020a] border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          
          {/* --- BRAND LOGO --- */}
          <Link to="/" className="flex items-center space-x-4 group relative">
            <div className="relative">
              <motion.div
                className="relative z-10 w-12 h-12 rounded-2xl overflow-hidden border border-indigo-500/30 p-1 bg-black/40 backdrop-blur-md"
                whileHover={{ scale: 1.05, rotate: -2 }}
              >
                <img 
                  src="/logo.png" 
                  alt="PatternBTech Logo" 
                  className="w-full h-full object-cover rounded-xl brightness-125 transition-all group-hover:brightness-150" 
                />
              </motion.div>
              <div className="absolute inset-0 blur-2xl rounded-full bg-indigo-500/20 -z-10 group-hover:bg-indigo-500/40 transition-all" />
            </div>
            
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tighter italic uppercase text-white group-hover:text-indigo-400 transition-colors">
                Pattern<span className="text-indigo-500 group-hover:text-white">BTech</span>
              </span>
              <div className="flex items-center space-x-1.5 mt-1">
                <Zap className="w-2.5 h-2.5 text-indigo-400 fill-indigo-400" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black">Neural Network V3</span>
              </div>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex items-center space-x-1 px-2 py-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all relative flex items-center gap-2 ${
                  isActive(link.path) ? "text-white" : "text-gray-500 hover:text-indigo-400"
                }`}
              >
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 border border-indigo-500/40 -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="opacity-70">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          {/* --- ACTION SECTION --- */}
          <div className="hidden md:flex items-center space-x-5">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme} 
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
            >
              {isGlobalDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {isAuthenticated ? (
              <div className="relative flex items-center" ref={userMenuRef}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-4 p-1.5 pr-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.08] transition-all group shadow-2xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-fuchsia-600 p-[1px]">
                    <div className="w-full h-full rounded-xl bg-[#02020a] flex items-center justify-center text-white text-xs font-black tracking-tighter overflow-hidden">
                        {displayData.raw?.photoURL ? (
                          <img src={displayData.raw.photoURL} alt="User" className="w-full h-full object-cover" />
                        ) : displayData.initials}
                    </div>
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[11px] font-black uppercase tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                      {displayData.fullName.split(' ')[0]}
                    </span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Online
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-5 w-72 rounded-[2.5rem] bg-[#05050f]/95 border border-white/10 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-3xl"
                    >
                      <div className="px-6 py-6 border-b border-white/5 mb-3 bg-white/[0.02] rounded-[1.5rem]">
                        <div className="flex items-center gap-3 mb-4">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <p className="text-[9px] uppercase tracking-[0.4em] font-black text-emerald-500">Authorized Node</p>
                        </div>
                        <p className="text-lg font-black italic text-white leading-none truncate uppercase tracking-tighter">
                          {displayData.fullName}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate mt-2 font-medium">{displayData.email}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <button 
                          onClick={() => { navigate("/selection"); setUserMenuOpen(false); }}
                          className="w-full flex items-center justify-between p-4 rounded-2xl text-gray-400 hover:bg-indigo-600 hover:text-white transition-all group"
                        >
                          <div className="flex items-center space-x-3">
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="font-black text-[10px] uppercase tracking-widest">Dashboard</span>
                          </div>
                          <motion.div whileHover={{ x: 3 }}><Zap className="w-3 h-3 opacity-0 group-hover:opacity-100" /></motion.div>
                        </button>

                        <button 
                          onClick={() => { navigate("/profile"); setUserMenuOpen(false); }}
                          className="w-full flex items-center space-x-3 p-4 rounded-2xl text-gray-400 hover:bg-white/5 transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                          <UserIcon className="w-4 h-4" />
                          <span>Core Identity</span>
                        </button>

                        <div className="h-[1px] bg-white/5 my-2 mx-4" />

                        <button 
                          onClick={() => { logout(); setUserMenuOpen(false); navigate("/"); }}
                          className="w-full flex items-center space-x-3 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Terminate Access</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="ghost" className="text-[10px] font-black uppercase text-gray-400 hover:text-white px-6 tracking-widest">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-indigo-600 text-white hover:bg-white hover:text-black text-[10px] h-12 font-black uppercase tracking-[0.2em] px-8 rounded-2xl shadow-2xl shadow-indigo-600/20 transition-all active:scale-95">
                    Join Terminal
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* --- MOBILE TRIGGER --- */}
          <button 
            className="md:hidden p-4 rounded-2xl bg-white/5 border border-white/10 text-white z-[110] relative" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- MOBILE OVERLAY (FIXED POSITIONING) --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 w-full h-screen z-[105] md:hidden bg-[#02020a] flex flex-col overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[120px] rounded-full -z-10" />

            <div className="flex-1 flex flex-col justify-center items-center p-10 overflow-y-auto">
              <div className="flex flex-col space-y-6 w-full text-center">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link 
                      to={link.path} 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-center gap-4 text-4xl font-black italic uppercase tracking-tighter ${
                        isActive(link.path) ? "text-indigo-500" : "text-white/40 hover:text-white"
                      }`}
                    >
                      <span className="opacity-50 scale-125">{link.icon}</span>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-16 w-full max-w-sm space-y-4">
                 {isAuthenticated ? (
                   <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 text-center backdrop-blur-md">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 mx-auto mb-4 p-[2px]">
                        <div className="w-full h-full rounded-2xl bg-[#02020a] flex items-center justify-center font-black text-xl">
                            {displayData.initials}
                        </div>
                      </div>
                      <p className="text-2xl font-black italic text-white uppercase tracking-tighter truncate mb-6">
                        {displayData.fullName}
                      </p>
                      <Button 
                        onClick={() => { logout(); setMobileMenuOpen(false); navigate("/"); }} 
                        className="w-full h-14 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-widest text-[10px]"
                      >
                        Disconnect Identity
                      </Button>
                   </div>
                 ) : (
                   <Link to="/auth" className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full h-16 rounded-3xl bg-indigo-600 text-white font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-indigo-600/30">
                        Initialize System
                      </Button>
                   </Link>
                 )}
                 
                 <div className="flex justify-center gap-4 pt-4">
                    <button 
                      onClick={() => {toggleTheme(); setMobileMenuOpen(false);}}
                      className="p-4 rounded-full bg-white/5 border border-white/10 text-indigo-400"
                    >
                      {isGlobalDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                    </button>
                    <button 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-400"
                    >
                      <X className="w-6 h-6" />
                    </button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}