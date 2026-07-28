"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DenemeRecord,
  evaluateDeneme,
  formatNet,
  estimateP3Score,
  formatDuration,
} from "@/lib/denemeUtils";
import { DENEME_SUBJECTS } from "@/lib/denemeConfig";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement
);
import DenemeScoreRing from "./DenemeScoreRing";
import { BarChart3, TrendingUp, Target, BookOpen, CheckCircle2, XCircle, MinusCircle, Lightbulb, AlertTriangle, Clock, Scale, Sparkles, BookText, Calculator, Landmark, Globe2, Newspaper } from "lucide-react";
import AppleEmoji from "../AppleEmoji";
import * as Slider from "@radix-ui/react-slider";

type Props = { 
  denemeler: DenemeRecord[]; 
  allDenemeler?: DenemeRecord[]; 
  viewType?: "genel" | "brans"; 
  targetNet: number;
  onTargetNetChange: (value: number) => void;
  onAdd: () => void;
  isReadOnly?: boolean;
};

type Range = "all" | "5" | "10";



function Row({ label, value, color, bold }: { label: string; value: string; color?: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center text-[11px] gap-4">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className={`font-mono ${bold ? "font-black text-sm" : "font-black"} ${color || "text-slate-900 dark:text-white"}`}>{value}</span>
    </div>
  );
}

const getSubjectIcon = (id: string, color: string) => {
  switch (id) {
    case 'turkce': return <BookText className="w-5 h-5" style={{ color }} />;
    case 'matematik': return <Calculator className="w-5 h-5" style={{ color }} />;
    case 'tarih': return <Landmark className="w-5 h-5" style={{ color }} />;
    case 'cografya': return <Globe2 className="w-5 h-5" style={{ color }} />;
    case 'vatandaslik': return <Scale className="w-5 h-5" style={{ color }} />;
    case 'guncel-bilgiler': return <Newspaper className="w-5 h-5" style={{ color }} />;
    default: return <BookOpen className="w-5 h-5" style={{ color }} />;
  }
};

export default function DenemeAnalytics({
  denemeler,
  allDenemeler = [],
  viewType = "genel",
  targetNet,
  onTargetNetChange,
  onAdd,
  isReadOnly = false,
}: Props) {
  const [range, setRange] = useState<Range>("all");
  const [activeMetric, setActiveMetric] = useState<"total" | "gy" | "gk">("total");
  const [selectedBransSubjectId, setSelectedBransSubjectId] = useState<string>("");

  const availableBransSubjects = useMemo(() => {
    if (viewType !== "brans") return [];
    const ids = new Set(allDenemeler.filter(d => d.examType === "brans").map(d => d.bransSubjectId).filter(Boolean));
    return DENEME_SUBJECTS.filter(s => ids.has(s.id));
  }, [allDenemeler, viewType]);

  useEffect(() => {
    if (viewType === "brans" && availableBransSubjects.length > 0) {
      if (!selectedBransSubjectId || !availableBransSubjects.find(s => s.id === selectedBransSubjectId)) {
        setSelectedBransSubjectId(availableBransSubjects[0].id);
      }
    }
  }, [viewType, availableBransSubjects, selectedBransSubjectId]);

  const active = useMemo(() => {
    const list = [...denemeler];
    return range === "all" ? list : list.slice(0, parseInt(range, 10));
  }, [denemeler, range]);

  /* ── General Mode Stats ── */
  const stats = useMemo(() => {
    if (viewType !== "genel" || active.length === 0) return null;
    const evals = active.map((d) => ({ d, r: evaluateDeneme(d.scores, d.examType) }));
    const nets = evals.map((e) => e.r.totalNet);
    const avg = nets.reduce((a, b) => a + b, 0) / nets.length;
    const best = Math.max(...nets);

    const subjects = DENEME_SUBJECTS.map((sub) => {
      let tc = 0, tw = 0, te = 0, cnt = 0;
      active.forEach((d) => {
        const s = d.scores.find((x) => x.subjectId === sub.id);
        if (s) { tc += s.correct; tw += s.wrong; te += s.empty; cnt++; }
      });
      const ac = cnt ? tc / cnt : 0, aw = cnt ? tw / cnt : 0, ae = cnt ? te / cnt : 0;
      const net = cnt ? (tc - tw / 4) / cnt : 0;
      const accuracy = sub.questionCount > 0 ? Math.max(0, (net / sub.questionCount) * 100) : 0;
      return { ...sub, avgCorrect: ac, avgWrong: aw, avgEmpty: ae, avgNet: net, accuracy };
    });

    const sorted = [...subjects].sort((a, b) => b.avgNet - a.avgNet);

    const trend = [...active].reverse().map((d) => {
      const r = evaluateDeneme(d.scores, d.examType);
      
      const gySubj = r.subjects.filter((s) => s.category === "Genel Yetenek");
      const gkSubj = r.subjects.filter((s) => s.category === "Genel Kültür" || s.category === "Vatandaşlık");

      return { 
        name: d.name, 
        net: r.totalNet, 
        gyNet: r.gyNet, 
        gkNet: r.gkNet, 
        correct: r.totalCorrect,
        wrong: r.totalWrong,
        empty: r.totalEmpty,
        gyC: gySubj.reduce((a, s) => a + s.correct, 0),
        gyW: gySubj.reduce((a, s) => a + s.wrong, 0),
        gyE: gySubj.reduce((a, s) => a + s.empty, 0),
        gkC: gkSubj.reduce((a, s) => a + s.correct, 0),
        gkW: gkSubj.reduce((a, s) => a + s.wrong, 0),
        gkE: gkSubj.reduce((a, s) => a + s.empty, 0),
      };
    });

    const gyAvg = subjects.filter((s) => s.category === "Genel Yetenek").reduce((a, s) => a + s.avgNet, 0);
    const gkAvg = subjects.filter((s) => s.category !== "Genel Yetenek").reduce((a, s) => a + s.avgNet, 0);

    const worstWrong = [...subjects].map((s) => ({ ...s, wr: s.questionCount ? s.avgWrong / s.questionCount : 0 })).sort((a, b) => b.wr - a.wr);
    const worstEmpty = [...subjects].map((s) => ({ ...s, er: s.questionCount ? s.avgEmpty / s.questionCount : 0 })).sort((a, b) => b.er - a.er);
    const improvement = active.length > 1 ? nets[0] - nets[nets.length - 1] : 0;

    const durations = active.map(d => d.durationMinutes).filter((d): d is number => typeof d === "number" && d > 0);
    const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : null;
    const avgSecondsPerQuestion = avgDuration ? (avgDuration * 60) / 120 : null;

    return {
      count: active.length, avg, best, latest: nets[0],
      subjects, strongest: sorted[0], weakest: sorted[sorted.length - 1],
      trend, gyAvg, gkAvg,
      p3: estimateP3Score(gyAvg, gkAvg),
      mostWrong: worstWrong[0]?.wr > 0 ? worstWrong[0] : null,
      mostEmpty: worstEmpty[0]?.er > 0 ? worstEmpty[0] : null,
      improvement,
      avgDuration,
      avgSecondsPerQuestion,
    };
  }, [active, viewType]);

  /* ── Branch Mode Stats ── */
  const bransStats = useMemo(() => {
    if (viewType !== "brans" || !selectedBransSubjectId) return null;
    const allForSubject = denemeler.filter(d => d.bransSubjectId === selectedBransSubjectId);
    const list = range === "all" ? allForSubject : allForSubject.slice(0, parseInt(range, 10));
    if (list.length === 0) return null;

    const subConfig = DENEME_SUBJECTS.find(s => s.id === selectedBransSubjectId);
    const maxQuestions = subConfig?.questionCount ?? 30;

    const evals = list.map(d => {
      const s = d.scores.find(x => x.subjectId === selectedBransSubjectId);
      const correct = s?.correct ?? 0;
      const wrong = s?.wrong ?? 0;
      const empty = s?.empty ?? 0;
      const net = correct - wrong / 4;
      return { correct, wrong, empty, net, name: d.name, date: d.date };
    });

    const nets = evals.map(e => e.net);
    const avg = nets.reduce((a, b) => a + b, 0) / nets.length;
    const best = Math.max(...nets);
    const latest = nets[0];

    const avgC = evals.reduce((a, b) => a + b.correct, 0) / evals.length;
    const avgW = evals.reduce((a, b) => a + b.wrong, 0) / evals.length;
    const avgE = evals.reduce((a, b) => a + b.empty, 0) / evals.length;

    const trend = [...evals].reverse();
    const improvement = list.length > 1 ? nets[0] - nets[nets.length - 1] : 0;

    const durations = list.map(d => d.durationMinutes).filter((d): d is number => typeof d === "number" && d > 0);
    const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : null;
    const avgSecondsPerQuestion = avgDuration ? (avgDuration * 60) / maxQuestions : null;

    return {
      count: list.length, avg, best, latest, avgC, avgW, avgE, maxQuestions, trend, config: subConfig, improvement, avgDuration, avgSecondsPerQuestion
    };
  }, [denemeler, selectedBransSubjectId, viewType, range]);

  /* ── Publisher Performance Stats Computation ── */
  const publisherStats = useMemo(() => {
    let listToProcess = active;

    if (viewType === "brans") {
      if (!selectedBransSubjectId) return [];
      listToProcess = denemeler.filter(
        (d) => d.examType === "brans" && d.bransSubjectId === selectedBransSubjectId
      );
      if (range !== "all") {
        listToProcess = listToProcess.slice(0, parseInt(range, 10));
      }
    }

    if (listToProcess.length === 0) return [];

    const map: Record<string, { count: number; totalNet: number; bestNet: number; totalCorrect: number; totalWrong: number; totalEmpty: number; totalDuration: number; durationCount: number }> = {};

    listToProcess.forEach(d => {
      const pub = d.publisher?.trim() || "Diğer";
      const res = evaluateDeneme(d.scores, d.examType);
      
      let net = res.totalNet;
      let correct = res.totalCorrect;
      let wrong = res.totalWrong;
      let empty = res.totalEmpty;

      if (d.examType === "brans" && d.bransSubjectId) {
        const subRes = res.subjects.find(s => s.subjectId === d.bransSubjectId);
        if (subRes) {
          net = subRes.net;
          correct = subRes.correct;
          wrong = subRes.wrong;
          empty = subRes.empty;
        }
      }

      if (!map[pub]) {
        map[pub] = {
          count: 0,
          totalNet: 0,
          bestNet: net,
          totalCorrect: 0,
          totalWrong: 0,
          totalEmpty: 0,
          totalDuration: 0,
          durationCount: 0,
        };
      }

      map[pub].count += 1;
      map[pub].totalNet += net;
      if (net > map[pub].bestNet) map[pub].bestNet = net;
      map[pub].totalCorrect += correct;
      map[pub].totalWrong += wrong;
      map[pub].totalEmpty += empty;
      if (d.durationMinutes && d.durationMinutes > 0) {
        map[pub].totalDuration += d.durationMinutes;
        map[pub].durationCount += 1;
      }
    });

    return Object.entries(map).map(([name, data]) => {
      const avgNet = data.totalNet / data.count;
      const avgDuration = data.durationCount > 0 ? data.totalDuration / data.durationCount : null;
      const totalQuestions = data.totalCorrect + data.totalWrong + data.totalEmpty;
      const accuracy = totalQuestions > 0 ? Math.max(0, (data.totalNet / totalQuestions) * 100) : 0;
      return {
        name,
        count: data.count,
        avgNet,
        bestNet: data.bestNet,
        accuracy,
        avgDuration,
      };
    }).sort((a, b) => b.avgNet - a.avgNet);
  }, [active, denemeler, selectedBransSubjectId, viewType, range]);

  /* ═══ Empty States ═══ */
  if (viewType === "genel" && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-[#1e293b] rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 text-center">
        <DenemeScoreRing value={0} max={120} size={130} label="Analiz Bekleniyor" />
        <p className="text-sm font-semibold text-slate-500 mt-6 max-w-xs leading-relaxed">
          Genel deneme analizlerini görmek için en az bir adet Genel Deneme kaydı {isReadOnly ? "bulunmuyor" : "girmelisiniz"}.
        </p>
        {!isReadOnly && <button onClick={onAdd} className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-500/20">Deneme Girişi Yap</button>}
      </div>
    );
  }

  if (viewType === "brans" && availableBransSubjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-[#1e293b] rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 text-center">
        <div className="w-16 h-16 bg-violet-50 dark:bg-violet-500/10 text-violet-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">
          🎯
        </div>
        <h3 className="text-lg font-black text-slate-800 dark:text-white">Branş Analizi Bekleniyor</h3>
        <p className="text-sm font-semibold text-slate-500 mt-2 max-w-xs leading-relaxed">
          Branş deneme grafiklerini ve analizlerini görmek için önce "Yeni Giriş" kısmından bir Branş Denemesi {isReadOnly ? "bulunmuyor" : "kaydetmelisiniz"}.
        </p>
        {!isReadOnly && <button onClick={onAdd} className="mt-6 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl shadow-lg shadow-violet-500/20">Branş Denemesi Gir</button>}
      </div>
    );
  }

  const metricStroke = activeMetric === "total" ? "#3b82f6" : activeMetric === "gy" ? "#6366f1" : "#a855f7";
  const remaining = stats ? Math.max(0, targetNet - stats.avg) : 0;

  return (
    <div className="space-y-12 pb-10">

      {/* ━━━ Header Filter / Count ━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 w-fit shadow-xs gap-1">
          {(["all", "5", "10"] as Range[]).map((r) => (
            <button 
              key={r} 
              type="button" 
              onClick={() => setRange(r)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                range === r 
                  ? "bg-white dark:bg-slate-800 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-[#1cb0f6] shadow-xs" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {r === "all" ? "Tüm Zamanlar" : `Son ${r} Sınav`}
            </button>
          ))}
        </div>
        <span className="text-xs font-black text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border-2 border-b-2 border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl shadow-2xs w-fit">
          {viewType === "genel" ? `${stats?.count ?? 0} genel deneme` : `${bransStats?.count ?? 0} branş denemesi`} gösteriliyor
        </span>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          GENEL DENEME ANALİZ DETAYLARI
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {viewType === "genel" && stats && (
        <>
          {/* ━━━ 1 · Genel Bakış ━━━ */}
          <Section
            title="Genel Bakış"
            desc="Sınav skorlarınızın özet tablosu. Çalışmalarınızın genel seyrini buradan takip edebilirsiniz."
            icon={<AppleEmoji emoji="📊" size={32} />}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <SummaryCard label="Net Ortalaması" value={formatNet(stats.avg)} sub="120 soru üzerinden" accent emoji="🔥" />
              <SummaryCard label="En Yüksek Net" value={formatNet(stats.best)} sub={`Tahmini P3: ${estimateP3Score(stats.best).toFixed(2)}`} emoji="👑" />
              <SummaryCard 
                label="Ortalama Süre" 
                value={stats.avgDuration ? formatDuration(Math.round(stats.avgDuration)) : "-"} 
                sub={stats.avgSecondsPerQuestion ? `Soru başı ~${Math.round(stats.avgSecondsPerQuestion)} sn` : "Süre kaydı bulunmuyor"} 
                emoji="⏱️" 
              />
              <SummaryCard label="Tahmini P3 Puanı" value={stats.p3.toFixed(2)} sub="Net ortalamanıza göre" highlight emoji="🎓" />
            </div>

            <div className="mt-8 p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs">
              <h4 className="text-[13px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">Denge Grafiği</h4>
              <div className="space-y-6">
                <BalanceBar label="Genel Yetenek" value={stats.gyAvg} max={60} color="bg-[#1cb0f6]" textColor="text-[#1cb0f6]" />
                <BalanceBar label="Genel Kültür" value={stats.gkAvg} max={60} color="bg-[#ce82ff]" textColor="text-[#ce82ff]" />
              </div>
            </div>
          </Section>

          {/* ━━━ 2 · Gelişim Grafiği ━━━ */}
          <Section
            title="Net Gelişim Eğrisi"
            desc="Sınavdan sınava olan net değişimlerinizi ve trendinizi gösterir."
            icon={<AppleEmoji emoji="📈" size={32} />}
          >
            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 text-xs font-black w-fit mb-8 shadow-xs">
              {([
                { key: "total" as const, label: "Toplam Net", icon: "🌟" },
                { key: "gy" as const, label: "Genel Yetenek", icon: "🧠" },
                { key: "gk" as const, label: "Genel Kültür", icon: "🌍" },
              ]).map((m) => (
                <button key={m.key} type="button" onClick={() => setActiveMetric(m.key)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 z-10 cursor-pointer ${
                    activeMetric === m.key ? "text-slate-800 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}>
                  {activeMetric === m.key && (
                    <motion.div
                      layoutId="metricTab"
                      className="absolute inset-0 bg-white dark:bg-slate-800 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xs rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 text-sm"><AppleEmoji emoji={m.icon} size={16} /></span>
                  <span className="relative z-10">{m.label}</span>
                </button>
              ))}
            </div>

            <GenelRechartsTrend stats={stats} activeMetric={activeMetric} targetNet={targetNet} />

            {stats.improvement !== 0 && stats.count > 1 && (
              <div className="mt-4 flex justify-center">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black shadow-xs border-2 border-b-2 ${stats.improvement > 0 ? "bg-[#e5f9e7] text-[#58cc02] border-[#58cc02]" : "bg-[#ffebeb] text-[#ff4b4b] border-[#ff4b4b]"}`}>
                  <AppleEmoji emoji={stats.improvement > 0 ? "🚀" : "📉"} size={18} />
                  İlk denemeden bu yana {stats.improvement > 0 ? "+" : ""}{formatNet(stats.improvement)} net {stats.improvement > 0 ? "ilerleme!" : "gerileme."}
                </span>
              </div>
            )}
          </Section>

          {/* ━━━ 3 · Hedef Belirleme (Gamified Path) ━━━ */}
          {!isReadOnly && (
            <Section title="Hedefine Doğru İlerle" desc="Koyduğun hedefe ulaşmak için önündeki yolu takip et." icon={<AppleEmoji emoji="🎯" size={32} />}>
              <div className="w-full bg-white dark:bg-[#1e293b] rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)] border-2 border-slate-100 dark:border-white/5 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

                <div className="flex flex-col gap-10 sm:gap-14 relative z-10">
                  
                  {/* Top: Stats Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="text-center flex-1">
                      <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">Mevcut Ortalaman</p>
                      <div className="flex items-baseline justify-center gap-2">
                        <p className="text-5xl sm:text-6xl font-black font-mono text-slate-800 dark:text-white leading-none">
                          {formatNet(stats.avg)}
                        </p>
                        <span className="text-xl font-black text-slate-400">net</span>
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col justify-center flex-1 px-4 mt-4">
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full relative overflow-hidden">
                        <motion.div 
                          className="absolute top-0 left-0 bottom-0 bg-[#58cc02]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (stats.avg / targetNet) * 100)}%` }}
                          transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        />
                      </div>
                      <p className="text-center text-xs font-black text-slate-400 mt-3">
                        Hedefin %{Math.round(Math.min(100, (stats.avg / targetNet) * 100))}'ine ulaştın!
                      </p>
                    </div>

                    <div className="text-center flex-1">
                      <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1 flex justify-center items-center gap-1.5">
                        Yeni Hedefin
                      </p>
                      <div className="flex items-baseline justify-center gap-2 text-[#1cb0f6]">
                        <p className="text-5xl sm:text-6xl font-black font-mono leading-none">
                          {targetNet}
                        </p>
                        <span className="text-xl font-black opacity-80">net</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Interactive Path Slider */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-6 sm:p-10 border-2 border-slate-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 flex items-center justify-center">
                          <AppleEmoji emoji="🎯" size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 dark:text-white">Hedefini Güncelle</p>
                          <p className="text-xs font-semibold text-slate-500">Hedefini artır, daha iyisini başar!</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tahmini P3 Puanı</p>
                        <p className="text-2xl font-black font-mono text-[#ff9600] leading-none">{estimateP3Score(targetNet).toFixed(2)}</p>
                      </div>
                    </div>

                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-8"
                      value={[targetNet]}
                      min={60}
                      max={115}
                      step={1}
                      onValueChange={(val) => onTargetNetChange(val[0])}
                    >
                      <Slider.Track className="bg-slate-200 dark:bg-slate-700 relative grow rounded-full h-4 sm:h-5 shadow-inner overflow-hidden">
                        <Slider.Range className="absolute bg-[#1cb0f6] rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb
                        className="block w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full border-[3px] border-[#1cb0f6] shadow-[0_4px_10px_rgba(28,176,246,0.3)] hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#1cb0f6]/20 transition-colors cursor-grab active:cursor-grabbing flex items-center justify-center"
                        aria-label="Hedef Net"
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#1cb0f6]" />
                      </Slider.Thumb>
                    </Slider.Root>
                    <div className="flex justify-between w-full mt-3 text-sm font-black text-slate-400 px-2">
                      <span>60 Net</span>
                      <span>115 Net</span>
                    </div>
                  </div>

                  {/* Bottom: Motivation Badge */}
                  <div className="flex justify-center">
                    {remaining > 0 ? (
                      <div className="inline-flex items-center gap-3 px-6 py-4 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl font-black border-2 border-amber-200 dark:border-amber-500/20">
                        <AppleEmoji emoji="🔥" size={24} className="animate-bounce" />
                        <span className="text-sm sm:text-base">Hedefe ulaşmana sadece <span className="font-black text-amber-500 text-lg sm:text-xl px-1">{formatNet(remaining)} net</span> kaldı! Devam et!</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-3 px-6 py-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black border-2 border-emerald-200 dark:border-emerald-500/20">
                        <AppleEmoji emoji="🎉" size={28} className="animate-bounce" /> 
                        <span className="text-sm sm:text-base">Mükemmel! Mevcut hedefini aştın. Yeni bir hedef belirleme zamanı!</span>
                      </div>
                    )}
                  </div>
                  
                </div>
              </div>
            </Section>
          )}

          {/* ━━━ 4 · Ders Bazlı Kırılım (Cards) ━━━ */}
          <Section title="Ders Karnen" desc="Derslerin detaylı analizleri. En yüksek ve en düşük başarı oranlarını incele." icon={<BookOpen className="w-8 h-8 text-purple-500" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.subjects.map((s, i) => {
                const pct = s.questionCount > 0 ? (s.avgNet / s.questionCount) * 100 : 0;
                
                return (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-6 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#1cb0f6] transition-all flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: s.color }} />
                    <div className="flex justify-between items-start mb-5 pt-1">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center border-2 border-b-4 shadow-xs" style={{ backgroundColor: `${s.color}15`, borderColor: s.color }}>
                          <AppleEmoji emoji={s.icon} size={22} />
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-slate-800 dark:text-white leading-tight">{s.title}</p>
                          <p className="text-[11px] font-bold text-slate-400 mt-0.5">{s.category} • {s.questionCount} Soru</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-xl text-xs font-black flex flex-col items-center justify-center border-2 border-b-2 shadow-2xs ${
                        s.accuracy >= 70 ? "bg-[#e5f9e7] border-[#58cc02] text-[#58cc02] dark:bg-[#58cc02]/20" : 
                        s.accuracy >= 45 ? "bg-amber-50 border-amber-400 text-amber-600 dark:bg-amber-500/20" : 
                        "bg-[#ffebeb] border-[#ff4b4b] text-[#ff4b4b] dark:bg-[#ff4b4b]/20"
                      }`}>
                        <span className="opacity-70 text-[9px] uppercase tracking-wider mb-0.5">Başarı</span>
                        <span>%{Math.round(s.accuracy)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mb-2">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ortalama Net</p>
                      <div className="flex items-baseline gap-1">
                        <p className="text-2xl font-black font-mono leading-none" style={{ color: s.color }}>{formatNet(s.avgNet)}</p>
                      </div>
                    </div>

                    <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full border-2 border-slate-200 dark:border-slate-700 p-[2px] shadow-inner overflow-hidden mb-4 flex">
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: s.color }}
                        initial={{ width: 0 }} animate={{ width: `${Math.min(100, pct)}%` }} transition={{ type: "spring", stiffness: 60, damping: 15 }} />
                    </div>

                    <div className="flex justify-between text-xs font-black font-mono pt-1">
                      <span className="px-2.5 py-1 rounded-xl bg-[#e5f9e7] dark:bg-[#58cc02]/20 text-[#58cc02] border-2 border-b-2 border-[#58cc02]">{s.avgCorrect.toFixed(1)} D</span>
                      <span className="px-2.5 py-1 rounded-xl bg-[#ffebeb] dark:bg-[#ff4b4b]/20 text-[#ff4b4b] border-2 border-b-2 border-[#ff4b4b]">{s.avgWrong.toFixed(1)} Y</span>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-2 border-b-2 border-slate-200 dark:border-slate-600">{s.avgEmpty.toFixed(1)} B</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Section>

          {/* ━━━ Yayınevi Bazlı Başarı & Performans Analizi ━━━ */}
          {publisherStats.length > 0 && (
            <Section 
              title="Yayınevi Bazlı Performans Analizi" 
              desc="Çözdüğünüz yayınlara göre net ortalamalarınız ve başarı karşılaştırmanız." 
              icon={<AppleEmoji emoji="🏷️" size={32} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {publisherStats.map((pub, idx) => {
                  const themeColor = "#1cb0f6";

                  return (
                    <motion.div
                      key={pub.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-6 rounded-[2.25rem] border-2 border-b-4 relative overflow-hidden flex flex-col justify-between shadow-xs transition-all ${
                        idx === 0 
                          ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white" 
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                      }`}
                      style={
                        idx === 0
                          ? { borderColor: themeColor, borderBottomColor: themeColor }
                          : {}
                      }
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span 
                            className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center border-2 ${
                              idx === 0 ? "text-white shadow-xs" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                            }`}
                            style={idx === 0 ? { backgroundColor: themeColor, borderColor: themeColor } : {}}
                          >
                            #{idx + 1}
                          </span>
                          <h4 className="text-base font-black text-slate-800 dark:text-white truncate max-w-[150px]">
                            {pub.name}
                          </h4>
                        </div>

                        {idx === 0 && (
                          <span 
                            className="px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1 border"
                            style={{ backgroundColor: `${themeColor}18`, borderColor: `${themeColor}40`, color: themeColor }}
                          >
                            <AppleEmoji emoji="👑" size={12} color={themeColor} /> En Yüksek Başarı
                          </span>
                        )}
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Ortalama Net</span>
                          <span className="text-2xl font-black font-mono leading-none" style={{ color: themeColor }}>{formatNet(pub.avgNet)}</span>
                        </div>

                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden flex">
                          <div 
                            className="h-full rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (pub.avgNet / 120) * 100)}%`, backgroundColor: themeColor }} 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-center font-mono">
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Sınav</span>
                          <span className="text-xs font-black text-slate-800 dark:text-white">{pub.count} Adet</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Rekor</span>
                          <span className="text-xs font-black" style={{ color: themeColor }}>{formatNet(pub.bestNet)}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Başarı</span>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-200">%{Math.round(pub.accuracy)}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ━━━ 5 · Tavsiyeler ━━━ */}
          <Section title="Akıllı Tavsiyeler" desc="Sonuçlarına göre oluşturulan kişisel koçluk notların." icon={<AppleEmoji emoji="💡" size={32} />}>
            <div className="grid md:grid-cols-2 gap-5">
              {stats.mostWrong && (
                <Tip 
                  emoji="⚠️" 
                  title="Dikkat: Çok Hata Yapıyorsun" 
                  badgeColor={{ bg: "#ffebeb", border: "#ff4b4b", borderBottom: "#ea2b2b" }}
                >
                  <strong className="font-black text-slate-800 dark:text-slate-100">{stats.mostWrong.title}</strong> dersinde soruların %{Math.round(stats.mostWrong.wr * 100)}'unu yanlış yapıyorsun. Yanlış yaptığın konuları tekrar etmeden yeni denemeye geçme!
                </Tip>
              )}
              {stats.mostEmpty && (
                <Tip 
                  emoji="⏱️" 
                  title="Süre veya Bilgi Eksikliği" 
                  badgeColor={{ bg: "#fffbeb", border: "#f59e0b", borderBottom: "#d97706" }}
                >
                  <strong className="font-black text-slate-800 dark:text-slate-100">{stats.mostEmpty.title}</strong> dersinde soruların %{Math.round(stats.mostEmpty.er * 100)}'unu boş bırakıyorsun. Turlama tekniğini daha iyi kullanarak süreni yönetebilirsin.
                </Tip>
              )}
              <Tip 
                emoji="⚖️" 
                title="GY / GK Dengen" 
                badgeColor={{ bg: "#ddf4ff", border: "#1cb0f6", borderBottom: "#1899d6" }}
              >
                {stats.gyAvg < stats.gkAvg
                  ? "Genel Yetenek puanın daha düşük. Paragraf ve matematik çözme hızını artırmaya odaklan."
                  : "Genel Kültür puanın daha düşük. Tarih, Coğrafya ve Vatandaşlık okumalarını sıklaştır."}
              </Tip>
              <Tip 
                emoji="✨" 
                title="Gizli Potansiyelin" 
                badgeColor={{ bg: "#e5f9e7", border: "#58cc02", borderBottom: "#46a302" }}
              >
                Tüm yanlış ve boş sorularını doğruya çevirirsen <span className="inline-block px-2 py-0.5 rounded-lg bg-[#e5f9e7] dark:bg-[#58cc02]/20 border border-[#58cc02]/40 font-black font-mono text-[#58cc02]">+{formatNet(120 - stats.avg)} net</span> kazanabilirsin. Hatalarından öğrenmek en büyük sıçramayı yaptırır!
              </Tip>
            </div>
          </Section>
        </>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BRANŞ DENEME ANALİZ DETAYLARI
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {viewType === "brans" && bransStats && (
        <>
          <div className="flex gap-2.5 p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs overflow-x-auto no-scrollbar snap-x">
            {availableBransSubjects.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedBransSubjectId(sub.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-black text-xs transition-all snap-start cursor-pointer ${
                  selectedBransSubjectId === sub.id 
                    ? "bg-white dark:bg-slate-800 border-2 border-b-4 text-slate-800 dark:text-white shadow-xs" 
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white border-2 border-transparent"
                }`}
                style={
                  selectedBransSubjectId === sub.id
                    ? { borderColor: sub.color, borderBottomColor: sub.color }
                    : {}
                }
              >
                <AppleEmoji emoji={sub.icon} size={20} />
                <span>{sub.title}</span>
              </button>
            ))}
          </div>

          <Section title={`${bransStats.config?.title} İstatistikleri`} desc="Seçili branştaki genel performans özetin." icon={<BarChart3 className="w-8 h-8" style={{ color: bransStats.config?.color || "#8b5cf6" }} />}>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
              <SummaryCard label="Net Ortalaması" value={formatNet(bransStats.avg)} sub={`${bransStats.maxQuestions} soruda`} emoji="📊" accent />
              <SummaryCard label="En Yüksek Net" value={formatNet(bransStats.best)} sub="Rekorun" emoji="🏆" />
              <SummaryCard 
                label="Ortalama Süre" 
                value={bransStats.avgDuration ? formatDuration(Math.round(bransStats.avgDuration)) : "-"} 
                sub={bransStats.avgSecondsPerQuestion ? `Soru başı ~${Math.round(bransStats.avgSecondsPerQuestion)} sn` : "Süre kaydı yok"} 
                emoji="⏱️" 
              />
              <SummaryCard label="Son Sınav Neti" value={formatNet(bransStats.latest)} sub="Mevcut durum" emoji="📌" />
              <SummaryCard label="Gelişimin" value={`${bransStats.improvement > 0 ? "+" : ""}${formatNet(bransStats.improvement)}`} sub="İlk sınava göre" emoji={bransStats.improvement > 0 ? "🚀" : "📉"} highlight />
            </div>

            {/* ━━━ Soru Dağılımı ve Başarı Analizi (Chart.js Doughnut + Site Uyumlu Yan Panel) ━━━ */}
            <div className="mt-8 p-7 sm:p-9 bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-[0_4px_25px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-white/5 space-y-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1cb0f6] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1cb0f6]" />
                    </span>
                    <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Ortalama Soru Dağılımı</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mt-1">Sınav başına düşen Doğru, Yanlış ve Boş oranlarının canlı halka analizi.</p>
                </div>
                {bransStats.maxQuestions > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#58cc02]/10 text-[#58cc02] border border-[#58cc02]/20 self-start sm:self-auto">
                    <Sparkles className="w-4 h-4 text-[#58cc02]" />
                    %{((bransStats.avgC / bransStats.maxQuestions) * 100).toFixed(0)} Başarı Oranı
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-12 gap-8 items-center pt-2">
                {/* Left: Interactive Doughnut Chart with Center Metric */}
                <div className="md:col-span-5 flex justify-center relative">
                  <div className="w-56 h-56 relative flex items-center justify-center">
                    <Doughnut
                      data={{
                        labels: ["Doğru", "Yanlış", "Boş"],
                        datasets: [
                          {
                            data: [
                              bransStats.avgC > 0 ? bransStats.avgC : 0.0001,
                              bransStats.avgW > 0 ? bransStats.avgW : 0.0001,
                              bransStats.avgE > 0 ? bransStats.avgE : 0.0001,
                            ],
                            backgroundColor: ["#58cc02", "#ff4b4b", "#cbd5e1"],
                            borderColor: "transparent",
                            borderWidth: 0,
                            hoverOffset: 6,
                          },
                        ],
                      }}
                      options={{
                        cutout: "78%",
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            titleFont: { size: 12, weight: 900 },
                            bodyFont: { size: 12, weight: 800 },
                            padding: 10,
                            cornerRadius: 12,
                            callbacks: {
                              label: (ctx) => {
                                const rawVal = typeof ctx.raw === "number" ? ctx.raw : 0;
                                if (rawVal === 0.0001) return ` ${ctx.label}: 0 Soru`;
                                const formatted = Number.isInteger(rawVal) 
                                  ? rawVal.toString() 
                                  : (Math.round(rawVal * 10) / 10).toFixed(1);
                                return ` ${ctx.label}: ${formatted} Soru`;
                              },
                            },
                          },
                        },
                      }}
                    />

                    {/* Center Label inside Ring */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ort. Net</span>
                      <span className="text-3xl font-black font-mono text-slate-800 dark:text-white leading-none mt-1">
                        {formatNet(bransStats.avg)}
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-400 mt-1">/ {bransStats.maxQuestions} Soru</span>
                    </div>
                  </div>
                </div>

                {/* Right: Modern Stat Cards Column */}
                <div className="md:col-span-7 space-y-3.5">
                  {/* Doğru Card */}
                  <div className="p-4 rounded-[1.25rem] bg-[#58cc02]/5 dark:bg-[#58cc02]/10 border border-[#58cc02]/20 flex items-center justify-between transition-all hover:translate-x-1">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#58cc02] text-white flex items-center justify-center shadow-sm shadow-[#58cc02]/30">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Ortalama Doğru</p>
                        <p className="text-[11px] font-extrabold text-[#58cc02] mt-0.5">
                          %{((bransStats.avgC / bransStats.maxQuestions) * 100).toFixed(0)} Soru Oranı
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-2xl font-black text-[#58cc02]">
                        {Number.isInteger(bransStats.avgC) ? bransStats.avgC : bransStats.avgC.toFixed(1)}
                      </span>
                      <span className="text-xs font-bold text-slate-400 ml-1">/ {bransStats.maxQuestions}</span>
                    </div>
                  </div>

                  {/* Yanlış Card */}
                  <div className="p-4 rounded-[1.25rem] bg-[#ff4b4b]/5 dark:bg-[#ff4b4b]/10 border border-[#ff4b4b]/20 flex items-center justify-between transition-all hover:translate-x-1">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#ff4b4b] text-white flex items-center justify-center shadow-sm shadow-[#ff4b4b]/30">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Ortalama Yanlış</p>
                        <p className="text-[11px] font-extrabold text-[#ff4b4b] mt-0.5">
                          %{((bransStats.avgW / bransStats.maxQuestions) * 100).toFixed(0)} Hata Oranı
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-2xl font-black text-[#ff4b4b]">
                        {Number.isInteger(bransStats.avgW) ? bransStats.avgW : bransStats.avgW.toFixed(1)}
                      </span>
                      <span className="text-xs font-bold text-slate-400 ml-1">/ {bransStats.maxQuestions}</span>
                    </div>
                  </div>

                  {/* Boş Card */}
                  <div className="p-4 rounded-[1.25rem] bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between transition-all hover:translate-x-1">
                    <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-400 dark:bg-slate-600 text-white flex items-center justify-center shadow-sm">
                        <MinusCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Ortalama Boş</p>
                        <p className="text-[11px] font-extrabold text-slate-400 mt-0.5">
                          %{((bransStats.avgE / bransStats.maxQuestions) * 100).toFixed(0)} Pas Oranı
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-2xl font-black text-slate-700 dark:text-slate-200">
                        {Number.isInteger(bransStats.avgE) ? bransStats.avgE : bransStats.avgE.toFixed(1)}
                      </span>
                      <span className="text-xs font-bold text-slate-400 ml-1">/ {bransStats.maxQuestions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ━━━ Gelişim Eğrisi (Recharts Ultra Modern Interaktif Trend Grafiği) ━━━ */}
          <BransRechartsTrend bransStats={bransStats} />

          {/* ━━━ Yayınevi Bazlı Başarı & Performans Analizi ━━━ */}
          {publisherStats.length > 0 && (
            <div className="mt-14">
              <Section 
                title={`${bransStats.config?.title} - Yayınevi Bazlı Analiz`} 
                desc="Seçili branşta çözdüğünüz yayınlara göre net ortalamalarınız." 
                icon={<AppleEmoji emoji="🏷️" size={32} />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {publisherStats.map((pub, idx) => {
                    const subColor = bransStats.config?.color || "#1cb0f6";

                    return (
                      <motion.div
                        key={pub.name}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-6 rounded-[2.25rem] border-2 border-b-4 relative overflow-hidden flex flex-col justify-between shadow-xs transition-all ${
                          idx === 0 
                            ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white" 
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                        }`}
                        style={
                          idx === 0
                            ? { borderColor: subColor, borderBottomColor: subColor }
                            : {}
                        }
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span 
                              className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center border-2 ${
                                idx === 0 ? "text-white shadow-xs" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                              }`}
                              style={idx === 0 ? { backgroundColor: subColor, borderColor: subColor } : {}}
                            >
                              #{idx + 1}
                            </span>
                            <h4 className="text-base font-black text-slate-800 dark:text-white truncate max-w-[150px]">
                              {pub.name}
                            </h4>
                          </div>

                          {idx === 0 && (
                            <span 
                              className="px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1 border"
                              style={{ backgroundColor: `${subColor}18`, borderColor: `${subColor}40`, color: subColor }}
                            >
                              <AppleEmoji emoji="👑" size={12} color={subColor} /> En Yüksek Başarı
                            </span>
                          )}
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Ortalama Net</span>
                            <span className="text-2xl font-black font-mono leading-none" style={{ color: subColor }}>{formatNet(pub.avgNet)}</span>
                          </div>

                          <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden flex">
                            <div 
                              className="h-full rounded-full transition-all duration-700" 
                              style={{ width: `${Math.min(100, (pub.avgNet / bransStats.maxQuestions) * 100)}%`, backgroundColor: subColor }} 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-center font-mono">
                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Sınav</span>
                            <span className="text-xs font-black text-slate-800 dark:text-white">{pub.count} Adet</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Rekor</span>
                            <span className="text-xs font-black" style={{ color: subColor }}>{formatNet(pub.bestNet)}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Başarı</span>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-200">%{Math.round(pub.accuracy)}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Section>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function Section({ title, desc, icon, children }: { title: string; desc?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-[1.25rem] shadow-sm border border-slate-100/80 dark:border-white/5">
            <span className="text-2xl drop-shadow-sm flex items-center justify-center child-svg-large">{icon}</span>
          </div>
        )}
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">{title}</h3>
          {desc && <p className="text-sm font-black text-slate-400 mt-1">{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}



function SummaryCard({ label, value, sub, accent, highlight, emoji }: { label: string; value: string; sub: string; accent?: boolean; highlight?: boolean; emoji?: string; }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }} 
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`p-5 sm:p-6 rounded-[2rem] border-2 border-b-4 relative overflow-hidden flex flex-col justify-between h-full cursor-pointer min-w-0 shadow-xs ${
      accent ? "bg-[#58cc02] border-[#46a302] text-white" : // Duolingo Green
      highlight ? "bg-[#1cb0f6] border-[#0088cc] text-white" : // Duolingo Blue
      "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
    }`}>
      <div className="flex justify-between items-start gap-2 mb-4 relative z-10 min-w-0">
        <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider min-w-0 flex-1 leading-snug ${accent || highlight ? "text-white/90" : "text-slate-400"}`}>{label}</p>
        {emoji && (
          <AppleEmoji 
            emoji={emoji} 
            size={24} 
            color={accent || highlight ? "#ffffff" : undefined}
            className="relative z-10 shrink-0 drop-shadow-sm hover:scale-110 transition-transform" 
          />
        )}
      </div>
      <div className="relative z-10 min-w-0">
        <p className={`text-3xl sm:text-4xl leading-none font-black tracking-tight font-mono ${accent || highlight ? "text-white" : "text-slate-800 dark:text-white"}`}>{value}</p>
        {sub && <p className={`text-xs font-black mt-2 truncate ${accent || highlight ? "text-white/90" : "text-slate-400"}`}>{sub}</p>}
      </div>
      {(accent || highlight) && <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />}
    </motion.div>
  );
}

function BalanceBar({ label, value, max, color, textColor }: { label: string; value: number; max: number; color: string; textColor: string; }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-end">
        <span className="font-black text-slate-700 dark:text-slate-200 text-[15px]">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className={`font-black text-xl ${textColor}`}>{formatNet(value)}</span>
          <span className="text-xs font-black text-slate-400">/ {max}</span>
        </div>
      </div>
      <div className="h-4.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full border-2 border-slate-200 dark:border-slate-700 p-[2px] shadow-inner overflow-hidden flex">
        <motion.div 
          className={`h-full ${color} rounded-full`} 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        />
      </div>
    </div>
  );
}

function Tip({ emoji = "💡", title, badgeColor, colorClass, children }: { emoji?: string; title: string; badgeColor?: { bg: string; border: string; borderBottom: string }; colorClass?: string; children: React.ReactNode; }) {
  const bg = badgeColor?.bg || "#ddf4ff";
  const border = badgeColor?.border || "#1cb0f6";
  const borderBottom = badgeColor?.borderBottom || "#1899d6";

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#1cb0f6] transition-all flex items-start gap-5">
      <div 
        className="w-13 h-13 rounded-2xl flex items-center justify-center border-2 border-b-4 shrink-0 shadow-xs"
        style={{
          backgroundColor: bg,
          borderColor: border,
          borderBottomColor: borderBottom,
        }}
      >
        <AppleEmoji emoji={emoji} size={26} />
      </div>
      <div>
        <h4 className="text-base font-black text-slate-800 dark:text-white mb-1.5">{title}</h4>
        <p className="text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">{children}</p>
      </div>
    </div>
  );
}

function CustomRechartsTooltip({ active, payload, mainColor }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-4 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xl text-slate-800 dark:text-white text-xs space-y-2.5 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
          <span className="font-black text-slate-800 dark:text-slate-100">{data.fullName}</span>
          <span className="text-[10px] font-bold text-slate-400">{data.indexName}</span>
        </div>

        <div className="flex items-center justify-between font-black text-sm">
          <span className="text-slate-600 dark:text-slate-300">Net:</span>
          <span className="font-mono text-base font-black" style={{ color: mainColor }}>{data.net}</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px] font-black text-center">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <div className="text-[9px] opacity-80">DOĞRU</div>
            <div>{data.correct}</div>
          </div>
          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400">
            <div className="text-[9px] opacity-80">YANLIŞ</div>
            <div>{data.wrong}</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-500/10 border border-slate-200 dark:border-slate-500/20 text-slate-600 dark:text-slate-400">
            <div className="text-[9px] opacity-80">BOŞ</div>
            <div>{data.empty}</div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function renderRefLabel(text: string, color: string, align: 'right' | 'left' = 'right') {
  return (props: any) => {
    const { viewBox } = props;
    if (!viewBox) return null;
    const { x, y, width } = viewBox;
    const isRight = align === 'right';
    const posX = isRight ? x + width - 15 : x + 25;
    const textAnchor = isRight ? 'end' : 'start';

    return (
      <g transform={`translate(${posX}, ${y - 8})`}>
        <text
          x={0}
          y={0}
          fill="none"
          stroke="rgba(15, 23, 42, 0.95)"
          strokeWidth={6}
          strokeLinejoin="round"
          fontSize={12}
          fontWeight={900}
          textAnchor={textAnchor}
        >
          {text}
        </text>
        <text
          x={0}
          y={0}
          fill={color}
          fontSize={12}
          fontWeight={900}
          textAnchor={textAnchor}
        >
          {text}
        </text>
      </g>
    );
  };
}

function GenelRechartsTrend({ stats, activeMetric, targetNet }: { stats: any; activeMetric: "total" | "gy" | "gk"; targetNet: number }) {
  const mainColor = activeMetric === "total" ? "#1cb0f6" : activeMetric === "gy" ? "#af52de" : "#ce82ff";
  const [chartView, setChartView] = useState<"net" | "breakdown">("net");

  const chartData = useMemo(() => {
    return stats.trend.map((d: any, idx: number) => {
      let netVal = d.net;
      let cVal = d.correct;
      let wVal = d.wrong;
      let eVal = d.empty;

      if (activeMetric === "gy") {
        netVal = d.gyNet;
        cVal = d.gyC;
        wVal = d.gyW;
        eVal = d.gyE;
      } else if (activeMetric === "gk") {
        netVal = d.gkNet;
        cVal = d.gkC;
        wVal = d.gkW;
        eVal = d.gkE;
      }

      return {
        indexName: `#${idx + 1}`,
        fullName: d.name,
        net: parseFloat(netVal.toFixed(2)),
        correct: cVal,
        wrong: wVal,
        empty: eVal,
      };
    });
  }, [stats.trend, activeMetric]);

  const nets = chartData.map((d: any) => d.net);
  const latestNet = nets.length > 0 ? nets[nets.length - 1] : 0;
  const bestNet = nets.length > 0 ? Math.max(...nets) : 0;
  const avgNet = nets.length > 0 ? nets.reduce((a: number, b: number) => a + b, 0) / nets.length : 0;
  const maxLimit = activeMetric === "total" ? 120 : 60;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-7 sm:p-9 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs space-y-6 relative overflow-hidden">
      <div 
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-30 transition-all duration-500" 
        style={{ backgroundColor: mainColor }} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: mainColor }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: mainColor }} />
            </span>
            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
              {activeMetric === "total" ? "Genel Deneme Net Gelişimi" : activeMetric === "gy" ? "Genel Yetenek Gelişimi" : "Genel Kültür Gelişimi"}
            </h3>
          </div>
          <p className="text-xs font-semibold text-slate-400">
            Sınavdan sınava anlık net seyri ve soru performansınız.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <span className="text-slate-400">Son:</span>
            <span className="font-mono text-sm" style={{ color: mainColor }}>{formatNet(latestNet)}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <span className="flex items-center gap-1"><AppleEmoji emoji="🏆" size={14} /> Rekor:</span>
            <span className="font-mono text-sm">{formatNet(bestNet)}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="flex items-center gap-1"><AppleEmoji emoji="⚡" size={14} /> Ort:</span>
            <span className="font-mono text-sm">{formatNet(avgNet)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 w-fit text-xs font-black">
        <button
          type="button"
          onClick={() => setChartView("net")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            chartView === "net"
              ? "bg-white dark:bg-slate-800 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-[#1cb0f6] shadow-xs"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <AppleEmoji emoji="📈" size={16} />
          <span>Net Değişimi</span>
        </button>
        <button
          type="button"
          onClick={() => setChartView("breakdown")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            chartView === "breakdown"
              ? "bg-white dark:bg-slate-800 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-[#1cb0f6] shadow-xs"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <AppleEmoji emoji="📊" size={16} />
          <span>Doğru / Yanlış / Boş</span>
        </button>
      </div>

      <div className="h-[340px] w-full pt-4 relative">
        <ResponsiveContainer width="100%" height={320} minWidth={0}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="genelNetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={mainColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={mainColor} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="genelCorrectGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#58cc02" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#58cc02" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />

            <XAxis 
              dataKey="indexName" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} 
              dy={8}
            />

            <YAxis 
              domain={[0, maxLimit]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
              dx={-8}
            />

            <RechartsTooltip content={<CustomRechartsTooltip mainColor={mainColor} />} />

            <ReferenceLine 
              y={avgNet} 
              stroke={mainColor} 
              strokeDasharray="4 4" 
              strokeOpacity={0.6} 
              label={renderRefLabel(`Ort: ${formatNet(avgNet)}`, mainColor, 'right')} 
            />

            {activeMetric === "total" && targetNet && (
              <ReferenceLine 
                y={targetNet} 
                stroke="#58cc02" 
                strokeDasharray="5 5" 
                strokeWidth={2}
                label={renderRefLabel(`🎯 Hedef: ${targetNet}`, '#58cc02', 'left')} 
              />
            )}

            {chartView === "net" ? (
              <Area
                type="monotone"
                dataKey="net"
                name="Net"
                stroke={mainColor}
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#genelNetGradient)"
                activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 3, fill: mainColor }}
              />
            ) : (
              <>
                <Area type="monotone" dataKey="correct" name="Doğru" stroke="#58cc02" strokeWidth={3} fill="url(#genelCorrectGradient)" />
                <Area type="monotone" dataKey="wrong" name="Yanlış" stroke="#ff4b4b" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="empty" name="Boş" stroke="#94a3b8" strokeWidth={2} fill="transparent" />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BransRechartsTrend({ bransStats }: { bransStats: any }) {
  const mainColor = bransStats.config?.color || "#1cb0f6";
  const [chartView, setChartView] = useState<"net" | "breakdown">("net");

  const chartData = useMemo(() => {
    return bransStats.trend.map((d: any, idx: number) => ({
      indexName: `#${idx + 1}`,
      fullName: d.name,
      date: d.date,
      net: parseFloat(d.net.toFixed(2)),
      correct: d.correct,
      wrong: d.wrong,
      empty: d.empty,
    }));
  }, [bransStats]);

  const latestNet = bransStats.latest;
  const bestNet = bransStats.best;
  const avgNet = bransStats.avg;

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-7 sm:p-9 border border-slate-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 relative overflow-hidden">
      <div 
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-30" 
        style={{ backgroundColor: mainColor }} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 pb-4 border-b border-slate-100 dark:border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: mainColor }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: mainColor }} />
            </span>
            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
              {bransStats.config?.title} Gelişim Trendi
            </h3>
          </div>
          <p className="text-xs font-semibold text-slate-400">
            Toplam {bransStats.count} denemede sınavdan sınava net seyri.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <span className="text-slate-400">Son:</span>
            <span className="font-mono text-sm" style={{ color: mainColor }}>{formatNet(latestNet)}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <span className="flex items-center gap-1"><AppleEmoji emoji="🏆" size={14} /> Rekor:</span>
            <span className="font-mono text-sm">{formatNet(bestNet)}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="flex items-center gap-1"><AppleEmoji emoji="⚡" size={14} /> Ort:</span>
            <span className="font-mono text-sm">{formatNet(avgNet)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-100/70 dark:bg-slate-800/70 p-1.5 rounded-2xl w-fit text-xs font-black">
        <button
          type="button"
          onClick={() => setChartView("net")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            chartView === "net"
              ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <AppleEmoji emoji="📈" size={16} />
          <span>Net Değişimi</span>
        </button>
        <button
          type="button"
          onClick={() => setChartView("breakdown")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            chartView === "breakdown"
              ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <AppleEmoji emoji="📊" size={16} />
          <span>Doğru / Yanlış / Boş</span>
        </button>
      </div>

      <div className="h-[320px] w-full pt-4 relative">
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="bransNetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={mainColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={mainColor} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="correctGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#58cc02" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#58cc02" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />

            <XAxis 
              dataKey="indexName" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} 
              dy={8}
            />

            <YAxis 
              domain={[0, bransStats.maxQuestions]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
              dx={-8}
            />

            <RechartsTooltip content={<CustomRechartsTooltip mainColor={mainColor} />} />

            <ReferenceLine 
              y={avgNet} 
              stroke={mainColor} 
              strokeDasharray="4 4" 
              strokeOpacity={0.6} 
              label={renderRefLabel(`Ort: ${formatNet(avgNet)}`, mainColor, 'right')} 
            />

            {chartView === "net" ? (
              <Area
                type="monotone"
                dataKey="net"
                name="Net"
                stroke={mainColor}
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#bransNetGradient)"
                activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 3, fill: mainColor }}
              />
            ) : (
              <>
                <Area type="monotone" dataKey="correct" name="Doğru" stroke="#58cc02" strokeWidth={3} fill="url(#correctGradient)" />
                <Area type="monotone" dataKey="wrong" name="Yanlış" stroke="#ff4b4b" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="empty" name="Boş" stroke="#94a3b8" strokeWidth={2} fill="transparent" />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
