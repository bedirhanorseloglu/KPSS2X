"use client";

import React from "react";
import { motion } from "framer-motion";
import AppleEmoji from "@/components/AppleEmoji";
import { Section } from "./AnalyticsCommon";
import { formatNet } from "@/lib/denemeUtils";
import { BookOpen, Trophy, Target, Newspaper } from "lucide-react";

type PublisherStats = {
  name: string;
  count: number;
  avgNet: number;
  bestNet: number;
  accuracy: number;
};

type Props = {
  publishers: PublisherStats[];
  viewType?: "genel" | "brans";
  maxQuestions?: number;
  subColor?: string;
};

export default function PublisherDistributionSection({
  publishers,
  viewType = "genel",
  maxQuestions = 120,
  subColor = "#1cb0f6",
}: Props) {
  if (!publishers || publishers.length === 0) return null;

  const totalDeneme = publishers.reduce((acc, p) => acc + p.count, 0);

  return (
    <Section
      title="Yayın Dağılımı ve Başarı Analizi"
      desc={`Çözdüğünüz ${totalDeneme} denemenin yayın evlerine göre performans karşılaştırması.`}
      icon={<Newspaper className="w-6 h-6 text-[#1cb0f6]" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {publishers.map((pub, idx) => {
          const pct = Math.min(100, (pub.avgNet / maxQuestions) * 100);
          return (
            <motion.div
              key={pub.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-6 rounded-[2.25rem] border-2 border-b-4 relative overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:scale-[1.01] ${
                idx === 0
                  ? "bg-white dark:bg-slate-800 border-[#1cb0f6] border-b-[#1899d6] text-slate-800 dark:text-white shadow-md"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center border-2 border-b-4 shrink-0 shadow-xs ${
                      idx === 0
                        ? "bg-[#1cb0f6] text-white border-[#1899d6]"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 border-slate-200 dark:border-slate-600"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <h4 className="text-base font-black text-slate-800 dark:text-white truncate max-w-[150px]">
                    {pub.name}
                  </h4>
                </div>

                {idx === 0 && (
                  <span className="px-3 py-1 text-[10px] font-black rounded-2xl uppercase tracking-wider flex items-center gap-1 bg-sky-50 dark:bg-sky-950/60 text-[#1cb0f6] border-2 border-b-2 border-sky-200 dark:border-sky-800 shadow-2xs">
                    <AppleEmoji emoji="👑" size={12} color="#1cb0f6" /> En Yüksek Başarı
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider">
                    Ortalama Net
                  </span>
                  <span
                    className="text-3xl font-black font-mono leading-none"
                    style={{ color: viewType === "brans" ? subColor : "#1cb0f6" }}
                  >
                    {formatNet(pub.avgNet)}
                  </span>
                </div>

                {/* Recessed 3D Progress Bar */}
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-900 rounded-full border-2 border-slate-200 dark:border-slate-700 p-[1.5px] shadow-inner overflow-hidden flex items-center">
                  <motion.div
                    className="h-full rounded-full relative flex items-center justify-end pr-0.5"
                    style={{
                      backgroundColor: viewType === "brans" ? subColor : "#1cb0f6",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-t-full pointer-events-none" />
                    {pct > 5 && (
                      <div className="w-2 h-2 rounded-full bg-white shadow-md shrink-0 relative z-10" />
                    )}
                  </motion.div>
                </div>
              </div>

              {/* 3D Alt Metrik Kutuları */}
              <div className="grid grid-cols-3 gap-2.5 pt-3.5 border-t-2 border-slate-100 dark:border-slate-700/60 text-center">
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-b-4 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center transition-transform hover:-translate-y-0.5 shadow-2xs">
                  <div className="flex items-center gap-1 mb-1">
                    <BookOpen className="w-3 h-3 text-[#1cb0f6]" />
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Sınav
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
                    {pub.count}{" "}
                    <span className="text-[10px] font-bold text-slate-400">Adet</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border-2 border-b-4 border-amber-400/40 border-b-amber-500/60 dark:border-amber-500/30 dark:border-b-amber-500/60 flex flex-col items-center justify-center transition-transform hover:-translate-y-0.5 shadow-2xs">
                  <div className="flex items-center gap-1 mb-1">
                    <Trophy className="w-3 h-3 text-[#ff9500]" />
                    <span className="text-[10px] font-black text-[#ff9500] uppercase tracking-wider">
                      Rekor
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#ff9500]">
                    {formatNet(pub.bestNet)}{" "}
                    <span className="text-[10px] font-bold opacity-80">Net</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#58cc02]/10 dark:bg-[#58cc02]/15 border-2 border-b-4 border-[#58cc02]/40 border-b-[#58cc02]/80 dark:border-[#58cc02]/30 dark:border-b-[#58cc02]/70 flex flex-col items-center justify-center transition-transform hover:-translate-y-0.5 shadow-2xs">
                  <div className="flex items-center gap-1 mb-1">
                    <Target className="w-3 h-3 text-[#58cc02]" />
                    <span className="text-[10px] font-black text-[#58cc02] uppercase tracking-wider">
                      Başarı
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#58cc02]">
                    %{Math.round(pub.accuracy)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
