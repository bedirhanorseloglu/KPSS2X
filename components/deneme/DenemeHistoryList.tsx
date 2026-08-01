"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Trash2, Edit3, Clock, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import AppleEmoji from "../AppleEmoji";
import { DenemeRecord, evaluateDeneme, formatNet, formatDuration, estimateP3Score } from "@/lib/denemeUtils";
import { DENEME_SUBJECTS } from "@/lib/denemeConfig";
import ConfirmDialog from "./ConfirmDialog";

type Props = {
  denemeler: DenemeRecord[];
  activeSubjectTab?: string;
  onActiveSubjectTabChange?: (subId: string) => void;
  onDelete: (id: string) => void;
  onEdit: (deneme: DenemeRecord) => void;
  onAdd: () => void;
};

export default function DenemeHistoryList({
  denemeler,
  activeSubjectTab: externalActiveSubjectTab,
  onActiveSubjectTabChange,
  onDelete,
  onEdit,
  onAdd,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DenemeRecord | null>(null);
  const [internalSubjectTab, setInternalSubjectTab] = useState<string>("turkce");

  const activeSubjectTab = externalActiveSubjectTab || internalSubjectTab;
  const setActiveSubjectTab = (subId: string) => {
    setInternalSubjectTab(subId);
    onActiveSubjectTabChange?.(subId);
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

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

  const isAllBrans = useMemo(() => {
    return denemeler.length > 0 && denemeler.every((d) => d.examType === "brans");
  }, [denemeler]);

  const groupedBrans = useMemo(() => {
    if (!isAllBrans) return null;
    const groups: Record<string, DenemeRecord[]> = {};
    denemeler.forEach((d) => {
      const subId = d.bransSubjectId || "turkce";
      if (!groups[subId]) groups[subId] = [];
      groups[subId].push(d);
    });
    return groups;
  }, [denemeler, isAllBrans]);

  // Active Subject List for Showcase
  const activeSubjectList = useMemo(() => {
    if (!isAllBrans || !groupedBrans) return denemeler;
    return groupedBrans[activeSubjectTab] || [];
  }, [isAllBrans, groupedBrans, activeSubjectTab, denemeler]);

  // Pagination for Active Subject List
  const totalPages = Math.max(1, Math.ceil(activeSubjectList.length / ITEMS_PER_PAGE));
  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return activeSubjectList.slice(start, start + ITEMS_PER_PAGE);
  }, [activeSubjectList, currentPage]);

  const activeSubConfig = DENEME_SUBJECTS.find((s) => s.id === activeSubjectTab);

  if (denemeler.length === 0) {
    return (
      <>
        {deleteDialog}
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 text-center shadow-xs">
          <div className="w-16 h-16 bg-[#ddf4ff] dark:bg-[#1cb0f6]/20 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-[#1cb0f6] rounded-2xl flex items-center justify-center mb-4 shadow-xs">
            <AppleEmoji emoji="📭" size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white">Henüz Deneme Kaydı Yok</h3>
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

  return (
    <>
      {deleteDialog}

      {/* ━━━ 3D DERS SEÇİM SEKMELERİ (TAM SIĞACAK BİÇİMDE GRID DÜZENİ) ━━━ */}
      {isAllBrans && groupedBrans && (
        <div className="mb-6 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-0.5 w-full">
            {DENEME_SUBJECTS.map((sub) => {
              const count = (groupedBrans[sub.id] || []).length;
              const isActive = activeSubjectTab === sub.id;

              return (
                <motion.button
                  key={sub.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setActiveSubjectTab(sub.id);
                    setCurrentPage(1);
                  }}
                  className={`w-full py-2.5 px-2 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 border-2 border-b-4 cursor-pointer flex items-center justify-center gap-1.5 ${
                    isActive
                      ? "shadow-sm"
                      : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:border-slate-300"
                  }`}
                  style={{
                    backgroundColor: isActive ? `${sub.color}15` : undefined,
                    borderColor: isActive ? sub.color : undefined,
                    borderBottomColor: isActive ? sub.color : undefined,
                    color: isActive ? sub.color : undefined,
                  }}
                >
                  <AppleEmoji emoji={sub.icon} size={15} />
                  <span className="truncate">{sub.title}</span>
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-black font-mono shrink-0"
                    style={{
                      backgroundColor: isActive ? sub.color : "rgba(148, 163, 184, 0.2)",
                      color: isActive ? "#ffffff" : undefined,
                    }}
                  >
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* ━━━ SABİT 6 KARTLI DERS VİTRİNİ ━━━ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isAllBrans ? activeSubjectTab : "genel"}
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.99 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {paginatedExams.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700">
              <p className="text-sm font-bold text-slate-400">Bu kategoride henüz kayıtlı deneme bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {paginatedExams.map((deneme, idx) => {
                const res = evaluateDeneme(deneme.scores, deneme.examType);
                const isBrans = deneme.examType === "brans";
                const subId = deneme.bransSubjectId || activeSubjectTab;
                const subConfig = isBrans ? DENEME_SUBJECTS.find((s) => s.id === subId) || activeSubConfig : null;
                const subRes = isBrans ? res.subjects.find((s) => s.subjectId === subId) || res.subjects[0] : null;

                const totalCorrect = res.subjects.reduce((sum, s) => sum + s.correct, 0);
                const totalWrong = res.subjects.reduce((sum, s) => sum + s.wrong, 0);
                const totalEmpty = res.subjects.reduce((sum, s) => sum + s.empty, 0);
                const totalQuestions = isBrans ? (subRes ? subRes.questionCount : 30) : 120;
                const cardNet = isBrans ? (subRes ? subRes.net : res.totalNet) : res.totalNet;
                const cardAccuracy = totalQuestions > 0 ? Math.max(0, Math.round((cardNet / totalQuestions) * 100)) : 0;
                const p3Score = estimateP3Score(res.gyNet, res.gkNet);
                const isExpanded = expandedId === deneme.id;

                const cardColor = subConfig?.color || "#1cb0f6";

                return (
                  <motion.div
                    key={deneme.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    whileHover={{ y: -3 }}
                    className={`bg-white dark:bg-slate-800 rounded-[2.25rem] border-2 border-b-4 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                      isExpanded 
                        ? "border-[#1cb0f6] border-b-[#1899d6] shadow-md" 
                        : "border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md"
                    }`}
                  >
                    {/* Top Accent Line */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1.5" 
                      style={{ backgroundColor: cardColor }} 
                    />

                    <div className="p-6">
                      {/* Header (Clickable ONLY for Genel Deneme) */}
                      {!isBrans ? (
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : deneme.id)}
                          className="w-full text-left focus:outline-none cursor-pointer group/title"
                        >
                          <div className="flex justify-between items-start mb-4 pt-1 gap-3">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 
                                  className="text-base font-black text-slate-800 dark:text-white leading-tight transition-colors duration-200"
                                  style={{ color: isExpanded ? cardColor : undefined }}
                                >
                                  {deneme.name}
                                </h4>
                                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 shrink-0">
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180 text-[#1cb0f6]" : ""}`} />
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 flex-wrap">
                                <span>{format(new Date(deneme.date + "T12:00:00"), "d MMM yyyy", { locale: tr })}</span>
                                {deneme.publisher && (
                                  <span className="bg-slate-100 dark:bg-slate-700/80 px-2.5 py-0.5 rounded-lg text-slate-600 dark:text-slate-200 font-extrabold border border-slate-200 dark:border-slate-600">
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

                            {/* Net Badge */}
                            <div 
                              className="px-4 py-2.5 rounded-2xl text-center shrink-0 border-2 border-b-4 shadow-xs" 
                              style={{ 
                                backgroundColor: "#1cb0f615", 
                                borderColor: "#1cb0f6" 
                              }}
                            >
                              <span className="text-[9px] font-black uppercase tracking-widest block mb-0.5 text-[#1cb0f6]">
                                NET
                              </span>
                              <span className="text-2xl font-black font-mono leading-none tracking-tight text-[#1cb0f6]">
                                {formatNet(res.totalNet)}
                              </span>
                            </div>
                          </div>

                          {/* GENEL DENEME İÇİN: GY / GK / P3 PUAN ÇİPLERİ */}
                          <div className="my-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                                <span className="text-[9px] font-extrabold text-slate-400 block uppercase">GY Net</span>
                                <span className="text-xs font-black font-mono text-[#1cb0f6]">{formatNet(res.gyNet)}</span>
                              </div>
                              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                                <span className="text-[9px] font-extrabold text-slate-400 block uppercase">GK Net</span>
                                <span className="text-xs font-black font-mono text-[#58cc02]">{formatNet(res.gkNet)}</span>
                              </div>
                              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-amber-500/30">
                                <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 block uppercase">P3 Puan</span>
                                <span className="text-xs font-black font-mono text-amber-600 dark:text-amber-400">{p3Score.toFixed(2)}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs font-black font-mono pt-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-lg bg-[#e5f9e7] dark:bg-[#58cc02]/20 text-[#58cc02] border border-[#58cc02]/40">{totalCorrect} D</span>
                                <span className="px-2.5 py-0.5 rounded-lg bg-[#ffebeb] dark:bg-[#ff4b4b]/20 text-[#ff4b4b] border border-[#ff4b4b]/40">{totalWrong} Y</span>
                                <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600">{totalEmpty} B</span>
                                <span className="px-2.5 py-0.5 rounded-lg bg-[#1cb0f6]/10 text-[#1cb0f6] border border-[#1cb0f6]/30 font-black">%{cardAccuracy} İsabet</span>
                              </div>
                              <span className="text-[11px] text-[#1cb0f6] font-extrabold font-mono hover:underline">
                                {isExpanded ? "Detayları Gizle ▲" : "Ders Detayları ▼"}
                              </span>
                            </div>
                          </div>
                        </button>
                      ) : (
                        /* BRANŞ DENEMESİ (PREMIUM STATIC CARD) */
                        <div>
                          <div className="flex justify-between items-start mb-4 pt-1 gap-3">
                            <div className="space-y-1.5 flex-1">
                              <h4 
                                className="text-base font-black text-slate-800 dark:text-white leading-tight transition-colors duration-200 cursor-default"
                                onMouseEnter={(e) => {
                                  if (subConfig?.color) e.currentTarget.style.color = subConfig.color;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = "";
                                }}
                              >
                                {deneme.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 flex-wrap">
                                <span>{format(new Date(deneme.date + "T12:00:00"), "d MMM yyyy", { locale: tr })}</span>
                                {deneme.publisher && (
                                  <span className="bg-slate-100 dark:bg-slate-700/80 px-2.5 py-0.5 rounded-lg text-slate-600 dark:text-slate-200 font-extrabold border border-slate-200 dark:border-slate-600">
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

                            {/* 3D Physical Net Badge */}
                            <div 
                              className="px-4 py-2.5 rounded-2xl text-center shrink-0 border-2 border-b-4 shadow-xs" 
                              style={{ 
                                backgroundColor: `${cardColor}15`, 
                                borderColor: cardColor,
                                borderBottomColor: cardColor,
                              }}
                            >
                              <span className="text-[9px] font-black uppercase tracking-widest block mb-0.5" style={{ color: cardColor }}>
                                NET
                              </span>
                              <span className="text-2xl font-black font-mono leading-none tracking-tight" style={{ color: cardColor }}>
                                {formatNet(subRes ? subRes.net : res.totalNet)}
                              </span>
                            </div>
                          </div>

                          {/* BRANŞ DENEMESİ İÇİN D/Y/B ÇİPLERİ & İSABET ORANI */}
                          {subRes && (
                            <div className="my-4 pt-3.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-xs font-black font-mono">
                                <span className="px-3 py-1 rounded-xl bg-[#e5f9e7] dark:bg-[#58cc02]/20 text-[#58cc02] border-2 border-b-2 border-[#58cc02] shadow-2xs">
                                  {subRes.correct} D
                                </span>
                                <span className="px-3 py-1 rounded-xl bg-[#ffebeb] dark:bg-[#ff4b4b]/20 text-[#ff4b4b] border-2 border-b-2 border-[#ff4b4b] shadow-2xs">
                                  {subRes.wrong} Y
                                </span>
                                <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-2 border-b-2 border-slate-200 dark:border-slate-600 shadow-2xs">
                                  {subRes.empty} B
                                </span>
                              </div>

                              <span 
                                className="text-[11px] font-black font-mono px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60"
                                style={{ color: cardColor }}
                              >
                                %{cardAccuracy} İsabet
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ━━━ ACCORDION EXPANDED: SADECE GENEL DENEME İÇİN GÖRÜNÜR ━━━ */}
                      <AnimatePresence>
                        {!isBrans && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="pt-4 border-t-2 border-slate-100 dark:border-slate-700/80 overflow-hidden space-y-4"
                          >
                            {/* 🧠 GENEL YETENEK (GY) GRUBU */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between px-1 mb-1">
                                <span className="text-[11px] font-black uppercase tracking-wider text-[#1cb0f6] flex items-center gap-1.5">
                                  <AppleEmoji emoji="🧠" size={14} /> Genel Yetenek (GY)
                                </span>
                                <span className="text-[11px] font-mono font-black text-[#1cb0f6] bg-[#1cb0f6]/10 px-2 py-0.5 rounded-lg border border-[#1cb0f6]/30">
                                  {formatNet(res.gyNet)} NET
                                </span>
                              </div>

                              {res.subjects
                                .filter((s) => {
                                  const cfg = DENEME_SUBJECTS.find((sub) => sub.id === s.subjectId);
                                  return cfg?.category === "Genel Yetenek";
                                })
                                .map((s, sIdx) => {
                                  const subItemConfig = DENEME_SUBJECTS.find((sub) => sub.id === s.subjectId);
                                  const qTotal = subItemConfig?.questionCount || 1;
                                  const subAcc = Math.max(0, Math.round((s.net / qTotal) * 100));
                                  const itemColor = subItemConfig?.color || "#1cb0f6";

                                  return (
                                    <motion.div
                                      key={s.subjectId}
                                      initial={{ opacity: 0, y: 6 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.15, delay: sIdx * 0.02 }}
                                      className="p-2.5 px-3.5 rounded-xl border-2 border-b-2 transition-all shadow-2xs flex items-center justify-between gap-3"
                                      style={{
                                        backgroundColor: `${itemColor}08`,
                                        borderColor: `${itemColor}30`,
                                      }}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div 
                                          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs"
                                          style={{ backgroundColor: `${itemColor}15`, borderColor: `${itemColor}40` }}
                                        >
                                          <AppleEmoji emoji={subItemConfig?.icon || "📘"} size={14} />
                                        </div>
                                        <span className="text-xs font-black text-slate-800 dark:text-white truncate">
                                          {s.title}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-3 shrink-0">
                                        <div className="flex items-center gap-2 text-[11px] font-mono font-bold">
                                          <div className="flex gap-1.5">
                                            <span className="text-[#58cc02] font-black">{s.correct}D</span>
                                            <span className="text-[#ff4b4b] font-black">{s.wrong}Y</span>
                                            <span className="text-slate-400">{s.empty}B</span>
                                          </div>
                                          <span className="text-[10px] text-[#58cc02] font-black px-2 py-0.5 rounded-md bg-[#e5f9e7] dark:bg-[#58cc02]/20 border border-[#58cc02]/30 shrink-0">%{subAcc}</span>
                                        </div>

                                        <span 
                                          className="text-xs font-black font-mono px-2 py-0.5 rounded-lg border shadow-2xs shrink-0"
                                          style={{ 
                                            color: itemColor, 
                                            backgroundColor: `${itemColor}15`,
                                            borderColor: `${itemColor}30` 
                                          }}
                                        >
                                          {formatNet(s.net)} NET
                                        </span>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                            </div>

                            {/* 🏛️ GENEL KÜLTÜR (GK) GRUBU */}
                            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                              <div className="flex items-center justify-between px-1 mb-1">
                                <span className="text-[11px] font-black uppercase tracking-wider text-[#58cc02] flex items-center gap-1.5">
                                  <AppleEmoji emoji="🏛️" size={14} /> Genel Kültür (GK)
                                </span>
                                <span className="text-[11px] font-mono font-black text-[#58cc02] bg-[#58cc02]/10 px-2 py-0.5 rounded-lg border border-[#58cc02]/30">
                                  {formatNet(res.gkNet)} NET
                                </span>
                              </div>

                              {res.subjects
                                .filter((s) => {
                                  const cfg = DENEME_SUBJECTS.find((sub) => sub.id === s.subjectId);
                                  return cfg?.category !== "Genel Yetenek";
                                })
                                .map((s, sIdx) => {
                                  const subItemConfig = DENEME_SUBJECTS.find((sub) => sub.id === s.subjectId);
                                  const qTotal = subItemConfig?.questionCount || 1;
                                  const subAcc = Math.max(0, Math.round((s.net / qTotal) * 100));
                                  const itemColor = subItemConfig?.color || "#58cc02";

                                  return (
                                    <motion.div
                                      key={s.subjectId}
                                      initial={{ opacity: 0, y: 6 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.15, delay: sIdx * 0.02 }}
                                      className="p-2.5 px-3.5 rounded-xl border-2 border-b-2 transition-all shadow-2xs flex items-center justify-between gap-3"
                                      style={{
                                        backgroundColor: `${itemColor}08`,
                                        borderColor: `${itemColor}30`,
                                      }}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div 
                                          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs"
                                          style={{ backgroundColor: `${itemColor}15`, borderColor: `${itemColor}40` }}
                                        >
                                          <AppleEmoji emoji={subItemConfig?.icon || "📘"} size={14} />
                                        </div>
                                        <span className="text-xs font-black text-slate-800 dark:text-white truncate">
                                          {s.title}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-3 shrink-0">
                                        <div className="flex items-center gap-2 text-[11px] font-mono font-bold">
                                          <div className="flex gap-1.5">
                                            <span className="text-[#58cc02] font-black">{s.correct}D</span>
                                            <span className="text-[#ff4b4b] font-black">{s.wrong}Y</span>
                                            <span className="text-slate-400">{s.empty}B</span>
                                          </div>
                                          <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">%{subAcc}</span>
                                        </div>

                                        <span 
                                          className="text-xs font-black font-mono px-2 py-0.5 rounded-lg border shadow-2xs shrink-0"
                                          style={{ 
                                            color: itemColor, 
                                            backgroundColor: `${itemColor}15`,
                                            borderColor: `${itemColor}30` 
                                          }}
                                        >
                                          {formatNet(s.net)} NET
                                        </span>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Footer Action Buttons */}
                    <div className="px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      <span 
                        className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 border-b-2 shadow-2xs"
                        style={{
                          backgroundColor: `${cardColor}15`,
                          borderColor: `${cardColor}40`,
                          color: cardColor,
                        }}
                      >
                        {isBrans ? (
                          <>
                            <AppleEmoji emoji={subConfig?.icon || "📘"} size={13} />
                            <span>{subConfig?.title}</span>
                          </>
                        ) : (
                          <>
                            <AppleEmoji emoji="🏛️" size={13} />
                            <span>KPSS Genel Deneme</span>
                          </>
                        )}
                      </span>

                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(deneme);
                          }} 
                          className="px-3.5 py-1.5 text-xs font-black text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:border-[#1cb0f6] border-2 border-b-4 border-slate-200 dark:border-slate-600 rounded-xl transition-all active:translate-y-0.5 cursor-pointer shadow-2xs flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#1cb0f6]" />
                          <span>Düzenle</span>
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            requestDelete(deneme);
                          }} 
                          className="px-3.5 py-1.5 text-xs font-black text-[#ff4b4b] dark:text-rose-400 bg-[#ffebeb] dark:bg-rose-500/20 border-2 border-b-4 border-[#ff4b4b] border-b-[#ea2b2b] rounded-xl transition-all active:translate-y-0.5 cursor-pointer shadow-2xs flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#ff4b4b]" />
                          <span>Sil</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ━━━ 3D PAGINATION CONTROL BAR ━━━ */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-slate-200 dark:border-slate-700/80 mt-8">
          <span className="text-xs font-bold text-slate-400">
            Sayfa <span className="text-slate-800 dark:text-white font-black">{currentPage}</span> / {totalPages} (Toplam {activeSubjectList.length} kayıt)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl text-xs font-black bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-b-4 border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#1cb0f6] active:translate-y-0.5 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Önceki
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer border-2 border-b-4 active:translate-y-0.5 ${
                  currentPage === pageNum
                    ? "bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#1cb0f6]"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 rounded-xl text-xs font-black bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-b-4 border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#1cb0f6] active:translate-y-0.5 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
            >
              Sonraki <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
