import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubjectScoreResult, formatNet, TopicErrorEntry } from "@/lib/denemeUtils";
import ScoreStepper from "./ScoreStepper";
import DenemeAlert from "./DenemeAlert";
import AppleEmoji from "../AppleEmoji";
import { getSubjectTopics } from "@/lib/topicUtils";
import { Search, Check, RotateCcw, X, Target, Plus, Minus } from "lucide-react";

type Props = {
  subject: SubjectScoreResult;
  onChange: (
    field: "correct" | "wrong" | "empty",
    value: number
  ) => void;
  index: number;
  topicErrors?: TopicErrorEntry[];
  onTopicErrorsChange?: (errors: TopicErrorEntry[]) => void;
};

export default function SubjectScoreRow({
  subject,
  onChange,
  index,
  topicErrors = [],
  onTopicErrorsChange,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const topics = getSubjectTopics(subject.subjectId);

  const correctPct = (subject.correct / subject.questionCount) * 100;
  const wrongPct = (subject.wrong / subject.questionCount) * 100;
  const emptyPct = (subject.empty / subject.questionCount) * 100;

  const totalMarkedWrong = topicErrors.reduce((acc, t) => acc + (t.wrongCount || 0), 0);
  const totalMarkedEmpty = topicErrors.reduce((acc, t) => acc + (t.emptyCount || 0), 0);

  const remainingWrongSlots = Math.max(0, subject.wrong - totalMarkedWrong);
  const remainingEmptySlots = Math.max(0, subject.empty - totalMarkedEmpty);

  const isWrongComplete = subject.wrong > 0 && totalMarkedWrong === subject.wrong;
  const isEmptyComplete = subject.empty > 0 && totalMarkedEmpty === subject.empty;
  const isFullyMatched = (subject.wrong === 0 || isWrongComplete) && (subject.empty === 0 || isEmptyComplete) && (subject.wrong > 0 || subject.empty > 0);

  // Auto-prune topic errors if subject.wrong or subject.empty decreases in score steppers
  useEffect(() => {
    if (!onTopicErrorsChange || topicErrors.length === 0) return;

    let updated = [...topicErrors];
    let curWrong = updated.reduce((acc, t) => acc + (t.wrongCount || 0), 0);
    let curEmpty = updated.reduce((acc, t) => acc + (t.emptyCount || 0), 0);

    let changed = false;

    if (curWrong > subject.wrong) {
      let excess = curWrong - subject.wrong;
      for (let i = updated.length - 1; i >= 0 && excess > 0; i--) {
        const w = updated[i].wrongCount || 0;
        if (w > 0) {
          const sub = Math.min(w, excess);
          updated[i] = { ...updated[i], wrongCount: w - sub };
          excess -= sub;
          changed = true;
        }
      }
    }

    if (curEmpty > subject.empty) {
      let excess = curEmpty - subject.empty;
      for (let i = updated.length - 1; i >= 0 && excess > 0; i--) {
        const e = updated[i].emptyCount || 0;
        if (e > 0) {
          const sub = Math.min(e, excess);
          updated[i] = { ...updated[i], emptyCount: e - sub };
          excess -= sub;
          changed = true;
        }
      }
    }

    const filtered = updated.filter((t) => (t.wrongCount || 0) > 0 || (t.emptyCount || 0) > 0);

    if (changed || filtered.length !== updated.length) {
      onTopicErrorsChange(filtered);
    }
  }, [subject.wrong, subject.empty, topicErrors, onTopicErrorsChange]);

  const changeWrongCount = (topicId: string, topicTitle: string, delta: number) => {
    if (!onTopicErrorsChange) return;

    const existingIndex = topicErrors.findIndex((t) => t.topicId === topicId);
    let updated = [...topicErrors];

    if (existingIndex > -1) {
      const curW = updated[existingIndex].wrongCount || 0;
      const nextW = Math.max(0, curW + delta);

      // If incrementing beyond remaining slots, auto increment subject.wrong
      if (delta > 0 && remainingWrongSlots <= 0) {
        onChange("wrong", subject.wrong + delta);
      }

      updated[existingIndex] = { ...updated[existingIndex], wrongCount: nextW };

      if (nextW === 0 && (updated[existingIndex].emptyCount || 0) === 0) {
        updated = updated.filter((t) => t.topicId !== topicId);
      }
    } else if (delta > 0) {
      if (remainingWrongSlots <= 0) {
        onChange("wrong", subject.wrong + delta);
      }
      updated.push({ topicId, topicTitle, wrongCount: delta, emptyCount: 0 });
    }

    onTopicErrorsChange(updated);
  };

  const changeEmptyCount = (topicId: string, topicTitle: string, delta: number) => {
    if (!onTopicErrorsChange) return;

    const existingIndex = topicErrors.findIndex((t) => t.topicId === topicId);
    let updated = [...topicErrors];

    if (existingIndex > -1) {
      const curE = updated[existingIndex].emptyCount || 0;
      const nextE = Math.max(0, curE + delta);

      // If incrementing beyond remaining slots, auto increment subject.empty
      if (delta > 0 && remainingEmptySlots <= 0) {
        onChange("empty", subject.empty + delta);
      }

      updated[existingIndex] = { ...updated[existingIndex], emptyCount: nextE };

      if (nextE === 0 && (updated[existingIndex].wrongCount || 0) === 0) {
        updated = updated.filter((t) => t.topicId !== topicId);
      }
    } else if (delta > 0) {
      if (remainingEmptySlots <= 0) {
        onChange("empty", subject.empty + delta);
      }
      updated.push({ topicId, topicTitle, wrongCount: 0, emptyCount: delta });
    }

    onTopicErrorsChange(updated);
  };

  const filteredTopics = searchQuery.trim()
    ? topics.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : topics;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, type: "spring", stiffness: 300, damping: 28 }}
      className={`p-6 rounded-[2.25rem] bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] transition-all shadow-xs relative overflow-hidden ${
        subject.error ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div
            className="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 border-2 border-b-4 shadow-2xs"
            style={{
              backgroundColor: `${subject.color}15`,
              borderColor: subject.color,
              color: subject.color,
            }}
          >
            <AppleEmoji emoji={subject.icon} size={26} color={subject.color} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-slate-800 dark:text-white text-lg tracking-tight truncate">{subject.title}</h4>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
              Soru Sayısı: <span className="font-mono text-slate-700 dark:text-slate-200 font-black">{subject.questionCount}</span>
            </p>
          </div>
        </div>

        {/* 3D Net Rozeti */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div 
            className="px-4 py-2 rounded-2xl font-mono text-lg font-black flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/80 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs"
            style={{ color: subject.color }}
          >
            <span>{formatNet(subject.net)}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">NET</span>
          </div>
        </div>
      </div>

      {/* 3D Segmented Progress Bar */}
      <div className="mt-4 h-3.5 w-full bg-slate-200 dark:bg-slate-950 rounded-full border-2 border-b-2 border-slate-300 dark:border-slate-700 p-0.5 relative overflow-hidden shadow-inner flex gap-1">
        {correctPct > 0 && (
          <motion.div 
            className="h-full bg-[#58cc02] rounded-full shadow-2xs"
            style={{ width: `${correctPct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
        {wrongPct > 0 && (
          <motion.div 
            className="h-full bg-[#ff4b4b] rounded-full shadow-2xs"
            style={{ width: `${wrongPct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
        {emptyPct > 0 && (
          <motion.div 
            className="h-full bg-slate-400/40 dark:bg-slate-700 rounded-full shadow-2xs"
            style={{ width: `${emptyPct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
      </div>

      {/* SAYISAL STEPPER’LAR */}
      <div className="grid grid-cols-3 gap-3.5 mt-4">
        <ScoreStepper
          label="Doğru"
          value={subject.correct}
          max={subject.questionCount}
          variant="correct"
          onChange={(v) => onChange("correct", v)}
        />
        <ScoreStepper
          label="Yanlış"
          value={subject.wrong}
          max={subject.questionCount}
          variant="wrong"
          onChange={(v) => onChange("wrong", v)}
        />
        <ScoreStepper
          label="Boş"
          value={subject.empty}
          max={subject.questionCount}
          variant="empty"
          onChange={(v) => onChange("empty", v)}
        />
      </div>

      {/* ━━━ KOMPAKT KONU ŞERİDİ & MODAL BUTONU (SAYFAYI UZATMAZ) ━━━ */}
      {topics.length > 0 && (
        <div className="mt-4 pt-3.5 border-t-2 border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3 flex-wrap">
          
          {/* Seçili Konu Rozetleri Şeridi */}
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            {topicErrors.length > 0 ? (
              topicErrors.map((t) => (
                <span
                  key={t.topicId}
                  className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-b-4 flex items-center gap-1.5 shadow-2xs ${
                    (t.wrongCount || 0) > 0 && (t.emptyCount || 0) > 0
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/40"
                      : (t.wrongCount || 0) > 0
                      ? "bg-[#ff4b4b]/10 text-[#ff4b4b] border-[#ff4b4b]/40"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/40"
                  }`}
                >
                  <span className="truncate max-w-[160px]">{t.topicTitle.split("(")[0]}</span>
                  {(t.wrongCount || 0) > 0 && <span className="px-1.5 py-0.2 rounded-md bg-[#ff4b4b] text-white text-[10px]">{t.wrongCount}Y</span>}
                  {(t.emptyCount || 0) > 0 && <span className="px-1.5 py-0.2 rounded-md bg-amber-500 text-white text-[10px]">{t.emptyCount}B</span>}
                </span>
              ))
            ) : (
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AppleEmoji emoji="🎯" size={16} /> Hangi konularda takıldın?
              </span>
            )}
          </div>

          {/* Modal Açma Butonu */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#1cb0f6] text-white border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] hover:bg-[#199edc] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 shadow-xs shrink-0"
          >
            {topicErrors.length > 0 ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" /> Konuları Düzenle ({topicErrors.length})
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" /> Konu Seç
              </>
            )}
          </button>
        </div>
      )}

      {/* ━━━ ŞIK POP-UP MODAL PENCERESİ (SİTE STANDARDI 3D TASARIM) ━━━ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-2xl sm:max-w-3xl bg-white dark:bg-slate-800 border-2 border-b-6 border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-6 sm:p-7 shadow-2xl space-y-4 max-h-[88vh] flex flex-col overflow-hidden"
            >
              {/* Modal Başlık Barı */}
              <div className="flex items-center justify-between pb-3.5 border-b-2 border-slate-100 dark:border-slate-700/80 shrink-0">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg border-2 border-b-4 shadow-2xs shrink-0"
                    style={{ backgroundColor: `${subject.color}15`, borderColor: subject.color, color: subject.color }}
                  >
                    <AppleEmoji emoji={subject.icon} size={24} color={subject.color} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-lg tracking-tight">
                      {subject.title} - Hangi Konularda Takıldın?
                    </h3>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-400 mt-0.5">
                      Hatalı veya boş bıraktığınız konuları işaretleyip adetlerini belirleyin
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-600 border-2 border-b-4 border-slate-200 dark:border-slate-600 active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer shadow-2xs shrink-0"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Canlı Eşleşme Sayaç Çubuğu (3D HUD) */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border-2 border-b-4 border-slate-200 dark:border-slate-700 shrink-0 text-xs font-bold gap-3 flex-wrap">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Yanlış Rozeti (Her zaman Kırmızı) */}
                  <span className={`px-3 py-1.5 rounded-xl border-2 border-b-4 text-xs font-black tracking-wide flex items-center gap-1.5 shadow-2xs ${
                    subject.wrong > 0 || totalMarkedWrong > 0
                      ? "bg-[#ff4b4b]/15 text-[#ff4b4b] border-[#ff4b4b]/50"
                      : "bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                  }`}>
                    <AppleEmoji emoji="❌" size={13} color={subject.wrong > 0 || totalMarkedWrong > 0 ? "#ff4b4b" : "#94a3b8"} />
                    <span>Yanlış: <strong className="font-mono">{totalMarkedWrong}</strong>{subject.wrong > 0 ? ` / ${subject.wrong}` : ""}</span>
                  </span>

                  {/* Boş Rozeti (Her zaman Turuncu) */}
                  <span className={`px-3 py-1.5 rounded-xl border-2 border-b-4 text-xs font-black tracking-wide flex items-center gap-1.5 shadow-2xs ${
                    subject.empty > 0 || totalMarkedEmpty > 0
                      ? "bg-amber-500/15 text-amber-500 border-amber-500/50"
                      : "bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                  }`}>
                    <AppleEmoji emoji="⚪" size={13} color={subject.empty > 0 || totalMarkedEmpty > 0 ? "#ff9500" : "#94a3b8"} />
                    <span>Boş: <strong className="font-mono">{totalMarkedEmpty}</strong>{subject.empty > 0 ? ` / ${subject.empty}` : ""}</span>
                  </span>
                </div>

                {topicErrors.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onTopicErrorsChange && onTopicErrorsChange([])}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 hover:text-rose-600 dark:text-rose-400 border-2 border-b-4 border-rose-200 border-b-rose-300 dark:border-rose-800 dark:border-b-rose-900 hover:border-rose-400 hover:border-b-rose-500 dark:hover:border-rose-500 dark:hover:border-b-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-black flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 shadow-2xs transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" /> Temizle
                  </button>
                )}
              </div>

              {/* Arama Barı */}
              <div className="relative shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Konularda hızlıca ara..."
                  className="w-full bg-slate-100/90 dark:bg-slate-900/90 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#1cb0f6] focus:border-b-[#1899d6] dark:focus:border-[#1cb0f6] dark:focus:border-b-[#1899d6] transition-all shadow-2xs"
                />
              </div>

              {/* Konu Kartları Scroll Listesi */}
              <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                {filteredTopics.map((t) => {
                  const errorEntry = topicErrors.find((e) => e.topicId === t.id);
                  const wCount = errorEntry?.wrongCount || 0;
                  const eCount = errorEntry?.emptyCount || 0;
                  const isWrongActive = wCount > 0;
                  const isEmptyActive = eCount > 0;

                  return (
                    <div
                      key={t.id}
                      className={`p-4 rounded-2xl border-2 border-b-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-xs ${
                        isWrongActive && isEmptyActive
                          ? "bg-purple-50/80 dark:bg-purple-950/25 border-purple-300 dark:border-purple-800/80 border-b-[#af52de]"
                          : isWrongActive
                          ? "bg-rose-50/80 dark:bg-rose-950/25 border-rose-300 dark:border-rose-800/80 border-b-[#ff4b4b]"
                          : isEmptyActive
                          ? "bg-amber-50/80 dark:bg-amber-950/25 border-amber-300 dark:border-amber-800/80 border-b-[#ff9500]"
                          : "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        {t.questionRange && (
                          <div className="mb-1.5">
                            <span 
                              className="px-2.5 py-0.8 rounded-xl text-xs font-black tracking-wide border-2 border-b-2 shadow-2xs inline-flex items-center gap-1"
                              style={{
                                backgroundColor: `${subject.color}15`,
                                borderColor: `${subject.color}50`,
                                color: subject.color
                              }}
                            >
                              {t.questionRange}
                            </span>
                          </div>
                        )}
                        <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 leading-snug break-words">
                          {t.title}
                        </p>
                        {t.questionCount && (
                          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 mt-1 flex items-center gap-1">
                            Sınav Ağırlığı: <span className="font-mono text-slate-600 dark:text-slate-300 font-black">{t.questionCount}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap justify-end">
                        {/* YANLIŞ SEÇENEĞİ & 3D MİNİ STEPPER */}
                        {wCount === 0 ? (
                          <button
                            type="button"
                            onClick={() => changeWrongCount(t.id, t.title, 1)}
                            className="px-3.5 py-2 rounded-xl text-xs font-black transition-all border-2 border-b-4 cursor-pointer active:translate-y-0.5 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 text-rose-500 dark:text-rose-400 border-slate-200 dark:border-slate-600 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-xs"
                          >
                            <AppleEmoji emoji="❌" size={13} color="#ff4b4b" />
                            <span>YANLIŞ</span>
                          </button>
                        ) : (
                          <div className="flex items-center rounded-xl bg-[#ff4b4b] text-white border-2 border-b-4 border-[#d63a3a] shadow-xs overflow-hidden h-9">
                            <button
                              type="button"
                              onClick={() => changeWrongCount(t.id, t.title, -1)}
                              className="w-7.5 h-full flex items-center justify-center hover:bg-black/15 active:bg-black/25 transition-colors cursor-pointer select-none text-white"
                              title="Yanlışı Azalt"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                            <div className="px-2 font-black text-xs min-w-[54px] text-center flex items-center justify-center gap-1 select-none">
                              <span className="font-mono text-sm">{wCount}</span>
                              <span className="text-[10px] uppercase font-bold opacity-90">Yanlış</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => changeWrongCount(t.id, t.title, 1)}
                              className="w-7.5 h-full flex items-center justify-center hover:bg-black/15 active:bg-black/25 transition-colors cursor-pointer select-none text-white"
                              title="Yanlışı Artır"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </div>
                        )}

                        {/* BOŞ SEÇENEĞİ & 3D MİNİ STEPPER */}
                        {eCount === 0 ? (
                          <button
                            type="button"
                            onClick={() => changeEmptyCount(t.id, t.title, 1)}
                            className="px-3.5 py-2 rounded-xl text-xs font-black transition-all border-2 border-b-4 cursor-pointer active:translate-y-0.5 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 text-amber-600 dark:text-amber-400 border-slate-200 dark:border-slate-600 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 shadow-xs"
                          >
                            <AppleEmoji emoji="⚪" size={13} color="#ff9500" />
                            <span>BOŞ</span>
                          </button>
                        ) : (
                          <div className="flex items-center rounded-xl bg-[#ff9500] text-white border-2 border-b-4 border-[#d97d00] shadow-xs overflow-hidden h-9">
                            <button
                              type="button"
                              onClick={() => changeEmptyCount(t.id, t.title, -1)}
                              className="w-7.5 h-full flex items-center justify-center hover:bg-black/15 active:bg-black/25 transition-colors cursor-pointer select-none text-white"
                              title="Boşu Azalt"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                            <div className="px-2 font-black text-xs min-w-[46px] text-center flex items-center justify-center gap-1 select-none">
                              <span className="font-mono text-sm">{eCount}</span>
                              <span className="text-[10px] uppercase font-bold opacity-90">Boş</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => changeEmptyCount(t.id, t.title, 1)}
                              className="w-7.5 h-full flex items-center justify-center hover:bg-black/15 active:bg-black/25 transition-colors cursor-pointer select-none text-white"
                              title="Boşu Artır"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Alt Tamam Butonu (3D Duolingo Green) */}
              <div className="pt-3.5 border-t-2 border-slate-100 dark:border-slate-700/80 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3.5 rounded-2xl bg-[#58cc02] hover:bg-[#4eb602] text-white font-black text-sm uppercase tracking-wider border-2 border-b-4 border-[#429902] active:translate-y-0.5 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Check className="w-5 h-5 stroke-[3]" /> Tamamla ve Kaydet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {subject.error && (
        <DenemeAlert 
          variant="error" 
          title="Soru Limiti Aşıldı!" 
          compact 
          className="mt-3.5"
        >
          Girdiğiniz toplam soru sayısı <strong className="font-mono text-sm underline">{subject.totalEntered}</strong>, bu dersteki soru limitini (<strong className="font-mono text-sm">{subject.questionCount}</strong>) geçemez. Lütfen sayıları kontrol edin.
        </DenemeAlert>
      )}
    </motion.div>
  );
}
