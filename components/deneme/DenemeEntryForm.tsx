"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { getStudyDate } from "@/lib/dateUtils";
import { tr } from "date-fns/locale";
import { FileText, Brain, Compass, Calendar, Tag, Check, ArrowRight, ArrowLeft, ChevronDown, Globe, Target, Clock, BarChart3, CheckCircle2, XCircle, MinusCircle, BookOpen, Landmark, Trophy, Loader2 } from "lucide-react";
import SubjectScoreRow from "./SubjectScoreRow";
import DenemeScoreRing from "./DenemeScoreRing";
import {
  createEmptyScores,
  evaluateDeneme,
  formatNet,
  SubjectScoreInput,
  estimateP3Score,
} from "@/lib/denemeUtils";
import { TOTAL_QUESTIONS, getSubjectConfig, getSubjectQuestionCount, DENEME_SUBJECTS } from "@/lib/denemeConfig";
import DenemeAlert from "./DenemeAlert";
import AppleEmoji from "../AppleEmoji";
import CustomDatePicker from "@/components/ui/CustomDatePicker";

type Props = {
  targetNet: number;
  onSubmit: (payload: {
    name: string;
    date: string;
    publisher?: string;
    note?: string;
    durationMinutes?: number;
    scores: SubjectScoreInput[];
    examType?: "genel" | "brans";
    bransSubjectId?: string;
  }) => void;
  onCancel?: () => void;
  initial?: {
    name: string;
    date: string;
    publisher?: string;
    note?: string;
    durationMinutes?: number;
    scores: SubjectScoreInput[];
    examType?: "genel" | "brans";
    bransSubjectId?: string;
  };
};

const PUBLISHER_OPTIONS = [
  "Pegem",
  "Benim Hocam",
  "Yargı",
  "Yediiklim",
  "İsem",
  "Hoca Kafası",
  "Murat",
  "Doktrin",
  "Tasarı",
  "Data",
  "Krallar Karma",
  "Bilgi Sarmal",
  "Evveliyat",
  "Palme",
  "ÖSYM",
  "Diğer"
];

export default function DenemeEntryForm({ targetNet, onSubmit, onCancel, initial }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [examType, setExamType] = useState<"genel" | "brans">(initial?.examType ?? "genel");
  const [bransSubjectId, setBransSubjectId] = useState<string>(initial?.bransSubjectId ?? "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredSubjectId, setHoveredSubjectId] = useState<string | null>(null);
  const [name, setName] = useState(initial?.name ?? "");
  const [date, setDate] = useState(initial?.date ?? format(getStudyDate(), "yyyy-MM-dd"));
  
  const initialPub = initial?.publisher?.trim() ?? "";
  const isKnownPub = PUBLISHER_OPTIONS.includes(initialPub);
  const [isPubDropdownOpen, setIsPubDropdownOpen] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState<string>(
    initialPub ? (isKnownPub ? initialPub : "Diğer") : ""
  );
  const [customPublisher, setCustomPublisher] = useState<string>(
    initialPub && !isKnownPub ? initialPub : ""
  );
  const publisher = selectedPublisher === "Diğer" ? customPublisher : selectedPublisher;

  const [durationMinutes, setDurationMinutes] = useState<number | "">(initial?.durationMinutes ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [scores, setScores] = useState<SubjectScoreInput[]>(initial?.scores ?? createEmptyScores());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const result = useMemo(() => evaluateDeneme(scores, examType), [scores, examType]);

  const updateScore = (subjectId: string, field: "correct" | "wrong" | "empty", value: number) => {
    setScores((prev) =>
      prev.map((s) => {
        if (s.subjectId !== subjectId) return s;
        let questionCount = getSubjectQuestionCount(subjectId, examType);

        if (field === "correct") {
          const newCorrect = value;
          const newEmpty = Math.max(0, questionCount - (newCorrect + s.wrong));
          return { ...s, correct: newCorrect, empty: newEmpty };
        }
        if (field === "wrong") {
          const newWrong = value;
          const newEmpty = Math.max(0, questionCount - (s.correct + newWrong));
          return { ...s, wrong: newWrong, empty: newEmpty };
        }
        if (field === "empty") {
          const newEmpty = value;
          const newWrong = Math.max(0, questionCount - (s.correct + newEmpty));
          return { ...s, empty: newEmpty, wrong: newWrong };
        }
        return { ...s, [field]: value };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !result.isValid || (examType === "brans" && !bransSubjectId) || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        date,
        publisher: publisher.trim() || undefined,
        note: note.trim() || undefined,
        durationMinutes: durationMinutes !== "" ? Number(durationMinutes) : undefined,
        scores,
        examType,
        bransSubjectId: examType === "brans" ? bransSubjectId : undefined,
      });
      
      if (!initial) {
        setName("");
        setSelectedPublisher("");
        setCustomPublisher("");
        setDurationMinutes("");
        setNote("");
        setScores(createEmptyScores());
        setStep(1);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const step2Subjects = result.subjects.filter((s) => s.category === "Genel Yetenek");
  const step3Subjects = result.subjects.filter((s) => s.category !== "Genel Yetenek");
  const selectedBranchSubject = examType === "brans" ? result.subjects.find(s => s.subjectId === bransSubjectId) : null;

  const totalAnswered = examType === "genel" ? result.totalCorrect + result.totalWrong : (selectedBranchSubject ? selectedBranchSubject.correct + selectedBranchSubject.wrong : 0);
  const maxQuestions = examType === "genel" ? 120 : (selectedBranchSubject?.questionCount ?? 0);
  const answeredPercentage = maxQuestions > 0 ? (totalAnswered / maxQuestions) * 100 : 0;
  
  const displayNet = examType === "genel" ? result.totalNet : (selectedBranchSubject?.net ?? 0);
  const successRate = maxQuestions > 0 ? Math.max(0, Math.round((displayNet / maxQuestions) * 100)) : 0;
  const activeColor = examType === "brans" ? (selectedBranchSubject?.color || "#1cb0f6") : "#1cb0f6";

  return (
    <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8 xl:gap-10 items-start">
      
      {/* ━━━ SOL PANEL: FORM YÜZEYİ ━━━ */}
      <div className="space-y-6 min-w-0">
        
        {/* Site Style Segmented Header */}
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[1.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 mb-8 overflow-hidden">
          {([
            { id: 1, label: "Giriş Bilgileri", icon: FileText },
            { id: 2, label: examType === "genel" ? "Genel Yetenek" : "Net Girişi", icon: Brain },
            ...(examType === "genel" ? [{ id: 3, label: "Genel Kültür", icon: Compass }] : [])
          ]).map(tab => (
            <button
              key={tab.id}
              type="button"
              disabled={tab.id > 1 && (!name.trim() || !publisher.trim() || (examType === "brans" && !bransSubjectId))}
              onClick={() => setStep(tab.id as 1|2|3)}
              className="relative flex-1 py-3 px-4 text-center disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
            >
              {step === tab.id && (
                <motion.div
                  layoutId="stepTabBg"
                  className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center justify-center gap-2">
                <tab.icon className={`w-4 h-4 transition-colors ${step === tab.id ? "text-[#1cb0f6]" : "text-slate-400 dark:text-slate-500"}`} />
                <span className={`text-xs font-black transition-colors tracking-wide ${step === tab.id ? "text-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                  {tab.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Site Style Form Card */}
        <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-6 sm:p-10 shadow-sm relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.section
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-8"
              >
                <div className="pb-4 border-b border-slate-100/50 dark:border-slate-700/50">
                  <h3 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">Sınav Bilgileri</h3>
                  <p className="text-sm font-bold text-slate-400 mt-1">Deneme türünü ve detaylarını belirleyin.</p>
                </div>

                {/* Awwward Grade Apple & Duolingo Style Exam Type Cards */}
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Deneme Türü</span>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Genel Deneme Kartı */}
                    <button
                      type="button"
                      onClick={() => {
                        setExamType("genel");
                        setStep(1);
                        window.history.replaceState(null, '', "?mode=genel");
                      }}
                      className={`relative group flex flex-col items-start gap-3.5 p-5 rounded-2xl border-2 border-b-4 transition-all duration-200 text-left outline-none cursor-pointer active:translate-y-0.5 ${
                        examType === "genel"
                          ? "border-[#1cb0f6] border-b-[#1899d6] bg-sky-50/60 dark:bg-sky-950/30"
                          : "border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 bg-white dark:bg-slate-800 hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6]"
                      }`}
                    >
                      {/* Seçili işareti */}
                      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        examType === "genel" ? "border-[#1cb0f6] bg-[#1cb0f6]" : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                      }`}>
                        {examType === "genel" && (
                          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="12" height="12" viewBox="0 0 10 10" fill="none">
                            <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </motion.svg>
                        )}
                      </div>

                      {/* Apple 3D Emoji Icon */}
                      <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all border-2 border-b-4 ${
                        examType === "genel" 
                          ? "bg-sky-100/80 dark:bg-sky-900/40 border-sky-200 dark:border-sky-800" 
                          : "bg-slate-100/80 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                      }`}>
                        <AppleEmoji emoji="🌍" size={30} color="#1cb0f6" />
                      </div>

                      {/* Başlık + Açıklama */}
                      <div>
                        <p className={`text-base font-black tracking-tight transition-colors ${
                          examType === "genel" ? "text-[#1cb0f6]" : "text-slate-800 dark:text-white"
                        }`}>
                          Genel Deneme
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5 leading-snug">
                          120 Soru • GY + GK
                        </p>
                      </div>

                      {/* Alt etiket */}
                      <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl transition-all border ${
                        examType === "genel"
                          ? "bg-sky-100 text-[#1cb0f6] dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-600"
                      }`}>
                        Türkiye Geneli
                      </div>
                    </button>

                    {/* Branş Denemesi Kartı */}
                    <button
                      type="button"
                      onClick={() => { 
                        setExamType("brans"); 
                        setStep(1); 
                        window.history.replaceState(null, '', `?mode=brans${bransSubjectId ? `&subject=${bransSubjectId}` : ""}`);
                      }}
                      className={`relative group flex flex-col items-start gap-3.5 p-5 rounded-2xl border-2 border-b-4 transition-all duration-200 text-left outline-none cursor-pointer active:translate-y-0.5 ${
                        examType === "brans"
                          ? "border-[#af52de] border-b-[#8e24aa] bg-purple-50/60 dark:bg-purple-950/30"
                          : "border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 bg-white dark:bg-slate-800 hover:border-[#af52de] dark:hover:border-[#af52de]"
                      }`}
                    >
                      {/* Seçili işareti */}
                      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        examType === "brans" ? "border-[#af52de] bg-[#af52de]" : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                      }`}>
                        {examType === "brans" && (
                          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="12" height="12" viewBox="0 0 10 10" fill="none">
                            <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </motion.svg>
                        )}
                      </div>

                      {/* Apple 3D Emoji Icon */}
                      <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all border-2 border-b-4 ${
                        examType === "brans" 
                          ? "bg-purple-100/80 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800" 
                          : "bg-slate-100/80 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                      }`}>
                        <AppleEmoji emoji="🎯" size={30} color="#af52de" />
                      </div>

                      {/* Başlık + Açıklama */}
                      <div>
                        <p className={`text-base font-black tracking-tight transition-colors ${
                          examType === "brans" ? "text-[#af52de]" : "text-slate-800 dark:text-white"
                        }`}>
                          Branş Denemesi
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5 leading-snug">
                          Tek ders odaklı
                        </p>
                      </div>

                      {/* Alt etiket */}
                      <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl transition-all border ${
                        examType === "brans"
                          ? "bg-purple-100 text-[#af52de] dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-600"
                      }`}>
                        Ders Bazlı
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-7">
                  {examType === "brans" && (
                    <div className="sm:col-span-2 space-y-2 relative">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Branş Seçimi *</span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`w-full flex items-center justify-between bg-slate-100/70 dark:bg-white/5 border-2 border-b-4 rounded-2xl px-5 py-3.5 text-sm font-black transition-all shadow-xs text-left cursor-pointer active:translate-y-0.5 ${
                            isDropdownOpen
                              ? "border-[#1cb0f6] border-b-[#1899d6] bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                              : "border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 dark:bg-slate-800/80 text-slate-800 dark:text-white hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6]"
                          }`}
                        >
                          <span className={`font-black ${bransSubjectId ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>
                            {bransSubjectId 
                              ? result.subjects.find(s => s.subjectId === bransSubjectId)?.title + ` (${getSubjectQuestionCount(bransSubjectId, "brans")} Soru)`
                              : "Lütfen bir branş seçin..."}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#1cb0f6]' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setIsDropdownOpen(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden z-50 p-2 max-h-56 overflow-y-auto space-y-1"
                              >
                                {result.subjects.filter(s => s.subjectId !== "geometri").map((s) => {
                                  const subjectColor = DENEME_SUBJECTS.find(ds => ds.id === s.subjectId)?.color || "#3b82f6";
                                  const isSelected = bransSubjectId === s.subjectId;
                                  const isHovered = hoveredSubjectId === s.subjectId;
                                  const bransCount = getSubjectQuestionCount(s.subjectId, "brans");
                                  
                                  return (
                                    <button
                                      key={s.subjectId}
                                      type="button"
                                      onClick={() => {
                                        setBransSubjectId(s.subjectId);
                                        setIsDropdownOpen(false);
                                        window.history.replaceState(null, '', `?mode=brans&subject=${s.subjectId}`);
                                      }}
                                      onMouseEnter={() => setHoveredSubjectId(s.subjectId)}
                                      onMouseLeave={() => setHoveredSubjectId(null)}
                                      className="w-full text-left px-5 py-3 text-sm font-bold transition-all flex items-center justify-between"
                                      style={{
                                        backgroundColor: isSelected || isHovered ? `${subjectColor}15` : "transparent",
                                        color: isSelected || isHovered ? subjectColor : undefined
                                      }}
                                    >
                                      <span>{s.title} ({bransCount} Soru)</span>
                                      {isSelected && <Check className="w-4 h-4" style={{ color: subjectColor }} />}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  <div className="sm:col-span-2 space-y-2">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                      <AppleEmoji emoji="📝" size={16} /> Deneme Adı *
                    </span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Örn: Pegem 5. Türkiye Geneli"
                      className="w-full bg-slate-100/70 dark:bg-white/5 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 rounded-2xl px-5 py-3.5 text-sm font-black text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#1cb0f6] focus:border-b-[#1899d6] dark:focus:border-[#1cb0f6] dark:focus:border-b-[#1899d6] hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] transition-all shadow-xs"
                      required
                    />
                  </div>

                  <CustomDatePicker
                    value={date}
                    onChange={setDate}
                    label="Tarih *"
                    required
                  />

                  <div className="space-y-2 relative">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                      <AppleEmoji emoji="🏷️" size={16} /> Yayınevi *
                    </span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsPubDropdownOpen(!isPubDropdownOpen)}
                        className={`w-full flex items-center justify-between bg-slate-100/70 dark:bg-white/5 border-2 border-b-4 rounded-2xl px-5 py-3.5 text-sm font-black transition-all shadow-xs text-left cursor-pointer active:translate-y-0.5 ${
                          isPubDropdownOpen
                            ? "border-[#1cb0f6] border-b-[#1899d6] bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                            : "border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 dark:bg-slate-800/80 text-slate-800 dark:text-white hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6]"
                        }`}
                      >
                        <span className={`font-black ${selectedPublisher ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>
                          {selectedPublisher || "Yayınevi seçin..."}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isPubDropdownOpen ? 'rotate-180 text-[#1cb0f6]' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isPubDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setIsPubDropdownOpen(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.97 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden z-50 p-2 max-h-56 overflow-y-auto space-y-1"
                            >
                              {PUBLISHER_OPTIONS.map((pub) => {
                                const isSelected = selectedPublisher === pub;
                                const isOtherOption = pub === "Diğer";

                                return (
                                  <button
                                    key={pub}
                                    type="button"
                                    onClick={() => {
                                      setSelectedPublisher(pub);
                                      if (!isOtherOption) {
                                        setCustomPublisher("");
                                      }
                                      setIsPubDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                      isSelected
                                        ? "bg-[#1cb0f6] text-white font-black shadow-xs"
                                        : isOtherOption
                                        ? "bg-slate-100 dark:bg-slate-700/60 text-[#1cb0f6] hover:bg-[#1cb0f6] hover:text-white border-t border-slate-200 dark:border-slate-700 mt-1 font-black"
                                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70 hover:text-[#1cb0f6]"
                                    }`}
                                  >
                                    <span className="flex items-center gap-2">
                                      {isOtherOption ? <Tag className="w-3.5 h-3.5" /> : null}
                                      {pub}
                                    </span>
                                    {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3.5} />}
                                  </button>
                                );
                              })}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    <AnimatePresence>
                      {selectedPublisher === "Diğer" && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -6, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pt-1 overflow-hidden"
                        >
                          <input
                            value={customPublisher}
                            onChange={(e) => setCustomPublisher(e.target.value)}
                            placeholder="Yayınevi girin (Örn: Lider)"
                            className="w-full bg-slate-100/70 dark:bg-white/5 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 rounded-2xl px-5 py-3.5 text-sm font-black text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#1cb0f6] focus:border-b-[#1899d6] dark:focus:border-[#1cb0f6] dark:focus:border-b-[#1899d6] hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] transition-all shadow-xs"
                            required={selectedPublisher === "Diğer"}
                            autoFocus
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.section>
            )}

            {step === 2 && (
              <motion.section
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-8"
              >
                <div className="pb-4 border-b border-slate-100/50 dark:border-slate-700/50">
                  <h3 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                    <AppleEmoji emoji="🧠" size={28} />
                    {examType === "genel" ? "Genel Yetenek" : "Net Girişi"}
                  </h3>
                  <p className="text-sm font-bold text-slate-400 mt-1">Doğru, yanlış ve boş sayılarınızı girin.</p>
                </div>
                
                <div className="space-y-5">
                  {(examType === "genel" ? step2Subjects : result.subjects.filter((s) => s.subjectId === bransSubjectId)).map((subject, i) => (
                    <SubjectScoreRow
                      key={subject.subjectId}
                      subject={subject}
                      index={i}
                      onChange={(field, value) => updateScore(subject.subjectId, field, value)}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {step === 3 && (
              <motion.section
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-8"
              >
                <div className="pb-4 border-b border-slate-100/50 dark:border-slate-700/50">
                  <h3 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                    <AppleEmoji emoji="🏛️" size={28} />
                    Genel Kültür
                  </h3>
                  <p className="text-sm font-bold text-slate-400 mt-1">Genel kültür testinin doğru ve yanlışlarını girin.</p>
                </div>
                
                <div className="space-y-5">
                  {step3Subjects.map((subject, i) => (
                    <SubjectScoreRow
                      key={subject.subjectId}
                      subject={subject}
                      index={i}
                      onChange={(field, value) => updateScore(subject.subjectId, field, value)}
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Footer Controls */}
          <div className="mt-10 pt-6 border-t border-slate-100/60 dark:border-white/10 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[15px] font-black text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 border-b-4 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-800 active:border-b-2 active:translate-y-0.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Geri
              </button>
            ) : onCancel ? (
              <button type="button" onClick={onCancel} className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 transition-colors">İptal</button>
            ) : <div />}

            {(step < 3 && examType === "genel") || (step < 2 && examType === "brans") ? (
              <button
                type="button"
                disabled={!name.trim() || !publisher.trim() || (examType === "brans" && !bransSubjectId)}
                onClick={() => setStep((s) => (s + 1) as any)}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[15px] font-black text-white bg-[#1cb0f6] hover:bg-[#1cb0f6]/90 active:bg-[#1cb0f6] border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:border-b-0 disabled:translate-y-1 shadow-md shadow-[#1cb0f6]/20"
              >
                İleri <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <motion.button
                type="submit"
                disabled={!name.trim() || !publisher.trim() || !result.isValid || isSubmitting}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-[15px] font-black text-white transition-all cursor-pointer shadow-lg ${
                  isSubmitting
                    ? "bg-[#46a302] border-2 border-b-2 border-[#378202] translate-y-0.5 opacity-90 cursor-wait shadow-none"
                    : "bg-[#58cc02] hover:bg-[#4eb802] active:bg-[#46a302] border-2 border-b-4 border-[#46a302] active:border-b-2 active:translate-y-0.5 shadow-[#58cc02]/30 hover:scale-[1.02]"
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:border-b-2 disabled:translate-y-0.5 disabled:hover:scale-100`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" strokeWidth={3} />
                    <span>{initial ? "Değişiklikleri Kaydet" : "Denemeyi Kaydet"}</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* ━━━ SAĞ PANEL: CANLI SKOR WIDGETLARI ━━━ */}
      <aside className="lg:sticky lg:top-28 h-fit space-y-6">
        <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-7 shadow-sm relative overflow-hidden">
          
          {/* Clean Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: activeColor }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: activeColor }} />
              </span>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-white">Canlı Skor Paneli</h4>
            </div>
            <BarChart3 className="w-5 h-5" style={{ color: activeColor }} />
          </div>

          {/* ━━━ CANLI SKOR GÖSTERGE KARTI ━━━ */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-[2rem] p-6 text-center relative overflow-hidden mb-6">
            <div 
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-[11px] font-extrabold uppercase tracking-wider mb-3 shadow-xs"
              style={{
                backgroundColor: activeColor,
                borderBottomWidth: "3px",
                borderBottomColor: "rgba(0, 0, 0, 0.25)"
              }}
            >
              <AppleEmoji emoji={examType === "genel" ? "🎯" : (selectedBranchSubject?.icon || "📘")} size={14} />
              <span>{examType === "genel" ? "Toplam Canlı Net" : `${selectedBranchSubject?.title || "Ders"} Neti`}</span>
            </div>

            <div className="flex items-baseline justify-center gap-2 my-1">
              <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-slate-800 dark:text-white leading-none">
                {displayNet.toFixed(2).replace(/\.?0+$/, "")}
              </span>
              <span className="text-base font-extrabold uppercase tracking-wider" style={{ color: activeColor }}>NET</span>
            </div>

            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
              {maxQuestions > 0 ? `${maxQuestions} soru üzerinden` : "Soru girişi bekleniyor"}
            </p>
          </div>

          {/* ━━━ CEVAPLANAN / KALAN BARI ━━━ */}
          <div className="space-y-2.5 mb-6">
            {(() => {
              const correctCount = examType === "genel" ? result.totalCorrect : (selectedBranchSubject?.correct ?? 0);
              const wrongCount = examType === "genel" ? result.totalWrong : (selectedBranchSubject?.wrong ?? 0);
              const correctPct = maxQuestions === 0 ? 0 : (correctCount / maxQuestions) * 100;
              const wrongPct = maxQuestions === 0 ? 0 : (wrongCount / maxQuestions) * 100;
              
              return (
                <>
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-[#58cc02]"></span>
                      Cevaplanan <span className="text-slate-800 dark:text-white font-mono">{totalAnswered}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      Kalan <span className="text-slate-800 dark:text-white font-mono">{maxQuestions - totalAnswered}</span>
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    </div>
                  </div>
                  <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full border-2 border-slate-200 dark:border-slate-700 p-[2px] relative overflow-hidden shadow-inner">
                    <div className="w-full h-full rounded-full overflow-hidden flex">
                      <motion.div 
                        className="h-full bg-[#58cc02]"
                        initial={{ width: 0 }}
                        animate={{ width: `${correctPct}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      <motion.div 
                        className="h-full bg-[#ff4b4b]"
                        initial={{ width: 0 }}
                        animate={{ width: `${wrongPct}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* ━━━ 4 MİNİ İSTATİSTİK KARTI ━━━ */}
          <div className="grid grid-cols-2 gap-3">
            {examType === "genel" ? (
              <>
                <SiteStatCard label="G. Yetenek" value={formatNet(result.gyNet)} icon={<BookOpen className="w-4 h-4 text-[#1cb0f6]" />} valueColor="text-[#1cb0f6]" />
                <SiteStatCard label="G. Kültür" value={formatNet(result.gkNet)} icon={<Landmark className="w-4 h-4 text-[#af52de]" />} valueColor="text-[#af52de]" />
                <SiteStatCard label="Doğru" value={String(result.totalCorrect)} icon={<CheckCircle2 className="w-4 h-4 text-[#58cc02]" />} valueColor="text-[#58cc02]" />
                <SiteStatCard label="Yanlış" value={String(result.totalWrong)} icon={<XCircle className="w-4 h-4 text-[#ff4b4b]" />} valueColor="text-[#ff4b4b]" />
                
                {/* P3 Puan Tahmini Kartı */}
                <div className="col-span-2 rounded-[1.25rem] p-4 bg-amber-500/10 dark:bg-amber-500/15 border-2 border-b-4 border-amber-200 dark:border-amber-500/30 flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">P3 Puan Tahmini</span>
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                    {estimateP3Score(result.gyNet, result.gkNet).toFixed(3)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <SiteStatCard label="Doğru" value={String(selectedBranchSubject?.correct ?? 0)} icon={<CheckCircle2 className="w-4 h-4 text-[#58cc02]" />} valueColor="text-[#58cc02]" />
                <SiteStatCard label="Yanlış" value={String(selectedBranchSubject?.wrong ?? 0)} icon={<XCircle className="w-4 h-4 text-[#ff4b4b]" />} valueColor="text-[#ff4b4b]" />
                <SiteStatCard label="Boş" value={String(selectedBranchSubject?.empty ?? 0)} icon={<MinusCircle className="w-4 h-4 text-slate-400" />} valueColor="text-slate-700 dark:text-slate-200" />
                <SiteStatCard label="İsabet Oranı" value={totalAnswered > 0 ? `%${(successRate % 1 === 0 ? successRate.toFixed(0) : successRate.toFixed(1))}` : "%0"} icon={<Target className="w-4 h-4" style={{ color: activeColor }} />} style={{ color: activeColor }} />
              </>
            )}
          </div>

          {examType === "genel" && (
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/60 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Target className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hedef Net: {targetNet}</span>
              </div>
              <div className="text-xs font-bold">
                {result.totalNet >= targetNet ? (
                  <span className="text-[#58cc02] bg-[#58cc02]/10 border border-[#58cc02]/20 px-3 py-1 rounded-full inline-flex items-center gap-1 font-bold">
                    🎉 Hedef aşıldı! (+{(result.totalNet - targetNet).toFixed(1)} Net)
                  </span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">
                    Hedefe <strong className="text-[#1cb0f6] font-mono text-sm px-1.5 py-0.5 rounded-md bg-[#1cb0f6]/10 font-bold">{(targetNet - result.totalNet).toFixed(1)}</strong> net kaldı.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {examType === "brans" && !bransSubjectId && step > 1 && (
          <DenemeAlert variant="warning" title="Branş seçimi gerekli">
            Devam etmek için hangi branş dersine ait deneme girdiğinizi seçmelisiniz.
          </DenemeAlert>
        )}
      </aside>
    </form>
  );
}

function SiteStatCard({ label, value, icon, valueColor, style }: { label: string; value: string; icon: React.ReactNode; valueColor?: string; style?: React.CSSProperties }) {
  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <p className={`text-2xl font-extrabold font-mono leading-none ${valueColor || ""}`} style={style}>{value}</p>
    </div>
  );
}
