import { motion } from "framer-motion"; // Changed from motion/react for stability
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({ 
  children, 
  className = "", 
  hover = true, 
  glow = false, 
  onClick 
}: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick} 
      className={`relative backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden group ${className}`}
      whileHover={hover ? { scale: 1.01, y: -2 } : {}}
      transition={{ duration: 0.2 }}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}