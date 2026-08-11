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
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight
} from "lucide-react";
import { TBMM_VOTE_ITEMS, TbmmVoteItem } from "@/lib/tbmmData";
import AppleEmoji from "@/components/AppleEmoji";

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

interface BucketConfig {
  id: string;
  voteValue: number | "mix";
  title: string;
  subtitle: string;
  positionLabel: string;
  dirIcon: React.ReactNode;
  mainColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeTextColor: string;
  cardBorder: string;
  hoverBg: string;
  iconBg: string;
  iconBorder: string;
}

const BUCKETS: BucketConfig[] = [
  {
    id: "b-151-200",
    voteValue: "mix",
    title: "151 & 200 Oy",
    subtitle: "Toplantı & Karar Yeter Sayısı",
    positionLabel: "Sol Üst",
    dirIcon: <ArrowUpLeft className="w-4.5 h-4.5 text-[#58cc02]" />,
    badgeBg: "bg-[#e5f9e7] dark:bg-[#58cc02]/20",
    badgeBorder: "border-[#58cc02]/30",
    badgeTextColor: "text-[#58cc02]",
    cardBorder: "border-2 border-b-4 border-[#58cc02] border-b-[#46a302]",
    hoverBg: "hover:bg-[#f4fcf5] dark:hover:bg-[#58cc02]/10",
    iconBg: "bg-[#58cc02]",
    iconBorder: "border-[#46a302]",
    mainColor: "#58cc02"
  },
  {
    id: "b-301",
    voteValue: 301,
    title: "301 Oy",
    subtitle: "Salt Çoğunluk (301)",
    positionLabel: "Sağ Üst",
    dirIcon: <ArrowUpRight className="w-4.5 h-4.5 text-[#1cb0f6]" />,
    badgeBg: "bg-[#e8f7fe] dark:bg-[#1cb0f6]/20",
    badgeBorder: "border-[#1cb0f6]/30",
    badgeTextColor: "text-[#1cb0f6]",
    cardBorder: "border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6]",
    hoverBg: "hover:bg-[#f2fbff] dark:hover:bg-[#1cb0f6]/10",
    iconBg: "bg-[#1cb0f6]",
    iconBorder: "border-[#1899d6]",
    mainColor: "#1cb0f6"
  },
  {
    id: "b-360",
    voteValue: 360,
    title: "360 Oy",
    subtitle: "Beşte Üç Çoğunluk (3/5)",
    positionLabel: "Sol Alt",
    dirIcon: <ArrowDownLeft className="w-4.5 h-4.5 text-[#ff9500]" />,
    badgeBg: "bg-[#fff8f0] dark:bg-[#ff9500]/20",
    badgeBorder: "border-[#ff9500]/30",
    badgeTextColor: "text-[#ff9500]",
    cardBorder: "border-2 border-b-4 border-[#ff9500] border-b-[#e08400]",
    hoverBg: "hover:bg-[#fffcf7] dark:hover:bg-[#ff9500]/10",
    iconBg: "bg-[#ff9500]",
    iconBorder: "border-[#e08400]",
    mainColor: "#ff9500"
  },
  {
    id: "b-400",
    voteValue: 400,
    title: "400 Oy",
    subtitle: "Üçte İki Çoğunluk (2/3)",
    positionLabel: "Sağ Alt",
    dirIcon: <ArrowDownRight className="w-4.5 h-4.5 text-[#af52de]" />,
    badgeBg: "bg-[#fcf0ff] dark:bg-[#af52de]/20",
    badgeBorder: "border-[#af52de]/30",
    badgeTextColor: "text-[#af52de]",
    cardBorder: "border-2 border-b-4 border-[#af52de] border-b-[#963bbb]",
    hoverBg: "hover:bg-[#fdf8ff] dark:hover:bg-[#af52de]/10",
    iconBg: "bg-[#af52de]",
    iconBorder: "border-[#963bbb]",
    mainColor: "#af52de"
  }
];

export default function TbmmYeterSayilariGame() {
  const [dragItems, setDragItems] = useState<TbmmVoteItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [solvedItems, setSolvedItems] = useState<{ item: TbmmVoteItem; bucketId: string }[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [scoreDelta, setScoreDelta] = useState<{ val: string; type: "up" | "down" } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lastAttemptStatus, setLastAttemptStatus] = useState<"correct" | "wrong" | null>(null);
  const [selectedBucket, setSelectedBucket] = useState<BucketConfig | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [showVisualMemoryModal, setShowVisualMemoryModal] = useState(false);

  const bucketRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffled = shuffle(TBMM_VOTE_ITEMS);
    setDragItems(shuffled);
    setCurrentIdx(0);
    setSolvedItems([]);
    setScore(0);
    setCorrectCount(0);
    setIsAnswered(false);
    setLastAttemptStatus(null);
    setSelectedBucket(null);
    setIsGameFinished(false);
  };

  const currentItem = dragItems[currentIdx];

  const checkBucketMatch = (item: TbmmVoteItem, bucket: BucketConfig) => {
    if (bucket.voteValue === "mix") {
      return item.requiredVotes === 151 || item.requiredVotes === 200;
    }
    return item.requiredVotes === bucket.voteValue;
  };

  const handleBucketDrop = (bucket: BucketConfig) => {
    if (isAnswered || !currentItem) return;

    setSelectedBucket(bucket);
    setIsAnswered(true);

    const isMatch = checkBucketMatch(currentItem, bucket);

    if (isMatch) {
      setLastAttemptStatus("correct");
      setScore(s => s + 25);
      setCorrectCount(c => c + 1);
      setSolvedItems(prev => [...prev, { item: currentItem, bucketId: bucket.id }]);
      setScoreDelta({ val: "+25", type: "up" });
    } else {
      setLastAttemptStatus("wrong");
      setScore(s => Math.max(0, s - 5));
      setScoreDelta({ val: "-5", type: "down" });
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < dragItems.length) {
      setCurrentIdx(prev => prev + 1);
      setIsAnswered(false);
      setLastAttemptStatus(null);
      setSelectedBucket(null);
    } else {
      setIsGameFinished(true);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }
  };

  const totalItemsCount = dragItems.length;
  // Accuracy calculation strictly according to site rules: (Doğru / Toplam Soru Sayısı) * 100
  const accuracy = totalItemsCount > 0 ? Math.round((correctCount / totalItemsCount) * 100) : 0;

  const bucket151 = BUCKETS.find(b => b.id === "b-151-200")!;
  const bucket301 = BUCKETS.find(b => b.id === "b-301")!;
  const bucket360 = BUCKETS.find(b => b.id === "b-360")!;
  const bucket400 = BUCKETS.find(b => b.id === "b-400")!;

  const renderBucketCard = (bucket: BucketConfig) => {
    const bucketSolved = solvedItems.filter((s) => s.bucketId === bucket.id);
    const isSelectedTarget = selectedBucket?.id === bucket.id;

    return (
      <div
        key={bucket.id}
        data-bucket-id={bucket.id}
        ref={(el) => {
          bucketRefs.current[bucket.id] = el;
        }}
        onClick={() => handleBucketDrop(bucket)}
        className={`bg-white dark:bg-slate-900 rounded-[2.25rem] p-4 border-2 border-b-4 ${bucket.cardBorder} ${bucket.hoverBg} transition-all cursor-pointer flex flex-col justify-between shadow-xs active:translate-y-0.5 group h-[175px] overflow-hidden ${
          isSelectedTarget && lastAttemptStatus === "wrong" ? "animate-shake" : ""
        }`}
      >
        {/* Bucket Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl ${bucket.iconBg} text-white font-black text-xs flex items-center justify-center border-2 border-b-2 ${bucket.iconBorder} shadow-2xs shrink-0`}>
              ✓
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h4 className="font-black text-xs sm:text-sm text-slate-800 dark:text-white leading-tight">
                  {bucket.title}
                </h4>
                {bucket.dirIcon}
              </div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 line-clamp-1">
                {bucket.subtitle}
              </p>
            </div>
          </div>

          <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg border-2 border-b-2 ${bucket.badgeBg} ${bucket.badgeBorder} ${bucket.badgeTextColor} shadow-2xs shrink-0`}>
            {bucketSolved.length} Madde
          </span>
        </div>

        {/* Solved Items in Bucket (Fixed Inner Scroll) */}
        <div className="h-[92px] overflow-y-auto no-scrollbar space-y-1.5 flex flex-col justify-start pt-1">
          <AnimatePresence>
            {bucketSolved.map(({ item }) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-b-3 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-extrabold text-[11px] flex items-center justify-between gap-1.5 shadow-2xs shrink-0"
              >
                <span className="line-clamp-1">{item.title}</span>
                <Check className="w-3.5 h-3.5 text-[#58cc02] shrink-0" />
              </motion.div>
            ))}
          </AnimatePresence>

          {bucketSolved.length === 0 && (
            <div className="my-auto py-2 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-400 group-hover:border-[#5856d6] group-hover:text-[#5856d6] transition-colors">
              Seçmek için buraya tıkla 🎯
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
        {/* Back Button */}
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
          <AppleEmoji emoji="🏛️" size={22} />
          <span className="font-black text-xs sm:text-sm text-slate-800 dark:text-white">
            Mekânsal Hafıza Arenası (Sürükle & Bırak)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowVisualMemoryModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-black text-xs sm:text-sm rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-800 hover:border-[#ff9500] active:translate-y-0.5 transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#ff9500]" />
          <span>Görsel Hafıza Haritası</span>
          <AppleEmoji emoji="🧠" size={18} />
        </button>
      </div>

      {/* ━━━ SPATIAL VISUAL MEMORY COMPASS ARENA (4 CORNERS + CENTER STAGE) ━━━ */}
      {isGameFinished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center space-y-6"
        >
          <div className="w-24 h-24 rounded-[1.75rem] bg-[#5856d6] text-white flex items-center justify-center border-2 border-b-4 border-[#4744b8] shadow-xs">
            <AppleEmoji emoji="🏛️" size={48} />
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Tebrikler! Tüm Meclis Kararlarını Eşleştirdin
            </h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
              Mekânsal Görsel Hafıza TBMM Yeter Sayıları Performansı
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
          
          {/* ━━━ TOP ROW BUCKETS: SOL ÜST (151/200) & SAĞ ÜST (301) ━━━ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderBucketCard(bucket151)}
            {renderBucketCard(bucket301)}
          </div>

          {/* ━━━ CENTER STAGE QUESTION CARD (CLICK ONLY) ━━━ */}
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
                  <AppleEmoji emoji="🏛️" size={16} />
                  <span>TBMM KARAR MADDESİ</span>
                </div>

                <div className="space-y-1 max-w-2xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aşağıdaki Meclis Kararı İçin Doğru Oy Kutusuna Tıkla!</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-relaxed tracking-tight">
                    {currentItem.title}
                  </h3>
                </div>
              </motion.div>
            </div>
          )}

          {/* ━━━ BOTTOM ROW BUCKETS: SOL ALT (360) & SAĞ ALT (400) ━━━ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderBucketCard(bucket360)}
            {renderBucketCard(bucket400)}
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
                      ? `Harika Eşleşme! (${currentItem?.majorityName})` 
                      : `Doğru Yeter Sayısı: ${currentItem?.majorityName}`}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed max-w-xl">
                    {currentItem?.explanation}
                  </p>
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

      {/* ━━━ GÖRSEL HAFIZA HARİTASI POPUP MODALI ━━━ */}
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
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-3xl w-full border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#ff9500] text-white flex items-center justify-center border-2 border-b-4 border-[#e08400] shadow-xs">
                    <AppleEmoji emoji="🧠" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">
                      TBMM Yeter Sayıları Görsel Hafıza Haritası
                    </h3>
                    <p className="text-xs font-semibold text-slate-400">
                      Sınavda akılda kalıcılığı artırmak için renk ve konum kodlu zihinsel şema
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

              {/* 4 Renk ve Konum Kodlu Hafıza Grubu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 151 & 200 - SOL ÜST */}
                <div className="bg-[#f4fcf5] dark:bg-[#58cc02]/10 p-5 rounded-3xl border-2 border-b-4 border-[#58cc02] border-b-[#46a302] space-y-2">
                  <div className="flex items-center justify-between font-black text-sm text-[#58cc02]">
                    <span>🟢 151 & 200 Oy (↖️ SOL ÜST)</span>
                    <span className="text-[11px] bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-lg border border-[#58cc02]/40">
                      TYS & KYS
                    </span>
                  </div>
                  <ul className="text-xs font-bold text-slate-700 dark:text-slate-200 space-y-1 pt-1 list-disc list-inside">
                    <li>TBMM Toplantı Yeter Sayısı (TYS = 200)</li>
                    <li>Karar Yeter Sayısı Alt Sınırı (KYS = 151)</li>
                  </ul>
                </div>

                {/* 301 - SAĞ ÜST */}
                <div className="bg-[#f2fbff] dark:bg-[#1cb0f6]/10 p-5 rounded-3xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] space-y-2">
                  <div className="flex items-center justify-between font-black text-sm text-[#1cb0f6]">
                    <span>🔵 301 Oy (↗️ SAĞ ÜST)</span>
                    <span className="text-[11px] bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-lg border border-[#1cb0f6]/40">
                      Salt Çoğunluk
                    </span>
                  </div>
                  <ul className="text-xs font-bold text-slate-700 dark:text-slate-200 space-y-1 pt-1 list-disc list-inside">
                    <li>Meclis Başkanı Seçimi 3. Turu</li>
                    <li>Kamu Başdenetçisi Seçimi 3. Turu</li>
                    <li>Devamsızlık Nedeniyle Düşürülme</li>
                    <li>CB Veto Edilen Kanunun Aynen Kabulü</li>
                    <li>AYM Üye Seçimi 2. Turu</li>
                    <li>Meclis Soruşturması Önergesi</li>
                  </ul>
                </div>

                {/* 360 - SOL ALT */}
                <div className="bg-[#fffcf7] dark:bg-[#ff9500]/10 p-5 rounded-3xl border-2 border-b-4 border-[#ff9500] border-b-[#e08400] space-y-2">
                  <div className="flex items-center justify-between font-black text-sm text-[#ff9500]">
                    <span>🟠 360 Oy (↙️ SOL ALT)</span>
                    <span className="text-[11px] bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-lg border border-[#ff9500]/40">
                      3/5 Çoğunluk
                    </span>
                  </div>
                  <ul className="text-xs font-bold text-slate-700 dark:text-slate-200 space-y-1 pt-1 list-disc list-inside">
                    <li>Genel ve Özel Af Kanun Oylaması</li>
                    <li>Anayasa Değişikliği Kabulü</li>
                    <li>TBMM Seçimlerinin Yenilenmesi (Erken Seçim)</li>
                    <li>Meclis Soruşturması Açılması Kararı</li>
                    <li>HSK Üye Seçimi 2. Turu</li>
                  </ul>
                </div>

                {/* 400 - SAĞ ALT */}
                <div className="bg-[#fdf8ff] dark:bg-[#af52de]/10 p-5 rounded-3xl border-2 border-b-4 border-[#af52de] border-b-[#963bbb] space-y-2">
                  <div className="flex items-center justify-between font-black text-sm text-[#af52de]">
                    <span>🟣 400 Oy (↘️ SAĞ ALT)</span>
                    <span className="text-[11px] bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-lg border border-[#af52de]/40">
                      2/3 Çoğunluk
                    </span>
                  </div>
                  <ul className="text-xs font-bold text-slate-700 dark:text-slate-200 space-y-1 pt-1 list-disc list-inside">
                    <li>Meclis Başkanı Seçimi 1. ve 2. Turu</li>
                    <li>Kamu Başdenetçisi Seçimi 1. ve 2. Turu</li>
                    <li>HSK Üye Seçimi 1. Turu</li>
                    <li>Anayasa Değişikliğinin Doğrudan Onaylanması</li>
                    <li>Yüce Divan'a Sevk Kararı</li>
                    <li>AYM Üye Seçimi 1. Turu</li>
                  </ul>
                </div>
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
