"use client";

import React from "react";
import { motion } from "framer-motion";
import AppleEmoji from "@/components/AppleEmoji";
import { Section } from "./AnalyticsCommon";
import { formatNet } from "@/lib/denemeUtils";

type SubjectStat = {
  id: string;
  title: string;
  icon: string;
  color: string;
  questionCount: number;
  avgNet: number;
  avgCorrect: number;
  avgWrong: number;
  avgEmpty: number;
  accuracy: number;
};

export default function SubjectBreakdownGrid({
  subjects,
}: {
  subjects: SubjectStat[];
}) {
  if (!subjects || subjects.length === 0) return null;

  return (
    <Section
      title="Ders Karnen"
      desc="Derslerin detaylı analizleri. En yüksek ve en düşük başarı oranlarını incele."
      icon={<AppleEmoji emoji="📚" size={32} color="#1cb0f6" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {subjects.map((s, i) => {
          const pct = s.questionCount > 0 ? (s.avgNet / s.questionCount) * 100 : 0;

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-4 sm:p-4.5 rounded-[1.75rem] bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-[1.02] flex flex-col justify-between relative overflow-hidden group"
            >
              <div>
                {/* Top Header */}
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-b-4 shrink-0 shadow-xs"
                      style={{
                        backgroundColor: `${s.color}15`,
                        borderColor: `${s.color}60`,
                      }}
                    >
                      <AppleEmoji emoji={s.icon} size={20} color={s.color} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-800 dark:text-white leading-tight truncate">
                        {s.title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-300 mt-0.5">
                        {s.questionCount} Soru
                      </p>
                    </div>
                  </div>

                  <div
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0 border border-b-2 shadow-2xs ${
                      s.accuracy >= 70
                        ? "bg-[#58cc02] text-white border-green-700"
                        : s.accuracy >= 45
                        ? "bg-[#ff9500] text-white border-amber-700"
                        : "bg-[#ff4b4b] text-white border-rose-700"
                    }`}
                  >
                    %{Math.round(s.accuracy)}
                  </div>
                </div>

                {/* Net & Recessed Progress Track */}
                <div className="space-y-1.5 my-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider">
                      Ort. Net
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span
                        className="text-2xl font-black font-mono leading-none"
                        style={{ color: s.color }}
                      >
                        {formatNet(s.avgNet)}
                      </span>
                      <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-300">
                        /{s.questionCount}
                      </span>
                    </div>
                  </div>

                  <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full border-2 border-slate-200 dark:border-slate-700 p-[1.5px] shadow-inner overflow-hidden flex items-center">
                    <motion.div
                      className="h-full rounded-full relative flex items-center justify-end pr-0.5"
                      style={{ backgroundColor: s.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, pct)}%` }}
                      transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-t-full pointer-events-none" />
                      {pct > 5 && (
                        <div className="w-2 h-2 rounded-full bg-white shadow-md shrink-0 relative z-10" />
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* 3D Doğru / Yanlış / Boş Compact Chips */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t-2 border-slate-100 dark:border-slate-700/60 text-[10px] font-black font-mono text-center">
                <div
                  className="px-1.5 py-1 rounded-lg bg-[#58cc02] text-white border border-b-2 border-green-700 shadow-2xs flex items-center justify-center gap-0.5"
                  title="Doğru"
                >
                  <AppleEmoji emoji="✅" size={10} color="white" />
                  <span>{s.avgCorrect.toFixed(1)}</span>
                </div>
                <div
                  className="px-1.5 py-1 rounded-lg bg-[#ff4b4b] text-white border border-b-2 border-rose-700 shadow-2xs flex items-center justify-center gap-0.5"
                  title="Yanlış"
                >
                  <AppleEmoji emoji="❌" size={10} color="white" />
                  <span>{s.avgWrong.toFixed(1)}</span>
                </div>
                <div
                  className="px-1.5 py-1 rounded-lg bg-[#ff9500] text-white border border-b-2 border-amber-700 shadow-2xs flex items-center justify-center gap-0.5"
                  title="Boş"
                >
                  <AppleEmoji emoji="⚪" size={10} color="white" />
                  <span>{s.avgEmpty.toFixed(1)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
