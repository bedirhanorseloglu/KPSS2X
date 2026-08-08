"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppleEmoji from "../AppleEmoji";
import { formatNet, estimateP3Score } from "@/lib/denemeUtils";
import * as Slider from "@radix-ui/react-slider";
import { Search, ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TYPES
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

type Props = {
  currentAvgNet: number;
  bestNet: number;
  targetNet: number;
  onTargetNetChange?: (value: number) => void;
  isReadOnly?: boolean;
};

export type Profession = {
  id: string;
  title: string;
  category: "muhendislik" | "saglik" | "idari" | "diger";
  categoryLabel: string;
  icon: string;
  minP3: number;
  targetNet: number;
  minRankTarget: number;
  description: string;
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ÖSYM RESMİ VERİ SETİ (2025/1 + 2025/2 + 2026/1 Birleşik)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const PROFESSIONS: Profession[] = [
  {
    id: "yazilim_muh",
    title: "Yazılım Mühendisi",
    category: "muhendislik",
    categoryLabel: "Nitelik: 4539 / 4531",
    icon: "💻",
    minP3: 83.25,
    targetNet: 72.5,
    minRankTarget: 17000,
    description: "KPSS-2026/1 Et ve Süt Kurumu (Ankara) en düşük: 83.25 P3 · 7 Kontenjan",
  },
  {
    id: "avukat",
    title: "Avukat / Hukuk Müşaviri",
    category: "idari",
    categoryLabel: "Nitelik: 4419",
    icon: "⚖️",
    minP3: 90.88,
    targetNet: 93.0,
    minRankTarget: 2400,
    description: "Son 3 dönem: 243 kadro · Ort. 90.88 P3 · En düşük 90.00 P3",
  },
  {
    id: "mimar",
    title: "Mimar / Şehir Plancısı",
    category: "muhendislik",
    categoryLabel: "Nitelik: 4747-4757",
    icon: "📐",
    minP3: 90.15,
    targetNet: 89.5,
    minRankTarget: 3100,
    description: "Son 3 dönem: 64 kadro · Ort. 90.15 P3",
  },
  {
    id: "psikolog",
    title: "Psikolog / Sosyal Hizmet",
    category: "diger",
    categoryLabel: "Sosyal Hizmet Kadroları",
    icon: "🧠",
    minP3: 88.75,
    targetNet: 86.0,
    minRankTarget: 4500,
    description: "Son 3 dönem: Ort. 88.75 P3",
  },
  {
    id: "muhendislik",
    title: "Mühendislik (Genel)",
    category: "muhendislik",
    categoryLabel: "Nitelik: 4611 / 4685",
    icon: "⚡",
    minP3: 84.85,
    targetNet: 76.2,
    minRankTarget: 13500,
    description: "Son 3 dönem: 1.011 kadro · Ort. 84.85 P3 · En düşük 61.00 P3",
  },
  {
    id: "memur",
    title: "Düz Memur / VHKİ",
    category: "idari",
    categoryLabel: "Nitelik: 4001",
    icon: "🏛️",
    minP3: 81.10,
    targetNet: 66.8,
    minRankTarget: 23500,
    description: "Son 3 dönem: 519 kadro · Ort. 81.10 P3 · En düşük 68.00 P3",
  },
  {
    id: "bilgisayar_isletmeni",
    title: "Bilgisayar İşletmeni",
    category: "idari",
    categoryLabel: "Bilişim & Büro",
    icon: "🖥️",
    minP3: 78.64,
    targetNet: 60.7,
    minRankTarget: 38000,
    description: "Son 3 dönem: 51 kadro · Ort. 78.64 P3 · En düşük 70.00 P3",
  },
  {
    id: "hemsire",
    title: "Hemşire / Sağlık Lisansiyeri",
    category: "saglik",
    categoryLabel: "Sağlık Kadroları",
    icon: "🩺",
    minP3: 74.50,
    targetNet: 50.3,
    minRankTarget: 70000,
    description: "Son 3 dönem: 15 kadro · Ort. 74.50 P3 · En düşük 72.00 P3",
  },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ÖSYM TAHMİNİ SIRALAMA HESAPLAMA
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function calculateRankEstimates(net: number) {
  const safeNet = Math.max(0, Math.min(120, net));
  const p3 = estimateP3Score(safeNet);

  let minRank = 1, maxRank = 1, percentile = 99.9;

  if (safeNet >= 105) {
    minRank = Math.max(1, Math.round(50 + (120 - safeNet) * 40));
    maxRank = Math.round(minRank * 1.4); percentile = 99.8;
  } else if (safeNet >= 95) {
    minRank = Math.round(450 + (105 - safeNet) * 185);
    maxRank = Math.round(minRank * 1.35); percentile = 99.2;
  } else if (safeNet >= 85) {
    minRank = Math.round(2300 + (95 - safeNet) * 1250);
    maxRank = Math.round(minRank * 1.3); percentile = 96.5;
  } else if (safeNet >= 75) {
    minRank = Math.round(14800 + (85 - safeNet) * 4200);
    maxRank = Math.round(minRank * 1.25); percentile = 88.0;
  } else if (safeNet >= 65) {
    minRank = Math.round(56800 + (75 - safeNet) * 9800);
    maxRank = Math.round(minRank * 1.2); percentile = 72.0;
  } else {
    minRank = Math.round(154800 + (65 - safeNet) * 14000);
    maxRank = Math.round(minRank * 1.15);
    percentile = Math.max(10, Math.round((safeNet / 65) * 60));
  }

  return { p3, minRank, maxRank, percentile };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function RankSimulator({
  currentAvgNet, bestNet, targetNet, onTargetNetChange, isReadOnly = false,
}: Props) {
  const { user } = useAuth();
  const isBedirhanUser = user?.email?.toLowerCase().includes("denemebedo6161") || user?.email?.toLowerCase().includes("bedo6161");

  const [selectedProfessionId, setSelectedProfessionId] = useState<string>(isBedirhanUser ? "yazilim_muh" : "memur");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isBedirhanUser) setSelectedProfessionId("yazilim_muh");
  }, [isBedirhanUser]);

  const prof = useMemo(() => PROFESSIONS.find((p) => p.id === selectedProfessionId) || PROFESSIONS[0], [selectedProfessionId]);
  const filtered = useMemo(() => PROFESSIONS.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase())
  ), [searchTerm]);

  const cur = useMemo(() => calculateRankEstimates(currentAvgNet), [currentAvgNet]);
  const tgt = useMemo(() => calculateRankEstimates(targetNet), [targetNet]);

  const remainingNet = Math.max(0, Math.round((targetNet - currentAvgNet) * 100) / 100);
  const rankGain = Math.max(0, cur.minRank - tgt.minRank);
  const isQualified = tgt.p3 >= prof.minP3;
  const p3Diff = Math.round((tgt.p3 - prof.minP3) * 100) / 100;
  const progressPct = Math.min(100, (tgt.p3 / prof.minP3) * 100);

  /* ━━━ QUICK ACTION BUTTONS ━━━ */
  const quickActions = [
    { label: "Mevcut Ort.", value: Math.round(currentAvgNet || 75), emoji: "📊" },
    ...(selectedProfessionId === "yazilim_muh"
      ? [{ label: "Yazılım Tabanı", value: 73, emoji: "💻" }, { label: "Güvenli (86 P3)", value: 78, emoji: "🛡️" }]
      : [{ label: "Meslek Tabanı", value: Math.round(prof.targetNet), emoji: "🎯" }, { label: "+5 Net Artış", value: Math.round(currentAvgNet + 5), emoji: "🚀" }]),
    { label: "Rekor Net", value: Math.max(80, Math.round(bestNet || 85)), emoji: "👑" },
  ];

  return (
    <section className="mb-14">
      {/* ── Section Header ── */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-[1.25rem] shadow-sm border border-slate-100/80 dark:border-white/5">
          <AppleEmoji emoji="🎯" size={28} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">Hedefine Doğru İlerle</h3>
          <p className="text-sm font-black text-slate-400 mt-1">Hedef mesleğini seç, ÖSYM sıralamanı ve atama şansını anında gör.</p>
        </div>
      </div>

      {/* ── Main Card Container ── */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">

        {/* ━━━ Top Bar: Profession Selector + Status Badge ━━━ */}
        <div className="p-5 sm:p-7 border-b-2 border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Profession Selector */}
          <div className="relative flex-1 max-w-md" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs active:translate-y-0.5"
            >
              <div className="flex items-center gap-3 truncate pr-2">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border-2 border-b-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                  <AppleEmoji emoji={prof.icon} size={20} />
                </div>
                <div className="text-left truncate">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block leading-tight">{prof.categoryLabel}</span>
                  <span className="text-xs font-black text-slate-800 dark:text-white truncate block">{prof.title}</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xl z-40 overflow-hidden"
                  >
                    <div className="p-3 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
                      <input
                        type="text"
                        placeholder="Meslek ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-xs font-bold bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
                      {filtered.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => { setSelectedProfessionId(p.id); setIsDropdownOpen(false); setSearchTerm(""); }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                            selectedProfessionId === p.id
                              ? "bg-[#e8f7ff] dark:bg-[#1cb0f6]/20"
                              : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <AppleEmoji emoji={p.icon} size={18} />
                            <div className="truncate">
                              <p className={`text-xs font-black truncate ${selectedProfessionId === p.id ? "text-[#1cb0f6]" : "text-slate-700 dark:text-slate-200"}`}>{p.title}</p>
                              <p className="text-[10px] font-bold text-slate-400">{p.minP3} P3 · {p.categoryLabel}</p>
                            </div>
                          </div>
                          {selectedProfessionId === p.id && <Check className="w-4 h-4 text-[#1cb0f6] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Status Badge */}
          <motion.div
            key={isQualified ? "q" : "nq"}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black border-2 border-b-4 shadow-xs flex items-center gap-2 whitespace-nowrap w-fit ${
              isQualified
                ? "bg-[#58cc02] border-[#46a302] text-white"
                : "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border-amber-400 border-b-amber-500"
            }`}
          >
            <AppleEmoji emoji={isQualified ? "👑" : "🎯"} size={18} color={isQualified ? "#ffffff" : undefined} />
            <span>{isQualified ? "Atama Sınırı Aşılıyor!" : "Geliştirilmesi Gerek"}</span>
          </motion.div>
        </div>

        {/* ━━━ Body: Two Column Layout ━━━ */}
        <div className="grid grid-cols-1 lg:grid-cols-5">

          {/* ── Left: Slider & Controls (3/5) ── */}
          <div className="lg:col-span-3 p-6 sm:p-8 space-y-6 lg:border-r-2 border-slate-100 dark:border-slate-700/60">

            {/* Stat Pills Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mevcut Ortalaman</p>
                <p className="text-2xl sm:text-3xl font-black font-mono text-slate-800 dark:text-white leading-none">{formatNet(currentAvgNet)}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1.5">Tahmini P3: <span className="font-mono text-slate-600 dark:text-slate-300">{cur.p3.toFixed(2)}</span></p>
              </div>
              <div className="p-4 bg-[#1cb0f6] rounded-2xl border-2 border-b-4 border-[#1899d6] border-b-[#1482b8] text-center shadow-xs relative overflow-hidden">
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none" />
                <p className="text-[10px] font-black text-white/90 uppercase tracking-widest mb-1 relative z-10">Hedef Netin</p>
                <p className="text-2xl sm:text-3xl font-black font-mono text-white leading-none relative z-10">{targetNet}</p>
                <p className="text-[10px] font-bold text-white/80 mt-1.5 relative z-10">Tahmini P3: <span className="font-mono text-white">{tgt.p3.toFixed(2)}</span></p>
              </div>
            </div>

            {/* Slider */}
            {!isReadOnly && (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border-2 border-b-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <AppleEmoji emoji="🎯" size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 dark:text-white">Hedefini Güncelle</p>
                    <p className="text-[10px] font-bold text-slate-400">Slider'ı sürükleyerek hedef netini değiştir</p>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs">
                  <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-7"
                    value={[targetNet]}
                    min={40}
                    max={115}
                    step={1}
                    onValueChange={(val) => onTargetNetChange?.(val[0])}
                  >
                    <Slider.Track className="bg-white dark:bg-slate-800 relative grow rounded-full h-4 border-2 border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden">
                      <Slider.Range className="absolute bg-[#1cb0f6] rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb
                      className="block w-10 h-10 bg-white dark:bg-slate-800 rounded-full border-[3px] border-[#1cb0f6] shadow-[0_3px_10px_rgba(28,176,246,0.35)] hover:scale-110 focus:outline-none transition-transform cursor-grab active:cursor-grabbing"
                      aria-label="Hedef Net"
                    />
                  </Slider.Root>

                  <div className="flex justify-between text-[10px] font-black text-slate-400 font-mono px-0.5">
                    <span>40</span><span>60</span><span>80</span><span>100</span><span>115</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            {!isReadOnly && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {quickActions.map((btn, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onTargetNetChange?.(btn.value)}
                    className={`py-2.5 px-2 rounded-2xl font-black text-xs transition-all border-2 border-b-4 active:translate-y-0.5 cursor-pointer shadow-2xs ${
                      targetNet === btn.value
                        ? "bg-[#1cb0f6] text-white border-[#1899d6] border-b-[#1482b8]"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 border-b-slate-300 dark:border-slate-700 hover:border-[#1cb0f6]"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <AppleEmoji emoji={btn.emoji} size={13} color={targetNet === btn.value ? "#ffffff" : undefined} />
                      <span className="text-[9px] opacity-80 uppercase tracking-wider">{btn.label}</span>
                    </div>
                    <div className="font-mono text-sm">{btn.value} Net</div>
                  </button>
                ))}
              </div>
            )}

            {/* Motivational Banner */}
            <div className={`p-4 rounded-2xl border-2 border-b-4 flex items-center gap-3 shadow-2xs ${
              remainingNet > 0
                ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                : "bg-[#58cc02] border-[#46a302] text-white"
            }`}>
              <AppleEmoji emoji={remainingNet > 0 ? "🔥" : "🎉"} size={22} color={remainingNet <= 0 ? "#ffffff" : undefined} />
              <div>
                <p className={`text-xs font-black ${remainingNet > 0 ? "text-slate-800 dark:text-white" : "text-white"}`}>
                  {remainingNet > 0 ? (
                    <>Hedefine ulaşmana <span className="text-[#ff9500] font-mono">{remainingNet} net</span> kaldı!</>
                  ) : (
                    "Mükemmel! Mevcut hedefini aştın 🥇"
                  )}
                </p>
                <p className={`text-[10px] font-bold mt-0.5 ${remainingNet > 0 ? "text-slate-400" : "text-white/80"}`}>
                  {prof.title} kadrosu için hedefin senkronize
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Rank & Appointment Analysis (2/5) ── */}
          <div className="lg:col-span-2 p-6 sm:p-8 space-y-5">

            {/* Rank Estimation Card */}
            <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-[2rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs text-center space-y-4 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#1cb0f6]/5 dark:bg-[#1cb0f6]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-center gap-2">
                <AppleEmoji emoji={prof.icon} size={20} />
                <p className="text-sm font-black text-slate-800 dark:text-white">{prof.title}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hedef Netindeki Tahmini Sıralaman</p>
                <motion.p
                  key={targetNet}
                  initial={{ scale: 0.95, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl sm:text-4xl font-black font-mono text-[#1cb0f6] tracking-tight leading-none"
                >
                  {tgt.minRank.toLocaleString("tr-TR")} – {tgt.maxRank.toLocaleString("tr-TR")}
                </motion.p>
              </div>

              {rankGain > 0 && (
                <div className="p-2.5 bg-[#e5f9e7] dark:bg-[#58cc02]/15 rounded-xl text-xs font-black text-[#58cc02] flex items-center justify-center gap-1.5">
                  <AppleEmoji emoji="🚀" size={15} />
                  <span>~{rankGain.toLocaleString("tr-TR")} aday önüne geçersin</span>
                </div>
              )}
            </div>

            {/* Profession P3 Threshold Card */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <AppleEmoji emoji={prof.icon} size={16} />
                  Meslek Taban Puanı
                </span>
                <span className="font-mono text-[#1cb0f6]">{prof.minP3} P3</span>
              </div>

              <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full border-2 border-slate-200 dark:border-slate-700 p-[2px] shadow-inner overflow-hidden flex">
                <motion.div
                  className={`h-full rounded-full ${isQualified ? "bg-[#58cc02]" : "bg-[#1cb0f6]"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ type: "spring", stiffness: 70, damping: 16 }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-black">
                <span className="text-slate-400">Hedefin:</span>
                <span className={`font-mono ${isQualified ? "text-[#58cc02]" : "text-[#ff4b4b]"}`}>
                  {isQualified ? `+${p3Diff.toFixed(2)} P3 Üzerinde` : `${Math.abs(p3Diff).toFixed(2)} P3 Eksik`}
                </span>
              </div>
            </div>

            {/* ÖSYM Source Info Card */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <AppleEmoji emoji="🏛️" size={18} />
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  ÖSYM Resmi Atama İstatistiği
                </span>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                {prof.description}
              </p>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-0.5">
                <span>ÖSYM Merkezi Atama Sonuçları</span>
                <span className="text-[#1cb0f6] font-mono">Doğrulanmış Veri</span>
              </div>
            </div>

            {/* Bedirhan User Special Mini Badge */}
            {isBedirhanUser && selectedProfessionId === "yazilim_muh" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-[#1cb0f6] rounded-2xl border-2 border-b-4 border-[#1899d6] border-b-[#1482b8] shadow-xs relative overflow-hidden"
              >
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center gap-2.5 relative z-10">
                  <AppleEmoji emoji="💻" size={20} color="#ffffff" />
                  <div>
                    <p className="text-xs font-black text-white">Yazılım Mühendisliği Hedefin Aktif</p>
                    <p className="text-[10px] font-bold text-white/75 mt-0.5">Güvenli hedef: 85+ P3 · Nitelik: 4539/4531</p>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
