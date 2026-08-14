"use client";

import React from "react";
import { motion } from "framer-motion";
import AppleEmoji from "@/components/AppleEmoji";
import { Section, SummaryCard } from "./AnalyticsCommon";
import { formatNet, formatDuration } from "@/lib/denemeUtils";
import { BarChart3 } from "lucide-react";

export function GenelAnalyticsOverview({ stats }: { stats: any }) {
  if (!stats) return null;

  return (
    <Section
      title="Genel Bakış"
      desc="Sınav skorlarınızın özet tablosu. Çalışmalarınızın genel seyrini buradan takip edebilirsiniz."
      icon={<AppleEmoji emoji="📊" size={32} color="#1cb0f6" />}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SummaryCard
          label="Net Ortalaması"
          value={formatNet(stats.avg)}
          sub="120 soru üzerinden"
          accent
          emoji="🔥"
        />
        <SummaryCard
          label="En Yüksek Net"
          value={formatNet(stats.best)}
          sub={`Tahmini P3: ${stats.bestP3.toFixed(2)}`}
          emoji="👑"
        />
        <SummaryCard
          label="Ortalama Süre"
          value={
            stats.avgDuration
              ? formatDuration(Math.round(stats.avgDuration))
              : "-"
          }
          sub={
            stats.avgSecondsPerQuestion
              ? `Soru başı ~${Math.round(stats.avgSecondsPerQuestion)} sn`
              : "Süre kaydı bulunmuyor"
          }
          emoji="⏱️"
        />
        <SummaryCard
          label="Tahmini P3 Puanı"
          value={stats.p3.toFixed(2)}
          sub="Ortalama netinize göre"
          highlight
          emoji="🎓"
        />
      </div>

      <DengeGrafigi stats={stats} />
    </Section>
  );
}

export function BransAnalyticsOverview({ bransStats }: { bransStats: any }) {
  if (!bransStats) return null;

  return (
    <Section
      title={`${bransStats.config?.title} İstatistikleri`}
      desc="Seçili branştaki genel performans özetin."
      icon={
        <BarChart3
          className="w-8 h-8"
          style={{ color: bransStats.config?.color || "#8b5cf6" }}
        />
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
        <SummaryCard
          label="Net Ortalaması"
          value={formatNet(bransStats.avg)}
          sub={`${bransStats.maxQuestions} soruda`}
          emoji="📊"
          accent
        />
        <SummaryCard
          label="En Yüksek Net"
          value={formatNet(bransStats.best)}
          sub="Rekorun"
          emoji="🏆"
        />
        <SummaryCard
          label="Ortalama Süre"
          value={
            bransStats.avgDuration
              ? formatDuration(Math.round(bransStats.avgDuration))
              : "-"
          }
          sub={
            bransStats.avgSecondsPerQuestion
              ? `Soru başı ~${Math.round(bransStats.avgSecondsPerQuestion)} sn`
              : "Süre kaydı yok"
          }
          emoji="⏱️"
        />
        <SummaryCard
          label="Son Sınav Neti"
          value={formatNet(bransStats.latest)}
          sub="Mevcut durum"
          emoji="📌"
        />
        <SummaryCard
          label="Gelişimin"
          value={`${bransStats.improvement > 0 ? "+" : ""}${formatNet(
            bransStats.improvement
          )}`}
          sub="İlk sınava göre"
          emoji={bransStats.improvement > 0 ? "🚀" : "📉"}
          highlight
        />
      </div>
    </Section>
  );
}

export function DengeGrafigi({ stats }: { stats: any }) {
  const gyVal = stats.gyAvg;
  const gkVal = stats.gkAvg;
  const total = gyVal + gkVal;

  const gyRatio = total > 0 ? (gyVal / total) * 100 : 50;
  const gkRatio = total > 0 ? (gkVal / total) * 100 : 50;

  const gyPercent = Math.min(100, Math.max(0, (gyVal / 60) * 100));
  const gkPercent = Math.min(100, Math.max(0, (gkVal / 60) * 100));

  const diff = gyVal - gkVal;
  const isBalanced = Math.abs(diff) <= 3;
  const isGyHigher = diff > 3;

  const gySubjects = stats.subjects.filter(
    (s: any) => s.id === "turkce" || s.id === "matematik"
  );
  const gkSubjects = stats.subjects.filter(
    (s: any) =>
      s.id === "tarih" || s.id === "cografya" || s.id === "vatandaslik"
  );

  return (
    <div className="mt-8 p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md relative overflow-hidden transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-100/80 dark:bg-sky-950/80 border-2 border-b-4 border-sky-200 dark:border-sky-800 flex items-center justify-center shrink-0 shadow-xs">
            <AppleEmoji emoji="⚖️" size={24} color="#1cb0f6" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              DENGE GRAFİĞİ
            </h4>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Genel Yetenek & Genel Kültür Başarı Oranı
            </p>
          </div>
        </div>

        <div
          className={`px-3.5 py-1.5 rounded-2xl border-2 border-b-4 text-xs font-black flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-xs ${
            isBalanced
              ? "bg-[#d7ffb8]/90 dark:bg-[#58cc02]/20 text-[#58cc02] border-[#58cc02]/40 dark:border-[#58cc02]/50"
              : isGyHigher
              ? "bg-sky-50 dark:bg-sky-950/60 text-[#1cb0f6] border-sky-200 dark:border-sky-800"
              : "bg-[#d7ffb8]/90 dark:bg-[#58cc02]/20 text-[#58cc02] border-[#58cc02]/40 dark:border-[#58cc02]/50"
          }`}
        >
          {isBalanced ? (
            <>
              <AppleEmoji emoji="⚖️" size={16} color="#58cc02" />
              <span>
                Dengeli İlerleme (%{gyRatio.toFixed(0)} - %{gkRatio.toFixed(0)})
              </span>
            </>
          ) : isGyHigher ? (
            <>
              <AppleEmoji emoji="⚡" size={16} color="#1cb0f6" />
              <span>GY Ağırlıklı (+{diff.toFixed(2)} Net)</span>
            </>
          ) : (
            <>
              <AppleEmoji emoji="📖" size={16} color="#58cc02" />
              <span>GK Ağırlıklı (+{Math.abs(diff).toFixed(2)} Net)</span>
            </>
          )}
        </div>
      </div>

      <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-900/70 rounded-2xl border-2 border-slate-200 dark:border-slate-700 relative z-10">
        <div className="flex justify-between items-center text-xs font-black mb-2.5">
          <div className="flex items-center gap-1.5 text-[#1cb0f6]">
            <AppleEmoji emoji="🧠" size={14} color="#1cb0f6" />
            <span>Genel Yetenek %{gyRatio.toFixed(1)}</span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden xs:inline">
            50/50 Denge Noktası
          </span>
          <div className="flex items-center gap-1.5 text-[#58cc02]">
            <span>Genel Kültür %{gkRatio.toFixed(1)}</span>
            <AppleEmoji emoji="🏛️" size={14} color="#58cc02" />
          </div>
        </div>

        <div className="h-4 w-full bg-slate-200 dark:bg-slate-950 rounded-full border-2 border-slate-300 dark:border-slate-700 p-[2px] shadow-inner relative overflow-hidden flex">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-500 z-20 -translate-x-1/2 opacity-70" />
          <motion.div
            className="h-full bg-gradient-to-r from-[#1cb0f6] to-[#0284c7] rounded-l-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${gyRatio}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-l-full h-1/2" />
          </motion.div>
          <motion.div
            className="h-full bg-gradient-to-r from-[#46a302] via-[#58cc02] to-[#65e005] rounded-r-full relative ms-auto"
            initial={{ width: 0 }}
            animate={{ width: `${gkRatio}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-r-full h-1/2" />
          </motion.div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 relative z-10">
        <CategoryBalanceCard
          label="Genel Yetenek"
          emoji="🧠"
          value={gyVal}
          max={60}
          percentage={gyPercent}
          color="from-[#1cb0f6] via-[#38bdf8] to-[#0284c7]"
          accentColor="#1cb0f6"
          badgeBg="bg-sky-50 dark:bg-sky-950/60 text-[#1cb0f6] border-sky-200 dark:border-sky-800"
          subSubjects={gySubjects}
        />
        <CategoryBalanceCard
          label="Genel Kültür"
          emoji="🏛️"
          value={gkVal}
          max={60}
          percentage={gkPercent}
          color="from-[#46a302] via-[#58cc02] to-[#65e005]"
          accentColor="#58cc02"
          badgeBg="bg-[#d7ffb8]/90 dark:bg-[#58cc02]/20 text-[#58cc02] border-[#58cc02]/40 dark:border-[#58cc02]/50"
          subSubjects={gkSubjects}
        />
      </div>
    </div>
  );
}

function CategoryBalanceCard({
  label,
  emoji,
  value,
  max,
  percentage,
  color,
  accentColor,
  badgeBg,
  subSubjects,
}: {
  label: string;
  emoji: string;
  value: number;
  max: number;
  percentage: number;
  color: string;
  accentColor: string;
  badgeBg: string;
  subSubjects: any[];
}) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/80 p-5 sm:p-6 rounded-3xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-600">
      <div>
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
              <AppleEmoji emoji={emoji} size={20} color={accentColor} />
            </div>
            <div>
              <span className="font-black text-slate-800 dark:text-slate-100 text-base leading-tight block">
                {label}
              </span>
              <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-300">
                {max} Soru Üzerinden
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="font-black text-2xl font-mono text-slate-800 dark:text-white leading-none">
                {formatNet(value)}
              </span>
              <span className="text-xs font-black text-slate-400 dark:text-slate-300">
                / {max}
              </span>
            </div>
            <span
              className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-black rounded-lg border border-b-2 ${badgeBg}`}
            >
              %{percentage.toFixed(1)} İsabet
            </span>
          </div>
        </div>

        <div className="h-5 w-full bg-slate-200 dark:bg-slate-950 rounded-full border-2 border-slate-300 dark:border-slate-700 p-[2px] shadow-inner relative overflow-hidden flex items-center my-3">
          <div className="absolute left-[25%] top-0 bottom-0 w-[1px] bg-slate-300/50 dark:bg-slate-700/50 z-10 pointer-events-none" />
          <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-slate-300/50 dark:bg-slate-700/50 z-10 pointer-events-none" />
          <div className="absolute left-[75%] top-0 bottom-0 w-[1px] bg-slate-300/50 dark:bg-slate-700/50 z-10 pointer-events-none" />

          <motion.div
            className={`h-full bg-gradient-to-r ${color} rounded-full relative flex items-center justify-end pr-1`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-t-full pointer-events-none" />
            {percentage > 5 && (
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-md shrink-0 relative z-10" />
            )}
          </motion.div>
        </div>
      </div>

      {subSubjects && subSubjects.length > 0 && (
        <div className="mt-4 pt-3 border-t-2 border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-300 mb-2 flex justify-between items-center">
            <span>Ders Net Dağılımı</span>
            <span>Net / Soru</span>
          </div>

          <div className="space-y-2">
            {subSubjects.map((sub: any) => {
              const subPercent = sub.questionCount
                ? Math.min(
                    100,
                    Math.max(0, (sub.avgNet / sub.questionCount) * 100)
                  )
                : 0;
              return (
                <div
                  key={sub.id}
                  className="p-2 bg-white dark:bg-slate-800 rounded-xl border-2 border-b-2 border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <AppleEmoji emoji={sub.icon} size={16} color={sub.color} />
                    <span className="font-extrabold text-slate-700 dark:text-slate-100 truncate">
                      {sub.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <div className="w-12 h-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden hidden xs:block">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${subPercent}%`,
                          backgroundColor: sub.color,
                        }}
                      />
                    </div>

                    <span className="font-black text-slate-800 dark:text-white">
                      {formatNet(sub.avgNet)}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-300 font-extrabold">
                      / {sub.questionCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
