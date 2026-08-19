"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trophy, Sparkles, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { OVA_DETECTIVE_QUESTIONS } from "@/lib/ovaData";
import AppleEmoji from "@/components/AppleEmoji";

interface OvaDetectiveGameProps {
  onComplete: () => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function OvaDetectiveGame({ onComplete }: OvaDetectiveGameProps) {
  const [questions] = useState(() => {
    return [...OVA_DETECTIVE_QUESTIONS].sort(() => Math.random() - 0.5);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedClues, setRevealedClues] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = questions[currentIndex];
  const maxClues = currentQuestion?.clues.length || 4;
  const currentPotentialPoints = 100 - (revealedClues - 1) * 25;

  // Reset state when question changes
  useEffect(() => {
    setRevealedClues(1);
    setSelectedOption(null);
    setIsCorrect(null);
  }, [currentIndex]);

  if (!currentQuestion) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 sm:p-12 border-2 border-b-[8px] border-slate-200 dark:border-slate-700 text-center max-w-xl mx-auto shadow-2xl">
        <div className="w-24 h-24 bg-[#58cc02]/15 border-2 border-b-4 border-[#58cc02]/40 border-b-[#58cc02] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md animate-bounce">
          <Trophy className="w-12 h-12 text-[#58cc02]" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3">Mükemmel Dedektif!</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold mb-8 text-base">
          Tüm ipuçlarını başarıyla analiz ettin ve toplam <span className="text-[#58cc02] font-black">{score}</span> puan topladın. Sıra ovaların yerlerini haritada bulmakta!
        </p>
        <button
          onClick={onComplete}
          className="bg-[#58cc02] hover:bg-[#46a302] text-white font-black py-4 px-8 rounded-2xl border-2 border-b-4 border-[#58cc02] border-b-[#46a302] active:translate-y-0.5 transition-all text-base w-full sm:w-auto shadow-md cursor-pointer"
        >
          Harita Moduna Geç ➔
        </button>
      </div>
    );
  }

  const handleRevealClue = () => {
    if (revealedClues < maxClues && selectedOption === null) {
      setRevealedClues((prev) => prev + 1);
    }
  };

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    const correct = option === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + currentPotentialPoints);
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.7 },
        colors: ["#58cc02", "#1cb0f6", "#ff9500"]
      });
    } else {
      setRevealedClues(maxClues);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-3xl mx-auto pb-32">
      {/* ── 3D Header Mission Capsule ── */}
      <div className="flex items-center justify-between mb-6 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-[2rem] border-2 border-b-[6px] border-slate-200 dark:border-slate-700 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-[#1cb0f6]/15 border-2 border-b-4 border-[#1cb0f6]/40 border-b-[#1cb0f6] flex items-center justify-center shrink-0 shadow-2xs">
            <AppleEmoji emoji="🔍" size={26} color="#1cb0f6" />
          </div>
          <div>
            <div className="text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              DOSYA {currentIndex + 1} / {questions.length}
            </div>
            <div className="text-base sm:text-lg font-black text-slate-800 dark:text-white tracking-tight">
              Gizli Ova Aranıyor
            </div>
          </div>
        </div>

        {/* 3D Score Coin */}
        <div className="flex items-center gap-2.5 bg-[#58cc02]/15 border-2 border-b-4 border-[#58cc02]/40 border-b-[#58cc02] px-4 py-2 rounded-2xl shadow-2xs">
          <AppleEmoji emoji="⭐" size={20} color="#58cc02" />
          <div className="text-right">
            <div className="text-[10px] font-black text-[#2d7d00] dark:text-[#58cc02] uppercase tracking-widest leading-none">
              PUAN
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#2d7d00] dark:text-[#58cc02] leading-tight">
              {score}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main 3D Detective Dossier Arena ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 md:p-9 border-2 border-b-[8px] border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden"
        >
          {/* Dossier Header */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1cb0f6]/15 text-[#1cb0f6] border-2 border-b-4 border-[#1cb0f6]/35 border-b-[#1cb0f6] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>İPUÇLARI ({revealedClues}/{maxClues})</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-[#ff9500]/15 text-[#c76300] dark:text-[#ff9500] border-2 border-b-4 border-[#ff9500]/35 border-b-[#ff9500] text-xs font-black uppercase tracking-wider">
              POTANSİYEL: {currentPotentialPoints} PUAN
            </div>
          </div>

          {/* Clues Stack */}
          <div className="space-y-3.5 mb-8">
            {currentQuestion.clues.slice(0, revealedClues).map((clue, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={idx}
                className="flex items-start gap-3.5 sm:gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-4.5 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-[#1cb0f6] text-white flex items-center justify-center font-black text-xs shrink-0 border-2 border-b-4 border-[#1899d6] border-b-[#0284c7] shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-slate-700 dark:text-slate-200 font-bold text-sm sm:text-base leading-relaxed pt-0.5">
                  {clue}
                </p>
              </motion.div>
            ))}

            {revealedClues < maxClues && selectedOption === null && (
              <button
                type="button"
                onClick={handleRevealClue}
                className="w-full py-4 px-4 bg-amber-50/80 dark:bg-amber-950/30 border-2 border-b-4 border-dashed border-amber-300 dark:border-amber-700/70 rounded-2xl text-amber-700 dark:text-amber-400 font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-amber-100/80 dark:hover:bg-amber-900/40 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <AppleEmoji emoji="💡" size={18} />
                <span>Yeni İpucu İste (-25 Puan)</span>
              </button>
            )}
          </div>

          {/* 4 Options Grid with Letter Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = selectedOption === option;
              let styleClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] hover:text-[#1cb0f6] dark:hover:text-[#38bdf8] hover:bg-slate-50 dark:hover:bg-slate-700/60";
              let letterBadgeClass = "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-600";

              if (selectedOption !== null) {
                if (option === currentQuestion.answer) {
                  styleClass = "bg-[#58cc02] text-white border-[#58cc02] border-b-[#46a302]";
                  letterBadgeClass = "bg-white/20 text-white border-white/40";
                } else if (isSelected && !isCorrect) {
                  styleClass = "bg-[#ff4b4b] text-white border-[#ff4b4b] border-b-[#d93a3a]";
                  letterBadgeClass = "bg-white/20 text-white border-white/40";
                } else {
                  styleClass = "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 opacity-40";
                  letterBadgeClass = "bg-slate-200 dark:bg-slate-700 text-slate-400 border-slate-300";
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null}
                  className={`p-4 sm:p-5 rounded-2xl border-2 border-b-4 font-black text-sm sm:text-base transition-all flex items-center justify-between text-left active:translate-y-0.5 shadow-sm cursor-pointer ${styleClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-black shrink-0 ${letterBadgeClass}`}>
                      {OPTION_LETTERS[optIdx] || optIdx + 1}
                    </span>
                    <span>{option}</span>
                  </div>

                  {selectedOption !== null && option === currentQuestion.answer && (
                    <Check className="w-5 h-5 stroke-[3] text-white shrink-0" />
                  )}
                  {isSelected && !isCorrect && (
                    <X className="w-5 h-5 stroke-[3] text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── 3D Floating Bottom Result Feedback Drawer ── */}
      <AnimatePresence>
        {selectedOption !== null && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 25 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 max-w-2xl w-[92%] sm:w-full p-4 sm:p-5 rounded-[2.25rem] border-2 border-b-[6px] z-50 flex items-center justify-between gap-4 backdrop-blur-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.35)] ${
              isCorrect 
                ? "bg-white/95 dark:bg-slate-900/95 border-[#58cc02]/50 border-b-[#58cc02]" 
                : "bg-white/95 dark:bg-slate-900/95 border-[#ff4b4b]/50 border-b-[#ff4b4b]"
            }`}
          >
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-white border-2 border-b-4 shrink-0 shadow-md ${
                isCorrect 
                  ? "bg-[#58cc02] border-[#58cc02] border-b-[#46a302]" 
                  : "bg-[#ff4b4b] border-[#ff4b4b] border-b-[#d93a3a]"
              }`}>
                {isCorrect ? <Check className="w-7 h-7 stroke-[3]" /> : <X className="w-7 h-7 stroke-[3]" />}
              </div>
              <div className="min-w-0">
                <h4 className={`font-black text-lg sm:text-xl truncate ${isCorrect ? "text-[#58cc02]" : "text-[#ff4b4b]"}`}>
                  {isCorrect ? `DOĞRU! (+${currentPotentialPoints} Puan)` : "YANLIŞ CEVAP!"}
                </h4>
                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 truncate">
                  {isCorrect ? "Tebrikler, tüm ipuçlarını doğru analiz ettin." : `Doğru cevap: ${currentQuestion.answer}`}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className={`px-5 sm:px-7 py-3.5 rounded-xl font-black uppercase tracking-wider text-xs sm:text-sm text-white shadow-md border-2 border-b-4 active:translate-y-0.5 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isCorrect 
                  ? "bg-[#58cc02] border-[#58cc02] border-b-[#46a302] hover:bg-[#46a302]" 
                  : "bg-[#ff4b4b] border-[#ff4b4b] border-b-[#d93a3a] hover:bg-[#e04343]"
              }`}
            >
              <span>DEVAM ET</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
