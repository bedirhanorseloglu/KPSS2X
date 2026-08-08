"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppleEmoji from "../AppleEmoji";
import { formatNet, estimateP3Score } from "@/lib/denemeUtils";
import { Search, ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

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
   ÖSYM RESMİ ATAMA VERİ SETİ (2025/1 + 2025/2 + 2026/1 Birleşik)
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
   ÖSYM SIRALAMA LOGIC
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
   AWWWARDS-LEVEL HUMAN-CENTERED DESIGN SIMULATOR
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

  // Current Average Net Calculations
  const curAvg = Math.max(0, currentAvgNet || 0);
  const curEst = useMemo(() => calculateRankEstimates(curAvg), [curAvg]);
  const isCurQualified = curEst.p3 >= prof.minP3;
  const curP3Diff = Math.round((curEst.p3 - prof.minP3) * 100) / 100;
  const netMargin = Math.round((curAvg - prof.targetNet) * 10) / 10;

  // Target Scenario Calculations
  const tgtEst = useMemo(() => calculateRankEstimates(targetNet), [targetNet]);
  const isTgtQualified = tgtEst.p3 >= prof.minP3;
  const tgtRankGain = Math.max(0, curEst.minRank - tgtEst.minRank);

  const progressPct = Math.min(100, Math.max(0, (curEst.p3 / prof.minP3) * 100));

  const quickActions = [
    { label: "Mevcut Ort.", value: Math.round(curAvg || 75), emoji: "📊" },
    ...(selectedProfessionId === "yazilim_muh"
      ? [{ label: "Yazılım Tabanı", value: 73, emoji: "💻" }, { label: "Güvenli Net", value: 78, emoji: "🛡️" }]
      : [{ label: "Meslek Tabanı", value: Math.round(prof.targetNet), emoji: "🎯" }, { label: "+5 Net Artış", value: Math.round(curAvg + 5), emoji: "🚀" }]),
    { label: "Rekor Net", value: Math.max(80, Math.round(bestNet || 85)), emoji: "👑" },
  ];

  return (
    <section className="mb-14">
      
      {/* ━━━ MAIN SIGNATURE 3D CONTAINER ━━━ */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs p-6 sm:p-10 space-y-8">
        
        {/* ── TOP HEADER: TITLE & KADRO SELECTOR ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3.5">
            <AppleEmoji emoji="🎓" size={32} color="#1cb0f6" />
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                KPSS Atama & Sıralama Simülatörü
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                Deneme netlerinize göre ÖSYM derecenizi hesaplayın ve atama şansınızı görün.
              </p>
            </div>
          </div>

          {/* Profession Dropdown Selector */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4.5 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs active:translate-y-0.5"
            >
              <AppleEmoji emoji={prof.icon} size={20} />
              <div className="text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-tight">Hedef Kadro</span>
                <span className="text-xs font-black text-slate-800 dark:text-white leading-tight">{prof.title}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 transition-transform shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 top-full mt-2 w-76 bg-white dark:bg-slate-800 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xl z-40 overflow-hidden"
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
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer text-xs font-black ${
                            selectedProfessionId === p.id ? "bg-[#1cb0f6]/10 text-[#1cb0f6]" : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <AppleEmoji emoji={p.icon} size={18} />
                            <span className="truncate">{p.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">{p.minP3} P3</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── MAIN 2-COLUMN DISPLAY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* LEFT: YOUR RANK RESULT */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">
                Ortalama Netiniz Kapsamında
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black font-mono text-[#1cb0f6] tracking-tight">
                  {formatNet(curAvg)}
                </span>
                <span className="text-sm font-black text-slate-400">net</span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-xl ml-auto">
                  Tahmini P3: {curEst.p3.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
                Türkiye Genelinde Tahmini Sıralamanız
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-slate-800 dark:text-white tracking-tight">
                {curEst.minRank.toLocaleString("tr-TR")} – {curEst.maxRank.toLocaleString("tr-TR")}
              </div>
            </div>
          </div>

          {/* RIGHT: PROFESSION APPOINTMENT STATUS */}
          <div className="lg:col-span-6 space-y-5 lg:border-l-2 lg:pl-8 border-slate-100 dark:border-slate-700/60">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Atama Uygunluk Analizi</span>
                <span className="text-xs font-black font-mono text-slate-500">Taban: {prof.minP3} P3 (~{prof.targetNet} Net)</span>
              </div>

              {/* Status Banner */}
              <div className={`p-5 rounded-2xl border-2 border-b-4 flex items-center gap-4 shadow-xs ${
                isCurQualified
                  ? "bg-[#58cc02] border-[#46a302] border-b-[#388202] text-white"
                  : "bg-amber-50 dark:bg-amber-500/20 border-amber-400 border-b-amber-500 text-amber-800 dark:text-amber-200"
              }`}>
                <AppleEmoji emoji={isCurQualified ? "🎉" : "🎯"} size={28} color={isCurQualified ? "#ffffff" : undefined} />
                <div>
                  <h4 className="text-lg font-black leading-tight">
                    {isCurQualified ? "Atama Sınırı Aşılıyor!" : "Taban Puanın Altında"}
                  </h4>
                  <p className={`text-xs font-bold mt-1 ${isCurQualified ? "text-white/90" : "text-amber-700 dark:text-amber-300"}`}>
                    {isCurQualified
                      ? `${prof.title} taban puanının +${curP3Diff.toFixed(2)} P3 (${Math.abs(netMargin)} Net) üzerindesiniz.`
                      : `${prof.title} kadrosu için yaklaşık ~${Math.abs(netMargin)} Net daha gerekiyor.`}
                  </p>
                </div>
              </div>

              {/* Progress Meter */}
              <div className="space-y-1.5 pt-2">
                <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full border-2 border-slate-200 dark:border-slate-700 p-[2px] overflow-hidden flex">
                  <motion.div
                    className={`h-full rounded-full ${isCurQualified ? "bg-[#58cc02]" : "bg-[#1cb0f6]"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ type: "spring", stiffness: 70, damping: 16 }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-black text-slate-400">
                  <span>Ortalama: {curEst.p3.toFixed(2)} P3</span>
                  <span>Gereken: {prof.minP3} P3</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── ÖSYM FOOTNOTE STRIP ── */}
        <div className="pt-4 border-t-2 border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-bold text-slate-400">
          <div className="flex items-center gap-2">
            <AppleEmoji emoji="🏛️" size={16} />
            <span>{prof.description}</span>
          </div>
          <span className="font-mono text-[#1cb0f6] shrink-0">ÖSYM Resmi Veriseti</span>
        </div>

      </div>
    </section>
  );
}
