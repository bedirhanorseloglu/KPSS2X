"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  CheckCircle2, 
  XCircle, 
  Star, 
  RotateCcw, 
  ArrowRight, 
  Award,
  ArrowLeft
} from "lucide-react";
import { GUNCEL_QUESTIONS, GuncelQuestion, CATEGORY_LABELS } from "@/lib/guncelData";
import AppleEmoji from "@/components/AppleEmoji";

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

interface Props {
  onComplete?: () => void;
  onBack?: () => void;
}

export default function GuncelBilgilerGame({ onComplete, onBack }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [questions, setQuestions] = useState<GuncelQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameState, setGameState] = useState<"playing" | "finished">("playing");
  const [scoreDelta, setScoreDelta] = useState<{ val: string; type: "up" | "down" } | null>(null);

  useEffect(() => {
    startNewGame(selectedCategory);
  }, [selectedCategory]);

  const startNewGame = (cat: string) => {
    let filtered = GUNCEL_QUESTIONS;
    if (cat !== "all") {
      filtered = GUNCEL_QUESTIONS.filter((q) => q.category === cat);
    }
    const shuffledQ = shuffle(filtered).map((q) => ({
      ...q,
      options: shuffle(q.options),
    }));

    setQuestions(shuffledQ);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameState("playing");
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQ.correctAnswer;

    if (isCorrect) {
      setScore((s) => s + 10);
      setCorrectCount((c) => c + 1);
      setScoreDelta({ val: "+10", type: "up" });
    } else {
      setScore((s) => Math.max(0, s - 5));
      setWrongCount((w) => w + 1);
      setScoreDelta({ val: "-5", type: "down" });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameState("finished");
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (onComplete) onComplete();
    }
  };

  const totalQuestions = questions.length;
  // Accuracy calculation strictly according to site rules: (Doğru / Toplam Soru Sayısı) * 100
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isCurrentCorrect = selectedOption === currentQ?.correctAnswer;

  if (gameState === "finished") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center space-y-6"
      >
        {/* 3D Trophy Badge */}
        <div className="w-24 h-24 rounded-[1.75rem] bg-[#5856d6] text-white flex items-center justify-center border-2 border-b-4 border-[#4744b8] shadow-xs">
          <AppleEmoji emoji="🏆" size={48} />
        </div>

        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Tebrikler! Testi Tamamladın
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
            KPSS Genel Kültür & Güncel Bilgiler Pratiği Sonucu
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 w-full pt-2">
          {/* Total Score */}
          <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-[#ff9500] border-b-[#e08400] rounded-2xl p-4 text-center shadow-2xs">
            <div className="text-2xl font-black text-[#ff9500] flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-current" />
              <span>{score}</span>
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">Puan</div>
          </div>

          {/* Correct Count */}
          <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-[#58cc02] border-b-[#46a302] rounded-2xl p-4 text-center shadow-2xs">
            <div className="text-2xl font-black text-[#58cc02] flex items-center justify-center gap-1">
              <CheckCircle2 className="w-5 h-5" />
              <span>{correctCount}</span>
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">Doğru</div>
          </div>

          {/* Accuracy Percentage */}
          <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-[#5856d6] border-b-[#4744b8] rounded-2xl p-4 text-center shadow-2xs">
            <div className="text-2xl font-black text-[#5856d6] flex items-center justify-center gap-1">
              <Award className="w-5 h-5" />
              <span>%{accuracy}</span>
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">İsabet Oranı</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-4">
          <button
            type="button"
            onClick={() => startNewGame(selectedCategory)}
            className="w-full py-4 px-6 bg-[#58cc02] text-white font-black rounded-2xl border-2 border-b-4 border-[#46a302] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-base cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Yeniden Oyna</span>
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-full py-4 px-6 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-base cursor-pointer shadow-xs"
            >
              <span>Etkinliklere Dön</span>
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-5 pb-44">
      
      {/* ━━━ TOP CONTROL BAR (Unified Header) ━━━ */}
      <div className="flex items-center justify-between gap-4">
        {/* Back Button */}
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] hover:text-[#1cb0f6] dark:hover:text-[#38bdf8] hover:bg-slate-50 dark:hover:bg-slate-800 active:translate-y-0.5 transition-all shadow-2xs cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">ETKİNLİKLERE DÖN</span>
          </button>
        ) : (
          <Link
            href="/etkinlik"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] hover:text-[#1cb0f6] dark:hover:text-[#38bdf8] hover:bg-slate-50 dark:hover:bg-slate-800 active:translate-y-0.5 transition-all shadow-2xs cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">ETKİNLİKLERE DÖN</span>
          </Link>
        )}

        {/* Integrated Progress Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="font-black text-xs text-slate-400 shrink-0">
            {currentIndex + 1} / {totalQuestions}
          </span>
          <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full flex-1 overflow-hidden border border-slate-200 dark:border-slate-700">
            <motion.div
              className="h-full bg-[#5856d6] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Score Chip */}
        <div className="relative flex items-center gap-1.5 text-[#ff9500] bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border-2 border-b-4 border-[#ff9500] border-b-[#e08400] font-black text-xs sm:text-sm shadow-2xs shrink-0">
          <Star className="w-4 h-4 fill-current" />
          <span>Puan: {score}</span>

          <AnimatePresence>
            {scoreDelta && (
              <motion.div
                key={scoreDelta.val + Date.now()}
                initial={{ opacity: 0, y: 5, scale: 0.8 }}
                animate={{ opacity: 1, y: -28, scale: 1.2 }}
                exit={{ opacity: 0, y: -38 }}
                transition={{ duration: 0.8 }}
                onAnimationComplete={() => setScoreDelta(null)}
                className={`absolute -top-3 right-1 font-black text-sm ${
                  scoreDelta.type === "up" ? "text-[#58cc02]" : "text-[#ff4b4b]"
                }`}
              >
                {scoreDelta.val}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ━━━ CATEGORY SELECTOR PILLS (RESPONSIVE FLEX WRAP) ━━━ */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-800 w-full shadow-2xs">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-xs transition-all cursor-pointer border-2 border-b-4 shrink-0 ${
            selectedCategory === "all"
              ? "bg-white dark:bg-slate-800 border-[#5856d6] border-b-[#4744b8] text-[#5856d6] shadow-xs"
              : "bg-white/50 dark:bg-slate-800/50 text-slate-500 hover:text-slate-800 dark:hover:text-white border-transparent"
          }`}
        >
          <AppleEmoji emoji="🌟" size={16} />
          <span>Tümü ({GUNCEL_QUESTIONS.length})</span>
        </button>

        {Object.entries(CATEGORY_LABELS).map(([catKey, catInfo]) => {
          const isActive = selectedCategory === catKey;
          const count = GUNCEL_QUESTIONS.filter((q) => q.category === catKey).length;
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => setSelectedCategory(catKey)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-xs transition-all cursor-pointer border-2 border-b-4 shrink-0 ${
                isActive
                  ? "bg-white dark:bg-slate-800 border-[#5856d6] border-b-[#4744b8] text-[#5856d6] shadow-xs"
                  : "bg-white/50 dark:bg-slate-800/50 text-slate-500 hover:text-slate-800 dark:hover:text-white border-transparent"
              }`}
            >
              <AppleEmoji emoji={catInfo.emoji} size={16} />
              <span>{catInfo.name} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* ━━━ MAIN QUESTION ARENA CARD ━━━ */}
      {currentQ && (
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden"
        >
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#5856d6]" />

          {/* Category Tag */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="inline-flex items-center gap-2 bg-[#f8f0fc] dark:bg-[#5856d6]/10 text-[#5856d6] font-black px-3.5 py-1.5 rounded-xl text-xs border-2 border-b-2 border-[#5856d6]/30 shadow-2xs">
              <AppleEmoji emoji={CATEGORY_LABELS[currentQ.category]?.emoji || "📜"} size={16} />
              <span>{CATEGORY_LABELS[currentQ.category]?.name}</span>
            </span>

            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Soru {currentIndex + 1} / {totalQuestions}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-relaxed tracking-tight">
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {currentQ.options.map((opt, idx) => {
              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D, E
              const isSelected = selectedOption === opt;
              const isCorrectOpt = opt === currentQ.correctAnswer;
              const isLastOddOption = currentQ.options.length % 2 !== 0 && idx === currentQ.options.length - 1;

              let btnStyle = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-[#1cb0f6]";
              let badgeStyle = "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700";

              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle = "bg-[#e5f9e7] dark:bg-[#58cc02]/15 border-[#58cc02] border-b-[#46a302] text-[#58cc02] dark:text-[#58cc02]";
                  badgeStyle = "bg-[#58cc02] text-white border-[#46a302]";
                } else if (isSelected && !isCorrectOpt) {
                  btnStyle = "bg-[#ffebeb] dark:bg-[#ff4b4b]/15 border-[#ff4b4b] border-b-[#e03030] text-[#ff4b4b] dark:text-[#ff4b4b]";
                  badgeStyle = "bg-[#ff4b4b] text-white border-[#e03030]";
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border-2 border-b-4 transition-all flex items-center gap-3 font-bold text-sm sm:text-base cursor-pointer shadow-2xs ${
                    isLastOddOption ? "md:col-span-2 justify-center" : "justify-between"
                  } ${isAnswered ? "" : "active:translate-y-0.5"} ${btnStyle}`}
                >
                  <div className={`flex items-center gap-3.5 ${isLastOddOption ? "mx-auto" : ""}`}>
                    <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 border-2 border-b-2 transition-colors ${badgeStyle}`}>
                      {optionLetter}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>

                  {isAnswered && (
                    <div className="shrink-0">
                      {isCorrectOpt && <CheckCircle2 className="w-6 h-6 text-[#58cc02]" />}
                      {isSelected && !isCorrectOpt && <XCircle className="w-6 h-6 text-[#ff4b4b]" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ━━━ DUOLINGO-STYLE FIXED BOTTOM BANNER ━━━ */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed bottom-0 inset-x-0 z-50 p-5 sm:p-6 border-t-4 shadow-2xl backdrop-blur-xl transition-colors ${
              isCurrentCorrect
                ? "bg-[#e5f9e7]/95 dark:bg-slate-900/95 border-[#58cc02]"
                : "bg-[#ffebeb]/95 dark:bg-slate-900/95 border-[#ff4b4b]"
            }`}
          >
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              {/* Left Side: Icon, Title & Explanation */}
              <div className="flex items-start gap-4 flex-1">
                <div className="shrink-0 mt-0.5">
                  {isCurrentCorrect ? (
                    <div className="w-12 h-12 rounded-2xl bg-[#58cc02] text-white flex items-center justify-center border-2 border-b-4 border-[#46a302] shadow-xs">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-[#ff4b4b] text-white flex items-center justify-center border-2 border-b-4 border-[#e03030] shadow-xs">
                      <XCircle className="w-7 h-7" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className={`text-lg font-black tracking-tight ${
                    isCurrentCorrect ? "text-[#58cc02]" : "text-[#ff4b4b]"
                  }`}>
                    {isCurrentCorrect ? "Mükemmel! Doğru Cevap" : `Doğru Cevap: ${currentQ.correctAnswer}`}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed max-w-xl">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>

              {/* Right Side: Next Question 3D Push Button */}
              <button
                type="button"
                onClick={handleNextQuestion}
                className={`w-full sm:w-auto px-8 py-4 text-white font-black rounded-2xl border-2 border-b-4 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-base cursor-pointer shadow-xs shrink-0 ${
                  isCurrentCorrect
                    ? "bg-[#58cc02] border-[#46a302]"
                    : "bg-[#ff4b4b] border-[#e03030]"
                }`}
              >
                <span>{currentIndex + 1 === totalQuestions ? "Sonuçları Gör" : "Devam Et"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
