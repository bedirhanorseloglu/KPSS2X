"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppleEmoji from "@/components/AppleEmoji";

const EXAM_DATE = new Date("2026-09-06T10:15:00").getTime();

const FlipNumber = ({ value, label, isDanger, isWarning }: { value: number; label: string; isDanger: boolean; isWarning: boolean }) => {
  const colorClass = isDanger ? "text-[#ff4b4b]" : isWarning ? "text-[#ff9500]" : "text-[#1cb0f6]";
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-10 overflow-hidden flex justify-center items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`font-mono text-3xl font-black ${colorClass} block tracking-tighter drop-shadow-2xs`}
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{label}</span>
    </div>
  );
};

export default function KPSSCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = EXAM_DATE - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  const isWarning = timeLeft.days < 30;
  const isDanger = timeLeft.days < 7;

  return (
    <div 
      className="relative group overflow-hidden bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 px-6 sm:px-8 py-5 rounded-[2.5rem] shadow-md flex items-center justify-between gap-6 flex-1 min-w-[280px]"
    >
      <div className="flex flex-col items-start pr-6 border-r-2 border-slate-200 dark:border-slate-700 relative z-10 shrink-0">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
           <AppleEmoji emoji="🎯" size={14} />
           <span>Hedef</span>
         </span>
         <span className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">
           06 Eylül
         </span>
      </div>
      
      <div className="flex items-center gap-3 relative z-10 flex-1 justify-around">
        <FlipNumber value={timeLeft.days} label="Gün" isDanger={isDanger} isWarning={isWarning} />
        <span className="text-slate-300 dark:text-slate-600 font-black mb-4 text-2xl">:</span>
        <FlipNumber value={timeLeft.hours} label="Saat" isDanger={isDanger} isWarning={isWarning} />
        <span className="text-slate-300 dark:text-slate-600 font-black mb-4 text-2xl">:</span>
        <FlipNumber value={timeLeft.minutes} label="Dk" isDanger={isDanger} isWarning={isWarning} />
        <span className="text-slate-300 dark:text-slate-600 font-black mb-4 text-2xl animate-pulse">:</span>
        <FlipNumber value={timeLeft.seconds} label="Sn" isDanger={isDanger} isWarning={isWarning} />
      </div>
    </div>
  );
}
