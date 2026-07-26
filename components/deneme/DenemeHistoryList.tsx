"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Trash2, Edit3, Target, Search, Clock, Trophy } from "lucide-react";
import AppleEmoji from "../AppleEmoji";
import { DenemeRecord, evaluateDeneme, formatNet, estimateP3Score, formatDuration } from "@/lib/denemeUtils";
import { DENEME_SUBJECTS } from "@/lib/denemeConfig";
import ConfirmDialog from "./ConfirmDialog";

type Props = {
  denemeler: DenemeRecord[];
  onDelete: (id: string) => void;
  onEdit: (deneme: DenemeRecord) => void;
  onAdd: () => void;
};

export default function DenemeHistoryList({
  denemeler,
  onDelete,
  onEdit,
  onAdd,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DenemeRecord | null>(null);

  const requestDelete = (deneme: DenemeRecord) => setDeleteTarget(deneme);
  const confirmDelete = () => {
    if (!deleteTarget) return;
    onDelete(deleteTarget.id);
    if (expandedId === deleteTarget.id) setExpandedId(null);
    setDeleteTarget(null);
  };

  const deleteDialog = (
    <ConfirmDialog
      open={!!deleteTarget}
      title="Deneme Kaydını Sil"
      message={
        deleteTarget
          ? `"${deleteTarget.name}" kaydı kalıcı olarak silinecek. Bu işlem geri alınamaz.`
          : ""
      }
      confirmLabel="Evet, Sil"
      cancelLabel="Vazgeç"
      variant="danger"
      onClose={() => setDeleteTarget(null)}
      onConfirm={confirmDelete}
    />
  );

  const [selectedPublisher, setSelectedPublisher] = useState<string>("all");

  const publisherList = useMemo(() => {
    const counts: Record<string, number> = {};
    denemeler.forEach((d) => {
      const pub = d.publisher?.trim() || "Diğer";
      counts[pub] = (counts[pub] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [denemeler]);

  const filteredDenemeler = useMemo(() => {
    if (selectedPublisher === "all") return denemeler;
    return denemeler.filter((d) => {
      const pub = d.publisher?.trim() || "Diğer";
      return pub === selectedPublisher;
    });
  }, [denemeler, selectedPublisher]);

  const isAllBrans = useMemo(() => {
    return filteredDenemeler.length > 0 && filteredDenemeler.every((d) => d.examType === "brans");
  }, [filteredDenemeler]);

  const groupedBrans = useMemo(() => {
    if (!isAllBrans) return null;
    const groups: Record<string, DenemeRecord[]> = {};
    filteredDenemeler.forEach((d) => {
      const subId = d.bransSubjectId || "unknown";
      if (!groups[subId]) groups[subId] = [];
      groups[subId].push(d);
    });
    return groups;
  }, [filteredDenemeler, isAllBrans]);

  if (denemeler.length === 0) {
    return (
      <>
        {deleteDialog}
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 text-center shadow-xs">
          <div className="w-16 h-16 bg-[#ddf4ff] dark:bg-[#1cb0f6]/20 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-[#1cb0f6] rounded-2xl flex items-center justify-center mb-4 shadow-xs">
            <AppleEmoji emoji="📭" size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white">Henüz Deneme Yok</h3>
          <p className="text-slate-500 font-medium mt-2 max-w-sm text-sm">
            İlk denemenizi ekleyerek ilerlemenizi görselleştirmeye ve istatistiklerinizi oluşturmaya başlayın.
          </p>
          <button
            onClick={onAdd}
            className="mt-6 px-6 py-3 bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-black rounded-2xl border-2 border-b-4 border-[#0088cc] active:translate-y-0.5 shadow-xs transition-all cursor-pointer flex items-center gap-2 text-sm"
          >
            + İlk Denemeyi Ekle
          </button>
        </div>
      </>
    );
  }

  const publisherFilterUI = publisherList.length > 1 && (
    <div className="mb-6 p-5 bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">
          <AppleEmoji emoji="🏷️" size={18} />
          <span>Yayınevi Sınıflandırması & Filtre</span>
        </div>
        {selectedPublisher !== "all" && (
          <button
            type="button"
            onClick={() => setSelectedPublisher("all")}
            className="text-xs font-black text-[#1cb0f6] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Filtreyi Sıfırla</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedPublisher("all")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-2 border-b-4 active:translate-y-0.5 ${
            selectedPublisher === "all"
              ? "bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#1cb0f6]"
          }`}
        >
          Tüm Yayınevleri ({denemeler.length})
        </button>

        {publisherList.map(([pubName, count]) => (
          <button
            key={pubName}
            type="button"
            onClick={() => setSelectedPublisher(pubName)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-2 border-b-4 active:translate-y-0.5 ${
              selectedPublisher === pubName
                ? "bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#1cb0f6]"
            }`}
          >
            {pubName} ({count})
          </button>
        ))}
      </div>
    </div>
  );

  // BRANŞ GÖRÜNÜMÜ
  if (isAllBrans && groupedBrans) {
    return (
      <>
        {deleteDialog}
        {publisherFilterUI}
        <div className="space-y-10">
          {Object.entries(groupedBrans).map(([subId, list]) => {
            const subConfig = DENEME_SUBJECTS.find((s) => s.id === subId);
            if (!subConfig) return null;

            return (
              <div key={subId} className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-b-4 shadow-xs" style={{ backgroundColor: `${subConfig.color}15`, borderColor: subConfig.color }}>
                    <AppleEmoji emoji={subConfig.icon} size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                      {subConfig.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{list.length} Çözüm</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {list.map((deneme) => {
                    const res = evaluateDeneme(deneme.scores, deneme.examType);
                    const subRes = res.subjects.find((s) => s.subjectId === subId);
                    if (!subRes) return null;

                    return (
                      <div
                        key={deneme.id}
                        className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                        style={{
                          // Dynamic border hover accent matching subject color
                        }}
                      >
                        {/* Subject Top Accent Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: subConfig.color }} />

                        <div className="flex justify-between items-start mb-5 pt-2">
                          <div className="space-y-1.5">
                            <h4 className="text-base font-black text-slate-800 dark:text-white transition-colors leading-tight" style={{ color: undefined }}>
                              {deneme.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 flex-wrap">
                              <span>{format(new Date(deneme.date + "T12:00:00"), "d MMM yyyy", { locale: tr })}</span>
                              {deneme.publisher && (
                                <span className="bg-slate-100 dark:bg-slate-700/60 px-2.5 py-0.5 rounded-lg text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-600">
                                  {deneme.publisher}
                                </span>
                              )}
                              {deneme.durationMinutes && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ddf4ff] dark:bg-[#1cb0f6]/20 text-[#1cb0f6] border border-[#1cb0f6]/30">
                                  <Clock className="w-3 h-3 text-[#1cb0f6]" />
                                  {formatDuration(deneme.durationMinutes)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div 
                            className="px-4 py-2 rounded-2xl text-center shrink-0 border-2 border-b-4 shadow-xs" 
                            style={{ backgroundColor: `${subConfig.color}15`, borderColor: subConfig.color }}
                          >
                            <span className="text-[9px] font-black uppercase tracking-widest block mb-0.5" style={{ color: subConfig.color }}>
                              NET
                            </span>
                            <span className="text-xl font-black font-mono leading-none tracking-tight" style={{ color: subConfig.color }}>
                              {formatNet(subRes.net)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60">
                          <div className="flex items-center gap-1.5 text-xs font-black font-mono">
                            <span className="px-2.5 py-1 rounded-xl bg-[#e5f9e7] dark:bg-[#58cc02]/20 text-[#58cc02] border-2 border-b-2 border-[#58cc02]">
                              {subRes.correct} D
                            </span>
                            <span className="px-2.5 py-1 rounded-xl bg-[#ffebeb] dark:bg-[#ff4b4b]/20 text-[#ff4b4b] border-2 border-b-2 border-[#ff4b4b]">
                              {subRes.wrong} Y
                            </span>
                            <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-2 border-b-2 border-slate-200 dark:border-slate-600">
                              {subRes.empty} B
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => onEdit(deneme)} 
                              className="p-2 text-slate-500 hover:text-[#1cb0f6] bg-white dark:bg-slate-700 border-2 border-b-4 border-slate-200 dark:border-slate-600 rounded-xl transition-all active:translate-y-0.5 cursor-pointer shadow-2xs"
                              title="Düzenle"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => requestDelete(deneme)} 
                              className="p-2 text-[#ff4b4b] bg-[#ffebeb] dark:bg-rose-500/20 border-2 border-b-4 border-[#ff4b4b] border-b-[#ea2b2b] rounded-xl transition-all active:translate-y-0.5 cursor-pointer shadow-2xs"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // GENEL GÖRÜNÜM
  return (
    <>
      {deleteDialog}
      {publisherFilterUI}
      <div className="space-y-5">
        {filteredDenemeler.map((deneme, index) => {
          const result = evaluateDeneme(deneme.scores, deneme.examType);
          const expanded = expandedId === deneme.id;
          
          const prevDeneme = filteredDenemeler[index + 1];
          let trend: "up" | "down" | "flat" = "flat";
          if (prevDeneme) {
            const prevResult = evaluateDeneme(prevDeneme.scores, prevDeneme.examType);
            if (result.totalNet > prevResult.totalNet) trend = "up";
            else if (result.totalNet < prevResult.totalNet) trend = "down";
          }

          return (
            <motion.div
              key={`${deneme.id}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-slate-800 rounded-[2.25rem] border-2 border-b-4 transition-all duration-300 overflow-hidden shadow-xs ${
                expanded 
                  ? "border-[#1cb0f6] border-b-[#1899d6] shadow-md" 
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : deneme.id)}
                className="w-full p-6 sm:p-7 flex flex-col md:flex-row md:items-center gap-6 text-left focus:outline-none relative transition-transform cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={`text-xl font-black transition-colors ${expanded ? "text-[#1cb0f6]" : "text-slate-800 dark:text-white group-hover:text-[#1cb0f6]"}`}>
                      {deneme.name}
                    </h4>
                    {trend === "up" && (
                      <span className="text-[11px] bg-[#e5f9e7] dark:bg-[#58cc02]/20 text-[#58cc02] border-2 border-b-4 border-[#58cc02] border-b-[#46a302] px-3 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                        <span className="text-sm leading-none">↗</span> Yükseliş
                      </span>
                    )}
                    {trend === "down" && (
                      <span className="text-[11px] bg-[#ffebeb] dark:bg-[#ff4b4b]/20 text-[#ff4b4b] border-2 border-b-4 border-[#ff4b4b] border-b-[#ea2b2b] px-3 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                        <span className="text-sm leading-none">↘</span> Düşüş
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mt-2 flex-wrap">
                    <span>{format(new Date(deneme.date + "T12:00:00"), "d MMM yyyy", { locale: tr })}</span>
                    {deneme.publisher && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-lg text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-600">{deneme.publisher}</span>
                      </>
                    )}
                    {deneme.durationMinutes && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="text-[#1cb0f6] bg-[#ddf4ff] dark:bg-[#1cb0f6]/20 border border-[#1cb0f6]/30 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#1cb0f6]" />
                          {formatDuration(deneme.durationMinutes)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-10 w-full md:w-auto">
                  {deneme.durationMinutes && (
                    <>
                      <div className="flex flex-col items-center hidden sm:flex">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#1cb0f6]" /> Süre
                        </span>
                        <span className="font-mono font-black text-slate-700 dark:text-slate-300 text-lg leading-none">{formatDuration(deneme.durationMinutes)}</span>
                      </div>
                      <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                    </>
                  )}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">GY Net</span>
                    <span className="font-mono font-black text-slate-700 dark:text-slate-300 text-lg leading-none">{formatNet(result.gyNet)}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">GK Net</span>
                    <span className="font-mono font-black text-slate-700 dark:text-slate-300 text-lg leading-none">{formatNet(result.gkNet)}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Toplam</span>
                    <span className="font-mono font-black text-slate-800 dark:text-white text-2xl leading-none">{formatNet(result.totalNet)}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                  <div className="flex flex-col items-center hidden sm:flex">
                    <span className="text-[10px] font-extrabold text-[#1cb0f6] uppercase tracking-widest mb-1">P3 Puan</span>
                    <span className="font-mono font-black text-[#1cb0f6] text-2xl leading-none">{estimateP3Score(result.gyNet, result.gkNet).toFixed(2)}</span>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 border-2 border-b-4 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 ml-2 shadow-2xs">
                    <svg className={`w-5 h-5 transition-transform duration-300 ${expanded ? "rotate-180 text-[#1cb0f6]" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 sm:px-7 sm:pb-7">
                      <div className="w-full h-px bg-slate-100 dark:bg-slate-700/60 mb-6" />
                      
                      {/* Detailed Subject Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {result.subjects.map((s) => {
                          const subConfig = DENEME_SUBJECTS.find((sub) => sub.id === s.subjectId);
                          const totalQ = Math.max(1, s.correct + s.wrong + s.empty);
                          const correctPct = (s.correct / totalQ) * 100;
                          const wrongPct = (s.wrong / totalQ) * 100;

                          return (
                            <div 
                              key={s.subjectId} 
                              className="bg-slate-50 dark:bg-slate-900/60 border-2 border-b-4 border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between shadow-2xs relative overflow-hidden"
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-2.5">
                                  <AppleEmoji emoji={subConfig?.icon || "📘"} size={16} />
                                  <h5 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">{s.title}</h5>
                                </div>

                                <div className="flex items-baseline justify-between mb-2">
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="font-mono font-black text-2xl text-slate-800 dark:text-white leading-none">
                                      {formatNet(s.net)}
                                    </span>
                                    <span className="text-[10px] font-extrabold text-[#1cb0f6] uppercase tracking-widest">NET</span>
                                  </div>
                                  <div className="flex gap-2 text-xs font-black font-mono">
                                    <span className="text-[#58cc02]">{s.correct}D</span>
                                    <span className="text-[#ff4b4b]">{s.wrong}Y</span>
                                  </div>
                                </div>
                              </div>

                              {/* Progress bar inside subject mini card */}
                              <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full border border-slate-300 dark:border-slate-700 overflow-hidden shadow-inner p-[1px] flex mt-2">
                                {correctPct > 0 && (
                                  <div style={{ width: `${correctPct}%` }} className="bg-[#58cc02] h-full rounded-full transition-all duration-500" />
                                )}
                                {wrongPct > 0 && (
                                  <div style={{ width: `${wrongPct}%` }} className="bg-[#ff4b4b] h-full rounded-full transition-all duration-500" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Footer Actions & P3 Tahmini Card */}
                      <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 bg-amber-500/10 dark:bg-amber-500/15 border-2 border-b-4 border-amber-300 dark:border-amber-500/30 rounded-2xl px-4 py-2.5 shadow-2xs">
                          <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
                          <div>
                            <p className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-widest">Tahmini P3 Puanı</p>
                            <p className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono leading-none mt-0.5">{estimateP3Score(result.gyNet, result.gkNet).toFixed(3)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onEdit(deneme)}
                            className="px-5 py-2.5 bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 hover:border-[#1cb0f6] text-slate-700 dark:text-slate-200 text-xs font-black rounded-xl active:translate-y-0.5 shadow-2xs transition-all cursor-pointer"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => requestDelete(deneme)}
                            className="px-5 py-2.5 bg-[#ffebeb] dark:bg-rose-500/20 border-2 border-b-4 border-[#ff4b4b] border-b-[#ea2b2b] text-[#ff4b4b] dark:text-rose-400 text-xs font-black rounded-xl active:translate-y-0.5 shadow-2xs transition-all cursor-pointer"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
