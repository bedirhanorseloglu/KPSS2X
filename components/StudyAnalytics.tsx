"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { getStudyDate } from "@/lib/dateUtils";
import AppleEmoji from "@/components/AppleEmoji";

const formatMins = (mins: number): string => {
  if (mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h > 0 && m > 0) return `${h}s ${m}dk`;
  if (h > 0) return `${h}s`;
  return `${m}dk`;
};

/* ─── Stagger animation variants ──────────────────────── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
};
const staggerItem: any = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } }
};

/* ─── Chart Tooltip ───────────────────────────────────── */
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.[0]) {
    return (
      <div className="bg-white dark:bg-slate-800 px-5 py-3.5 rounded-2xl shadow-xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6]">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
        <p className="text-xl font-black text-[#1cb0f6] font-mono tracking-tight">
          {formatMins(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

/* ─── 3D Mini Stat Card ──────────────────────────────────── */
const MiniStat = ({ emoji, label, value, bgClass, borderClass, textClass }: { emoji: string; label: string; value: string; bgClass: string; borderClass: string; textClass: string }) => (
  <motion.div
    variants={staggerItem}
    whileHover={{ y: -3, transition: { duration: 0.2 } }}
    className={`rounded-2xl p-4 border-2 border-b-4 ${bgClass} ${borderClass} shadow-2xs transition-all relative overflow-hidden group`}
  >
    <div className="flex items-center gap-2 mb-2 relative z-10">
      <AppleEmoji emoji={emoji} size={16} />
      <span className={`text-[10px] font-black uppercase tracking-widest ${textClass}`}>{label}</span>
    </div>
    <p className={`text-xl font-black font-mono tracking-tight relative z-10 ${textClass}`}>{value}</p>
  </motion.div>
);

export default function StudyAnalytics() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadHistory = () => {
      try {
        const raw = localStorage.getItem("pomodoro_history");
        if (raw) setHistory(prev => ({ ...prev, ...JSON.parse(raw) }));
      } catch {}

      const getStudyDay = () => {
        const now = new Date();
        if (now.getHours() < 4) now.setDate(now.getDate() - 1);
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      };

      try {
        const saved = localStorage.getItem("pomodoro_total_focus");
        if (saved) {
          const parsed = parseInt(saved);
          const dayKey = getStudyDay();
          setHistory(prev => ({ ...prev, [dayKey]: Math.max(prev[dayKey] || 0, parsed) }));
        }
      } catch {}
    };

    loadHistory();

    const handleUpdate = (e: any) => {
      if (e.detail) setHistory(prev => ({ ...prev, [e.detail.date]: e.detail.focus }));
    };
    window.addEventListener("pomodoro_update", handleUpdate);
    return () => window.removeEventListener("pomodoro_update", handleUpdate);
  }, []);

  const { days, weekTotal, dailyAvg, bestDay, consistency, todayMins, yesterdayMins, trend } = useMemo(() => {
    const studyToday = getStudyDate();
    const todayStr = format(studyToday, "yyyy-MM-dd");

    const weekStart = startOfWeek(studyToday, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(weekStart, i);
      const key = format(d, "yyyy-MM-dd");
      const abbr = format(d, "EEE", { locale: tr });
      return {
        date: d, key,
        label: abbr.charAt(0).toUpperCase() + abbr.slice(1),
        fullLabel: format(d, "d MMMM EEEE", { locale: tr }),
        minutes: history[key] || 0,
        isToday: key === todayStr
      };
    });

    const weekTotal = days.reduce((sum, d) => sum + d.minutes, 0);
    const dailyAvg = Math.round(weekTotal / 7);
    const bestDay = days.reduce((best, d) => d.minutes > best.minutes ? d : best, days[0]);
    const consistency = days.filter(d => d.minutes > 0).length;
    const todayMins = days.find(d => d.isToday)?.minutes || 0;
    const todayIdx = days.findIndex(d => d.isToday);
    const yesterdayMins = todayIdx > 0 ? days[todayIdx - 1].minutes : 0;
    const trend = yesterdayMins > 0
      ? Math.round(((todayMins - yesterdayMins) / yesterdayMins) * 100)
      : todayMins > 0 ? 100 : 0;

    return { days, weekTotal, dailyAvg, bestDay, consistency, todayMins, yesterdayMins, trend };
  }, [history]);

  const maxMins = Math.max(...days.map(d => d.minutes), 1);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          COLLAPSED CARD — 3D Physical Push Card
          ═══════════════════════════════════════════════════════ */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded); } }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -4, transition: { duration: 0.25 } }}
        className={`bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 flex flex-col justify-between items-start gap-5 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md hover:border-[#1cb0f6] transition-all relative overflow-hidden group cursor-pointer select-none ${
          isExpanded ? 'border-[#1cb0f6] shadow-md' : ''
        }`}
      >
        {/* 3D Badge Icon Box */}
        <div className="w-14 h-14 rounded-2xl bg-[#1cb0f6] border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-white flex items-center justify-center shadow-xs shrink-0">
          <AppleEmoji emoji="📊" size={28} className="text-white" />
        </div>

        <div className="flex flex-col z-10 w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Çalışma Analizi</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`w-7 h-7 rounded-xl border-2 border-b-2 flex items-center justify-center transition-colors ${
                isExpanded ? 'bg-[#e8f7ff] border-[#1cb0f6] text-[#1cb0f6]' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 text-slate-500'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Today's study time */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight text-[#1cb0f6] font-mono">
              {formatMins(todayMins)}
            </span>
            {todayMins > 0 && yesterdayMins > 0 && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-xs font-black flex items-center gap-0.5 ${
                  trend >= 0 ? 'text-[#58cc02]' : 'text-[#ff4b4b]'
                }`}
              >
                {trend >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {Math.abs(trend)}%
              </motion.span>
            )}
          </div>

          {/* Mini 7-day bars */}
          <div className="flex items-end gap-[5px] mt-3">
            {days.map((d, i) => (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-7 flex items-end">
                  <motion.div
                    className={`w-full rounded-t-md ${
                      d.isToday
                        ? 'bg-[#1cb0f6]'
                        : d.minutes > 0
                          ? 'bg-[#1cb0f6]/40 dark:bg-[#1cb0f6]/50'
                          : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${d.minutes > 0 ? Math.max(20, (d.minutes / maxMins) * 100) : 12}%` }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </div>
                <span className={`text-[9px] font-black leading-none ${
                  d.isToday ? 'text-[#1cb0f6]' : 'text-slate-400'
                }`}>
                  {d.label.charAt(0)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2.5">
            {consistency > 0 && (
              <div className="flex items-center gap-1">
                <AppleEmoji emoji="🔥" size={12} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {consistency}/7
                </span>
              </div>
            )}
            <span className="text-[10px] font-black text-slate-300">•</span>
            <span className="text-[10px] font-black text-[#1cb0f6] uppercase tracking-widest">
              Detay ↓
            </span>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          EXPANDED PANEL — 3D Physical Container
          ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="col-span-full overflow-hidden"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md overflow-hidden p-6 sm:p-8 flex flex-col gap-6"
            >
              {/* Header */}
              <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1cb0f6] border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-white flex items-center justify-center shadow-xs shrink-0">
                    <AppleEmoji emoji="📊" size={24} className="text-white" />
                  </div>
                  <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-widest">Haftalık Çalışma Raporu</h3>
                </div>
                {todayMins > 0 && yesterdayMins > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 border-b-2 shadow-2xs ${
                      trend >= 0
                        ? 'bg-[#e5f9e7] text-[#58cc02] border-[#58cc02]/30'
                        : 'bg-red-50 text-[#ff4b4b] border-[#ff4b4b]/30'
                    }`}
                  >
                    {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {trend >= 0 ? '+' : ''}{trend}% düne göre
                  </motion.div>
                )}
              </motion.div>

              {/* 3D Mini Stats Row */}
              <motion.div variants={staggerItem}>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  <MiniStat emoji="⏱️" label="Bu Hafta" value={formatMins(weekTotal)} bgClass="bg-[#e8f7ff] dark:bg-[#1cb0f6]/10" borderClass="border-[#1cb0f6] border-b-[#1899d6]" textClass="text-[#1cb0f6]" />
                  <MiniStat emoji="📈" label="Günlük Ort." value={formatMins(dailyAvg)} bgClass="bg-red-50 dark:bg-red-500/10" borderClass="border-[#ff4b4b] border-b-[#e03030]" textClass="text-[#ff4b4b]" />
                  <MiniStat emoji="⚡" label="En Verimli" value={bestDay.minutes > 0 ? bestDay.label : '—'} bgClass="bg-[#e5f9e7] dark:bg-[#58cc02]/10" borderClass="border-[#58cc02] border-b-[#46a302]" textClass="text-[#58cc02]" />
                  <MiniStat emoji="🔥" label="Tutarlılık" value={`${consistency}/7`} bgClass="bg-[#fff8ed] dark:bg-[#ff9500]/10" borderClass="border-[#ff9500] border-b-[#e08400]" textClass="text-[#ff9500]" />
                </motion.div>
              </motion.div>

              {/* 3D Bar Chart Container */}
              <motion.div variants={staggerItem}>
                <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border-2 border-b-2 border-slate-200 dark:border-slate-700 p-5 shadow-2xs">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <AppleEmoji emoji="📊" size={14} />
                    <span>Günlük Çalışma Dağılımı</span>
                  </p>
                  <div className="h-48 sm:h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={days.map(d => ({ name: d.label, dakika: d.minutes }))}
                        margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1cb0f6" stopOpacity={1} />
                            <stop offset="100%" stopColor="#1cb0f6" stopOpacity={0.6} />
                          </linearGradient>
                          <linearGradient id="barGradientPast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1cb0f6" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#1cb0f6" stopOpacity={0.15} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100,116,139,0.1)" />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fontWeight: 800, fill: '#94a3b8' }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#cbd5e1' }}
                          tickFormatter={(v: number) => {
                            if (v === 0) return '0';
                            if (v < 60) return `${v}dk`;
                            return `${Math.floor(v / 60)}s`;
                          }}
                        />
                        <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(28,176,246,0.05)', radius: 8 }} />
                        <Bar dataKey="dakika" radius={[10, 10, 3, 3]} barSize={32} animationDuration={900} animationEasing="ease-out">
                          {days.map((d) => (
                            <Cell
                              key={d.key}
                              fill={d.isToday ? 'url(#barGradientActive)' : d.minutes > 0 ? 'url(#barGradientPast)' : 'rgba(100,116,139,0.08)'}
                              stroke={d.isToday ? '#1cb0f6' : 'transparent'}
                              strokeWidth={d.isToday ? 2 : 0}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              {/* 3D 7-Day Heatmap Container */}
              <motion.div variants={staggerItem}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border-2 border-b-2 border-slate-200 dark:border-slate-700 p-5 shadow-2xs">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0 flex items-center gap-2">
                    <AppleEmoji emoji="🗺️" size={14} />
                    <span>Aktivite Haritası</span>
                  </span>

                  <div className="flex items-center gap-2 sm:gap-3">
                    {days.map((d, i) => {
                      const intensity = d.minutes > 0 ? Math.max(0.15, d.minutes / maxMins) : 0;
                      return (
                        <motion.div
                          key={d.key}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.06, duration: 0.35, ease: "easeOut" }}
                          className="flex flex-col items-center gap-1.5 group/heat"
                          title={`${d.fullLabel}: ${formatMins(d.minutes)}`}
                        >
                          <div
                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl border-2 transition-all flex items-center justify-center ${
                              d.isToday 
                                ? 'border-[#1cb0f6] border-b-4 bg-[#e8f7ff] dark:bg-[#1cb0f6]/20' 
                                : d.minutes > 0
                                  ? 'border-[#1cb0f6]/40 border-b-2 bg-[#1cb0f6]/10'
                                  : 'border-slate-200 dark:border-slate-700 border-b-2 bg-white dark:bg-slate-800'
                            }`}
                          >
                            {d.minutes > 0 && (
                              <span className="text-[9px] font-black text-[#1cb0f6]">
                                {d.minutes < 60 ? `${d.minutes}` : `${Math.floor(d.minutes / 60)}s`}
                              </span>
                            )}
                          </div>
                          <span className={`text-[9px] font-black ${
                            d.isToday ? 'text-[#1cb0f6]' : 'text-slate-400'
                          }`}>
                            {d.label.substring(0, 3)}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-black text-slate-400 shrink-0">
                    <span>Az</span>
                    {[0.15, 0.35, 0.6, 0.85].map((op, i) => (
                      <div key={i} className="w-4 h-4 rounded-md border" style={{ backgroundColor: `#1cb0f6${Math.round(op * 255).toString(16).padStart(2, '0')}`, borderColor: '#1cb0f6' }} />
                    ))}
                    <span>Çok</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
