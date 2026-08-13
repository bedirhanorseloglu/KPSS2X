"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  DenemeRecord,
  evaluateDeneme,
  formatNet,
  estimateP3Score,
  formatDuration,
} from "@/lib/denemeUtils";
import { DENEME_SUBJECTS, getSubjectQuestionCount } from "@/lib/denemeConfig";
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
import RankSimulator from "./RankSimulator";
import { initialData } from "@/lib/data";
import { getSubjectTopics } from "@/lib/topicUtils";

type Props = { 
  denemeler: DenemeRecord[]; 
  allDenemeler?: DenemeRecord[]; 
  viewType?: "genel" | "brans"; 
  activeSubjectTab?: string;
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
    default: return <BookOpen className="w-5 h-5" style={{ color }} />;
  }
};

export default function DenemeAnalytics({
  denemeler,
  allDenemeler = [],
  viewType = "genel",
  activeSubjectTab,
  targetNet,
  onTargetNetChange,
  onAdd,
  isReadOnly = false,
}: Props) {
  const [range, setRange] = useState<Range>("all");
  const [activeMetric, setActiveMetric] = useState<"total" | "gy" | "gk">("total");
  const [selectedBransSubjectId, setSelectedBransSubjectId] = useState<string>(activeSubjectTab || "");

  const availableBransSubjects = useMemo(() => {
    if (viewType !== "brans") return [];
    const ids = new Set(allDenemeler.filter(d => d.examType === "brans").map(d => d.bransSubjectId).filter(Boolean));
    return DENEME_SUBJECTS.filter(s => ids.has(s.id));
  }, [allDenemeler, viewType]);

  useEffect(() => {
    if (activeSubjectTab) {
      setSelectedBransSubjectId(activeSubjectTab);
    }
  }, [activeSubjectTab]);

  useEffect(() => {
    if (viewType === "brans" && availableBransSubjects.length > 0) {
      if (!selectedBransSubjectId || !availableBransSubjects.find(s => s.id === selectedBransSubjectId)) {
        setSelectedBransSubjectId(activeSubjectTab || availableBransSubjects[0].id);
      }
    }
  }, [viewType, availableBransSubjects, selectedBransSubjectId, activeSubjectTab]);

  const active = useMemo(() => {
    const list = viewType === "genel" ? denemeler.filter(d => d.examType !== "brans") : denemeler;
    return range === "all" ? list : list.slice(0, parseInt(range, 10));
  }, [denemeler, range, viewType]);

  /* ── General Mode Stats ── */
  const stats = useMemo(() => {
    if (viewType !== "genel" || active.length === 0) return null;
    const evals = active.map((d) => ({ d, r: evaluateDeneme(d.scores, d.examType) }));
    const nets = evals.map((e) => e.r.totalNet);
    const avg = nets.reduce((a, b) => a + b, 0) / nets.length;
    const best = Math.max(...nets);

    const subjects = DENEME_SUBJECTS.map((sub) => {
      let tc = 0, tw = 0, te = 0, cnt = 0;
      evals.forEach((e) => {
        const s = e.r.subjects.find((x) => x.subjectId === sub.id);
        if (s) {
          tc += s.correct;
          tw += s.wrong;
          te += s.empty;
          cnt++;
        }
      });
      const ac = cnt ? tc / cnt : 0;
      const aw = cnt ? tw / cnt : 0;
      const ae = cnt ? te / cnt : 0;

      const net = cnt ? Math.round((ac - aw / 4) * 100) / 100 : 0;
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

    const bestEval = evals.reduce((max, curr) => curr.r.totalNet > max.r.totalNet ? curr : max, evals[0]);
    const bestP3 = bestEval ? estimateP3Score(bestEval.r.gyNet, bestEval.r.gkNet) : estimateP3Score(best);

    return {
      count: active.length, avg, best, latest: nets[0],
      subjects, strongest: sorted[0], weakest: sorted[sorted.length - 1],
      trend, gyAvg, gkAvg,
      p3: estimateP3Score(gyAvg, gkAvg),
      bestP3,
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
    const maxQuestions = getSubjectQuestionCount(selectedBransSubjectId, "brans");

    const evals = list.map(d => {
      const s = d.scores.find(x => x.subjectId === selectedBransSubjectId);
      const correct = s?.correct ?? 0;
      const wrong = s?.wrong ?? 0;
      const empty = s?.empty ?? 0;
      const net = Math.round((correct - wrong / 4) * 100) / 100;
      return { correct, wrong, empty, net, name: d.name, date: d.date };
    });

    const nets = evals.map(e => e.net);
    const avg = Math.round((nets.reduce((a, b) => a + b, 0) / nets.length) * 100) / 100;
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
      const totalQuestions = data.count * (viewType === "brans" ? (getSubjectQuestionCount(selectedBransSubjectId, "brans") || 30) : 120);
      const accuracy = totalQuestions > 0 ? Math.max(0, Math.round((data.totalNet / totalQuestions) * 100)) : 0;
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
            icon={<AppleEmoji emoji="📊" size={32} color="#1cb0f6" />}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <SummaryCard label="Net Ortalaması" value={formatNet(stats.avg)} sub="120 soru üzerinden" accent emoji="🔥" />
              <SummaryCard label="En Yüksek Net" value={formatNet(stats.best)} sub={`Tahmini P3: ${stats.bestP3.toFixed(2)}`} emoji="👑" />
              <SummaryCard 
                label="Ortalama Süre" 
                value={stats.avgDuration ? formatDuration(Math.round(stats.avgDuration)) : "-"} 
                sub={stats.avgSecondsPerQuestion ? `Soru başı ~${Math.round(stats.avgSecondsPerQuestion)} sn` : "Süre kaydı bulunmuyor"} 
                emoji="⏱️" 
              />
              <SummaryCard label="Tahmini P3 Puanı" value={stats.p3.toFixed(2)} sub="Ortalama netinize göre" highlight emoji="🎓" />
            </div>

            <DengeGrafigi stats={stats} />
          </Section>

          {/* ━━━ 2 · Gelişim Grafiği ━━━ */}
          <Section
            title="Net Gelişim Eğrisi"
            desc="Sınavdan sınava olan net değişimlerinizi ve trendinizi gösterir."
            icon={<AppleEmoji emoji="📈" size={32} color="#1cb0f6" />}
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
                  <span className="relative z-10 text-sm"><AppleEmoji emoji={m.icon} size={16} color="#1cb0f6" /></span>
                  <span className="relative z-10">{m.label}</span>
                </button>
              ))}
            </div>

            <GenelRechartsTrend stats={stats} activeMetric={activeMetric} targetNet={targetNet} />

            {stats.improvement !== 0 && stats.count > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-2.5 flex items-center gap-3 shadow-2xs">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 border-b-2 shrink-0 ${
                    stats.improvement > 0
                      ? "bg-[#58cc02] border-[#46a302] text-white"
                      : "bg-[#ff4b4b] border-[#ea2b2b] text-white"
                  }`}>
                    <AppleEmoji emoji={stats.improvement > 0 ? "🚀" : "📉"} size={16} color="#ffffff" />
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-white leading-none">
                    İlk denemeden bu yana <span className={`font-mono font-black ${stats.improvement > 0 ? "text-[#58cc02]" : "text-[#ff4b4b]"}`}>{stats.improvement > 0 ? "+" : ""}{formatNet(stats.improvement)} net</span> {stats.improvement > 0 ? "ilerleme!" : "gerileme."}
                  </span>
                </div>
              </div>
            )}
          </Section>

          {/* ━━━ 3 · Hedef Belirleme & ÖSYM Tahmini Sıralama Simülatörü ━━━ */}
          <RankSimulator 
            currentAvgNet={stats.avg} 
            currentGyAvgNet={stats.gyAvg}
            currentGkAvgNet={stats.gkAvg}
            bestNet={stats.best} 
            targetNet={targetNet}
            onTargetNetChange={onTargetNetChange}
            isReadOnly={isReadOnly}
          />

          {/* ━━━ 4 · Ders Bazlı Kırılım (Compact Single Row 5-Column Grid) ━━━ */}
          <Section title="Ders Karnen" desc="Derslerin detaylı analizleri. En yüksek ve en düşük başarı oranlarını incele." icon={<AppleEmoji emoji="📚" size={32} color="#1cb0f6" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
              {stats.subjects.map((s, i) => {
                const pct = s.questionCount > 0 ? (s.avgNet / s.questionCount) * 100 : 0;
                
                return (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="p-4 sm:p-4.5 rounded-[1.75rem] bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-[1.02] flex flex-col justify-between relative overflow-hidden group">
                    <div>
                      {/* Top Header */}
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-b-4 shrink-0 shadow-xs" style={{ backgroundColor: `${s.color}15`, borderColor: `${s.color}60` }}>
                            <AppleEmoji emoji={s.icon} size={20} color={s.color} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-800 dark:text-white leading-tight truncate">{s.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-300 mt-0.5">{s.questionCount} Soru</p>
                          </div>
                        </div>

                        <div className={`px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0 border border-b-2 shadow-2xs ${
                          s.accuracy >= 70 ? "bg-[#58cc02] text-white border-green-700" : 
                          s.accuracy >= 45 ? "bg-[#ff9500] text-white border-amber-700" : 
                          "bg-[#ff4b4b] text-white border-rose-700"
                        }`}>
                          %{Math.round(s.accuracy)}
                        </div>
                      </div>

                      {/* Net & Recessed Progress Track */}
                      <div className="space-y-1.5 my-3">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider">Ort. Net</span>
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-2xl font-black font-mono leading-none" style={{ color: s.color }}>{formatNet(s.avgNet)}</span>
                            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-300">/{s.questionCount}</span>
                          </div>
                        </div>

                        <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full border-2 border-slate-200 dark:border-slate-700 p-[1.5px] shadow-inner overflow-hidden flex items-center">
                          <motion.div className="h-full rounded-full relative flex items-center justify-end pr-0.5" style={{ backgroundColor: s.color }}
                            initial={{ width: 0 }} animate={{ width: `${Math.min(100, pct)}%` }} transition={{ type: "spring", stiffness: 60, damping: 15 }}>
                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-t-full pointer-events-none" />
                            {pct > 5 && <div className="w-2 h-2 rounded-full bg-white shadow-md shrink-0 relative z-10" />}
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* 3D Doğru / Yanlış / Boş Compact Chips */}
                    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t-2 border-slate-100 dark:border-slate-700/60 text-[10px] font-black font-mono text-center">
                      <div className="px-1.5 py-1 rounded-lg bg-[#58cc02] text-white border border-b-2 border-green-700 shadow-2xs flex items-center justify-center gap-0.5" title="Doğru">
                        <AppleEmoji emoji="✅" size={10} color="white" />
                        <span>{s.avgCorrect.toFixed(1)}</span>
                      </div>
                      <div className="px-1.5 py-1 rounded-lg bg-[#ff4b4b] text-white border border-b-2 border-rose-700 shadow-2xs flex items-center justify-center gap-0.5" title="Yanlış">
                        <AppleEmoji emoji="❌" size={10} color="white" />
                        <span>{s.avgWrong.toFixed(1)}</span>
                      </div>
                      <div className="px-1.5 py-1 rounded-lg bg-[#ff9500] text-white border border-b-2 border-amber-700 shadow-2xs flex items-center justify-center gap-0.5" title="Boş">
                        <AppleEmoji emoji="⚪" size={10} color="white" />
                        <span>{s.avgEmpty.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Section>

          {/* ━━━ 5 · Müfredat & Konu Hata Matrisi ━━━ */}
          <TopicErrorMatrixSection
            denemeler={denemeler}
            viewType={viewType}
            selectedBransSubjectId={selectedBransSubjectId}
          />

          {/* ━━━ 6 · Yayınevi Bazlı Başarı & Performans Analizi (Signature 3D Cards) ━━━ */}
          {publisherStats.length > 0 && (
            <Section 
              title="Yayınevi Bazlı Performans Analizi" 
              desc="Çözdüğünüz yayınlara göre net ortalamalarınız ve başarı karşılaştırmanız." 
              icon={<AppleEmoji emoji="🏷️" size={32} color="#1cb0f6" />}
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
                          <span 
                            className="px-3 py-1 text-[10px] font-black rounded-2xl uppercase tracking-wider flex items-center gap-1 bg-sky-50 dark:bg-sky-950/60 text-[#1cb0f6] border-2 border-b-2 border-sky-200 dark:border-sky-800 shadow-2xs"
                          >
                            <AppleEmoji emoji="👑" size={12} color="#1cb0f6" /> En Yüksek Başarı
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider">Ortalama Net</span>
                          <span className="text-3xl font-black font-mono leading-none text-[#1cb0f6]">{formatNet(pub.avgNet)}</span>
                        </div>

                        {/* Recessed 3D Progress Bar */}
                        <div className="h-4 w-full bg-slate-100 dark:bg-slate-900 rounded-full border-2 border-slate-200 dark:border-slate-700 p-[1.5px] shadow-inner overflow-hidden flex items-center">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-[#1cb0f6] to-[#0284c7] rounded-full relative flex items-center justify-end pr-0.5" 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (pub.avgNet / 120) * 100)}%` }} 
                            transition={{ type: "spring", stiffness: 60, damping: 15 }}
                          >
                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-t-full pointer-events-none" />
                            {(pub.avgNet / 120) * 100 > 5 && <div className="w-2 h-2 rounded-full bg-white shadow-md shrink-0 relative z-10" />}
                          </motion.div>
                        </div>
                      </div>

                      {/* 3D Alt Metrik Kutuları */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t-2 border-slate-100 dark:border-slate-700/60 text-center font-mono">
                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs">
                          <span className="text-[9px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest block mb-0.5">Sınav</span>
                          <span className="text-xs font-black text-slate-800 dark:text-white">{pub.count} Adet</span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-2 border-b-4 border-amber-300 dark:border-amber-800 shadow-2xs">
                          <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest block mb-0.5">Rekor</span>
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400">{formatNet(pub.bestNet)}</span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-[#e5f9e7] dark:bg-[#58cc02]/20 border-2 border-b-4 border-[#58cc02] border-b-[#46a302] shadow-2xs">
                          <span className="text-[9px] font-black text-[#58cc02] uppercase tracking-widest block mb-0.5">Başarı</span>
                          <span className="text-xs font-black text-[#58cc02]">%{Math.round(pub.accuracy)}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ━━━ 7 · Akıllı Tavsiyeler (EN ALT BÖLÜM - Kullanıcı Konu Hata Verileri Entegre Edildi) ━━━ */}
          <SmartTopicRecommendationsSection denemeler={denemeler} stats={stats} viewType={viewType} />
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

            {/* ━━━ Soru Dağılımı ve Başarı Analizi (Chart.js Doughnut + 3D Yan Panel) ━━━ */}
            <div className="mt-8 p-7 sm:p-9 bg-white dark:bg-slate-800 rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs space-y-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: bransStats.config?.color || "#1cb0f6" }} />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: bransStats.config?.color || "#1cb0f6" }} />
                    </span>
                    <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Ortalama Soru Dağılımı</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mt-1">Sınav başına düşen Doğru, Yanlış ve Boş oranlarının canlı halka analizi.</p>
                </div>
                {bransStats.maxQuestions > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-[#e5f9e7] dark:bg-[#58cc02]/20 text-[#58cc02] border-2 border-b-2 border-[#58cc02] shadow-2xs self-start sm:self-auto">
                    %{Math.max(0, Math.round((bransStats.avg / bransStats.maxQuestions) * 100))} İsabet Oranı
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-12 gap-8 items-center pt-2">
                {/* Left: Apple Fitness Concentric Rings */}
                <div className="md:col-span-5 flex justify-center relative">
                  <AppleFitnessConcentricRings 
                    correct={bransStats.avgC}
                    wrong={bransStats.avgW}
                    empty={bransStats.avgE}
                    maxQuestions={bransStats.maxQuestions}
                    avgNet={bransStats.avg}
                    color={bransStats.config?.color || "#1cb0f6"}
                  />
                </div>

                {/* Right: Modern 3D Stat Cards Column */}
                <div className="md:col-span-7 space-y-3.5">
                  {/* Doğru Card */}
                  <div className="p-4 rounded-2xl bg-[#e5f9e7] dark:bg-[#58cc02]/20 border-2 border-b-4 border-[#58cc02] border-b-[#46a302] flex items-center justify-between transition-all hover:translate-x-1 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#58cc02] text-white flex items-center justify-center border-2 border-b-2 border-[#46a302] shadow-xs">
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
                  <div className="p-4 rounded-2xl bg-[#ffebeb] dark:bg-[#ff4b4b]/20 border-2 border-b-4 border-[#ff4b4b] border-b-[#ea2b2b] flex items-center justify-between transition-all hover:translate-x-1 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#ff4b4b] text-white flex items-center justify-center border-2 border-b-2 border-[#ea2b2b] shadow-xs">
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
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border-2 border-b-4 border-slate-200 dark:border-slate-700 flex items-center justify-between transition-all hover:translate-x-1 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-400 dark:bg-slate-600 text-white flex items-center justify-center border-2 border-b-2 border-slate-500 shadow-xs">
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

          {/* ━━━ Müfredat & Konu Hata Matrisi ━━━ */}
          <TopicErrorMatrixSection
            denemeler={denemeler}
            viewType={viewType}
            selectedBransSubjectId={selectedBransSubjectId}
          />

          {/* ━━━ Yayınevi Bazlı Başarı & Performans Analizi (Signature 3D Cards) ━━━ */}
          {publisherStats.length > 0 && (
            <Section 
              title={`${bransStats.config?.title} - Yayınevi Bazlı Analiz`} 
              desc="Seçili branşta çözdüğünüz yayınlara göre net ortalamalarınız ve başarı karşılaştırmanız." 
              icon={<AppleEmoji emoji={bransStats.config?.icon || "🏷️"} size={32} color={bransStats.config?.color} />}
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
                      className={`p-6 rounded-[2.25rem] border-2 border-b-4 relative overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:scale-[1.01] ${
                        idx === 0 
                          ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white shadow-md" 
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                      }`}
                      style={
                        idx === 0
                          ? { borderColor: subColor, borderBottomColor: subColor }
                          : {}
                      }
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span 
                            className="w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center border-2 border-b-4 shrink-0 text-white shadow-xs"
                            style={{ backgroundColor: subColor, borderColor: subColor }}
                          >
                            #{idx + 1}
                          </span>
                          <h4 className="text-base font-black text-slate-800 dark:text-white truncate max-w-[150px]">
                            {pub.name}
                          </h4>
                        </div>

                        {idx === 0 && (
                          <span 
                            className="px-3 py-1 text-[10px] font-black rounded-2xl uppercase tracking-wider flex items-center gap-1 border-2 border-b-2 shadow-2xs"
                            style={{ backgroundColor: `${subColor}18`, borderColor: `${subColor}40`, color: subColor }}
                          >
                            <AppleEmoji emoji="👑" size={12} color={subColor} /> En Yüksek Başarı
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider">Ortalama Net</span>
                          <span className="text-3xl font-black font-mono leading-none" style={{ color: subColor }}>{formatNet(pub.avgNet)}</span>
                        </div>

                        {/* Recessed 3D Progress Bar */}
                        <div className="h-4 w-full bg-slate-100 dark:bg-slate-900 rounded-full border-2 border-slate-200 dark:border-slate-700 p-[1.5px] shadow-inner overflow-hidden flex items-center">
                          <motion.div 
                            className="h-full rounded-full relative flex items-center justify-end pr-0.5" 
                            style={{ backgroundColor: subColor }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (pub.avgNet / bransStats.maxQuestions) * 100)}%` }} 
                            transition={{ type: "spring", stiffness: 60, damping: 15 }}
                          >
                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-t-full pointer-events-none" />
                            {(pub.avgNet / bransStats.maxQuestions) * 100 > 5 && <div className="w-2 h-2 rounded-full bg-white shadow-md shrink-0 relative z-10" />}
                          </motion.div>
                        </div>
                      </div>

                      {/* 3D Alt Metrik Kutuları */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t-2 border-slate-100 dark:border-slate-700/60 text-center font-mono">
                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs">
                          <span className="text-[9px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest block mb-0.5">Sınav</span>
                          <span className="text-xs font-black text-slate-800 dark:text-white">{pub.count} Adet</span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-2 border-b-4 border-amber-300 dark:border-amber-800 shadow-2xs">
                          <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest block mb-0.5">Rekor</span>
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400" style={{ color: subColor }}>{formatNet(pub.bestNet)}</span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-[#e5f9e7] dark:bg-[#58cc02]/20 border-2 border-b-4 border-[#58cc02] border-b-[#46a302] shadow-2xs">
                          <span className="text-[9px] font-black text-[#58cc02] uppercase tracking-widest block mb-0.5">Başarı</span>
                          <span className="text-xs font-black text-[#58cc02]">%{Math.round(pub.accuracy)}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ━━━ Akıllı Tavsiyeler (EN ALT BÖLÜM) ━━━ */}
          <SmartTopicRecommendationsSection
            denemeler={denemeler}
            stats={stats}
            viewType={viewType}
            selectedBransSubjectId={selectedBransSubjectId}
          />
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
            color={accent || highlight ? "#ffffff" : "#1cb0f6"}
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

function DengeGrafigi({ stats }: { stats: any }) {
  const gyVal = stats.gyAvg;
  const gkVal = stats.gkAvg;
  const totalNet = gyVal + gkVal;
  
  const gyPercent = Math.min(100, Math.max(0, (gyVal / 60) * 100));
  const gkPercent = Math.min(100, Math.max(0, (gkVal / 60) * 100));
  
  const gyRatio = totalNet > 0 ? (gyVal / totalNet) * 100 : 50;
  const gkRatio = totalNet > 0 ? (gkVal / totalNet) * 100 : 50;
  const diff = gyVal - gkVal;

  const isBalanced = Math.abs(diff) <= 2;
  const isGyHigher = diff > 2;

  const gySubjects = stats.subjects ? stats.subjects.filter((s: any) => s.category === "Genel Yetenek") : [];
  const gkSubjects = stats.subjects ? stats.subjects.filter((s: any) => s.category === "Genel Kültür" || s.category === "Vatandaşlık") : [];

  return (
    <div className="mt-8 p-6 sm:p-8 bg-white dark:bg-slate-800/95 backdrop-blur-md rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700/80 shadow-md relative overflow-hidden transition-all">
      {/* Background ambient glow effects */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#1cb0f6]/10 dark:bg-[#1cb0f6]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-[#58cc02]/10 dark:bg-[#58cc02]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
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

        {/* Dynamic Status Badge */}
        <div className={`px-3.5 py-1.5 rounded-2xl border-2 border-b-4 text-xs font-black flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-xs ${
          isBalanced 
            ? "bg-[#d7ffb8]/90 dark:bg-[#58cc02]/20 text-[#58cc02] border-[#58cc02]/40 dark:border-[#58cc02]/50"
            : isGyHigher
            ? "bg-sky-50 dark:bg-sky-950/60 text-[#1cb0f6] border-sky-200 dark:border-sky-800"
            : "bg-[#d7ffb8]/90 dark:bg-[#58cc02]/20 text-[#58cc02] border-[#58cc02]/40 dark:border-[#58cc02]/50"
        }`}>
          {isBalanced ? (
            <>
              <AppleEmoji emoji="⚖️" size={16} color="#58cc02" />
              <span>Dengeli İlerleme (%{gyRatio.toFixed(0)} - %{gkRatio.toFixed(0)})</span>
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

      {/* Dual Ratio Equilibrium Meter */}
      <div className="mb-8 p-4 bg-slate-50/80 dark:bg-slate-900/70 rounded-2xl border-2 border-slate-200/80 dark:border-slate-700/70 relative z-10">
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

        {/* Bi-directional split progress bar */}
        <div className="h-4 w-full bg-slate-200/80 dark:bg-slate-950/90 rounded-full border-2 border-slate-300/80 dark:border-slate-700 p-[2px] shadow-inner relative overflow-hidden flex">
          {/* Midpoint notch indicator */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-500 z-20 -translate-x-1/2 opacity-70" />

          {/* GY Ratio Left Fill */}
          <motion.div 
            className="h-full bg-gradient-to-r from-[#1cb0f6] to-[#0284c7] rounded-l-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${gyRatio}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-l-full h-1/2" />
          </motion.div>

          {/* GK Ratio Right Fill */}
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

      {/* Main Category Cards Grid */}
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
  subSubjects
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
    <div className="bg-slate-50/80 dark:bg-slate-900/80 p-5 sm:p-6 rounded-3xl border-2 border-b-4 border-slate-200/90 dark:border-slate-700/80 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-600">
      <div>
        {/* Header */}
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
              <span className="text-xs font-black text-slate-400 dark:text-slate-300">/ {max}</span>
            </div>
            <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-black rounded-lg border border-b-2 ${badgeBg}`}>
              %{percentage.toFixed(1)} İsabet
            </span>
          </div>
        </div>

        {/* 3D Recessed Progress Track */}
        <div className="h-5 w-full bg-slate-200/80 dark:bg-slate-950/90 rounded-full border-2 border-slate-300/70 dark:border-slate-700 p-[2px] shadow-inner relative overflow-hidden flex items-center my-3">
          {/* Inner Grid Ticks */}
          <div className="absolute left-[25%] top-0 bottom-0 w-[1px] bg-slate-300/50 dark:bg-slate-700/50 z-10 pointer-events-none" />
          <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-slate-300/50 dark:bg-slate-700/50 z-10 pointer-events-none" />
          <div className="absolute left-[75%] top-0 bottom-0 w-[1px] bg-slate-300/50 dark:bg-slate-700/50 z-10 pointer-events-none" />

          {/* Animated Fill Bar */}
          <motion.div 
            className={`h-full bg-gradient-to-r ${color} rounded-full relative flex items-center justify-end pr-1`} 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          >
            {/* Top Gloss Reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-t-full pointer-events-none" />
            {percentage > 5 && (
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-md shrink-0 relative z-10" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Sub-subjects Breakdown */}
      {subSubjects && subSubjects.length > 0 && (
        <div className="mt-4 pt-3 border-t-2 border-slate-200/60 dark:border-slate-800/80">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-300 mb-2 flex justify-between items-center">
            <span>Ders Net Dağılımı</span>
            <span>Net / Soru</span>
          </div>

          <div className="space-y-2">
            {subSubjects.map((sub: any) => {
              const subPercent = sub.questionCount ? Math.min(100, Math.max(0, (sub.avgNet / sub.questionCount) * 100)) : 0;
              return (
                <div key={sub.id} className="p-2 bg-white dark:bg-slate-800 rounded-xl border-2 border-b-3 border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-center justify-between gap-3 text-xs">
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
                        style={{ width: `${subPercent}%`, backgroundColor: sub.color }} 
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

function Tip({ emoji = "💡", title, badgeColor, accentColor, children }: { emoji?: string; title: string; badgeColor?: { bg: string; border: string; borderBottom: string }; accentColor?: string; children: React.ReactNode; }) {
  const barColor = accentColor || badgeColor?.border || "#1cb0f6";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="bg-white dark:bg-slate-800 p-6 rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4 sm:gap-5 relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-600 transition-all"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: barColor }} />

      {/* 3D Icon Box */}
      <div 
        className="w-13 h-13 rounded-2xl flex items-center justify-center border-2 border-b-4 shrink-0 shadow-2xs mt-0.5"
        style={{
          backgroundColor: `${barColor}15`,
          borderColor: `${barColor}50`,
          borderBottomColor: barColor,
        }}
      >
        <AppleEmoji emoji={emoji} size={24} color={barColor} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-base font-black text-slate-800 dark:text-white mb-2 leading-snug tracking-tight">{title}</h4>
        <div className="text-xs font-bold leading-relaxed text-slate-600 dark:text-slate-300">{children}</div>
      </div>
    </motion.div>
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
    
    const rectWidth = text.length * 8 + 22;
    const rectHeight = 24;
    const rectX = isRight ? x + width - rectWidth - 12 : x + 12;
    const rectY = y - rectHeight / 2;

    return (
      <g className="select-none">
        <rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          rx={10}
          ry={10}
          fill={color}
          stroke="#ffffff"
          strokeWidth={2}
        />
        <text
          x={rectX + rectWidth / 2}
          y={rectY + 16}
          fill="#ffffff"
          fontSize={12}
          fontWeight={900}
          textAnchor="middle"
          style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif' }}
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

        <div className="flex flex-wrap items-center gap-2.5">
          <div 
            className="px-3.5 py-1.5 rounded-xl border-2 border-b-4 text-xs font-black flex items-center gap-1.5 shadow-2xs"
            style={{
              backgroundColor: `${mainColor}12`,
              borderColor: `${mainColor}40`,
              borderBottomColor: mainColor,
              color: mainColor,
            }}
          >
            <span className="opacity-75">Son:</span>
            <span className="font-mono text-sm">{formatNet(latestNet)}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border-2 border-b-4 border-amber-400 border-b-amber-500 text-amber-600 dark:text-amber-400 text-xs font-black flex items-center gap-1.5 shadow-2xs">
            <span>Rekor:</span>
            <span className="font-mono text-sm">{formatNet(bestNet)}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-[#e5f9e7] dark:bg-[#58cc02]/20 border-2 border-b-4 border-[#58cc02] border-b-[#46a302] text-[#58cc02] text-xs font-black flex items-center gap-1.5 shadow-2xs">
            <span>Ort:</span>
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

function AppleFitnessConcentricRings({ 
  correct, 
  wrong, 
  empty, 
  maxQuestions, 
  avgNet, 
  color 
}: { 
  correct: number; 
  wrong: number; 
  empty: number; 
  maxQuestions: number; 
  avgNet: number; 
  color: string; 
}) {
  const [hoveredRing, setHoveredRing] = useState<"correct" | "wrong" | "empty" | null>(null);

  const total = maxQuestions > 0 ? maxQuestions : 1;
  const cPct = Math.min(1, Math.max(0, correct / total));
  const wPct = Math.min(1, Math.max(0, wrong / total));
  const ePct = Math.min(1, Math.max(0, empty / total));

  const size = 220;
  const center = size / 2;

  const rings = [
    { 
      key: "correct" as const, 
      label: "Doğru", 
      val: correct, 
      pct: cPct, 
      radius: 85, 
      strokeWidth: 14, 
      color: "#58cc02", 
      trackColor: "rgba(88, 204, 2, 0.15)",
    },
    { 
      key: "wrong" as const, 
      label: "Yanlış", 
      val: wrong, 
      pct: wPct, 
      radius: 67, 
      strokeWidth: 14, 
      color: "#ff4b4b", 
      trackColor: "rgba(255, 75, 75, 0.15)",
    },
    { 
      key: "empty" as const, 
      label: "Boş", 
      val: empty, 
      pct: ePct, 
      radius: 49, 
      strokeWidth: 14, 
      color: "#94a3b8", 
      trackColor: "rgba(148, 163, 184, 0.15)",
    },
  ];

  const activeRing = rings.find(r => r.key === hoveredRing);

  return (
    <div className="relative flex flex-col items-center justify-center py-2">
      <div className="relative w-[220px] h-[220px] flex items-center justify-center">
        {/* SVG Concentric Rings */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {rings.map((ring, idx) => {
            const circumference = 2 * Math.PI * ring.radius;
            const strokeDashoffset = circumference * (1 - ring.pct);
            const isHovered = hoveredRing === ring.key;

            return (
              <g key={ring.key} className="cursor-pointer" onMouseEnter={() => setHoveredRing(ring.key)} onMouseLeave={() => setHoveredRing(null)}>
                {/* Track Circle */}
                <circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="transparent"
                  stroke={ring.trackColor}
                  strokeWidth={ring.strokeWidth}
                />
                {/* Active Progress Arc */}
                <motion.circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="transparent"
                  stroke={ring.color}
                  strokeWidth={isHovered ? ring.strokeWidth + 4 : ring.strokeWidth}
                  strokeDasharray={circumference}
                  strokeLinecap="round"
                  animate={{ strokeDashoffset, strokeWidth: isHovered ? ring.strokeWidth + 4 : ring.strokeWidth }}
                  transition={{ type: "spring", stiffness: 100, damping: 18 }}
                  className="filter drop-shadow-xs"
                />
              </g>
            );
          })}
        </svg>

        {/* Center 3D Hero Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[84px] h-[84px] rounded-full bg-white dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md flex flex-col items-center justify-center text-center p-1">
            {activeRing ? (
              <motion.div key={activeRing.key} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}>
                <span className="text-[9px] font-black uppercase tracking-wider block leading-tight" style={{ color: activeRing.color }}>
                  {activeRing.label}
                </span>
                <span className="text-xl font-black text-slate-800 dark:text-white leading-none mt-0.5 block">
                  {activeRing.val.toFixed(1)}
                </span>
                <span className="text-[9px] font-bold text-slate-400 block mt-0.5">
                  %{Math.round(activeRing.pct * 100)}
                </span>
              </motion.div>
            ) : (
              <div>
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block leading-tight">Ort. Net</span>
                <span className="text-xl font-black tracking-tight leading-none mt-0.5 block" style={{ color: color || "#1cb0f6" }}>
                  {formatNet(avgNet)}
                </span>
                <span className="text-[9px] font-extrabold text-slate-400 mt-0.5 block">/ {maxQuestions}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ring Legends below */}
      <div className="flex items-center gap-4 mt-3">
        {rings.map((ring) => (
          <div 
            key={ring.key} 
            onMouseEnter={() => setHoveredRing(ring.key)}
            onMouseLeave={() => setHoveredRing(null)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
              hoveredRing === ring.key 
                ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 shadow-2xs scale-105" 
                : "border-transparent text-slate-500"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ring.color }} />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{ring.label}</span>
          </div>
        ))}
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

        <div className="flex flex-wrap items-center gap-2.5">
          <div 
            className="px-3.5 py-1.5 rounded-xl border-2 border-b-4 text-xs font-black flex items-center gap-1.5 shadow-2xs"
            style={{
              backgroundColor: `${mainColor}12`,
              borderColor: `${mainColor}40`,
              borderBottomColor: mainColor,
              color: mainColor,
            }}
          >
            <span className="opacity-75">Son:</span>
            <span className="font-mono text-sm">{formatNet(latestNet)}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border-2 border-b-4 border-amber-400 border-b-amber-500 text-amber-600 dark:text-amber-400 text-xs font-black flex items-center gap-1.5 shadow-2xs">
            <span>Rekor:</span>
            <span className="font-mono text-sm">{formatNet(bestNet)}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-[#e5f9e7] dark:bg-[#58cc02]/20 border-2 border-b-4 border-[#58cc02] border-b-[#46a302] text-[#58cc02] text-xs font-black flex items-center gap-1.5 shadow-2xs">
            <span>Ort:</span>
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

/* ─────────────────────────────────────────────────────────────
   AKILLI TAVSİYELER BÖLÜMÜ (DERS & BRANŞ FİLTRELİ KOÇLUK)
   ───────────────────────────────────────────────────────────── */

function SmartTopicRecommendationsSection({
  denemeler,
  stats,
  viewType = "genel",
  selectedBransSubjectId,
}: {
  denemeler: DenemeRecord[];
  stats: any;
  viewType?: "genel" | "brans";
  selectedBransSubjectId?: string;
}) {
  const topicStats: Record<string, { topicId: string; topicTitle: string; subjectId: string; totalWrong: number; totalEmpty: number }> = {};

  const recordsToProcess = useMemo(() => {
    if (viewType === "brans" && selectedBransSubjectId) {
      return denemeler.filter((d) => d.examType === "brans" && d.bransSubjectId === selectedBransSubjectId);
    }
    return denemeler.filter((d) => d.examType !== "brans");
  }, [denemeler, viewType, selectedBransSubjectId]);

  recordsToProcess.forEach((d) => {
    d.scores.forEach((s) => {
      if (viewType === "brans" && selectedBransSubjectId && s.subjectId !== selectedBransSubjectId) {
        return;
      }
      if (s.topicErrors && s.topicErrors.length > 0) {
        s.topicErrors.forEach((te) => {
          if (!topicStats[te.topicId]) {
            topicStats[te.topicId] = {
              topicId: te.topicId,
              topicTitle: te.topicTitle,
              subjectId: s.subjectId,
              totalWrong: te.wrongCount || 0,
              totalEmpty: te.emptyCount || 0,
            };
          } else {
            topicStats[te.topicId].totalWrong += te.wrongCount || 0;
            topicStats[te.topicId].totalEmpty += te.emptyCount || 0;
          }
        });
      }
    });
  });

  const activeSubjectConfig = DENEME_SUBJECTS.find((s) => s.id === selectedBransSubjectId);
  const recColor = (viewType === "brans" && activeSubjectConfig) ? activeSubjectConfig.color : "#1cb0f6";
  const recIcon = (viewType === "brans" && activeSubjectConfig) ? activeSubjectConfig.icon : "💡";
  const list = Object.values(topicStats);
  const topWrongTopic = [...list].sort((a, b) => b.totalWrong - a.totalWrong).find((t) => t.totalWrong > 0);
  const topEmptyTopic = [...list].sort((a, b) => b.totalEmpty - a.totalEmpty).find((t) => t.totalEmpty > 0);
  const top3Topics = [...list].sort((a, b) => (b.totalWrong + b.totalEmpty) - (a.totalWrong + a.totalEmpty)).slice(0, 3);
  const potentialNetGain = top3Topics.reduce((acc, t) => acc + (t.totalWrong * 1.25) + (t.totalEmpty * 1.0), 0);

  return (
    <Section 
      title={viewType === "brans" && activeSubjectConfig ? `${activeSubjectConfig.title} - Akıllı Tavsiyeler` : "Akıllı Tavsiyeler"} 
      desc={viewType === "brans" && activeSubjectConfig ? `Seçili ${activeSubjectConfig.title} branşındaki konu hatalarınız ve kişisel koçluk tavsiyeleri.` : "İşaretlediğiniz konu hatalarınız ve genel sınav sonuçlarınıza göre oluşturulan kişisel koçluk tavsiyeleri."} 
      icon={<AppleEmoji emoji={recIcon} size={32} color={recColor} />}
    >
      <div className="grid md:grid-cols-2 gap-5">
        {/* 1. Konu Bazlı Kritik Hata Uyarısı */}
        {topWrongTopic ? (
          <Tip 
            emoji="🚨" 
            title={`Öncelikli Konu Tekrarı: ${topWrongTopic.topicTitle.split("(")[0]}`} 
            accentColor="#ff4b4b"
          >
            <span className="font-black px-2.5 py-0.5 rounded-lg text-white text-xs inline-block mr-1.5 shadow-2xs" style={{ backgroundColor: DENEME_SUBJECTS.find(s => s.id === topWrongTopic.subjectId)?.color || "#ff4b4b" }}>
              {DENEME_SUBJECTS.find(s => s.id === topWrongTopic.subjectId)?.title || topWrongTopic.subjectId}
            </span>
            dersinde <strong className="font-black text-slate-800 dark:text-white">&quot;{topWrongTopic.topicTitle}&quot;</strong> konusunda toplam <strong className="font-mono font-black text-[#ff4b4b]">{topWrongTopic.totalWrong} Yanlış</strong> yaptın. Bu konuyu soru bankasından tekrar etmeden yeni denemeye geçme!
          </Tip>
        ) : stats?.mostWrong ? (
          <Tip 
            emoji="⚠️" 
            title="Dikkat: Çok Hata Yapıyorsun" 
            accentColor="#ff4b4b"
          >
            <span className="font-black px-2 py-0.5 rounded-lg text-white text-xs inline-block mr-1.5 shadow-2xs" style={{ backgroundColor: stats.mostWrong.color }}>
              {stats.mostWrong.title}
            </span>
            dersinde soruların <strong className="font-black font-mono text-[#ff4b4b]">%{Math.round(stats.mostWrong.wr * 100)}</strong>'ini yanlış yapıyorsun. Yanlış yaptığın konuları tekrar etmeden yeni denemeye geçme!
          </Tip>
        ) : null}

        {/* 2. Konu Bazlı Boş Uyarısı */}
        {topEmptyTopic ? (
          <Tip 
            emoji="⚪" 
            title={`Boş Bırakılan Konu Analizi: ${topEmptyTopic.topicTitle.split("(")[0]}`} 
            accentColor="#ff9500"
          >
            <span className="font-black px-2.5 py-0.5 rounded-lg text-white text-xs inline-block mr-1.5 shadow-2xs" style={{ backgroundColor: DENEME_SUBJECTS.find(s => s.id === topEmptyTopic.subjectId)?.color || "#ff9500" }}>
              {DENEME_SUBJECTS.find(s => s.id === topEmptyTopic.subjectId)?.title || topEmptyTopic.subjectId}
            </span>
            dersinde <strong className="font-black text-slate-800 dark:text-white">&quot;{topEmptyTopic.topicTitle}&quot;</strong> konusundan <strong className="font-mono font-black text-[#ff9500]">{topEmptyTopic.totalEmpty} soru</strong> boş bıraktın. 15 dakikalık konu özetiyle bu boşları nete çevirebilirsin.
          </Tip>
        ) : stats?.mostEmpty ? (
          <Tip 
            emoji="⏱️" 
            title="Süre veya Bilgi Eksikliği" 
            accentColor="#ff9500"
          >
            <span className="font-black px-2 py-0.5 rounded-lg text-white text-xs inline-block mr-1.5 shadow-2xs" style={{ backgroundColor: stats.mostEmpty.color }}>
              {stats.mostEmpty.title}
            </span>
            dersinde soruların <strong className="font-black font-mono text-[#ff9500]">%{Math.round(stats.mostEmpty.er * 100)}</strong>'ini boş bırakıyorsun. Turlama tekniğini daha iyi kullanabilirsin.
          </Tip>
        ) : null}

        {/* 3. Denge veya Branş Koçluğu */}
        {viewType === "brans" && activeSubjectConfig ? (
          <Tip 
            emoji={activeSubjectConfig.icon} 
            title={`${activeSubjectConfig.title} Branş Odağı`} 
            accentColor={activeSubjectConfig.color}
          >
            <span className="font-black text-slate-800 dark:text-white">{activeSubjectConfig.title}</span> branşında nokta atışı konu analizi yaparak eksiklerinizi tamamlayabilir, soru bankası tekrarlarıyla isabet oranınızı yükseltebilirsiniz.
          </Tip>
        ) : (
          <Tip 
            emoji="⚖️" 
            title="GY / GK Dengen" 
            accentColor="#1cb0f6"
          >
            {stats?.gyAvg < stats?.gkAvg ? (
              <>
                Genel Yetenek puanın daha düşük. <span className="font-black text-[#F43F5E]">Türkçe</span> paragraf ve <span className="font-black text-[#af52de]">Matematik</span> çözme hızını artırmaya odaklan.
              </>
            ) : (
              <>
                Genel Kültür puanın daha düşük. <span className="font-black text-[#ff9500]">Tarih</span>, <span className="font-black text-[#10B981]">Coğrafya</span> ve <span className="font-black text-[#5856d6]">Vatandaşlık</span> okumalarını sıklaştır.
              </>
            )}
          </Tip>
        )}

        {/* 4. Konu Bazlı Net Kazanımı ve Potansiyel */}
        <Tip 
          emoji="✨" 
          title="Konu Hatalarından Net Kazanımı" 
          accentColor="#58cc02"
        >
          {top3Topics.length > 0 ? (
            <>
              En çok hata yaptığın <strong className="font-black text-slate-800 dark:text-white">{top3Topics.map(t => t.topicTitle.split("(")[0]).join(", ")}</strong> konularındaki eksiklerini kapatırsan doğrudan <span className="inline-flex items-center px-3 py-1 rounded-xl bg-[#58cc02] text-white border-2 border-b-4 border-green-700 font-mono font-black text-xs shadow-2xs ml-1">+{formatNet(potentialNetGain)} net</span> kazanabilirsin!
            </>
          ) : stats ? (
            <>
              Tüm yanlış ve boş sorularını doğruya çevirirsen <span className="inline-flex items-center px-3 py-1 rounded-xl bg-[#58cc02] text-white border-2 border-b-4 border-green-700 font-mono font-black text-xs shadow-2xs ml-1">+{formatNet(120 - stats.avg)} net</span> kazanabilirsin. Hatalarından öğrenmek en büyük sıçramayı yaptırır!
            </>
          ) : (
            <>
              Denemelerdeki konu hatalarını işaretledikçe burada doğrudan sana özel net kazanım tavsiyeleri görüntülenecektir.
            </>
          )}
        </Tip>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────
   MÜFREDAT & KONU HATA MATRİSİ BÖLÜMÜ
   ───────────────────────────────────────────────────────────── */

function TopicErrorMatrixSection({
  denemeler,
  viewType,
  selectedBransSubjectId,
}: {
  denemeler: DenemeRecord[];
  viewType: "genel" | "brans";
  selectedBransSubjectId?: string;
}) {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<"all" | "errorsOnly" | "wrongOnly" | "emptyOnly">("errorsOnly");

  useEffect(() => {
    if (viewType === "brans" && selectedBransSubjectId) {
      setSelectedSubjectFilter(selectedBransSubjectId);
    } else if (viewType === "genel") {
      setSelectedSubjectFilter("all");
    }
  }, [viewType, selectedBransSubjectId]);

  const topicMatrixData = useMemo(() => {
    const recordsToProcess = viewType === "genel"
      ? denemeler.filter(d => d.examType !== "brans")
      : (selectedBransSubjectId ? denemeler.filter(d => d.examType === "brans" && d.bransSubjectId === selectedBransSubjectId) : denemeler);

    const topicStats: Record<string, { topicId: string; topicTitle: string; subjectId: string; totalWrong: number; totalEmpty: number; testCount: number }> = {};

    // Load curriculum topics from initialData (Filtered strictly by selectedBransSubjectId if in Branş mode)
    initialData.forEach((sub) => {
      if (viewType === "brans" && selectedBransSubjectId && sub.id !== selectedBransSubjectId) {
        return;
      }
      sub.topics.forEach((top) => {
        topicStats[top.id] = {
          topicId: top.id,
          topicTitle: top.title,
          subjectId: sub.id,
          totalWrong: 0,
          totalEmpty: 0,
          testCount: 0,
        };
      });
    });

    // Populate with actual recorded deneme errors
    recordsToProcess.forEach((d) => {
      d.scores.forEach((s) => {
        if (viewType === "brans" && selectedBransSubjectId && s.subjectId !== selectedBransSubjectId) {
          return;
        }
        if (s.topicErrors && s.topicErrors.length > 0) {
          s.topicErrors.forEach((te) => {
            if (topicStats[te.topicId]) {
              topicStats[te.topicId].totalWrong += te.wrongCount || 0;
              topicStats[te.topicId].totalEmpty += te.emptyCount || 0;
              topicStats[te.topicId].testCount += 1;
            } else {
              topicStats[te.topicId] = {
                topicId: te.topicId,
                topicTitle: te.topicTitle,
                subjectId: s.subjectId,
                totalWrong: te.wrongCount || 0,
                totalEmpty: te.emptyCount || 0,
                testCount: 1,
              };
            }
          });
        }
      });
    });

    const list = Object.values(topicStats);
    const topWrong = [...list].sort((a, b) => b.totalWrong - a.totalWrong).filter((t) => t.totalWrong > 0);
    const topEmpty = [...list].sort((a, b) => b.totalEmpty - a.totalEmpty).filter((t) => t.totalEmpty > 0);
    const totalErrors = list.reduce((acc, t) => acc + t.totalWrong + t.totalEmpty, 0);

    return {
      all: list,
      topWrong: topWrong.slice(0, 3),
      topEmpty: topEmpty.slice(0, 3),
      totalErrors,
      totalRecordedTests: recordsToProcess.length,
    };
  }, [denemeler, viewType, selectedBransSubjectId]);

  const filteredTopics = useMemo(() => {
    return topicMatrixData.all.filter((t) => {
      if (selectedSubjectFilter !== "all" && t.subjectId !== selectedSubjectFilter) {
        return false;
      }
      if (filterMode === "errorsOnly") {
        return t.totalWrong > 0 || t.totalEmpty > 0;
      }
      if (filterMode === "wrongOnly") {
        return t.totalWrong > 0;
      }
      if (filterMode === "emptyOnly") {
        return t.totalEmpty > 0;
      }
      return true;
    });
  }, [topicMatrixData.all, selectedSubjectFilter, filterMode]);

  const activeSubjectConfig = DENEME_SUBJECTS.find((s) => s.id === selectedBransSubjectId);
  const matrixColor = (viewType === "brans" && activeSubjectConfig) ? activeSubjectConfig.color : "#1cb0f6";
  const matrixIcon = (viewType === "brans" && activeSubjectConfig) ? activeSubjectConfig.icon : "🎯";

  return (
    <Section
      title={viewType === "brans" && activeSubjectConfig ? `${activeSubjectConfig.title} - Müfredat & Konu Hata Matrisi` : "Müfredat & Konu Hata Matrisi"}
      desc={viewType === "brans" && activeSubjectConfig ? `Seçili ${activeSubjectConfig.title} branşındaki sınav sorularının konu bazlı detay analizi.` : "Sınavlarda işaretlediğiniz yanlış ve boş soruların ders ve konu bazlı detay analizi."}
      icon={<AppleEmoji emoji={matrixIcon} size={32} color={matrixColor} />}
    >
      {/* ━━━ SIGNATURE 3D ÖZET KARTLARI ━━━ */}
      {topicMatrixData.totalErrors > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* En Çok Yanlış Yapılanlar */}
          <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-rose-200 dark:border-rose-900/50 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-3.5 mb-4 pb-3.5 border-b-2 border-slate-100 dark:border-slate-700/60">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border-2 border-b-4 border-rose-300 dark:border-rose-800 flex items-center justify-center shadow-xs">
                <AppleEmoji emoji="🚨" size={22} />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-800 dark:text-white">Kritik Yanlış Yapılan Konular</h4>
                <p className="text-xs font-bold text-slate-400">En çok net kaybettiğin müfredat konuların</p>
              </div>
            </div>

            {topicMatrixData.topWrong.length > 0 ? (
              <div className="space-y-3">
                {topicMatrixData.topWrong.map((t, idx) => {
                  const subjectConfig = DENEME_SUBJECTS.find((s) => s.id === t.subjectId);
                  const color = subjectConfig?.color || "#F43F5E";

                  return (
                    <div key={t.topicId} className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700/80 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-[#ff4b4b] text-white font-mono font-black text-xs flex items-center justify-center shrink-0 border-2 border-b-4 border-rose-700 shadow-xs">
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg text-white shrink-0 border border-white/20 shadow-2xs" style={{ backgroundColor: color }}>
                              {subjectConfig?.title || t.subjectId}
                            </span>
                            <span className="text-xs font-black text-slate-800 dark:text-white truncate">{t.topicTitle}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-black text-white shrink-0 px-3 py-1.5 rounded-xl bg-[#ff4b4b] border-2 border-b-4 border-rose-700 shadow-xs flex items-center gap-1">
                        <AppleEmoji emoji="❌" size={12} color="white" />
                        <span>{t.totalWrong} Yanlış</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-400 py-4 text-center">İşaretlenmiş yanlış konusu bulunmuyor.</p>
            )}
          </div>

          {/* En Çok Boş Bırakılanlar */}
          <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-amber-200 dark:border-amber-900/50 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-3.5 mb-4 pb-3.5 border-b-2 border-slate-100 dark:border-slate-700/60">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border-2 border-b-4 border-amber-300 dark:border-amber-800 flex items-center justify-center shadow-xs">
                <AppleEmoji emoji="⚪" size={22} />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-800 dark:text-white">En Çok Boş Bırakılan Konular</h4>
                <p className="text-xs font-bold text-slate-400">Yeterli süre ayıramadığın veya tereddüt ettiğin alanlar</p>
              </div>
            </div>

            {topicMatrixData.topEmpty.length > 0 ? (
              <div className="space-y-3">
                {topicMatrixData.topEmpty.map((t, idx) => {
                  const subjectConfig = DENEME_SUBJECTS.find((s) => s.id === t.subjectId);
                  const color = subjectConfig?.color || "#ff9500";

                  return (
                    <div key={t.topicId} className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700/80 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 border-2 border-b-4 border-amber-700 shadow-xs">
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg text-white shrink-0 border border-white/20 shadow-2xs" style={{ backgroundColor: color }}>
                              {subjectConfig?.title || t.subjectId}
                            </span>
                            <span className="text-xs font-black text-slate-800 dark:text-white truncate">{t.topicTitle}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-black text-white shrink-0 px-3 py-1.5 rounded-xl bg-amber-500 border-2 border-b-4 border-amber-700 shadow-xs flex items-center gap-1">
                        <AppleEmoji emoji="⚪" size={12} color="white" />
                        <span>{t.totalEmpty} Boş</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-400 py-4 text-center">İşaretlenmiş boş konusu bulunmuyor.</p>
            )}
          </div>
        </div>
      )}

      {/* ━━━ SIGNATURE 3D DERS VE GÖRÜNÜM FİLTRELERİ ━━━ */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Ders Sekmeleri (Sadece Genel Denemeler Modunda Görüntülenir) */}
        {viewType === "genel" && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {DENEME_SUBJECTS.map((s) => {
              const isSelected = selectedSubjectFilter === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSubjectFilter(isSelected ? "all" : s.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border-2 border-b-4 active:translate-y-0.5 ${
                    isSelected
                      ? "text-white shadow-xs"
                      : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                  style={{
                    backgroundColor: isSelected ? s.color : undefined,
                    borderColor: isSelected ? s.color : undefined,
                  }}
                >
                  <AppleEmoji emoji={s.icon} size={15} color={isSelected ? "white" : s.color} />
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Görünüm Filtresi */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-xs font-black shrink-0 shadow-2xs">
          <button
            type="button"
            onClick={() => setFilterMode("errorsOnly")}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterMode === "errorsOnly" 
                ? "bg-white dark:bg-slate-800 text-[#ff4b4b] border-2 border-b-4 border-rose-200 dark:border-rose-800/60 shadow-xs font-black" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            ❌ Sadece Hatalılar ({topicMatrixData.all.filter(t => t.totalWrong > 0 || t.totalEmpty > 0).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterMode === "all" 
                ? "bg-white dark:bg-slate-800 text-[#1cb0f6] border-2 border-b-4 border-sky-200 dark:border-sky-800/60 shadow-xs font-black" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            📚 Tüm Müfredat ({topicMatrixData.all.length})
          </button>
        </div>
      </div>

      {/* ━━━ SIGNATURE 3D KONU KARTLARI MATRİSİ GRID (TÜM TEMALARDA UYUMLU) ━━━ */}
      {filteredTopics.length > 0 ? (
        <div className="space-y-3">
          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 rounded-2xl custom-matrix-scrollbar border-2 border-slate-200 dark:border-slate-700/60 p-3.5 bg-slate-100/70 dark:bg-slate-900/60">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {filteredTopics.map((t) => {
              const subjectConfig = DENEME_SUBJECTS.find((s) => s.id === t.subjectId);
              const color = subjectConfig?.color || "#1cb0f6";
              const totalIssue = t.totalWrong + t.totalEmpty;
              
              let statusBadge = {
                label: "Temiz",
                emoji: "✅",
                className: "bg-[#58cc02] text-white border-2 border-b-4 border-green-700 shadow-xs"
              };

              if (t.totalWrong > 2) {
                statusBadge = {
                  label: "Kritik Eksik",
                  emoji: "🚨",
                  className: "bg-[#ff4b4b] text-white border-2 border-b-4 border-rose-700 shadow-xs"
                };
              } else if (totalIssue > 0) {
                statusBadge = {
                  label: "İncele",
                  emoji: "💡",
                  className: "bg-[#ff9500] text-white border-2 border-b-4 border-amber-700 shadow-xs"
                };
              }

              return (
                <div
                  key={t.topicId}
                  className="bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-[2rem] p-5.5 relative overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:scale-[1.015] hover:border-slate-300 dark:hover:border-slate-600 group"
                >
                  {/* Top Subject Color Strip */}
                  <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: color }} />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3 pt-0.5">
                      {/* 3D Subject Badge */}
                      <span className="text-xs font-black uppercase px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-b-2 border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-center gap-1.5">
                        <AppleEmoji emoji={subjectConfig?.icon || "📘"} size={14} color={color} />
                        <span style={{ color: color }}>{subjectConfig?.title || t.subjectId}</span>
                      </span>

                      {/* 3D Status Push Badge */}
                      <span className={`text-[11px] font-mono font-black px-2.5 py-1 rounded-xl flex items-center gap-1 ${statusBadge.className}`}>
                        <AppleEmoji emoji={statusBadge.emoji} size={12} color="white" />
                        <span>{statusBadge.label}</span>
                      </span>
                    </div>

                    <h5 className="text-[15px] font-black text-slate-800 dark:text-white leading-snug line-clamp-2 my-3 group-hover:text-[#1cb0f6] transition-colors">
                      {t.topicTitle}
                    </h5>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-mono font-black">
                    {t.totalWrong > 0 ? (
                      <span className="px-2.5 py-1 rounded-xl bg-[#ff4b4b] text-white border-2 border-b-4 border-rose-700 shadow-2xs flex items-center gap-1">
                        <AppleEmoji emoji="❌" size={12} color="white" />
                        <span>{t.totalWrong} Yanlış</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-300 border-2 border-b-2 border-slate-200 dark:border-slate-600">
                        0 Yanlış
                      </span>
                    )}

                    {t.totalEmpty > 0 ? (
                      <span className="px-2.5 py-1 rounded-xl bg-[#ff9500] text-white border-2 border-b-4 border-amber-700 shadow-2xs flex items-center gap-1">
                        <AppleEmoji emoji="⚪" size={12} color="white" />
                        <span>{t.totalEmpty} Boş</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-300 border-2 border-b-2 border-slate-200 dark:border-slate-600">
                        0 Boş
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
          {/* ━━━ GITHUB TARZI MÜFREDAT HATA HARİTASI (HEATMAP MATRIX) ━━━ */}
          <div className="mt-8 pt-8 border-t-2 border-slate-200/80 dark:border-slate-700/80">
            <GithubTopicHeatmap topicMatrixData={topicMatrixData} viewType={viewType} selectedBransSubjectId={selectedBransSubjectId} />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-10 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border-2 border-b-4 border-[#1cb0f6] flex items-center justify-center mx-auto shadow-sm">
            <AppleEmoji emoji="✨" size={32} />
          </div>
          <h4 className="text-lg font-black text-slate-800 dark:text-white">
            {filterMode === "errorsOnly" ? "Harika! Bu filtrede kayıtlı bir hata bulunmuyor." : "Henüz konu bazlı hata kaydı bulunmuyor."}
          </h4>
          <p className="text-xs font-bold text-slate-400 max-w-md mx-auto">
            Sınav girişi yaparken &quot;Hangi konularda takıldın?&quot; menüsünü kullanarak hangi sorularda takıldığınızı işaretleyebilirsiniz.
          </p>
        </div>
      )}
    </Section>
  );
}

{/* ━━━ SİTEMİZE UYGUN MÜFREDAT KONU HATA HARİTASI MATRİSİ ━━━ */}
function GithubTopicHeatmap({
  topicMatrixData,
  viewType,
  selectedBransSubjectId,
}: {
  topicMatrixData: any;
  viewType?: "genel" | "brans";
  selectedBransSubjectId?: string;
}) {
  const [hoveredTopic, setHoveredTopic] = useState<any | null>(null);

  const activeSubjectConfig = DENEME_SUBJECTS.find((s) => s.id === selectedBransSubjectId);
  const themeColor = (viewType === "brans" && activeSubjectConfig) ? activeSubjectConfig.color : "#1cb0f6";
  const themeIcon = (viewType === "brans" && activeSubjectConfig) ? activeSubjectConfig.icon : "🎯";

  const subjectsWithData = DENEME_SUBJECTS.map((sub) => {
    const topics = topicMatrixData.all.filter((t: any) => t.subjectId === sub.id);
    const totalWrong = topics.reduce((acc: number, t: any) => acc + t.totalWrong, 0);
    const totalEmpty = topics.reduce((acc: number, t: any) => acc + t.totalEmpty, 0);
    return {
      ...sub,
      topics,
      totalWrong,
      totalEmpty,
    };
  }).filter((sub) => sub.topics.length > 0);

  return (
    <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-6">
      {/* Sitemize Uygun 3D Başlık & Lejant */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100 dark:border-slate-700/60 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl border-2 border-b-4 flex items-center justify-center shadow-xs shrink-0" style={{ backgroundColor: `${themeColor}15`, borderColor: `${themeColor}60` }}>
            <AppleEmoji emoji={themeIcon} size={24} color={themeColor} />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Müfredat & Konu Hata Haritası</h4>
            <p className="text-xs font-bold text-slate-400">Sınavlarda işaretlediğiniz yanlış ve boş soruların ders bazlı görsel matrisi</p>
          </div>
        </div>

        {/* Sitemize Uygun 3D Lejant */}
        <div className="flex items-center gap-2.5 text-xs font-black text-slate-500 dark:text-slate-400 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <span>Az Hata</span>
          <div className="flex items-center gap-1.5 mx-1">
            <span className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-center text-[10px] font-mono text-slate-400 font-bold" title="0 Hata">0</span>
            <span className="w-5 h-5 rounded-lg bg-amber-100 dark:bg-amber-950/60 border-2 border-b-4 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 shadow-2xs flex items-center justify-center text-[10px] font-mono font-black" title="1 Boş">1B</span>
            <span className="w-5 h-5 rounded-lg bg-amber-500 text-white border-2 border-b-4 border-amber-700 shadow-2xs flex items-center justify-center text-[10px] font-mono font-black" title="1 Yanlış">1Y</span>
            <span className="w-5 h-5 rounded-lg bg-[#ff4b4b] text-white border-2 border-b-4 border-rose-700 shadow-2xs flex items-center justify-center text-[10px] font-mono font-black" title="2 Yanlış">2Y</span>
            <span className="w-5 h-5 rounded-lg bg-rose-700 text-white border-2 border-b-4 border-rose-950 shadow-xs flex items-center justify-center text-[10px] font-mono font-black" title="3+ Yanlış (Kritik)">3+</span>
          </div>
          <span>Çok Hata</span>
        </div>
      </div>

      {/* Ders Ders 3D Matris Blokları */}
      <div className="space-y-4">
        {subjectsWithData.map((sub) => (
          <div key={sub.id} className="p-4.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border-2 border-slate-200/80 dark:border-slate-700/80 space-y-3">
            {/* Ders Başlık & Metrik Satırı */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700/80 shadow-2xs flex items-center gap-1.5">
                  <AppleEmoji emoji={sub.icon} size={14} color={sub.color} />
                  <span style={{ color: sub.color }}>{sub.title}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 lowercase">({sub.topics.length} konu)</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5 font-mono text-xs font-black">
                <span className="px-3 py-1 rounded-xl bg-[#ff4b4b] text-white border-2 border-b-4 border-rose-700 shadow-xs flex items-center gap-1.5">
                  <AppleEmoji emoji="❌" size={13} color="white" />
                  <span>{sub.totalWrong} Yanlış</span>
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#ff9500] text-white border-2 border-b-4 border-amber-700 shadow-xs flex items-center gap-1.5">
                  <AppleEmoji emoji="⚪" size={13} color="white" />
                  <span>{sub.totalEmpty} Boş</span>
                </span>
              </div>
            </div>

            {/* Konu 3D Kare Kutucukları Matrisi */}
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              {sub.topics.map((t: any) => {
                let squareStyle = "bg-slate-100 dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-800 text-slate-400";
                let displayVal = "0";

                if (t.totalWrong > 2) {
                  squareStyle = "bg-rose-700 text-white border-2 border-b-4 border-rose-950 shadow-xs font-black";
                  displayVal = `${t.totalWrong}`;
                } else if (t.totalWrong === 2) {
                  squareStyle = "bg-[#ff4b4b] text-white border-2 border-b-4 border-rose-700 shadow-2xs font-black";
                  displayVal = "2";
                } else if (t.totalWrong === 1) {
                  squareStyle = "bg-amber-500 text-white border-2 border-b-4 border-amber-700 shadow-2xs font-black";
                  displayVal = "1";
                } else if (t.totalEmpty > 0) {
                  squareStyle = "bg-amber-400 text-amber-950 border-2 border-b-4 border-amber-600 shadow-2xs font-black";
                  displayVal = `${t.totalEmpty}B`;
                }

                return (
                  <div
                    key={t.topicId}
                    onMouseEnter={() => setHoveredTopic({ ...t, subjectTitle: sub.title, subjectIcon: sub.icon, color: sub.color })}
                    onMouseLeave={() => setHoveredTopic(null)}
                    className={`w-9 h-9 rounded-xl border-2 border-b-4 cursor-pointer transition-all duration-150 hover:scale-125 hover:z-30 flex items-center justify-center font-mono text-xs font-black ${squareStyle}`}
                  >
                    <span>{displayVal}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sitemize Uygun 3D Hover & İpucu Bilgi Kartı */}
      {hoveredTopic ? (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm transition-all animate-fadeIn">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-white px-3 py-1 rounded-xl text-xs uppercase font-black shrink-0 border-2 border-b-4 border-black/20 shadow-xs flex items-center gap-1.5" style={{ backgroundColor: hoveredTopic.color }}>
              <AppleEmoji emoji={hoveredTopic.subjectIcon} size={14} color="white" />
              <span>{hoveredTopic.subjectTitle}</span>
            </span>
            <span className="text-slate-800 dark:text-white font-black text-sm truncate">{hoveredTopic.topicTitle}</span>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs shrink-0">
            {hoveredTopic.totalWrong > 0 ? (
              <span className="px-3 py-1.5 rounded-xl bg-[#ff4b4b] text-white border-2 border-b-4 border-rose-700 font-mono font-black text-xs flex items-center gap-1.5 shadow-xs">
                <AppleEmoji emoji="❌" size={13} color="white" />
                <span>{hoveredTopic.totalWrong} Yanlış</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono font-bold text-xs border-2 border-slate-200 dark:border-slate-700">
                0 Yanlış
              </span>
            )}

            {hoveredTopic.totalEmpty > 0 ? (
              <span className="px-3 py-1.5 rounded-xl bg-[#ff9500] text-white border-2 border-b-4 border-amber-700 font-mono font-black text-xs flex items-center gap-1.5 shadow-xs">
                <AppleEmoji emoji="⚪" size={13} color="white" />
                <span>{hoveredTopic.totalEmpty} Boş</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono font-bold text-xs border-2 border-slate-200 dark:border-slate-700">
                0 Boş
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-700/80 text-xs font-black text-slate-700 dark:text-slate-200 flex items-center justify-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border-2 border-b-4 border-amber-300 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-xs">
            <AppleEmoji emoji="💡" size={18} color="#ff9500" />
          </div>
          <span>Konu başlığını ve detaylı yanlış/boş verilerini görmek için matristeki kutucukların üzerine gelin.</span>
        </div>
      )}
    </div>
  );
}
