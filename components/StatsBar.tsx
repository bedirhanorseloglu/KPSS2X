"use client";

import { motion } from "framer-motion";
import StudyAnalytics from "./StudyAnalytics";
import AppleEmoji from "@/components/AppleEmoji";

interface StatsBarProps {
  total: number;
  completed: number;
}

const StatCard = ({ label, value, emoji, colorClass, borderClass, bgBadgeClass, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 flex flex-col justify-between items-start gap-5 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md hover:border-[#1cb0f6] transition-all relative overflow-hidden group"
  >
    {/* 3D Push-Badge Icon Box */}
    <div className={`w-14 h-14 rounded-2xl ${bgBadgeClass} border-2 border-b-4 ${borderClass} text-white flex items-center justify-center shadow-xs shrink-0`}>
      <AppleEmoji emoji={emoji} size={28} className="text-white" />
    </div>

    <div className="flex flex-col z-10">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-black tracking-tight ${colorClass}`}>{value}</span>
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
      colorClass: "text-slate-800 dark:text-white",
      borderClass: "border-[#963ec7]",
      bgBadgeClass: "bg-[#af52de]"
    },
    { 
      label: "Tamamlanan", 
      value: completed, 
      emoji: "✅", 
      colorClass: "text-[#58cc02]",
      borderClass: "border-[#46a302]",
      bgBadgeClass: "bg-[#58cc02]"
    },
    { 
      label: "Kalan Görevler", 
      value: remaining, 
      emoji: "⏳", 
      colorClass: "text-[#ff9500]",
      borderClass: "border-[#e08400]",
      bgBadgeClass: "bg-[#ff9500]"
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
