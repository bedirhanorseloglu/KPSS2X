"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import AppleEmoji from "@/components/AppleEmoji";

type Props = {
  value: string; // "yyyy-MM-dd"
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
};

export default function CustomDatePicker({ value, onChange, label = "Tarih *", required }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = value ? parseISO(value) : new Date();
  const [viewMonth, setViewMonth] = useState<Date>(selectedDate);

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const handleDateSelect = (day: Date) => {
    const formatted = format(day, "yyyy-MM-dd");
    onChange(formatted);
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    onChange(format(today, "yyyy-MM-dd"));
    setViewMonth(today);
    setIsOpen(false);
  };

  const formattedDisplay = value
    ? format(parseISO(value), "d MMMM yyyy", { locale: tr })
    : "Tarih seçin...";

  return (
    <div className="space-y-2 relative">
      {label && (
        <span className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
          <AppleEmoji emoji="📅" size={16} /> {label}
        </span>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between bg-slate-100/70 dark:bg-white/5 border-2 border-b-4 rounded-2xl px-5 py-3.5 text-sm font-black transition-all shadow-xs text-left cursor-pointer active:translate-y-0.5 ${
            isOpen
              ? "border-[#1cb0f6] border-b-[#1899d6] bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
              : "border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 dark:bg-slate-800/80 text-slate-800 dark:text-white hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6]"
          }`}
        >
          <span className={`font-black ${value ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>
            {formattedDisplay}
          </span>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#1cb0f6]" />
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#1cb0f6]" : ""}`} />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop overlay */}
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

              {/* 3D Popover Card */}
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute bottom-full left-0 right-0 mb-2 sm:w-80 bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xl rounded-[2rem] p-4 z-50 overflow-hidden"
              >
                {/* Month/Year Header Controls */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <button
                    type="button"
                    onClick={() => setViewMonth(subMonths(viewMonth, 1))}
                    className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-[#1cb0f6] hover:text-white border-2 border-b-4 border-slate-200 dark:border-slate-600 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-sm font-black text-slate-800 dark:text-white capitalize">
                    {format(viewMonth, "MMMM yyyy", { locale: tr })}
                  </span>

                  <button
                    type="button"
                    onClick={() => setViewMonth(addMonths(viewMonth, 1))}
                    className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-[#1cb0f6] hover:text-white border-2 border-b-4 border-slate-200 dark:border-slate-600 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {weekDays.map((d) => (
                    <span key={d} className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 py-1">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {days.map((day) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonthDay = isSameMonth(day, viewMonth);
                    const isCurrentDay = isToday(day);

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className={`h-9 rounded-xl font-black text-xs transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? "bg-[#1cb0f6] text-white border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-2xs scale-105"
                            : isCurrentDay
                            ? "bg-sky-100/80 dark:bg-sky-950/60 text-[#1cb0f6] border-2 border-[#1cb0f6]/40 font-black"
                            : isCurrentMonthDay
                            ? "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70 hover:text-[#1cb0f6]"
                            : "text-slate-300 dark:text-slate-600 hover:text-slate-400"
                        }`}
                      >
                        {format(day, "d")}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Actions Footer */}
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleSelectToday}
                    className="text-xs font-black text-[#1cb0f6] hover:underline px-2 py-1 cursor-pointer"
                  >
                    Bugün
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 cursor-pointer"
                  >
                    Kapat
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
