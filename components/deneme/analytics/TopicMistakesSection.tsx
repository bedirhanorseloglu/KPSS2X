"use client";

import React, { useState, useMemo, useEffect } from "react";
import AppleEmoji from "@/components/AppleEmoji";
import { Section } from "./AnalyticsCommon";
import { DenemeRecord } from "@/lib/denemeUtils";
import { DENEME_SUBJECTS } from "@/lib/denemeConfig";
import { initialData } from "@/lib/data";

export default function TopicMistakesSection({
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
    const recordsToProcess =
      viewType === "genel"
        ? denemeler.filter((d) => d.examType !== "brans")
        : selectedBransSubjectId
        ? denemeler.filter(
            (d) => d.examType === "brans" && d.bransSubjectId === selectedBransSubjectId
          )
        : denemeler;

    const topicStats: Record<
      string,
      {
        topicId: string;
        topicTitle: string;
        subjectId: string;
        totalWrong: number;
        totalEmpty: number;
        testCount: number;
      }
    > = {};

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
  const matrixColor = viewType === "brans" && activeSubjectConfig ? activeSubjectConfig.color : "#1cb0f6";
  const matrixIcon = viewType === "brans" && activeSubjectConfig ? activeSubjectConfig.icon : "🎯";

  return (
    <Section
      title={
        viewType === "brans" && activeSubjectConfig
          ? `${activeSubjectConfig.title} - Müfredat & Konu Hata Matrisi`
          : "Müfredat & Konu Hata Matrisi"
      }
      desc={
        viewType === "brans" && activeSubjectConfig
          ? `Seçili ${activeSubjectConfig.title} branşındaki sınav sorularının konu bazlı detay analizi.`
          : "Sınavlarda işaretlediğiniz yanlış ve boş soruların ders ve konu bazlı detay analizi."
      }
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
                <h4 className="text-base font-black text-slate-800 dark:text-white">
                  Kritik Yanlış Yapılan Konular
                </h4>
                <p className="text-xs font-bold text-slate-400">
                  En çok net kaybettiğin müfredat konuların
                </p>
              </div>
            </div>

            {topicMatrixData.topWrong.length > 0 ? (
              <div className="space-y-3">
                {topicMatrixData.topWrong.map((t, idx) => {
                  const subjectConfig = DENEME_SUBJECTS.find((s) => s.id === t.subjectId);
                  const color = subjectConfig?.color || "#fa5fea";

                  return (
                    <div
                      key={t.topicId}
                      className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700/80 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-[#ff4b4b] text-white font-mono font-black text-xs flex items-center justify-center shrink-0 border-2 border-b-4 border-rose-700 shadow-xs">
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg text-white shrink-0 border border-white/20 shadow-2xs"
                              style={{ backgroundColor: color }}
                            >
                              {subjectConfig?.title || t.subjectId}
                            </span>
                            <span className="text-xs font-black text-slate-800 dark:text-white truncate">
                              {t.topicTitle}
                            </span>
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
              <p className="text-xs font-bold text-slate-400 py-4 text-center">
                İşaretlenmiş yanlış konusu bulunmuyor.
              </p>
            )}
          </div>

          {/* En Çok Boş Bırakılanlar */}
          <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-amber-200 dark:border-amber-900/50 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-3.5 mb-4 pb-3.5 border-b-2 border-slate-100 dark:border-slate-700/60">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border-2 border-b-4 border-amber-300 dark:border-amber-800 flex items-center justify-center shadow-xs">
                <AppleEmoji emoji="⚪" size={22} />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-800 dark:text-white">
                  En Çok Boş Bırakılan Konular
                </h4>
                <p className="text-xs font-bold text-slate-400">
                  Yeterli süre ayıramadığın veya tereddüt ettiğin alanlar
                </p>
              </div>
            </div>

            {topicMatrixData.topEmpty.length > 0 ? (
              <div className="space-y-3">
                {topicMatrixData.topEmpty.map((t, idx) => {
                  const subjectConfig = DENEME_SUBJECTS.find((s) => s.id === t.subjectId);
                  const color = subjectConfig?.color || "#ff9500";

                  return (
                    <div
                      key={t.topicId}
                      className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700/80 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 border-2 border-b-4 border-amber-700 shadow-xs">
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg text-white shrink-0 border border-white/20 shadow-2xs"
                              style={{ backgroundColor: color }}
                            >
                              {subjectConfig?.title || t.subjectId}
                            </span>
                            <span className="text-xs font-black text-slate-800 dark:text-white truncate">
                              {t.topicTitle}
                            </span>
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
              <p className="text-xs font-bold text-slate-400 py-4 text-center">
                İşaretlenmiş boş konusu bulunmuyor.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ━━━ SIGNATURE 3D DERS VE GÖRÜNÜM FİLTRELERİ ━━━ */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
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
            ❌ Sadece Hatalılar (
            {topicMatrixData.all.filter((t) => t.totalWrong > 0 || t.totalEmpty > 0).length})
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

      {/* ━━━ SIGNATURE 3D KONU KARTLARI MATRİSİ GRID ━━━ */}
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
                  className: "bg-[#58cc02] text-white border-2 border-b-4 border-green-700 shadow-xs",
                };

                if (t.totalWrong > 2) {
                  statusBadge = {
                    label: "Kritik Eksik",
                    emoji: "🚨",
                    className: "bg-[#ff4b4b] text-white border-2 border-b-4 border-rose-700 shadow-xs",
                  };
                } else if (totalIssue > 0) {
                  statusBadge = {
                    label: "İncele",
                    emoji: "💡",
                    className: "bg-[#ff9500] text-white border-2 border-b-4 border-amber-700 shadow-xs",
                  };
                }

                return (
                  <div
                    key={t.topicId}
                    className="bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-[2rem] p-5.5 relative overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:scale-[1.015] hover:border-slate-300 dark:hover:border-slate-600 group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: color }} />

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3 pt-0.5">
                        <span className="text-xs font-black uppercase px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-b-2 border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-center gap-1.5">
                          <AppleEmoji emoji={subjectConfig?.icon || "📘"} size={14} color={color} />
                          <span style={{ color }}>{subjectConfig?.title || t.subjectId}</span>
                        </span>

                        <span
                          className={`text-[11px] font-mono font-black px-2.5 py-1 rounded-xl flex items-center gap-1 ${statusBadge.className}`}
                        >
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
            <GithubTopicHeatmap
              topicMatrixData={topicMatrixData}
              viewType={viewType}
              selectedBransSubjectId={selectedBransSubjectId}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-10 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border-2 border-b-4 border-[#1cb0f6] flex items-center justify-center mx-auto shadow-sm">
            <AppleEmoji emoji="✨" size={32} />
          </div>
          <h4 className="text-lg font-black text-slate-800 dark:text-white">
            {filterMode === "errorsOnly"
              ? "Harika! Bu filtrede kayıtlı bir hata bulunmuyor."
              : "Henüz konu bazlı hata kaydı bulunmuyor."}
          </h4>
          <p className="text-xs font-bold text-slate-400 max-w-md mx-auto">
            Sınav girişi yaparken &quot;Hangi konularda takıldın?&quot; menüsünü kullanarak hangi sorularda takıldığınızı işaretleyebilirsiniz.
          </p>
        </div>
      )}
    </Section>
  );
}

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
  const themeColor = viewType === "brans" && activeSubjectConfig ? activeSubjectConfig.color : "#1cb0f6";
  const themeIcon = viewType === "brans" && activeSubjectConfig ? activeSubjectConfig.icon : "🎯";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100 dark:border-slate-700/60 pb-6">
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl border-2 border-b-4 flex items-center justify-center shadow-xs shrink-0"
            style={{ backgroundColor: `${themeColor}15`, borderColor: `${themeColor}60` }}
          >
            <AppleEmoji emoji={themeIcon} size={24} color={themeColor} />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
              Müfredat & Konu Hata Haritası
            </h4>
            <p className="text-xs font-bold text-slate-400">
              Sınavlarda işaretlediğiniz yanlış ve boş soruların ders bazlı görsel matrisi
            </p>
          </div>
        </div>

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

      <div className="space-y-4">
        {subjectsWithData.map((sub) => (
          <div key={sub.id} className="p-4.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border-2 border-slate-200/80 dark:border-slate-700/80 space-y-3">
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

      {hoveredTopic ? (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="text-white px-3 py-1 rounded-xl text-xs uppercase font-black shrink-0 border-2 border-b-4 border-black/20 shadow-xs flex items-center gap-1.5"
              style={{ backgroundColor: hoveredTopic.color }}
            >
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
