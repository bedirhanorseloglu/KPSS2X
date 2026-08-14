import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubjectScoreResult, formatNet, TopicErrorEntry } from "@/lib/denemeUtils";
import ScoreStepper from "./ScoreStepper";
import DenemeAlert from "./DenemeAlert";
import AppleEmoji from "../AppleEmoji";
import { getSubjectTopics } from "@/lib/topicUtils";
import { Search, Check, RotateCcw, X, Target, Plus } from "lucide-react";

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

  const toggleWrongClick = (topicId: string, topicTitle: string) => {
    if (!onTopicErrorsChange) return;

    const existingIndex = topicErrors.findIndex((t) => t.topicId === topicId);
    let updated = [...topicErrors];

    if (existingIndex > -1) {
      const curW = updated[existingIndex].wrongCount || 0;
      if (remainingWrongSlots > 0) {
        updated[existingIndex] = { ...updated[existingIndex], wrongCount: curW + 1 };
      } else {
        updated[existingIndex] = { ...updated[existingIndex], wrongCount: 0 };
      }

      if ((updated[existingIndex].wrongCount || 0) === 0 && (updated[existingIndex].emptyCount || 0) === 0) {
        updated = updated.filter((t) => t.topicId !== topicId);
      }
    } else {
      if (remainingWrongSlots > 0) {
        updated.push({ topicId, topicTitle, wrongCount: 1, emptyCount: 0 });
      }
    }

    onTopicErrorsChange(updated);
  };

  const toggleEmptyClick = (topicId: string, topicTitle: string) => {
    if (!onTopicErrorsChange) return;

    const existingIndex = topicErrors.findIndex((t) => t.topicId === topicId);
    let updated = [...topicErrors];

    if (existingIndex > -1) {
      const curE = updated[existingIndex].emptyCount || 0;
      if (remainingEmptySlots > 0) {
        updated[existingIndex] = { ...updated[existingIndex], emptyCount: curE + 1 };
      } else {
        updated[existingIndex] = { ...updated[existingIndex], emptyCount: 0 };
      }

      if ((updated[existingIndex].wrongCount || 0) === 0 && (updated[existingIndex].emptyCount || 0) === 0) {
        updated = updated.filter((t) => t.topicId !== topicId);
      }
    } else {
      if (remainingEmptySlots > 0) {
        updated.push({ topicId, topicTitle, wrongCount: 0, emptyCount: 1 });
      }
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
      {topics.length > 0 && (subject.wrong > 0 || subject.empty > 0) && (
        <div className="mt-4 pt-3.5 border-t-2 border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3 flex-wrap">
          
          {/* Seçili Konu Rozetleri Şeridi */}
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            {topicErrors.length > 0 ? (
              topicErrors.map((t) => (
                <span
                  key={t.topicId}
                  className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-b-4 flex items-center gap-1.5 shadow-2xs ${
                    (t.wrongCount || 0) > 0
                      ? "bg-[#ff4b4b]/10 text-[#ff4b4b] border-[#ff4b4b]/40"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/40"
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

      {/* ━━━ ŞIK POP-UP MODAL PENCERESİ (PAGE HEİGHT KESİNLİKLE UZAMAZ) ━━━ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Modal Başlık Barı */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 dark:border-slate-700/60 shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg border-2 border-b-4 shadow-2xs"
                    style={{ backgroundColor: `${subject.color}15`, borderColor: subject.color, color: subject.color }}
                  >
                    <AppleEmoji emoji={subject.icon} size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-base">{subject.title} - Hangi Konularda Takıldın?</h3>
                    <p className="text-xs font-bold text-slate-400">Tek tıkla hatalı konularınızı işaretleyin</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Canlı Eşleşme Sayaç Çubuğu */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shrink-0 text-xs font-bold">
                <div className="flex items-center gap-2">
                  {subject.wrong > 0 && (
                    <span className={`px-2.5 py-1 rounded-xl border-2 border-b-4 text-[11px] font-mono font-black ${
                      totalMarkedWrong === subject.wrong ? "bg-[#58cc02]/15 text-[#58cc02] border-[#58cc02]/40" : "bg-[#ff4b4b]/15 text-[#ff4b4b] border-[#ff4b4b]/40"
                    }`}>
                      Yanlış: {totalMarkedWrong}/{subject.wrong}
                    </span>
                  )}
                  {subject.empty > 0 && (
                    <span className={`px-2.5 py-1 rounded-xl border-2 border-b-4 text-[11px] font-mono font-black ${
                      totalMarkedEmpty === subject.empty ? "bg-[#58cc02]/15 text-[#58cc02] border-[#58cc02]/40" : "bg-amber-500/15 text-amber-500 border-amber-500/40"
                    }`}>
                      Boş: {totalMarkedEmpty}/{subject.empty}
                    </span>
                  )}
                </div>

                {topicErrors.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onTopicErrorsChange && onTopicErrorsChange([])}
                    className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 border-2 border-rose-200 dark:border-rose-800 text-[11px] font-black flex items-center gap-1 hover:bg-rose-100 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Temizle
                  </button>
                )}
              </div>

              {/* Arama Barı */}
              <div className="relative shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Konu ara..."
                  className="w-full bg-slate-100 dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#1cb0f6] shadow-2xs"
                />
              </div>

              {/* Konu Kartları Scroll Listesi */}
              <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                {filteredTopics.map((t) => {
                  const errorEntry = topicErrors.find((e) => e.topicId === t.id);
                  const wCount = errorEntry?.wrongCount || 0;
                  const eCount = errorEntry?.emptyCount || 0;
                  const isWrongActive = wCount > 0;
                  const isEmptyActive = eCount > 0;

                  return (
                    <div
                      key={t.id}
                      className={`p-3.5 rounded-2xl border-2 border-b-4 transition-all flex items-center justify-between gap-3 ${
                        isWrongActive
                          ? "bg-rose-50/90 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 shadow-2xs"
                          : isEmptyActive
                          ? "bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 shadow-2xs"
                          : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{t.title}</p>
                        {t.questionCount && (
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">Sınav Ağırlığı: {t.questionCount}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {subject.wrong > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleWrongClick(t.id, t.title)}
                            disabled={!isWrongActive && remainingWrongSlots <= 0}
                            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all border-2 border-b-4 cursor-pointer active:translate-y-0.5 flex items-center gap-1.5 ${
                              isWrongActive
                                ? "bg-[#ff4b4b] text-white border-rose-700 shadow-xs"
                                : remainingWrongSlots > 0
                                ? "bg-slate-100 dark:bg-slate-700/80 text-rose-500 dark:text-rose-400 border-slate-200 dark:border-slate-600 hover:border-rose-400"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-40"
                            }`}
                          >
                            <span>❌ YANLIŞ</span>
                            {wCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-md bg-white text-[#ff4b4b] font-mono text-[11px] font-black shadow-2xs">
                                {wCount}
                              </span>
                            )}
                          </button>
                        )}

                        {subject.empty > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleEmptyClick(t.id, t.title)}
                            disabled={!isEmptyActive && remainingEmptySlots <= 0}
                            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all border-2 border-b-4 cursor-pointer active:translate-y-0.5 flex items-center gap-1.5 ${
                              isEmptyActive
                                ? "bg-amber-500 text-white border-amber-700 shadow-xs"
                                : remainingEmptySlots > 0
                                ? "bg-slate-100 dark:bg-slate-700/80 text-amber-600 dark:text-amber-400 border-slate-200 dark:border-slate-600 hover:border-amber-400"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-40"
                            }`}
                          >
                            <span>⚪ BOŞ</span>
                            {eCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-md bg-white text-amber-600 font-mono text-[11px] font-black shadow-2xs">
                                {eCount}
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Alt Tamam Butonu */}
              <div className="pt-3 border-t-2 border-slate-100 dark:border-slate-700/60 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 rounded-2xl bg-[#58cc02] text-white border-2 border-b-4 border-emerald-700 hover:bg-[#4eb602] text-xs font-black cursor-pointer active:translate-y-0.5 shadow-xs"
                >
                  Tamamla ve Kaydet
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
