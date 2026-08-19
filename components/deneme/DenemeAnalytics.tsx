"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DenemeRecord,
  evaluateDeneme,
  formatNet,
  estimateP3Score,
  formatDuration,
} from "@/lib/denemeUtils";
import { DENEME_SUBJECTS, getSubjectQuestionCount } from "@/lib/denemeConfig";
import AppleEmoji from "../AppleEmoji";
import RankSimulator from "./RankSimulator";
import { Section } from "./analytics/AnalyticsCommon";
import {
  GenelAnalyticsOverview,
  BransAnalyticsOverview,
} from "./analytics/AnalyticsSummaryCards";
import {
  GenelRechartsTrend,
  BransRechartsTrend,
  AppleFitnessConcentricRings,
} from "./analytics/NetProgressionChart";
import SubjectBreakdownGrid from "./analytics/SubjectBreakdownGrid";
import TopicMistakesSection from "./analytics/TopicMistakesSection";
import PublisherDistributionSection from "./analytics/PublisherDistributionSection";
import SmartRecommendationsSection from "./analytics/SmartRecommendationsSection";
import {
  BarChart3,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from "lucide-react";

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
  const [selectedBransSubjectId, setSelectedBransSubjectId] = useState<string>(
    activeSubjectTab || ""
  );

  const availableBransSubjects = useMemo(() => {
    if (viewType !== "brans") return [];
    const ids = new Set(
      allDenemeler
        .filter((d) => d.examType === "brans")
        .map((d) => d.bransSubjectId)
        .filter(Boolean)
    );
    return DENEME_SUBJECTS.filter((s) => ids.has(s.id));
  }, [allDenemeler, viewType]);

  useEffect(() => {
    if (activeSubjectTab) {
      setSelectedBransSubjectId(activeSubjectTab);
    }
  }, [activeSubjectTab]);

  useEffect(() => {
    if (viewType === "brans" && availableBransSubjects.length > 0) {
      if (
        !selectedBransSubjectId ||
        !availableBransSubjects.find((s) => s.id === selectedBransSubjectId)
      ) {
        setSelectedBransSubjectId(activeSubjectTab || availableBransSubjects[0].id);
      }
    }
  }, [viewType, availableBransSubjects, selectedBransSubjectId, activeSubjectTab]);

  const active = useMemo(() => {
    const list =
      viewType === "genel"
        ? denemeler.filter((d) => d.examType !== "brans")
        : denemeler;
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
      let tc = 0,
        tw = 0,
        te = 0,
        cnt = 0;
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
      const an = ac - aw * 0.25;
      const qc = getSubjectQuestionCount(sub.id);
      return {
        id: sub.id,
        title: sub.title,
        icon: sub.icon,
        color: sub.color,
        questionCount: qc,
        avgCorrect: ac,
        avgWrong: aw,
        avgEmpty: ae,
        avgNet: an,
        accuracy: qc > 0 ? (an / qc) * 100 : 0,
      };
    });

    const gySubs = subjects.filter((s) => s.id === "turkce" || s.id === "matematik");
    const gkSubs = subjects.filter(
      (s) => s.id === "tarih" || s.id === "cografya" || s.id === "vatandaslik"
    );

    const gyAvg = gySubs.reduce((a, b) => a + b.avgNet, 0);
    const gkAvg = gkSubs.reduce((a, b) => a + b.avgNet, 0);

    const gyNets = evals.map(
      (e) =>
        e.r.subjects
          .filter((s) => s.subjectId === "turkce" || s.subjectId === "matematik")
          .reduce((a, b) => a + b.net, 0)
    );
    const gkNets = evals.map(
      (e) =>
        e.r.subjects
          .filter(
            (s) =>
              s.subjectId === "tarih" ||
              s.subjectId === "cografya" ||
              s.subjectId === "vatandaslik"
          )
          .reduce((a, b) => a + b.net, 0)
    );

    const gyBest = gyNets.length > 0 ? Math.max(...gyNets) : 0;
    const gkBest = gkNets.length > 0 ? Math.max(...gkNets) : 0;

    const gyLatest = gyNets.length > 0 ? gyNets[gyNets.length - 1] : 0;
    const gkLatest = gkNets.length > 0 ? gkNets[gkNets.length - 1] : 0;

    const trend = evals.map((e) => {
      const gy = e.r.subjects
        .filter((s) => s.subjectId === "turkce" || s.subjectId === "matematik")
        .reduce(
          (acc, s) => ({
            net: acc.net + s.net,
            correct: acc.correct + s.correct,
            wrong: acc.wrong + s.wrong,
            empty: acc.empty + s.empty,
          }),
          { net: 0, correct: 0, wrong: 0, empty: 0 }
        );

      const gk = e.r.subjects
        .filter(
          (s) =>
            s.subjectId === "tarih" ||
            s.subjectId === "cografya" ||
            s.subjectId === "vatandaslik"
        )
        .reduce(
          (acc, s) => ({
            net: acc.net + s.net,
            correct: acc.correct + s.correct,
            wrong: acc.wrong + s.wrong,
            empty: acc.empty + s.empty,
          }),
          { net: 0, correct: 0, wrong: 0, empty: 0 }
        );

      return {
        name: e.d.name,
        date: e.d.date,
        totalNet: e.r.totalNet,
        totalCorrect: e.r.totalCorrect,
        totalWrong: e.r.totalWrong,
        totalEmpty: e.r.totalEmpty,
        gyNet: gy.net,
        gyCorrect: gy.correct,
        gyWrong: gy.wrong,
        gyEmpty: gy.empty,
        gkNet: gk.net,
        gkCorrect: gk.correct,
        gkWrong: gk.wrong,
        gkEmpty: gk.empty,
      };
    });

    const durations = active.map((d) => d.durationMinutes).filter(Boolean) as number[];
    const avgDuration =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : null;

    const avgSecondsPerQuestion = avgDuration ? (avgDuration * 60) / 120 : null;

    const latest = nets[nets.length - 1];
    const improvement = nets.length > 1 ? latest - nets[0] : 0;
    const p3 = estimateP3Score(gyAvg, gkAvg);
    const bestP3 = estimateP3Score(gyBest, gkBest);

    return {
      count: active.length,
      avg,
      best,
      latest,
      improvement,
      p3,
      bestP3,
      gyAvg,
      gkAvg,
      gyBest,
      gkBest,
      gyLatest,
      gkLatest,
      subjects,
      trend,
      avgDuration,
      avgSecondsPerQuestion,
    };
  }, [active, viewType]);

  /* ── Branş Mode Stats ── */
  const bransStats = useMemo(() => {
    if (viewType !== "brans" || !selectedBransSubjectId || active.length === 0)
      return null;

    const filtered = active.filter(
      (d) => d.examType === "brans" && d.bransSubjectId === selectedBransSubjectId
    );
    if (filtered.length === 0) return null;

    const subjectConfig = DENEME_SUBJECTS.find((s) => s.id === selectedBransSubjectId);
    const maxQuestions = getSubjectQuestionCount(selectedBransSubjectId);

    const evals = filtered.map((d) => {
      const r = evaluateDeneme(d.scores, "brans");
      const targetSub = r.subjects.find((s) => s.subjectId === selectedBransSubjectId);
      return {
        d,
        net: targetSub ? targetSub.net : r.totalNet,
        correct: targetSub ? targetSub.correct : r.totalCorrect,
        wrong: targetSub ? targetSub.wrong : r.totalWrong,
        empty: targetSub ? targetSub.empty : r.totalEmpty,
      };
    });

    const nets = evals.map((e) => e.net);
    const avg = nets.reduce((a, b) => a + b, 0) / nets.length;
    const best = Math.max(...nets);
    const latest = nets[nets.length - 1];
    const improvement = nets.length > 1 ? latest - nets[0] : 0;

    const avgC = evals.reduce((a, b) => a + b.correct, 0) / evals.length;
    const avgW = evals.reduce((a, b) => a + b.wrong, 0) / evals.length;
    const avgE = evals.reduce((a, b) => a + b.empty, 0) / evals.length;

    const durations = filtered
      .map((d) => d.durationMinutes)
      .filter(Boolean) as number[];
    const avgDuration =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : null;
    const avgSecondsPerQuestion =
      avgDuration && maxQuestions > 0 ? (avgDuration * 60) / maxQuestions : null;

    const trend = evals.map((e) => ({
      name: e.d.name,
      date: e.d.date,
      net: e.net,
      correct: e.correct,
      wrong: e.wrong,
      empty: e.empty,
    }));

    return {
      count: filtered.length,
      config: subjectConfig,
      maxQuestions,
      avg,
      best,
      latest,
      improvement,
      avgC,
      avgW,
      avgE,
      avgDuration,
      avgSecondsPerQuestion,
      trend,
    };
  }, [active, viewType, selectedBransSubjectId]);

  /* ── Publisher Stats ── */
  const publisherStats = useMemo(() => {
    const records =
      viewType === "genel"
        ? active.filter((d) => d.examType !== "brans")
        : selectedBransSubjectId
        ? active.filter(
            (d) =>
              d.examType === "brans" && d.bransSubjectId === selectedBransSubjectId
          )
        : active;

    if (records.length === 0) return [];

    const map: Record<string, { count: number; totalNet: number; nets: number[] }> =
      {};
    const maxQ =
      viewType === "genel"
        ? 120
        : getSubjectQuestionCount(selectedBransSubjectId || "turkce");

    records.forEach((d) => {
      const pub = d.publisher?.trim() || "Diğer / Belirtilmemiş";
      let netVal = 0;
      if (viewType === "genel") {
        netVal = evaluateDeneme(d.scores, d.examType).totalNet;
      } else {
        const sub = d.scores.find((s) => s.subjectId === selectedBransSubjectId);
        netVal = sub ? sub.correct - sub.wrong * 0.25 : 0;
      }

      if (!map[pub]) {
        map[pub] = { count: 0, totalNet: 0, nets: [] };
      }
      map[pub].count += 1;
      map[pub].totalNet += netVal;
      map[pub].nets.push(netVal);
    });

    return Object.entries(map)
      .map(([name, data]) => ({
        name,
        count: data.count,
        avgNet: data.totalNet / data.count,
        bestNet: Math.max(...data.nets),
        accuracy: maxQ > 0 ? ((data.totalNet / data.count) / maxQ) * 100 : 0,
      }))
      .sort((a, b) => b.avgNet - a.avgNet);
  }, [active, viewType, selectedBransSubjectId]);

  if (active.length === 0 && (!stats || stats.count === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md text-center max-w-lg mx-auto my-6">
        <div className="w-20 h-20 rounded-3xl bg-sky-50 dark:bg-sky-950/60 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] flex items-center justify-center shadow-xs mb-6 shrink-0">
          <AppleEmoji emoji="📊" size={40} color="#1cb0f6" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          Analiz Bekleniyor
        </h3>
        <p className="text-sm font-extrabold text-slate-400 mt-2.5 max-w-xs leading-relaxed">
          Detaylı grafiklerinizi, ders kırılımlarınızı ve koçluk tavsiyelerini
          görmek için ilk denemenizi kaydedin.
        </p>
        {!isReadOnly && (
          <button
            type="button"
            onClick={onAdd}
            className="mt-8 px-8 py-4 rounded-2xl bg-[#1cb0f6] text-white font-black text-xs uppercase tracking-widest border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xs active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Deneme Sınavı Ekle</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  if (viewType === "brans" && availableBransSubjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md text-center max-w-lg mx-auto my-6">
        <div className="w-20 h-20 rounded-3xl bg-[#f5e8ff] dark:bg-[#af52de]/10 border-2 border-b-4 border-[#af52de] border-b-[#9b37c7] flex items-center justify-center shadow-xs mb-6 shrink-0">
          <AppleEmoji emoji="🎯" size={40} color="#af52de" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          Branş Analizi Bekleniyor
        </h3>
        <p className="text-sm font-extrabold text-slate-400 mt-2.5 max-w-xs leading-relaxed">
          Branş deneme grafiklerinizi ve konu analizlerinizi görmek için önce ilk
          Branş Denemenizi kaydedin.
        </p>
        {!isReadOnly && (
          <button
            type="button"
            onClick={onAdd}
            className="mt-8 px-8 py-4 rounded-2xl bg-[#af52de] text-white font-black text-xs uppercase tracking-widest border-2 border-b-4 border-[#af52de] border-b-[#9b37c7] shadow-xs active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Branş Denemesi Gir</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

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
                  : "text-slate-500 dark:text-slate-400 hover:text-[#1cb0f6] dark:hover:text-[#1cb0f6] hover:bg-sky-50 dark:hover:bg-slate-800/60"
              }`}
            >
              {r === "all" ? "Tüm Zamanlar" : `Son ${r} Sınav`}
            </button>
          ))}
        </div>
        <span className="text-xs font-black text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border-2 border-b-2 border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl shadow-2xs w-fit">
          {viewType === "genel"
            ? `${stats?.count ?? 0} genel deneme`
            : `${bransStats?.count ?? 0} branş denemesi`}{" "}
          gösteriliyor
        </span>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          GENEL DENEME ANALİZ DETAYLARI
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {viewType === "genel" && stats && (
        <>
          {/* 1 · Genel Bakış & Denge Grafiği */}
          <GenelAnalyticsOverview stats={stats} />

          {/* 2 · Gelişim Grafiği */}
          <Section
            title="Net Gelişim Eğrisi"
            desc="Sınavdan sınava olan net değişimlerinizi ve trendinizi gösterir."
            icon={<AppleEmoji emoji="📈" size={32} color="#1cb0f6" />}
          >
            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 text-xs font-black w-fit mb-8 shadow-xs">
              {[
                { key: "total" as const, label: "Toplam Net", icon: "🌟" },
                { key: "gy" as const, label: "Genel Yetenek", icon: "🧠" },
                { key: "gk" as const, label: "Genel Kültür", icon: "🌍" },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setActiveMetric(m.key)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 z-10 cursor-pointer ${
                    activeMetric === m.key
                      ? "text-slate-800 dark:text-white"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {activeMetric === m.key && (
                    <motion.div
                      layoutId="metricTab"
                      className="absolute inset-0 bg-white dark:bg-slate-800 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xs rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 text-sm">
                    <AppleEmoji emoji={m.icon} size={16} color="#1cb0f6" />
                  </span>
                  <span className="relative z-10">{m.label}</span>
                </button>
              ))}
            </div>

            <GenelRechartsTrend
              stats={stats}
              activeMetric={activeMetric}
              targetNet={targetNet}
            />

            {stats.improvement !== 0 && stats.count > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-2.5 flex items-center gap-3 shadow-2xs">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 border-b-2 shrink-0 ${
                      stats.improvement > 0
                        ? "bg-[#58cc02] border-[#46a302] text-white"
                        : "bg-[#ff4b4b] border-[#ea2b2b] text-white"
                    }`}
                  >
                    <AppleEmoji
                      emoji={stats.improvement > 0 ? "🚀" : "📉"}
                      size={16}
                      color="#ffffff"
                    />
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-white leading-none">
                    İlk denemeden bu yana{" "}
                    <span
                      className={`font-mono font-black ${
                        stats.improvement > 0 ? "text-[#58cc02]" : "text-[#ff4b4b]"
                      }`}
                    >
                      {stats.improvement > 0 ? "+" : ""}
                      {formatNet(stats.improvement)} net
                    </span>{" "}
                    {stats.improvement > 0 ? "ilerleme!" : "gerileme."}
                  </span>
                </div>
              </div>
            )}
          </Section>

          {/* 3 · Hedef Belirleme & ÖSYM Tahmini Sıralama Simülatörü */}
          <RankSimulator
            currentAvgNet={stats.avg}
            currentGyAvgNet={stats.gyAvg}
            currentGkAvgNet={stats.gkAvg}
            bestNet={stats.best}
            targetNet={targetNet}
            onTargetNetChange={onTargetNetChange}
            isReadOnly={isReadOnly}
          />

          {/* 4 · Ders Bazlı Kırılım */}
          <SubjectBreakdownGrid subjects={stats.subjects} />

          {/* 5 · Müfredat & Konu Hata Matrisi */}
          <TopicMistakesSection
            denemeler={denemeler}
            viewType={viewType}
            selectedBransSubjectId={selectedBransSubjectId}
          />

          {/* 6 · Yayınevi Bazlı Başarı & Performans Analizi */}
          <PublisherDistributionSection
            publishers={publisherStats}
            viewType="genel"
            maxQuestions={120}
          />

          {/* 7 · Akıllı Tavsiyeler & Kişisel Koçluk */}
          <SmartRecommendationsSection
            denemeler={denemeler}
            stats={stats}
            viewType={viewType}
            selectedBransSubjectId={selectedBransSubjectId}
          />
        </>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BRANŞ DENEME ANALİZ DETAYLARI
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {viewType === "brans" && bransStats && (
        <>
          <div className="flex gap-2.5 p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs overflow-x-auto no-scrollbar snap-x">
            {availableBransSubjects.map((sub) => {
              const isSelected = selectedBransSubjectId === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedBransSubjectId(sub.id)}
                  className={`flex-shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-black text-xs transition-all snap-start cursor-pointer border-2 border-b-4 ${
                    isSelected
                      ? "text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                  style={
                    isSelected
                      ? { backgroundColor: sub.color, borderColor: sub.color, borderBottomColor: "rgba(0,0,0,0.35)" }
                      : {}
                  }
                >
                  <AppleEmoji emoji={sub.icon} size={20} color={isSelected ? "white" : sub.color} />
                  <span>{sub.title}</span>
                </button>
              );
            })}
          </div>

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
            <BransAnalyticsOverview bransStats={bransStats} />

            {/* Soru Dağılımı ve Başarı Analizi */}
            <div className="mt-8 p-7 sm:p-9 bg-white dark:bg-slate-800 rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs space-y-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{
                          backgroundColor:
                            bransStats.config?.color || "#1cb0f6",
                        }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-2.5 w-2.5"
                        style={{
                          backgroundColor:
                            bransStats.config?.color || "#1cb0f6",
                        }}
                      />
                    </span>
                    <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">
                      Ortalama Soru Dağılımı
                    </h4>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    Sınav başına düşen Doğru, Yanlış ve Boş oranlarının canlı halka
                    analizi.
                  </p>
                </div>
                {bransStats.maxQuestions > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-[#e5f9e7] dark:bg-[#58cc02]/20 text-[#58cc02] border-2 border-b-2 border-[#58cc02] shadow-2xs self-start sm:self-auto">
                    %
                    {Math.max(
                      0,
                      Math.round(
                        (bransStats.avg / bransStats.maxQuestions) * 100
                      )
                    )}{" "}
                    İsabet Oranı
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-12 gap-8 items-center pt-2">
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

                <div className="md:col-span-7 space-y-3.5">
                  <div className="p-4 rounded-2xl bg-[#e5f9e7] dark:bg-[#58cc02]/20 border-2 border-b-4 border-[#58cc02] border-b-[#46a302] flex items-center justify-between transition-all hover:translate-x-1 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#58cc02] text-white flex items-center justify-center border-2 border-b-2 border-[#46a302] shadow-xs">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                          Ortalama Doğru
                        </p>
                        <p className="text-[11px] font-extrabold text-[#58cc02] mt-0.5">
                          %
                          {(
                            (bransStats.avgC / bransStats.maxQuestions) *
                            100
                          ).toFixed(0)}{" "}
                          Soru Oranı
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-2xl font-black text-[#58cc02]">
                        {Number.isInteger(bransStats.avgC)
                          ? bransStats.avgC
                          : bransStats.avgC.toFixed(1)}
                      </span>
                      <span className="text-xs font-bold text-slate-400 ml-1">
                        / {bransStats.maxQuestions}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#ffebeb] dark:bg-[#ff4b4b]/20 border-2 border-b-4 border-[#ff4b4b] border-b-[#ea2b2b] flex items-center justify-between transition-all hover:translate-x-1 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#ff4b4b] text-white flex items-center justify-center border-2 border-b-2 border-[#ea2b2b] shadow-xs">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                          Ortalama Yanlış
                        </p>
                        <p className="text-[11px] font-extrabold text-[#ff4b4b] mt-0.5">
                          %
                          {(
                            (bransStats.avgW / bransStats.maxQuestions) *
                            100
                          ).toFixed(0)}{" "}
                          Hata Oranı
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-2xl font-black text-[#ff4b4b]">
                        {Number.isInteger(bransStats.avgW)
                          ? bransStats.avgW
                          : bransStats.avgW.toFixed(1)}
                      </span>
                      <span className="text-xs font-bold text-slate-400 ml-1">
                        / {bransStats.maxQuestions}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border-2 border-b-4 border-slate-200 dark:border-slate-700 flex items-center justify-between transition-all hover:translate-x-1 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-400 dark:bg-slate-600 text-white flex items-center justify-center border-2 border-b-2 border-slate-500 shadow-xs">
                        <MinusCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                          Ortalama Boş
                        </p>
                        <p className="text-[11px] font-extrabold text-slate-400 mt-0.5">
                          %
                          {(
                            (bransStats.avgE / bransStats.maxQuestions) *
                            100
                          ).toFixed(0)}{" "}
                          Pas Oranı
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-2xl font-black text-slate-700 dark:text-slate-200">
                        {Number.isInteger(bransStats.avgE)
                          ? bransStats.avgE
                          : bransStats.avgE.toFixed(1)}
                      </span>
                      <span className="text-xs font-bold text-slate-400 ml-1">
                        / {bransStats.maxQuestions}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <BransRechartsTrend bransStats={bransStats} />

          <TopicMistakesSection
            denemeler={denemeler}
            viewType={viewType}
            selectedBransSubjectId={selectedBransSubjectId}
          />

          <PublisherDistributionSection
            publishers={publisherStats}
            viewType="brans"
            maxQuestions={bransStats.maxQuestions}
            subColor={bransStats.config?.color}
          />

          <SmartRecommendationsSection
            denemeler={denemeler}
            stats={bransStats}
            viewType={viewType}
            selectedBransSubjectId={selectedBransSubjectId}
          />
        </>
      )}
    </div>
  );
}
