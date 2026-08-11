"use client";

import { Subject, Topic } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useEffect, useCallback } from "react";
import { GripVertical, Check, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import AppleEmoji from "@/components/AppleEmoji";

function DraggableTopicItem({ 
  topic, 
  onToggleTopic, 
  onScheduleTopic, 
  color, 
}: { 
  topic: Topic; 
  onToggleTopic: (id: string) => void; 
  onScheduleTopic: (id: string) => void; 
  color: string; 
  subjectIcon: string; 
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `topic_${topic.id}`,
    data: { topic }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.9 : 1,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      layoutId={`topic-${topic.id}`}
      className={`cursor-grab active:cursor-grabbing group relative flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 border-2 ${
        topic.done
          ? "bg-slate-50 dark:bg-slate-900/40 border-b-2 border-slate-200 dark:border-slate-700/50 opacity-60 grayscale"
          : "bg-white dark:bg-slate-800 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs"
      }`}
    >
      {/* 3D Drag Handle */}
      <div 
        className="text-slate-300 p-1 shrink-0 rounded-xl transition-colors cursor-grab active:cursor-grabbing"
        style={{ color: isDragging ? color : undefined }}
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="flex-1 flex items-center gap-3 text-left overflow-hidden">
        {/* 3D Checkbox */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onToggleTopic(topic.id); }}
          className={`w-7 h-7 rounded-xl flex items-center justify-center border-2 transition-all shrink-0 cursor-pointer ${
            topic.done
              ? "bg-[#58cc02] border-2 border-b-4 border-[#58cc02] border-b-[#46a302] text-white shadow-2xs"
              : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 group-hover:border-[#58cc02] dark:group-hover:border-[#58cc02]"
          }`}
        >
          {topic.done && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="w-4 h-4" strokeWidth={3.5} />
            </motion.div>
          )}
        </button>

        <div
          onClick={() => onToggleTopic(topic.id)}
          className="flex flex-col min-w-0 flex-1 select-none cursor-pointer"
        >
          <span className={`text-sm font-black transition-colors truncate ${
            topic.done ? "text-slate-400 line-through" : "text-slate-800 dark:text-white"
          }`}>
            {topic.title}
          </span>
          {topic.questionCount && !topic.done && (
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
              {topic.questionCount} SORU
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons & Schedule Badges */}
      <div className="flex items-center gap-2 shrink-0">
        {!topic.done && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onScheduleTopic(topic.id); }}
            className="w-8 h-8 rounded-xl bg-[#58cc02] text-white border-2 border-b-4 border-[#58cc02] border-b-[#46a302] shadow-2xs hover:scale-105 active:translate-y-0.5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Bugüne Ekle"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
          </button>
        )}

        {topic.schedules && topic.schedules.length > 0 && (
          <div className="flex gap-1">
            {topic.schedules.slice(0, 1).map((sch, i) => (
              <div
                key={i}
                className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border-2 border-b-2 shadow-2xs"
                style={{ color: color, backgroundColor: `${color}15`, borderColor: `${color}30` }}
              >
                {format(new Date(sch.date), "dd MMM", { locale: tr })}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface TopicListProps {
  subjects: Subject[];
  activeSubjectId: string;
  onSelectSubject: (id: string) => void;
  onToggleTopic: (topicId: string, subjectId: string) => void;
  onScheduleTopic: (topicId: string, subjectId: string) => void;
  onUpdateSubjectName: (subjectId: string, newName: string) => void;
}

export default function TopicList({ 
  subjects, 
  activeSubjectId, 
  onSelectSubject, 
  onToggleTopic, 
  onScheduleTopic, 
  onUpdateSubjectName 
}: TopicListProps) {
  const currentIndex = subjects.findIndex(s => s.id === activeSubjectId);
  const subject = subjects[currentIndex] || subjects[0];

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % subjects.length;
    onSelectSubject(subjects[nextIndex].id);
  }, [currentIndex, subjects, onSelectSubject]);

  const goToPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + subjects.length) % subjects.length;
    onSelectSubject(subjects[prevIndex].id);
  }, [currentIndex, subjects, onSelectSubject]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping = activeEl && (
        activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        activeEl.tagName === "SELECT" ||
        (activeEl as HTMLElement).isContentEditable
      );

      if (isTyping) return;

      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Subject theme color map using dynamic subject.color
  const mainColor = subject.color || "#1cb0f6";
  const subjectTheme = {
    color: mainColor,
    bgStyle: { backgroundColor: mainColor, borderColor: mainColor },
    textStyle: { color: mainColor },
  };
  const progressPercent = Math.round((subject.topics.filter(t => t.done).length / (subject.topics.length || 1)) * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* 3D Header Navigation */}
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrev}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center font-black active:translate-y-0.5 transition-all shadow-2xs cursor-pointer"
            title="Önceki Ders"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center font-black active:translate-y-0.5 transition-all shadow-2xs cursor-pointer"
            title="Sonraki Ders"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-b-2 border-slate-200 dark:border-slate-700 shadow-2xs">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {currentIndex + 1} / {subjects.length} DERS
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subject.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md"
        >
          {/* Header Info Box */}
          <div className="flex flex-col gap-4 mb-6 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                {/* 3D Subject Icon Badge */}
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-b-4 text-white flex items-center justify-center shadow-xs shrink-0"
                  style={{ backgroundColor: subjectTheme.color, borderColor: subjectTheme.color }}
                >
                  <AppleEmoji emoji={subject.icon || "📘"} size={32} className="text-white" />
                </div>
                
                <div className="flex flex-col flex-1 min-w-0">
                  <input
                    type="text"
                    value={subject.title}
                    onChange={(e) => onUpdateSubjectName(subject.id, e.target.value)}
                    className="bg-transparent border-0 outline-none text-2xl font-black text-slate-800 dark:text-white p-0 w-full tracking-tight"
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {subject.category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: subjectTheme.color }}>
                      {subject.subCategory}
                    </span>
                  </div>
                </div>
              </div>

              {/* Success Rate Box */}
              <div className="flex flex-col items-center justify-center shrink-0 bg-slate-50 dark:bg-slate-900/60 px-3.5 py-2 rounded-2xl border-2 border-b-2 border-slate-200 dark:border-slate-700 shadow-2xs text-center min-w-[96px]">
                <span className="text-2xl font-black font-mono tracking-tight leading-none mb-1" style={{ color: subjectTheme.color }}>
                  {progressPercent}%
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  TAMAMLANDI
                </span>
              </div>
            </div>

            {/* 3D Tip Box */}
            {subject.tip && (
              <div className="bg-[#fff8ed] dark:bg-[#ff9500]/10 rounded-2xl p-4 border-2 border-b-2 border-[#ff9500]/30 shadow-2xs flex items-center gap-3">
                <AppleEmoji emoji="💡" size={18} />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 italic leading-relaxed">
                  {subject.tip}
                </span>
              </div>
            )}
          </div>

          {/* Draggable Topic List */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
            {subject.topics.map((topic) => (
              <DraggableTopicItem
                key={topic.id}
                topic={topic}
                onToggleTopic={(id) => onToggleTopic(id, subject.id)}
                onScheduleTopic={(id) => onScheduleTopic(id, subject.id)}
                color={subject.color}
                subjectIcon={subject.icon}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
