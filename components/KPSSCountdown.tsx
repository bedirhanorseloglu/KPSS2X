"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppleEmoji from "@/components/AppleEmoji";
import { ChevronDown, Check } from "lucide-react";

export interface ExamTypeOption {
  id: "lisans" | "onlisans" | "ortaogretim" | "ekpss";
  title: string;
  shortName: string;
  dateISO: string;
  displayDate: string;
  scoreType: string;
  emoji: string;
}

export const EXAM_OPTIONS: ExamTypeOption[] = [
  {
    id: "lisans",
    title: "KPSS Lisans",
    shortName: "Lisans",
    dateISO: "2026-09-06T10:15:00+03:00",
    displayDate: "06 Eylül 2026",
    scoreType: "P3 Puanı",
    emoji: "🎓"
  },
  {
    id: "onlisans",
    title: "KPSS Ön Lisans",
    shortName: "Ön Lisans",
    dateISO: "2026-10-04T10:15:00+03:00",
    displayDate: "04 Ekim 2026",
    scoreType: "P93 Puanı",
    emoji: "🏫"
  },
  {
    id: "ortaogretim",
    title: "KPSS Ortaöğretim",
    shortName: "Ortaöğretim",
    dateISO: "2026-10-25T10:15:00+03:00",
    displayDate: "25 Ekim 2026",
    scoreType: "P94 Puanı",
    emoji: "📚"
  },
  {
    id: "ekpss",
    title: "EKPSS",
    shortName: "EKPSS",
    dateISO: "2026-04-26T10:15:00+03:00",
    displayDate: "26 Nisan 2026",
    scoreType: "EKPSS Puanı",
    emoji: "♿"
  }
];

const FlipNumber = ({ value, label, isDanger }: { value: number; label: string; isDanger: boolean }) => {
  const colorClass = isDanger ? "text-[#ff4b4b]" : "text-[#1cb0f6]";
  
  return (
    <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/80 px-2 py-2 sm:px-3 sm:py-2.5 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700/80 shadow-2xs transition-transform hover:scale-105">
      <div className="relative h-7 sm:h-8 overflow-hidden flex justify-center items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`font-mono text-xl sm:text-2xl font-black ${colorClass} block tracking-tight drop-shadow-2xs`}
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mt-0.5">{label}</span>
    </div>
  );
};

export default function KPSSCountdown() {
  const [selectedExamId, setSelectedExamId] = useState<ExamTypeOption["id"]>("lisans");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read persisted exam selection
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("user_selected_exam") as ExamTypeOption["id"];
    if (saved && EXAM_OPTIONS.some(e => e.id === saved)) {
      setSelectedExamId(saved);
    }
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentExam = EXAM_OPTIONS.find(e => e.id === selectedExamId) || EXAM_OPTIONS[0];

  useEffect(() => {
    if (!isClient) return;

    const examTime = new Date(currentExam.dateISO).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = examTime - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [selectedExamId, isClient, currentExam.dateISO]);

  const handleSelectExam = (examId: ExamTypeOption["id"]) => {
    setSelectedExamId(examId);
    localStorage.setItem("user_selected_exam", examId);
    setIsDropdownOpen(false);
  };

  if (!isClient) return null;

  const isWarning = timeLeft.days < 30;
  const isDanger = timeLeft.days < 7;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.25rem] p-6 sm:p-7 border-2 border-b-4 border-slate-200 dark:border-slate-700/80 shadow-md flex flex-col justify-between relative h-full group z-20">
      {/* Target Badge Header */}
      <div className="flex items-center justify-between gap-4 mb-4 relative z-30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border-2 border-b-4 border-sky-200 dark:border-sky-800/80 flex items-center justify-center shrink-0 shadow-2xs">
            <AppleEmoji emoji={currentExam.emoji} size={22} color="#1cb0f6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Hedef Sınav
            </span>
            <span className="text-base sm:text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight block">
              {currentExam.displayDate}
            </span>
          </div>
        </div>

        {/* Interactive Exam Selector Dropdown Button */}
        <div className="relative z-50" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-500/10 border-2 border-b-4 border-sky-200 dark:border-sky-500/30 rounded-xl text-[11px] font-black uppercase tracking-widest text-[#1cb0f6] hover:bg-sky-100 dark:hover:bg-sky-500/20 active:translate-y-0.5 transition-all shadow-2xs cursor-pointer"
          >
            <span>{currentExam.title}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Overlay Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5 space-y-1 max-h-72 overflow-y-auto"
              >
                <div className="px-3 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700/60 mb-1">
                  Sınav Türü Seçin
                </div>
                {EXAM_OPTIONS.map((exam) => {
                  const isSelected = exam.id === selectedExamId;
                  return (
                    <button
                      key={exam.id}
                      onClick={() => handleSelectExam(exam.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors text-xs font-black ${
                        isSelected 
                          ? "bg-sky-50 dark:bg-sky-500/20 text-[#1cb0f6] border-2 border-sky-200 dark:border-sky-500/40" 
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <AppleEmoji emoji={exam.emoji} size={16} />
                        <div className="flex flex-col">
                          <span>{exam.title}</span>
                          <span className="text-[9px] text-slate-400 font-bold">{exam.displayDate} • {exam.scoreType}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#1cb0f6] shrink-0" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Countdown Chips Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5 relative z-10 mt-auto pt-2">
        <FlipNumber value={timeLeft.days} label="Gün" isDanger={isDanger} />
        <FlipNumber value={timeLeft.hours} label="Saat" isDanger={isDanger} />
        <FlipNumber value={timeLeft.minutes} label="Dk" isDanger={isDanger} />
        <FlipNumber value={timeLeft.seconds} label="Sn" isDanger={isDanger} />
      </div>
    </div>
  );
}
