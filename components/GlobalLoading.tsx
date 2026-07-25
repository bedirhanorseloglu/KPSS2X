"use client";

import { motion } from "framer-motion";
import AppleEmoji from "./AppleEmoji";

interface GlobalLoadingProps {
  title?: string;
  description?: string;
  emoji?: string;
  fullScreen?: boolean;
}

export default function GlobalLoading({
  title = "Sistem Hazırlanıyor...",
  description = "KPSS çalışma verileriniz yükleniyor, lütfen bekleyin.",
  emoji = "🚀",
  fullScreen = true,
}: GlobalLoadingProps) {
  const containerClasses = fullScreen
    ? "min-h-screen fixed inset-0 z-50 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
    : "w-full py-16 flex flex-col items-center justify-center p-6 text-center";

  return (
    <div className={containerClasses}>
      {/* Top Floating Progress Line */}
      {fullScreen && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200/50 dark:bg-slate-800/50 overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-r from-[#1cb0f6] via-[#58cc02] to-[#af52de]"
          />
        </div>
      )}

      {/* Main 3D Card Loading Badge */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-22 h-22 sm:w-24 sm:h-24 bg-white dark:bg-slate-800 rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center z-10">
          <AppleEmoji emoji={emoji} size={42} className="animate-bounce" />
        </div>
        <div 
          className="absolute inset-0 -m-3.5 sm:-m-4 rounded-[2.75rem] border-2 border-dashed border-[#1cb0f6] animate-spin opacity-60 pointer-events-none" 
          style={{ animationDuration: "6s" }} 
        />
      </div>

      {/* Title & Description */}
      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center justify-center gap-2">
          <AppleEmoji emoji="⚡" size={22} />
          <span>{title}</span>
        </h3>
        <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Subtle Bottom Pulsing Dots */}
      <div className="flex items-center gap-1.5 mt-6">
        <span className="w-2 h-2 rounded-full bg-[#1cb0f6] animate-ping" />
        <span className="w-2 h-2 rounded-full bg-[#58cc02] animate-ping" style={{ animationDelay: "0.2s" }} />
        <span className="w-2 h-2 rounded-full bg-[#af52de] animate-ping" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
}
