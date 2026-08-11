"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, getDay } from "date-fns";
import { tr } from "date-fns/locale";
import { Topic, Subject } from "@/types";
import { UNIVERSITY_CLASSES } from "@/lib/data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AppleEmoji from "@/components/AppleEmoji";

interface MonthlyCalendarProps {
  topics: Topic[];
  subjects: Subject[];
  slotNotes: Record<string, string>;
  completedNotes: Record<string, boolean>;
  isDragging: boolean;
  onDayClick: (date: Date) => void;
}

const HOLIDAYS = [
  "2026-05-01", "2026-05-19", "2026-07-15", "2026-08-30", "2026-09-05"
];
const EXAM_DATE = "2026-09-06";

function DroppableDayCell({ 
  date, 
  isCurrentMonth, 
  topicsForDay, 
  allTopics, 
  subjects, 
  slotNotes,
  completedNotes,
  isDragging, 
  onClick 
}: { 
  date: Date; 
  isCurrentMonth: boolean; 
  topicsForDay: Topic[]; 
  allTopics: Topic[]; 
  subjects: Subject[]; 
  slotNotes: Record<string, string>;
  completedNotes: Record<string, boolean>;
  isDragging: boolean; 
  onClick: () => void; 
}) {
  const dateStr = format(date, "yyyy-MM-dd");
  const dayOfWeek = getDay(date);
  const isHoliday = HOLIDAYS.includes(dateStr) || dayOfWeek === 0;
  const isExamDay = dateStr === EXAM_DATE;
  const classesForDay = UNIVERSITY_CLASSES.filter(c => c.date === dateStr);
  const notesForDay = Object.entries(slotNotes)
    .filter(([key, val]) => key.startsWith(dateStr) && val.trim() !== "")
    .map(([key, val]) => ({ 
      time: key.split("_")[1], 
      text: val,
      isCompleted: completedNotes[key] || false 
    }));

  const { isOver, setNodeRef } = useDroppable({
    id: dateStr,
    data: { acceptsDrop: !isHoliday && !isExamDay },
    disabled: isHoliday || isExamDay
  });

  const isToday = isSameDay(date, new Date());

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`min-h-[90px] sm:min-h-[125px] p-1.5 sm:p-3 border-2 border-b-4 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col gap-1 sm:gap-1.5 relative group overflow-hidden ${
        !isCurrentMonth 
          ? 'opacity-30 pointer-events-none border-slate-100 dark:border-slate-800' 
          : 'hover:-translate-y-0.5 shadow-2xs'
      } ${
        isToday 
          ? 'bg-[#e8f7ff] dark:bg-[#1cb0f6]/10 border-[#1cb0f6] border-b-[#1899d6] shadow-xs' 
          : 'border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 bg-white dark:bg-slate-800 hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6]'
      } ${
        isOver ? 'scale-105 z-20 ring-4 ring-[#1cb0f6]/30 bg-[#e8f7ff] border-[#1cb0f6] shadow-xl' : ''
      }`}
    >
      {/* Top Header Row of Cell */}
      <div className="flex justify-between items-center mb-1">
        <span className={`text-xs font-black font-mono px-2.5 py-0.5 rounded-xl border-2 border-b-2 transition-all ${
          isToday 
            ? 'bg-[#1cb0f6] text-white border-[#1cb0f6] border-b-[#1899d6] shadow-2xs' 
            : isExamDay 
              ? 'bg-[#ff4b4b] text-white border-[#ff4b4b] border-b-[#e03030]' 
              : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
        }`}>
          {format(date, "d")}
        </span>
        {isExamDay && <span className="text-[9px] font-black uppercase text-[#ff4b4b] tracking-widest">KPSS</span>}
        {isHoliday && !isExamDay && isCurrentMonth && <AppleEmoji emoji="🏖️" size={14} />}
      </div>

      {/* Topics & Badges inside cell */}
      <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
        {classesForDay.map(cls => (
          <div key={cls.id} className="w-full h-2 bg-[#5856d6] rounded-full shadow-2xs" title={cls.courseName} />
        ))}
        
        {topicsForDay.slice(0, 3).map((topic, idx) => {
          const subject = subjects.find(s => s.topics.some(t => t.id === topic.id));
          return (
            <div 
              key={`${topic.id}-${topic.scheduledTime || idx}`} 
              className="text-[9px] font-black px-2 py-1 rounded-lg truncate border-2 border-b-2 shadow-2xs transition-transform hover:scale-105"
              style={{ backgroundColor: `${subject?.color || '#1cb0f6'}15`, borderColor: `${subject?.color || '#1cb0f6'}40`, color: subject?.color || '#1cb0f6' }}
            >
              {topic.title}
            </div>
          );
        })}

        <div className="mt-auto flex flex-wrap gap-1.5 items-center">
           {notesForDay.length > 0 && (
             <div className={`flex items-center gap-1 p-1 rounded-lg border-2 border-b-2 shadow-2xs ${
               notesForDay.every(n => n.isCompleted) 
                 ? 'bg-[#e5f9e7] border-[#58cc02]' 
                 : 'bg-red-50 border-[#ff4b4b]'
             }`}>
                <AppleEmoji emoji="📝" size={12} />
             </div>
           )}
           {allTopics.some(t => t.revisions?.some(r => r.date === dateStr)) && (
             <div className="w-2 h-2 rounded-full bg-[#1cb0f6] border border-[#1899d6] shadow-2xs" />
           )}
        </div>
      </div>
      
      {isDragging && !isHoliday && !isExamDay && isCurrentMonth && (
        <div className="absolute inset-0 bg-[#e8f7ff] border-2 border-dashed border-[#1cb0f6] rounded-2xl animate-pulse" />
      )}
    </div>
  );
}

export default function MonthlyCalendar({ topics, subjects, slotNotes, completedNotes, isDragging, onDayClick }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md">
      {/* 3D Month Title & Controls */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black capitalize text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
          <AppleEmoji emoji="📅" size={32} />
          <span>{format(currentDate, "MMMM yyyy", { locale: tr })}</span>
        </h2>
        
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs">
          <button 
            type="button"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))} 
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 font-black text-slate-600 dark:text-slate-300 hover:text-slate-900 active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
            title="Önceki Ay"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            type="button"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))} 
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 font-black text-slate-600 dark:text-slate-300 hover:text-slate-900 active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
            title="Sonraki Ay"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-3 mb-4">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
          <div key={day} className="text-center text-xs font-black text-slate-400 uppercase tracking-widest py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-3">
        {days.map(day => {
          const dayStr = format(day, "yyyy-MM-dd");
          const topicsForDay = topics.filter(t => t.scheduledDate === dayStr);
          return (
            <DroppableDayCell 
              key={day.toString()}
              date={day}
              isCurrentMonth={isSameMonth(day, monthStart)}
              topicsForDay={topicsForDay}
              allTopics={topics}
              subjects={subjects}
              slotNotes={slotNotes}
              completedNotes={completedNotes}
              isDragging={isDragging}
              onClick={() => onDayClick(day)}
            />
          );
        })}
      </div>
      
      {/* 3D Legend Section */}
      <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/60 px-4 py-2 rounded-2xl border-2 border-b-2 border-slate-200 dark:border-slate-700 shadow-2xs">
             <AppleEmoji emoji="📝" size={16} />
             <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Özel Notlar</span>
          </div>
         <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/60 px-4 py-2 rounded-2xl border-2 border-b-2 border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="w-4 h-4 rounded-full bg-[#1cb0f6] border-2 border-[#1899d6] shadow-2xs" />
            <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Tekrarlar</span>
         </div>
         <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/60 px-4 py-2 rounded-2xl border-2 border-b-2 border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="w-4 h-4 rounded-full bg-[#af52de] border-2 border-[#963ec7] shadow-2xs" />
            <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Ders Konuları</span>
         </div>
      </div>
    </div>
  );
}
