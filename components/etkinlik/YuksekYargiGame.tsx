"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ArrowLeft,
  Sparkles,
  Check,
  AlertTriangle,
  Crown,
  Building2,
  Scale,
  ShieldCheck,
  BookOpen
} from "lucide-react";
import { YUKSEK_YARGI_ITEMS, COURT_SUMMARIES, YuksekYargiItem } from "@/lib/yuksekYargiData";
import AppleEmoji from "@/components/AppleEmoji";

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

interface SelectorConfig {
  id: "CB" | "TBMM" | "HSK" | "Yargıtay/Danıştay" | "AYM";
  title: string;
  subtitle: string;
  positionLabel: string;
  icon: React.ReactNode;
  cardBorder: string;
  hoverBg: string;
  iconBg: string;
  badgeBg: string;
  badgeBorder: string;
  badgeTextColor: string;
}

const SELECTORS: SelectorConfig[] = [
  {
    id: "CB",
    title: "Cumhurbaşkanı (CB)",
    subtitle: "Devletin & Yürütmenin Başı",
    positionLabel: "Sol Üst",
    icon: <Crown className="w-5 h-5 text-white" />,
    cardBorder: "border-2 border-b-4 border-[#af52de] border-b-[#963bbb]",
    hoverBg: "hover:bg-[#fcf0ff] dark:hover:bg-[#af52de]/10",
    iconBg: "bg-[#af52de]",
    badgeBg: "bg-[#fcf0ff] dark:bg-[#af52de]/20",
    badgeBorder: "border-[#af52de]/30",
    badgeTextColor: "text-[#af52de]"
  },
  {
    id: "TBMM",
    title: "TBMM",
    subtitle: "Milli İrade & Yasama Organı",
    positionLabel: "Sağ Üst",
    icon: <Building2 className="w-5 h-5 text-white" />,
    cardBorder: "border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6]",
    hoverBg: "hover:bg-[#f2fbff] dark:hover:bg-[#1cb0f6]/10",
    iconBg: "bg-[#1cb0f6]",
    badgeBg: "bg-[#e8f7fe] dark:bg-[#1cb0f6]/20",
    badgeBorder: "border-[#1cb0f6]/30",
    badgeTextColor: "text-[#1cb0f6]"
  },
  {
    id: "HSK",
    title: "HSK (Hakimler ve Savcılar Kurulu)",
    subtitle: "Adli ve İdari Yargı Teminatı",
    positionLabel: "Sol Alt",
    icon: <ShieldCheck className="w-5 h-5 text-white" />,
    cardBorder: "border-2 border-b-4 border-[#10B981] border-b-[#0d9488]",
    hoverBg: "hover:bg-[#ecfdf5] dark:hover:bg-[#10B981]/10",
    iconBg: "bg-[#10B981]",
    badgeBg: "bg-[#ecfdf5] dark:bg-[#10B981]/20",
    badgeBorder: "border-[#10B981]/30",
    badgeTextColor: "text-[#10B981]"
  },
  {
    id: "Yargıtay/Danıştay",
    title: "Yargıtay & Danıştay GK",
    subtitle: "Yüksek Yargı Genel Kurulları",
    positionLabel: "Sağ Alt",
    icon: <Scale className="w-5 h-5 text-white" />,
    cardBorder: "border-2 border-b-4 border-[#ff9500] border-b-[#e08400]",
    hoverBg: "hover:bg-[#fffcf7] dark:hover:bg-[#ff9500]/10",
    iconBg: "bg-[#ff9500]",
    badgeBg: "bg-[#fff8f0] dark:bg-[#ff9500]/20",
    badgeBorder: "border-[#ff9500]/30",
    badgeTextColor: "text-[#ff9500]"
  },
  {
    id: "AYM",
    title: "AYM (Anayasa Mahkemesi)",
    subtitle: "Anayasal Denetim Yüksek Mahkemesi",
    positionLabel: "Orta Alt",
    icon: <AppleEmoji emoji="⚖️" size={20} />,
    cardBorder: "border-2 border-b-4 border-[#5856d6] border-b-[#4744b8]",
    hoverBg: "hover:bg-[#f8f0fc] dark:hover:bg-[#5856d6]/10",
    iconBg: "bg-[#5856d6]",
    badgeBg: "bg-[#f8f0fc] dark:bg-[#5856d6]/20",
    badgeBorder: "border-[#5856d6]/30",
    badgeTextColor: "text-[#5856d6]"
  }
];

export default function YuksekYargiGame() {
  const [items, setItems] = useState<YuksekYargiItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [solvedItems, setSolvedItems] = useState<{ item: YuksekYargiItem; selectorId: string }[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [scoreDelta, setScoreDelta] = useState<{ val: string; type: "up" | "down" } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lastAttemptStatus, setLastAttemptStatus] = useState<"correct" | "wrong" | null>(null);
  const [selectedSelector, setSelectedSelector] = useState<SelectorConfig | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [showVisualMemoryModal, setShowVisualMemoryModal] = useState(false);

  const selectorRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffled = shuffle(YUKSEK_YARGI_ITEMS);
    setItems(shuffled);
    setCurrentIdx(0);
    setSolvedItems([]);
    setScore(0);
    setCorrectCount(0);
    setIsAnswered(false);
    setLastAttemptStatus(null);
    setSelectedSelector(null);
    setIsGameFinished(false);
  };

  const currentItem = items[currentIdx];

  const handleSelectorDrop = (selector: SelectorConfig) => {
    if (isAnswered || !currentItem) return;

    setSelectedSelector(selector);
    setIsAnswered(true);

    const isMatch = currentItem.correctSelector === selector.id;

    if (isMatch) {
      setLastAttemptStatus("correct");
      setScore(s => s + 25);
      setCorrectCount(c => c + 1);
      setSolvedItems(prev => [...prev, { item: currentItem, selectorId: selector.id }]);
      setScoreDelta({ val: "+25", type: "up" });
    } else {
      setLastAttemptStatus("wrong");
      setScore(s => Math.max(0, s - 5));
      setScoreDelta({ val: "-5", type: "down" });
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < items.length) {
      setCurrentIdx(prev => prev + 1);
      setIsAnswered(false);
      setLastAttemptStatus(null);
      setSelectedSelector(null);
    } else {
      setIsGameFinished(true);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }
  };

  const totalItemsCount = items.length;
  const accuracy = totalItemsCount > 0 ? Math.round((correctCount / totalItemsCount) * 100) : 0;

  const cbSelector = SELECTORS.find(s => s.id === "CB")!;
  const tbmmSelector = SELECTORS.find(s => s.id === "TBMM")!;
  const hskSelector = SELECTORS.find(s => s.id === "HSK")!;
  const yargitayDanistaySelector = SELECTORS.find(s => s.id === "Yargıtay/Danıştay")!;
  const aymSelector = SELECTORS.find(s => s.id === "AYM")!;

  const renderSelectorCard = (selector: SelectorConfig) => {
    const selectorSolved = solvedItems.filter((s) => s.selectorId === selector.id);
    const isSelectedTarget = selectedSelector?.id === selector.id;

    return (
      <div
        key={selector.id}
        data-selector-id={selector.id}
        ref={(el) => {
          selectorRefs.current[selector.id] = el;
        }}
        onClick={() => handleSelectorDrop(selector)}
        className={`bg-white dark:bg-slate-900 rounded-[2.25rem] p-4 border-2 border-b-4 ${selector.cardBorder} ${selector.hoverBg} transition-all cursor-pointer flex flex-col justify-between shadow-xs active:translate-y-0.5 group h-[175px] overflow-hidden ${
          isSelectedTarget && lastAttemptStatus === "wrong" ? "animate-shake" : ""
        }`}
      >
        {/* Selector Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl ${selector.iconBg} flex items-center justify-center border-2 border-b-2 border-black/20 shadow-2xs shrink-0`}>
              {selector.icon}
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-slate-800 dark:text-white leading-tight">
                {selector.title}
              </h4>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 line-clamp-1">
                {selector.subtitle}
              </p>
            </div>
          </div>

          <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg border-2 border-b-2 ${selector.badgeBg} ${selector.badgeBorder} ${selector.badgeTextColor} shadow-2xs shrink-0`}>
            {selectorSolved.length} Doğru
          </span>
        </div>

        {/* Solved Items */}
        <div className="h-[92px] overflow-y-auto no-scrollbar space-y-1.5 flex flex-col justify-start pt-1">
          <AnimatePresence>
            {selectorSolved.map(({ item }) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-b-3 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-extrabold text-[11px] flex items-center justify-between gap-1.5 shadow-2xs shrink-0"
              >
                <span className="line-clamp-1">{item.question}</span>
                <Check className="w-3.5 h-3.5 text-[#58cc02] shrink-0" />
              </motion.div>
            ))}
          </AnimatePresence>

          {selectorSolved.length === 0 && (
            <div className="my-auto py-2 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-400 group-hover:border-[#5856d6] group-hover:text-[#5856d6] transition-colors">
              Seçmek için tıkla 🎯
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 pb-44">
      
      {/* ━━━ TOP CONTROL BAR ━━━ */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/etkinlik"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:border-[#5856d6] active:translate-y-0.5 transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Etkinlikler</span>
        </Link>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xs bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="font-black text-xs text-slate-400 shrink-0">
            {currentIdx + 1} / {totalItemsCount}
          </span>
          <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full flex-1 overflow-hidden border border-slate-200 dark:border-slate-700">
            <motion.div
              className="h-full bg-[#5856d6] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIdx + 1) / totalItemsCount) * 100}%` }}
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

      {/* ━━━ VISUAL MEMORY MAP TRIGGER BUTTON ━━━ */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 pl-2">
          <AppleEmoji emoji="⚖️" size={22} />
          <span className="font-black text-xs sm:text-sm text-slate-800 dark:text-white">
            Yüksek Mahkeme Üyeleri Seçim Kaynakları Simülatörü
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowVisualMemoryModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-black text-xs sm:text-sm rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-800 hover:border-[#ff9500] active:translate-y-0.5 transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#ff9500]" />
          <span>Seçim Kaynakları Tablosu</span>
          <AppleEmoji emoji="🧠" size={18} />
        </button>
      </div>

      {/* ━━━ GAME ARENA ━━━ */}
      {isGameFinished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center space-y-6"
        >
          <div className="w-24 h-24 rounded-[1.75rem] bg-[#5856d6] text-white flex items-center justify-center border-2 border-b-4 border-[#4744b8] shadow-xs">
            <AppleEmoji emoji="⚖️" size={48} />
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Tebrikler! Yüksek Yargı Seçim Kaynaklarını Tamamladın
            </h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
              Görsel Hafıza Yüksek Mahkeme Üye Seçimleri Performansı
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full pt-2">
            <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-[#ff9500] border-b-[#e08400] rounded-2xl p-4 text-center shadow-2xs">
              <div className="text-2xl font-black text-[#ff9500] flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-current" />
                <span>{score}</span>
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">Puan</div>
            </div>

            <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-[#58cc02] border-b-[#46a302] rounded-2xl p-4 text-center shadow-2xs">
              <div className="text-2xl font-black text-[#58cc02] flex items-center justify-center gap-1">
                <CheckCircle2 className="w-5 h-5" />
                <span>{correctCount} / {totalItemsCount}</span>
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">Doğru Eşleşme</div>
            </div>

            <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-[#5856d6] border-b-[#4744b8] rounded-2xl p-4 text-center shadow-2xs">
              <div className="text-2xl font-black text-[#5856d6] flex items-center justify-center gap-1">
                <Award className="w-5 h-5" />
                <span>%{accuracy}</span>
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">İsabet Oranı</div>
            </div>
          </div>

          <button
            type="button"
            onClick={initGame}
            className="w-full py-4 px-6 bg-[#58cc02] text-white font-black rounded-2xl border-2 border-b-4 border-[#46a302] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-base cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Yeniden Oyna</span>
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          
          {/* TOP ROW SELECTORS: CB (Sol Üst) & TBMM (Sağ Üst) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderSelectorCard(cbSelector)}
            {renderSelectorCard(tbmmSelector)}
          </div>

          {/* CENTER STAGE QUESTION CARD (CLICK ONLY) */}
          {currentItem && (
            <div className="space-y-2 my-2">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 sm:p-9 border-2 border-b-4 shadow-xs text-center flex flex-col items-center justify-center space-y-5 transition-all select-none cursor-default ${
                  lastAttemptStatus === "correct"
                    ? "border-[#58cc02] border-b-[#46a302] bg-[#e5f9e7] dark:bg-[#58cc02]/10"
                    : lastAttemptStatus === "wrong"
                    ? "border-[#ff4b4b] border-b-[#e03030] bg-[#ffebeb] dark:bg-[#ff4b4b]/10"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="inline-flex items-center gap-2 bg-[#f8f0fc] dark:bg-[#5856d6]/10 text-[#5856d6] font-black px-3.5 py-1.5 rounded-xl text-xs border-2 border-b-2 border-[#5856d6]/30 shadow-2xs">
                  <AppleEmoji emoji={currentItem.courtIcon} size={16} />
                  <span>{currentItem.court} • Üye Seçim Kaynağı</span>
                </div>

                <div className="space-y-1 max-w-2xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aşağıdaki Soru İçin Doğru Seçim Kaynağı Kutusuna Tıkla!</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-relaxed tracking-tight">
                    {currentItem.question}
                  </h3>
                </div>

                {currentItem.isExamTrap && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-[#ff4b4b] font-black text-xs border border-red-200 dark:border-red-500/30">
                    <AlertTriangle className="w-4 h-4 text-[#ff4b4b] shrink-0" />
                    <span>ÖSYM ÇIKTI DİKKAT! Soru Tuzak İçerebilir.</span>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* BOTTOM ROW SELECTORS: HSK (Sol Alt), Yargıtay/Danıştay (Sağ Alt), AYM (Orta Alt) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {renderSelectorCard(hskSelector)}
            {renderSelectorCard(yargitayDanistaySelector)}
            {renderSelectorCard(aymSelector)}
          </div>

        </div>
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
              lastAttemptStatus === "correct"
                ? "bg-[#e5f9e7]/95 dark:bg-slate-900/95 border-[#58cc02]"
                : "bg-[#ffebeb]/95 dark:bg-slate-900/95 border-[#ff4b4b]"
            }`}
          >
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="shrink-0 mt-0.5">
                  {lastAttemptStatus === "correct" ? (
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
                    lastAttemptStatus === "correct" ? "text-[#58cc02]" : "text-[#ff4b4b]"
                  }`}>
                    {lastAttemptStatus === "correct" 
                      ? `Harika! (${currentItem?.selectorName} - ${currentItem?.ratioOrCount})` 
                      : `Doğru Seçim Kaynağı: ${currentItem?.selectorName} (${currentItem?.ratioOrCount})`}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed max-w-xl">
                    {currentItem?.explanation}
                  </p>

                  {currentItem?.trapWarning && (
                    <div className="mt-2 p-2.5 rounded-xl bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 font-black text-xs border border-red-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{currentItem.trapWarning}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextQuestion}
                className={`w-full sm:w-auto px-8 py-4 text-white font-black rounded-2xl border-2 border-b-4 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-base cursor-pointer shadow-xs shrink-0 ${
                  lastAttemptStatus === "correct"
                    ? "bg-[#58cc02] border-[#46a302]"
                    : "bg-[#ff4b4b] border-[#e03030]"
                }`}
              >
                <span>{currentIdx + 1 === totalItemsCount ? "Sonuçları Gör" : "Devam Et"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━━ GÖRSEL HAFIZA SEÇİM KAYNAKLARI TABLOSU POPUP MODALI ━━━ */}
      <AnimatePresence>
        {showVisualMemoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setShowVisualMemoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-4xl w-full border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <AppleEmoji emoji="🧠" size={32} />
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">
                      Yüksek Mahkeme Üyeleri Seçim Kaynakları Tablosu
                    </h3>
                    <p className="text-xs font-semibold text-slate-400">
                      Ders notunuzdaki görsel hafıza şeması ve ÖSYM çıkmış soru tuzakları
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowVisualMemoryModal(false)}
                  className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-black flex items-center justify-center border-2 border-b-4 border-slate-200 dark:border-slate-700 hover:border-slate-400 cursor-pointer transition-all"
                >
                  ✕
                </button>
              </div>

              {/* DİKKAT ÖSYM KUTUSU */}
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border-2 border-b-4 border-red-500 border-b-red-600 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-2xs">
                  !
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-red-600 dark:text-red-400 uppercase tracking-wide">
                    ÇIKTI! DİKKAT (ÖSYM TUZAĞI)
                  </h4>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
                    Cumhurbaşkanı Yargıtay&apos;a üye seçmez! Yargıtay üyelerinin TAMAMINI HSK seçer. ANCAK Yargıtay Cumhuriyet Başsavcısı ve Vekilini Cumhurbaşkanı seçer.
                  </p>
                </div>
              </div>

              {/* MAHKEME TABLOSU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COURT_SUMMARIES.map((c) => (
                  <div
                    key={c.name}
                    className="p-5 rounded-3xl border-2 border-b-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <AppleEmoji emoji={c.icon} size={20} />
                        <h4 className="font-black text-sm text-slate-800 dark:text-white">{c.name}</h4>
                      </div>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#5856d6]">
                        {c.totalSeats}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-bold">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cumhurbaşkanı (CB):</span>
                        <span className="text-[#af52de] font-black">{c.cbShare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">HSK:</span>
                        <span className="text-[#10B981] font-black">{c.hskShare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">TBMM:</span>
                        <span className="text-[#1cb0f6] font-black">{c.tbmmShare}</span>
                      </div>
                      {c.otherShare !== "-" && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Diğer:</span>
                          <span className="text-[#ff9500] font-black">{c.otherShare}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      💡 {c.note}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowVisualMemoryModal(false)}
                  className="py-3.5 px-8 bg-[#5856d6] text-white font-black rounded-2xl border-2 border-b-4 border-[#4744b8] active:translate-y-0.5 transition-all text-sm cursor-pointer shadow-xs"
                >
                  Anladım, Oyuna Başla!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
