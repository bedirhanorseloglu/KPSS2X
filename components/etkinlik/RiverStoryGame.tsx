"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RIVER_FEATURES } from "@/lib/riverData";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import AppleEmoji from "@/components/AppleEmoji";

interface RiverStoryGameProps {
  onComplete: () => void;
}

export default function RiverStoryGame({ onComplete }: RiverStoryGameProps) {
  const [questions] = useState(() => {
    return [...RIVER_FEATURES].sort(() => Math.random() - 0.5).slice(0, 10).map(q => {
      const pairOptions = q.options.map(opt => {
        if (opt === q.blank) return `${q.name} - ${opt}`;
        const wrongRivers = RIVER_FEATURES.filter(r => r.name !== q.name);
        const randomWrongRiver = wrongRivers[Math.floor(Math.random() * wrongRivers.length)].name;
        return `${randomWrongRiver} - ${opt}`;
      });
      
      const shuffledOptions = [...pairOptions].sort(() => Math.random() - 0.5);
      
      return {
        ...q,
        story: `Ben _____ . ${q.story}`,
        blank: `${q.name} - ${q.blank}`,
        options: shuffledOptions,
      };
    });
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const currentRiver = questions[currentIndex];

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    
    if (option === currentRiver.blank) {
      setIsCorrect(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#58cc02', '#1cb0f6', '#ffffff']
      });
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      onComplete();
    }
  };

  if (!currentRiver) return null;

  const parts = currentRiver.story.split("_____");
  const progressPct = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full pb-32">
      {/* ── 3D Progress Bar Header ── */}
      <div className="w-full mb-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#1cb0f6]/15 border-2 border-b-4 border-[#1cb0f6]/40 border-b-[#1cb0f6] flex items-center justify-center shrink-0">
          <AppleEmoji emoji="💧" size={20} color="#1cb0f6" />
        </div>
        <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700/60 rounded-full border-2 border-slate-200 dark:border-slate-700 overflow-hidden relative">
          <motion.div 
            className="h-full bg-[#58cc02] rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
          >
            <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/30 rounded-full" />
          </motion.div>
        </div>
        <span className="text-xs font-black text-slate-500 dark:text-slate-400 shrink-0">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="w-full flex flex-col items-center"
        >
          {/* ── 3D Question Story Card ── */}
          <div className="bg-white dark:bg-slate-800 w-full rounded-[2.25rem] p-6 sm:p-8 border-2 border-b-[6px] border-slate-200 dark:border-slate-700 shadow-xl mb-6 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1cb0f6]/10 text-[#1cb0f6] border-2 border-b-4 border-[#1cb0f6]/30 border-b-[#1cb0f6] text-xs font-black uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              SORU {currentIndex + 1}
            </div>

            <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-relaxed">
              {parts[0]}
              <span className={`inline-flex items-center justify-center px-4 py-1 mx-1.5 rounded-xl border-2 border-b-4 text-base sm:text-lg font-black transition-all ${
                selectedOption === null 
                  ? "bg-slate-100 dark:bg-slate-700/60 border-slate-300 dark:border-slate-600 text-slate-400" 
                  : isCorrect 
                    ? "bg-[#58cc02]/15 text-[#58cc02] border-[#58cc02]/40 border-b-[#46a302]" 
                    : "bg-[#ff4b4b]/15 text-[#ff4b4b] border-[#ff4b4b]/40 border-b-[#d93a3a]"
              }`}>
                {selectedOption ? selectedOption.split(" - ")[0] : "______"}
              </span>
              {parts[1]}
              {parts.length > 2 && (
                <>
                  <span className={`inline-flex items-center justify-center px-4 py-1 mx-1.5 rounded-xl border-2 border-b-4 text-base sm:text-lg font-black transition-all ${
                    selectedOption === null 
                      ? "bg-slate-100 dark:bg-slate-700/60 border-slate-300 dark:border-slate-600 text-slate-400" 
                      : isCorrect 
                        ? "bg-[#58cc02]/15 text-[#58cc02] border-[#58cc02]/40 border-b-[#46a302]" 
                        : "bg-[#ff4b4b]/15 text-[#ff4b4b] border-[#ff4b4b]/40 border-b-[#d93a3a]"
                  }`}>
                    {selectedOption ? selectedOption.split(" - ")[1] : "______"}
                  </span>
                  {parts[2]}
                </>
              )}
            </div>
          </div>

          {/* ── 3D Options Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {currentRiver.options.map((option) => {
              const isSelected = selectedOption === option;
              let styleClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] hover:text-[#1cb0f6] dark:hover:text-[#38bdf8] hover:bg-slate-50 dark:hover:bg-slate-700/60";
              
              if (isSelected) {
                if (isCorrect) {
                  styleClass = "bg-[#58cc02] text-white border-[#58cc02] border-b-[#46a302]";
                } else {
                  styleClass = "bg-[#ff4b4b] text-white border-[#ff4b4b] border-b-[#d93a3a]";
                }
              } else if (selectedOption !== null && option === currentRiver.blank) {
                styleClass = "bg-[#58cc02]/20 border-[#58cc02] text-[#58cc02] opacity-75";
              } else if (selectedOption !== null) {
                styleClass = "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 opacity-40";
              }

              return (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null}
                  className={`p-4 sm:p-5 rounded-2xl border-2 border-b-4 font-black text-sm sm:text-base transition-all flex items-center justify-center text-center active:translate-y-0.5 shadow-sm ${styleClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── 3D Bottom Result Feedback Bar ── */}
      <AnimatePresence>
        {selectedOption !== null && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 p-4 md:p-6 border-t-2 z-50 flex justify-center backdrop-blur-md ${
              isCorrect 
                ? "bg-[#58cc02]/15 dark:bg-[#58cc02]/20 border-[#58cc02]/40" 
                : "bg-[#ff4b4b]/15 dark:bg-[#ff4b4b]/20 border-[#ff4b4b]/40"
            }`}
          >
            <div className="max-w-4xl w-full flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white border-2 border-b-4 shrink-0 shadow-md ${
                  isCorrect 
                    ? "bg-[#58cc02] border-[#58cc02] border-b-[#46a302]" 
                    : "bg-[#ff4b4b] border-[#ff4b4b] border-b-[#d93a3a]"
                }`}>
                  {isCorrect ? <Check className="w-7 h-7 stroke-[3]" /> : <X className="w-7 h-7 stroke-[3]" />}
                </div>
                <div>
                  <h4 className={`font-black text-xl sm:text-2xl ${isCorrect ? "text-[#58cc02]" : "text-[#ff4b4b]"}`}>
                    {isCorrect ? "Harika Doğru!" : "Yanlış Cevap"}
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
                    {isCorrect ? "Bilgiyi hafızana başarıyla kopyaladın." : `Doğru cevap: ${currentRiver.blank}`}
                  </p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className={`px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-black uppercase tracking-wider text-sm sm:text-base text-white shadow-md border-2 border-b-4 active:translate-y-0.5 transition-all flex items-center gap-2 shrink-0 ${
                  isCorrect 
                    ? "bg-[#58cc02] border-[#58cc02] border-b-[#46a302] hover:bg-[#46a302]" 
                    : "bg-[#ff4b4b] border-[#ff4b4b] border-b-[#d93a3a] hover:bg-[#e04343]"
                }`}
              >
                Devam Et <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
