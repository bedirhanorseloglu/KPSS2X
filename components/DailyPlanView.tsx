"use client";

import { format, addDays, subDays } from "date-fns";
import { tr } from "date-fns/locale";
import { Topic, Subject } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import { UNIVERSITY_CLASSES } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { getStudyDate } from "@/lib/dateUtils";
import { X, Check } from "lucide-react";
import AppleEmoji from "@/components/AppleEmoji";

interface DailyPlanViewProps {
  date: Date;
  topics: Topic[];
  subjects: Subject[];
  isDragging: boolean;
  onDateChange: (date: Date) => void;
  onRemoveTopic: (topicId: string, dateStr?: string, timeStr?: string) => void;
  slotNotes: Record<string, string>;
  completedNotes: Record<string, boolean>;
  onUpdateNote: (slotId: string, note: string) => void;
  onToggleNote: (slotId: string) => void;
  holidays: string[];
  onToggleHoliday: (dateStr: string) => void;
}

const EXAM_DATE = "2026-09-06";

function TimeSlot({ 
  hour, 
  dateStr, 
  topic, 
  revision, 
  isLocked, 
  lockedTitle, 
  lockedType, 
  color, 
  isDragging, 
  onRemoveTopic, 
  note, 
  isCompleted, 
  onUpdateNote, 
  onToggleNote, 
  subjects 
}: any) {
  const slotId = `${dateStr}_${hour.toString().padStart(2, '0')}:00`;
  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
    data: { acceptsDrop: !isLocked },
    disabled: isLocked
  });

  return (
    <div 
      ref={setNodeRef}
      className={`group relative rounded-[2rem] p-5 transition-all duration-200 border-2 flex flex-col gap-4 ${
        isLocked 
          ? 'bg-slate-100/70 dark:bg-slate-800/40 border-b-4 border-dashed border-slate-300 dark:border-slate-700 opacity-70' 
          : 'bg-white dark:bg-slate-800 border-b-4 border-slate-200 dark:border-slate-700 hover:border-[#1cb0f6] shadow-xs'
      } ${isOver ? 'ring-4 ring-[#1cb0f6]/30 border-[#1cb0f6] scale-[1.02] z-10' : ''} ${
        isDragging && !isLocked && !topic ? 'border-dashed border-[#1cb0f6] bg-[#e8f7ff] dark:bg-[#1cb0f6]/10 animate-pulse' : ''
      }`}
    >
      {/* Time Badge & Remove Button */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-black font-mono text-[#1cb0f6] tracking-tight bg-[#e8f7ff] dark:bg-[#1cb0f6]/10 px-3 py-1 rounded-xl border-2 border-b-2 border-[#1cb0f6]/30 shadow-2xs">
          {hour.toString().padStart(2, '0')}:00
        </span>
        
        {topic && !isLocked && (
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveTopic(topic.id, dateStr, `${hour.toString().padStart(2, '0')}:00`);
            }}
            className="w-7 h-7 rounded-xl bg-red-50 dark:bg-red-500/10 text-[#ff4b4b] border-2 border-b-2 border-[#ff4b4b]/30 hover:bg-[#ff4b4b] hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-95 shadow-2xs cursor-pointer"
            title="Dersi Kaldır"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content Slot Area */}
      <div className="min-h-[52px] flex flex-col justify-center">
        {isLocked && lockedTitle ? (
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 border-2 border-b-2 border-slate-300 dark:border-slate-600">
               <AppleEmoji emoji={lockedType === 'uni' ? '🎓' : lockedType === 'code' ? '💻' : '🏖️'} size={20} />
             </div>
             <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">KAPALI</span>
                <span className="text-sm font-black text-slate-600 dark:text-slate-300 leading-tight truncate">{lockedTitle}</span>
             </div>
          </div>
        ) : topic ? (
          <div className="flex items-center gap-3">
             <div className="w-2 h-10 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: color }} />
             <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest truncate" style={{ color }}>
                  {subjects.find((s: any) => s.topics.some((t: any) => t.id === topic.id))?.title}
                </span>
                <span className="text-sm font-black text-slate-800 dark:text-white leading-tight">{topic.title}</span>
             </div>
          </div>
        ) : revision ? (
          <div className="flex items-center gap-3">
             <div className={`w-2 h-10 rounded-full shrink-0 ${revision.level === 3 ? 'bg-[#ff9500]' : 'bg-[#1cb0f6]'}`} />
             <div className="flex flex-col min-w-0">
                <span className={`text-[10px] font-black uppercase tracking-widest ${revision.level === 3 ? 'text-[#ff9500]' : 'text-[#1cb0f6]'}`}>
                  {revision.level === 3 ? "Kritik Tekrar" : "Rutin Tekrar"}
                </span>
                <span className="text-sm font-black text-slate-800 dark:text-white leading-tight">{revision.title}</span>
             </div>
          </div>
        ) : (
          <div className="flex items-center justify-center border-2 border-b-2 border-dashed border-slate-300 dark:border-slate-700/60 rounded-2xl py-4 bg-slate-50 dark:bg-slate-900/50 group-hover:bg-[#e8f7ff] dark:group-hover:bg-[#1cb0f6]/10 group-hover:border-[#1cb0f6]/40 transition-all">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-[#1cb0f6] transition-colors">
               {isDragging ? "BURAYA BIRAK" : "BOŞ SLOT"}
             </span>
          </div>
        )}
      </div>

      {/* Note Area */}
      {!isLocked && (
        <div className={`p-3.5 rounded-2xl border-2 transition-all relative ${
          note 
            ? isCompleted 
              ? 'bg-slate-50 dark:bg-slate-900/40 border-b-2 border-slate-200 dark:border-slate-700 opacity-60' 
              : 'bg-[#fff8ed] dark:bg-[#ff9500]/10 border-b-4 border-[#ff9500] shadow-2xs' 
            : 'bg-slate-50 dark:bg-slate-900/40 border-b-2 border-slate-200 dark:border-slate-700/60 group-hover:bg-white'
        }`}>
           <div className="flex items-center justify-between mb-1.5">
              <div className={`flex items-center gap-1.5 ${note ? (isCompleted ? 'opacity-40' : 'text-[#ff9500]') : 'text-slate-400'}`}>
                <AppleEmoji emoji="📝" size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Özel Not</span>
              </div>
              
              {note && (
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleNote(slotId);
                  }}
                  className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${
                    isCompleted 
                      ? 'bg-[#58cc02] border-2 border-b-2 border-[#58cc02] text-white shadow-2xs' 
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-[#58cc02]'
                  }`}
                >
                  {isCompleted && <Check className="w-3.5 h-3.5" strokeWidth={3.5} />}
                </button>
              )}
           </div>
           <textarea 
             value={note || ""}
             onChange={(e) => onUpdateNote(slotId, e.target.value)}
             placeholder="Bir not bırakın..."
             rows={2}
             className={`w-full bg-transparent border-0 outline-none text-xs font-bold transition-all placeholder:text-slate-400 resize-none leading-relaxed ${
               isCompleted ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-100'
             }`}
             onClick={(e) => e.stopPropagation()}
           />
        </div>
      )}
    </div>
  );
}

export default function DailyPlanView({ 
  date, 
  topics, 
  subjects, 
  isDragging, 
  onDateChange, 
  onRemoveTopic, 
  slotNotes, 
  completedNotes, 
  onUpdateNote, 
  onToggleNote, 
  holidays, 
  onToggleHoliday 
}: DailyPlanViewProps) {
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [pomodoroFocusMins, setPomodoroFocusMins] = useState(0);

  const dateStr = format(date, "yyyy-MM-dd");
  const isHoliday = holidays.includes(dateStr);
  const isExamDay = dateStr === EXAM_DATE;
  const topicsForDay = topics.filter(t => t.scheduledDate === dateStr);
  const isToday = dateStr === format(getStudyDate(), "yyyy-MM-dd");

  useEffect(() => {
    const getStudyDay = () => {
      const now = new Date();
      if (now.getHours() < 4) {
        now.setDate(now.getDate() - 1);
      }
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    };

    let focusMins = 0;
    try {
      const historyRaw = localStorage.getItem("pomodoro_history");
      if (historyRaw) {
        const history = JSON.parse(historyRaw);
        if (history[dateStr] !== undefined) {
          focusMins = history[dateStr];
        }
      }
      
      if (dateStr === getStudyDay()) {
        const savedTotalFocus = localStorage.getItem("pomodoro_total_focus");
        if (savedTotalFocus) {
          const parsed = parseInt(savedTotalFocus);
          if (parsed > focusMins) {
            focusMins = parsed;
          }
        }
      }
    } catch (e) {}

    setPomodoroFocusMins(focusMins);

    const handlePomodoroUpdate = (e: any) => {
      if (e.detail && e.detail.date === dateStr) {
        setPomodoroFocusMins(e.detail.focus);
      }
    };

    window.addEventListener("pomodoro_update", handlePomodoroUpdate);
    return () => window.removeEventListener("pomodoro_update", handlePomodoroUpdate);
  }, [dateStr]);

  const morningHours = [8, 9, 10, 11, 12];
  const afternoonHours = [13, 14, 15, 16, 17];
  const eveningHours = [18, 19, 20, 21, 22];

  const stats = useMemo(() => {
    const check = (hours: number[]) => {
      let hasSomething = false;
      let hasUncompleted = false;

      hours.forEach(h => {
        const timeStr = `${h.toString().padStart(2, '0')}:00`;
        const slotId = `${dateStr}_${timeStr}`;
        
        const topic = topicsForDay.find(t => t.scheduledTime === timeStr);
        const revisionTopic = topics.find(t => t.revisions?.some(r => r.date === dateStr && r.time === timeStr));
        const hasUni = UNIVERSITY_CLASSES.some(c => {
          if (c.date !== dateStr) return false;
          const startH = parseInt(c.startTime.split(":")[0]);
          const endH = parseInt(c.endTime.split(":")[0]);
          return h >= startH && h < endH;
        });
        const hasNote = slotNotes[slotId] && slotNotes[slotId].trim() !== "";
        const isNoteCompleted = completedNotes[slotId];

        if (topic || revisionTopic || hasUni || hasNote) {
          hasSomething = true;
          if (hasNote && !isNoteCompleted) {
            hasUncompleted = true;
          }
        }
      });

      return { hasSomething, hasUncompleted };
    };
    return {
      morning: check(morningHours),
      afternoon: check(afternoonHours),
      evening: check(eveningHours)
    };
  }, [topics, topicsForDay, dateStr, slotNotes, completedNotes]);

  const tabContent = (hours: number[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {hours.map(hour => {
        let lockedTitle = "";
        let lockedType = "";
        let isLocked = false;

        const universityClass = UNIVERSITY_CLASSES.find(c => {
          if (c.date !== dateStr) return false;
          const startH = parseInt(c.startTime.split(":")[0]);
          const endH = parseInt(c.endTime.split(":")[0]);
          return hour >= startH && hour < endH;
        });

        if (isExamDay) {
          isLocked = true;
          lockedTitle = "KPSS Sınavı";
          lockedType = "holiday";
        } else if (isHoliday) {
          isLocked = true;
          lockedTitle = "Dinlenme Günü";
          lockedType = "holiday";
        } else if (universityClass) {
          isLocked = true;
          lockedTitle = `${universityClass.courseCode}`;
          lockedType = "uni";
        }

        const slotTimeStr = `${hour.toString().padStart(2, '0')}:00`;
        const topic = topicsForDay.find(t => t.scheduledTime === slotTimeStr);
        
        let color = "var(--accent)";
        if (topic) {
          const subject = subjects.find(s => s.topics.some(t => t.id === topic.id));
          if (subject) color = subject.color;
        }

        let revision = null;
        for (const t of topics) {
          const rev = t.revisions?.find(r => r.date === dateStr && r.time === slotTimeStr);
          if (rev) {
            revision = { ...rev, title: t.title };
            break;
          }
        }

        return (
          <TimeSlot 
            key={hour} 
            hour={hour} 
            dateStr={dateStr}
            topic={topic}
            revision={revision}
            isLocked={isLocked}
            lockedTitle={lockedTitle}
            lockedType={lockedType}
            color={color}
            isDragging={isDragging}
            onRemoveTopic={onRemoveTopic}
            note={slotNotes[`${dateStr}_${hour.toString().padStart(2, '0')}:00`]}
            isCompleted={completedNotes[`${dateStr}_${hour.toString().padStart(2, '0')}:00`]}
            onUpdateNote={onUpdateNote}
            onToggleNote={onToggleNote}
            subjects={subjects}
          />
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* 3D Date Header Box */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-5 sm:p-6 flex flex-col lg:flex-row justify-between items-center gap-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
           {/* 3D Date Badge */}
           <div className="bg-[#e8f7ff] dark:bg-[#1cb0f6]/10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xs shrink-0">
              <span className="text-[10px] font-black uppercase text-[#1cb0f6] tracking-widest">{format(date, "MMM", { locale: tr })}</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{format(date, "dd")}</span>
           </div>
           
           <div className="flex flex-col text-center lg:text-left">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                {format(date, "EEEE", { locale: tr })}
              </h2>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-2">
                {/* 3D Holiday Toggle Button */}
                <button 
                  type="button"
                  onClick={() => onToggleHoliday(dateStr)}
                  className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-2xl border-2 border-b-4 transition-all cursor-pointer shadow-2xs active:translate-y-0.5 ${
                    isHoliday 
                      ? "bg-red-50 text-[#ff4b4b] border-[#ff4b4b] border-b-[#e03030]" 
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-slate-200 border-b-slate-300 dark:border-slate-600 hover:border-[#1cb0f6]"
                  }`}
                >
                  {isHoliday ? "🏖️ Tatili İptal Et" : "🏖️ Tatil Modu"}
                </button>

                {pomodoroFocusMins > 0 && (
                  <div className="flex items-center gap-2 bg-[#e8f7ff] dark:bg-[#1cb0f6]/10 text-[#1cb0f6] px-4 py-2 rounded-2xl border-2 border-b-2 border-[#1cb0f6]/30 shadow-2xs font-black text-xs">
                    <AppleEmoji emoji="⏱️" size={16} />
                    <span>
                      {Math.floor(pomodoroFocusMins / 60) > 0 && `${Math.floor(pomodoroFocusMins / 60)}s `}
                      {pomodoroFocusMins % 60}dk Çalışıldı
                    </span>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* 3D Date Navigation Controls */}
        <div className="flex items-center justify-between sm:justify-center gap-2 bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 w-full sm:w-auto shadow-2xs">
          <button 
            type="button"
            onClick={() => onDateChange(subDays(new Date(date), 1))} 
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 font-black text-slate-600 dark:text-slate-300 hover:text-slate-900 active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
          >
            &lt;
          </button>
          
          <button 
            type="button"
            onClick={() => {
              if (!isToday) onDateChange(getStudyDate());
            }} 
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${
              isToday 
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 border-2 border-slate-300 dark:border-slate-700 cursor-default" 
                : "bg-[#1cb0f6] text-white border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xs active:translate-y-0.5"
            }`}
          >
            {isToday ? "Bugün" : "Bugüne Dön"}
          </button>
          
          <button 
            type="button"
            onClick={() => onDateChange(addDays(new Date(date), 1))} 
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 font-black text-slate-600 dark:text-slate-300 hover:text-slate-900 active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* 3D Timeline Section */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md">
        {/* 3D Sub-Tabs Header */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-2 m-5 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 gap-2 shadow-xs">
           {(['morning', 'afternoon', 'evening'] as const).map((tab) => {
             const { hasSomething, hasUncompleted } = stats[tab];
             const isActive = activeTab === tab;

             return (
               <button
                 key={tab}
                 type="button"
                 onClick={() => setActiveTab(tab)}
                 className={`flex-1 py-3 px-6 text-xs font-black uppercase tracking-widest transition-all cursor-pointer relative flex items-center justify-center gap-3 rounded-xl ${
                   isActive 
                    ? 'bg-white dark:bg-slate-800 text-[#1cb0f6] border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white border-2 border-transparent'
                 }`}
               >
                 <span>{tab === 'morning' ? 'Sabah' : tab === 'afternoon' ? 'Öğle' : 'Akşam'}</span>
                 {hasSomething && (
                   <div className={`w-2.5 h-2.5 rounded-full ${
                     hasUncompleted 
                       ? 'bg-[#ff4b4b] shadow-[0_0_8px_rgba(255,75,75,0.5)] animate-pulse' 
                       : 'bg-[#58cc02] shadow-[0_0_8px_rgba(88,204,2,0.5)]'
                   }`} />
                 )}
               </button>
             );
           })}
        </div>

        {/* Tab Slot Contents */}
        <div className="p-6 pt-2">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
             >
               {tabContent(activeTab === 'morning' ? morningHours : activeTab === 'afternoon' ? afternoonHours : eveningHours)}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
