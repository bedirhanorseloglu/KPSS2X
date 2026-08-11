"use client";

import React, { useState } from "react";
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
  FileText,
  Landmark,
  ShieldAlert,
  Building2,
  CheckCheck,
  Scale
} from "lucide-react";
import AppleEmoji from "@/components/AppleEmoji";

interface Stage {
  id: number;
  stageTitle: string;
  stageBadge: string;
  iconEmoji: string;
  storyText: string;
  question: string;
  options: { label: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

const STAGES: Stage[] = [
  {
    id: 1,
    stageTitle: "1. Aşama: Teklif Hazırlığı",
    stageBadge: "Kanun Teklif Etme Yetkisi",
    iconEmoji: "📜",
    storyText: "TBMM'ye sunulmak üzere yeni bir 'Yapay Zeka ve Siber Güvenlik Kanunu' taslağı hazırlandı.",
    question: "Türkiye Cumhuriyeti Anayasası'na göre kanun teklif etmeye yetkili kılınan merci kimdir?",
    options: [
      { label: "A", text: "Cumhurbaşkanı", isCorrect: false },
      { label: "B", text: "En az 1 Milletvekili", isCorrect: true },
      { label: "C", text: "İçişleri Bakanı", isCorrect: false },
      { label: "D", text: "Danıştay Başkanı", isCorrect: false },
      { label: "E", text: "Adalet Bakanlığı Yüksek Disiplin Kurulu", isCorrect: false }
    ],
    explanation: "2017 değişikliğiyle bakanlıklar ve Bakanlar Kurulu kaldırılmıştır. Kanun teklif etmeye YALNIZCA milletvekilleri yetkilidir (İstisna: Bütçe Kanun teklifini Cumhurbaşkanı sunar)."
  },
  {
    id: 2,
    stageTitle: "2. Aşama: Komisyon İncelemesi",
    stageBadge: "İhtisas Komisyonu Havalesi",
    iconEmoji: "🔍",
    storyText: "Milletvekilleri hazırladıkları kanun teklifini TBMM Başkanlığı'na sundu.",
    question: "TBMM Başkanlığı gelen teklifi ayrıntılı incelemek ve raporlaştırmak üzere öncelikle nereye havale eder?",
    options: [
      { label: "A", text: "İlgili İhtisas Komisyonuna (Adalet/İçişleri Komisyonu vb.)", isCorrect: true },
      { label: "B", text: "Doğrudan Anayasa Mahkemesine", isCorrect: false },
      { label: "C", text: "Devlet Denetleme Kuruluna", isCorrect: false },
      { label: "D", text: "Yargıtay Cumhuriyet Başsavcılığına", isCorrect: false },
      { label: "E", text: "Cumhurbaşkanlığı Kararlar Dairesine", isCorrect: false }
    ],
    explanation: "TBMM Başkanlığına sunulan teklifler doğrudan Genel Kurula gelmez; önce uzmanlık alanına göre ilgili İhtisas Komisyonuna havale edilerek rapor hazırlanır."
  },
  {
    id: 3,
    stageTitle: "3. Aşama: Genel Kurul Oylaması",
    stageBadge: "Toplantı & Karar Yetersayısı",
    iconEmoji: "🏛️",
    storyText: "Komisyon raporu tamamlandı ve teklif 600 sandalyeli TBMM Genel Kurulu gündemine alındı.",
    question: "Olağan bir kanunun görüşülebilmesi ve kabul edilebilmesi için gereken Toplantı (TYS) ve Karar Yetersayısı (KYS) kuralı nedir?",
    options: [
      { label: "A", text: "En az 200 vekil toplanır (ÜTS 1/3) - Katılanların basit çoğunluğu (en az 151 kabul) yeterlidir", isCorrect: true },
      { label: "B", text: "En az 301 vekil toplanır - 400 vekilin evet oyu gerekir", isCorrect: false },
      { label: "C", text: "En az 400 vekil toplanır - Nitelikli 2/3 çoğunluk aranır", isCorrect: false },
      { label: "D", text: "En az 100 vekil toplanır - Oy birliği şarttır", isCorrect: false },
      { label: "E", text: "Toplantı yeter sayısı aranmaz - 51 kabul oyu kafi gelir", isCorrect: false }
    ],
    explanation: "Anayasa m.96 uyarınca TBMM Üye Tam Sayısının (600) en az 1/3'ü olan 200 vekil ile toplanır. Karar için katılanların salt çoğunluğu yeterlidir ancak kabul oyu ÜTS'nin 1/4'ünün 1 fazlasından (151) az olamaz."
  },
  {
    id: 4,
    stageTitle: "4. Aşama: Cumhurbaşkanı Onayı & Veto",
    stageBadge: "Yayımlama veya Geri Gönderme",
    iconEmoji: "✍️",
    storyText: "Teklif Genel Kurulda 180 EVET oyuyla kabul edilip 'Kanun'laştı ve Cumhurbaşkanlığına gönderildi.",
    question: "Cumhurbaşkanının kanunu inceleme süresi kaç gündür ve kanunu veto ederse TBMM'nin kanunu aynen kabul etmesi için kaç oy gerekir?",
    options: [
      { label: "A", text: "15 gün inceleme - TBMM Üye Tam Sayısının Salt Çoğunluğu (301 Oy)", isCorrect: true },
      { label: "B", text: "7 gün inceleme - Katılanların basit çoğunluğu (151 Oy)", isCorrect: false },
      { label: "C", text: "30 gün inceleme - Nitelikli 400 Oy", isCorrect: false },
      { label: "D", text: "10 gün inceleme - 200 Oy", isCorrect: false },
      { label: "E", text: "60 gün inceleme - 360 Oy", isCorrect: false }
    ],
    explanation: "Cumhurbaşkanı 15 gün içinde yayımlar veya veto eder. Cumhurbaşkanınca veto edilen kanunun TBMM tarafından yeniden aynen kabul edilebilmesi için üye tam sayısının salt çoğunluğu (en az 301 oy) aranır."
  },
  {
    id: 5,
    stageTitle: "5. Aşama: Resmi Gazete & Yürürlük",
    stageBadge: "Yürürlük Tarihi Kuralı",
    iconEmoji: "📰",
    storyText: "Cumhurbaşkanı kanunu onayladı ve kanun Resmi Gazete'de yayımlandı.",
    question: "Metninde veya içeriğinde açıkça özel bir yürürlük tarihi belirtilmeyen kanunlar ne zaman yürürlüğe girer?",
    options: [
      { label: "A", text: "Resmi Gazete'de Yayımlandığı Gün", isCorrect: true },
      { label: "B", text: "Yayımlandığı tarihten 45 gün sonra", isCorrect: false },
      { label: "C", text: "Yayımlandığı tarihi takip eden ayın 1. günü", isCorrect: false },
      { label: "D", text: "Yayımlandığı tarihten 30 gün sonra", isCorrect: false },
      { label: "E", text: "Yayımlandığı yılın son günü", isCorrect: false }
    ],
    explanation: "Eski 45 günlük kural kaldırılmıştır! Yürürlük tarihi belirtilmeyen kanunlar Resmi Gazete'de yayımlandıkları GÜN doğrudan yürürlüğe girer."
  },
  {
    id: 6,
    stageTitle: "6. Aşama: Anayasa Yargısı (İptal Davası)",
    stageBadge: "AYM İptal Süreci (Soyut Norm)",
    iconEmoji: "⚖️",
    storyText: "Yürürlüğe giren kanunun bazı maddelerinin Anayasa'ya aykırı olduğu iddia ediliyor.",
    question: "Kanunların Anayasa'ya aykırılığı gerekçesiyle Anayasa Mahkemesi'ne (AYM) iptal davası yayımdan itibaren kaç gün içinde açılabilir?",
    options: [
      { label: "A", text: "Yayımdan itibaren 60 gün içinde (CB, 2 Parti Grubu veya 1/5 Milletvekili)", isCorrect: true },
      { label: "B", text: "Yayımdan itibaren 30 gün içinde (Sadece Danıştay)", isCorrect: false },
      { label: "C", text: "Yayımdan itibaren 15 gün içinde (Herhangi bir vatandaş)", isCorrect: false },
      { label: "D", text: "Yayımdan itibaren 90 gün içinde (Sayıştay ve Barolar)", isCorrect: false },
      { label: "E", text: "Yayımdan itibaren 10 gün içinde (Yargıtay Başsavcısı)", isCorrect: false }
    ],
    explanation: "Kanunların hem esas hem şekil bakımından AYM'ye iptal davası açma süresi yayımdan itibaren 60 GÜNDÜR. İptal davası açmaya yetkililer: Cumhurbaşkanı, En çok üyeye sahip 2 siyasi parti grubu ve TBMM üye tam sayısının en az 1/5'i (120 milletvekili)."
  }
];

export default function KanununYolculuguGame() {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameState, setGameState] = useState<"playing" | "finished">("playing");
  const [scoreDelta, setScoreDelta] = useState<{ val: string; type: "up" | "down" } | null>(null);

  const currentStage = STAGES[currentStageIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOptionIdx(idx);
    setIsAnswered(true);

    const isCorrect = currentStage.options[idx].isCorrect;

    if (isCorrect) {
      setScore((s) => s + 20);
      setCorrectAnswersCount((c) => c + 1);
      setScoreDelta({ val: "+20", type: "up" });
    } else {
      setScore((s) => Math.max(0, s - 5));
      setScoreDelta({ val: "-5", type: "down" });
    }
  };

  const handleNextStage = () => {
    if (currentStageIdx + 1 < STAGES.length) {
      setCurrentStageIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
    } else {
      setGameState("finished");
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }
  };

  const resetGame = () => {
    setCurrentStageIdx(0);
    setScore(0);
    setCorrectAnswersCount(0);
    setSelectedOptionIdx(null);
    setIsAnswered(false);
    setGameState("playing");
  };

  const totalStages = STAGES.length;
  // Accuracy calculation strictly according to site rules: (Doğru / Toplam Soru Sayısı) * 100
  const accuracy = totalStages > 0 ? Math.round((correctAnswersCount / totalStages) * 100) : 0;
  const isCurrentCorrect = selectedOptionIdx !== null && currentStage.options[selectedOptionIdx]?.isCorrect;

  if (gameState === "finished") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center space-y-6"
      >
        {/* 3D Trophy Badge */}
        <div className="w-24 h-24 rounded-[1.75rem] bg-[#5856d6] text-white flex items-center justify-center border-2 border-b-4 border-[#4744b8] shadow-xs">
          <AppleEmoji emoji="🏛️" size={48} />
        </div>

        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Kanun Resmi Gazete'de Yayımlandı!
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
            TBMM Kanun Yapım & Anayasal Süreç Labirenti Sonucu
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
              <span>{correctAnswersCount} / {totalStages}</span>
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">Başarılı Aşama</div>
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
            onClick={resetGame}
            className="w-full py-4 px-6 bg-[#58cc02] text-white font-black rounded-2xl border-2 border-b-4 border-[#46a302] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-base cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Yeniden Oyna</span>
          </button>

          <Link
            href="/etkinlik"
            className="w-full py-4 px-6 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-base cursor-pointer text-center shadow-xs"
          >
            <span>Etkinliklere Dön</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6 pb-44">
      
      {/* ━━━ TOP CONTROL BAR (Unified Header) ━━━ */}
      <div className="flex items-center justify-between gap-4">
        {/* Back Button */}
        <Link
          href="/etkinlik"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:border-[#5856d6] active:translate-y-0.5 transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Etkinlikler</span>
        </Link>

        {/* Integrated Progress Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="font-black text-xs text-slate-400 shrink-0">
            Aşama {currentStageIdx + 1} / {totalStages}
          </span>
          <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full flex-1 overflow-hidden border border-slate-200 dark:border-slate-700">
            <motion.div
              className="h-full bg-[#5856d6] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStageIdx + 1) / totalStages) * 100}%` }}
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

      {/* ━━━ STAGE ROADMAP STEPPER CHIPS ━━━ */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-800 w-full shadow-2xs gap-1.5 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x flex-nowrap">
        {STAGES.map((stg, i) => {
          const isDone = i < currentStageIdx;
          const isCurrent = i === currentStageIdx;

          return (
            <div
              key={stg.id}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-xs transition-all whitespace-nowrap border-2 border-b-4 shrink-0 ${
                isCurrent
                  ? "bg-white dark:bg-slate-800 border-[#5856d6] border-b-[#4744b8] text-[#5856d6] shadow-xs"
                  : isDone
                  ? "bg-[#e5f9e7] dark:bg-[#58cc02]/10 border-[#58cc02] border-b-[#46a302] text-[#58cc02]"
                  : "text-slate-400 border-transparent"
              }`}
            >
              <AppleEmoji emoji={stg.iconEmoji} size={16} />
              <span>{i + 1}. {stg.stageBadge}</span>
            </div>
          );
        })}
      </div>

      {/* ━━━ MAIN STAGE ARENA CARD ━━━ */}
      {currentStage && (
        <motion.div
          key={currentStage.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden"
        >
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#5856d6]" />

          {/* Stage Header Info */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="inline-flex items-center gap-2 bg-[#f8f0fc] dark:bg-[#5856d6]/10 text-[#5856d6] font-black px-3.5 py-1.5 rounded-xl text-xs border-2 border-b-2 border-[#5856d6]/30 shadow-2xs">
              <AppleEmoji emoji={currentStage.iconEmoji} size={16} />
              <span>{currentStage.stageTitle}</span>
            </span>

            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Aşama {currentStageIdx + 1} / {totalStages}
            </span>
          </div>

          {/* Story Context Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 shrink-0">
              <FileText className="w-5 h-5 text-[#5856d6]" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
              {currentStage.storyText}
            </p>
          </div>

          {/* Question Text */}
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-relaxed tracking-tight">
            {currentStage.question}
          </h3>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {currentStage.options.map((opt, idx) => {
              const isSelected = selectedOptionIdx === idx;
              const isCorrectOpt = opt.isCorrect;
              const isLastOddOption = currentStage.options.length % 2 !== 0 && idx === currentStage.options.length - 1;

              let btnStyle = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-[#5856d6]";
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
                  key={opt.text}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border-2 border-b-4 transition-all flex items-center gap-3 font-bold text-sm sm:text-base cursor-pointer shadow-2xs ${
                    isLastOddOption ? "md:col-span-2 justify-center" : "justify-between"
                  } ${isAnswered ? "" : "active:translate-y-0.5"} ${btnStyle}`}
                >
                  <div className={`flex items-center gap-3.5 ${isLastOddOption ? "mx-auto" : ""}`}>
                    <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 border-2 border-b-2 transition-colors ${badgeStyle}`}>
                      {opt.label}
                    </span>
                    <span className="leading-snug">{opt.text}</span>
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
                    {isCurrentCorrect ? "Harika Adım! Doğru Karar" : "Yanlış Karar!"}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed max-w-xl">
                    {currentStage.explanation}
                  </p>
                </div>
              </div>

              {/* Right Side: Next Question 3D Push Button */}
              <button
                type="button"
                onClick={handleNextStage}
                className={`w-full sm:w-auto px-8 py-4 text-white font-black rounded-2xl border-2 border-b-4 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-base cursor-pointer shadow-xs shrink-0 ${
                  isCurrentCorrect
                    ? "bg-[#58cc02] border-[#46a302]"
                    : "bg-[#ff4b4b] border-[#e03030]"
                }`}
              >
                <span>{currentStageIdx + 1 === totalStages ? "Sonuçları Gör" : "Sonraki Aşama"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
