"use client";

import { motion } from "framer-motion";
import StudyAnalytics from "./StudyAnalytics";
import AppleEmoji from "@/components/AppleEmoji";

interface StatsBarProps {
  total: number;
  completed: number;
}

const StatCard = ({ label, value, emoji, colorClass, borderClass, bgBadgeClass, accentColor, hoverBorderClass, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={`bg-white dark:bg-slate-800/95 backdrop-blur-md rounded-[2.25rem] p-6 flex flex-col justify-between items-start gap-5 border-2 border-b-4 border-slate-200 dark:border-slate-700/80 shadow-md ${hoverBorderClass} transition-all relative overflow-hidden group`}
  >
    {/* Soft 3D Tinted Badge Icon Box */}
    <div className={`w-13 h-13 rounded-2xl ${bgBadgeClass} ${borderClass} flex items-center justify-center shadow-xs shrink-0`}>
      <AppleEmoji emoji={emoji} size={26} color={accentColor} />
    </div>

    <div className="flex flex-col z-10 w-full">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${colorClass}`}>{value}</span>
      </div>
    </div>
  </motion.div>
);

export default function StatsBar({ total, completed }: StatsBarProps) {
  const remaining = total - completed;

  const stats = [
    { 
      label: "Toplam Müfredat", 
      value: total, 
      emoji: "📘", 
      colorClass: "text-[#af52de]",
      borderClass: "border-2 border-b-4 border-purple-200 dark:border-[#af52de]/50",
      bgBadgeClass: "bg-purple-50 dark:bg-[#af52de]/20",
      hoverBorderClass: "hover:border-[#af52de] dark:hover:border-[#af52de]",
      accentColor: "#af52de"
    },
    { 
      label: "Tamamlanan", 
      value: completed, 
      emoji: "✅", 
      colorClass: "text-[#58cc02]",
      borderClass: "border-2 border-b-4 border-[#58cc02]/40 dark:border-[#58cc02]/50",
      bgBadgeClass: "bg-[#d7ffb8]/90 dark:bg-[#58cc02]/20",
      hoverBorderClass: "hover:border-[#58cc02] dark:hover:border-[#58cc02]",
      accentColor: "#58cc02"
    },
    { 
      label: "Kalan Görevler", 
      value: remaining, 
      emoji: "⏳", 
      colorClass: "text-[#ff9500]",
      borderClass: "border-2 border-b-4 border-amber-200 dark:border-[#ff9500]/50",
      bgBadgeClass: "bg-amber-50 dark:bg-[#ff9500]/20",
      hoverBorderClass: "hover:border-[#ff9500] dark:hover:border-[#ff9500]",
      accentColor: "#ff9500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} delay={0.1 + (i * 0.1)} />
      ))}
      <StudyAnalytics />
    </div>
  );
}
