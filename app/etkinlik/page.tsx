"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, Sparkles, Trophy, Zap, Compass, BookOpen, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AppleEmoji from "@/components/AppleEmoji";

type SubjectTab = "all" | "vatandaslik" | "cografya" | "tarih";

interface ActivityItem {
  id: string;
  subject: SubjectTab;
  subjectName: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeTextColor: string;
  iconBg: string;
  iconBorder: string;
  buttonBg: string;
  buttonBorder: string;
  emoji: string;
  tag: string;
  title: string;
  description: string;
  href: string;
  isLocked?: boolean;
  kavramCount?: string;
  duration?: string;
  xp?: string;
  typeLabel?: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: "yuksek-yargi-secim",
    subject: "vatandaslik",
    subjectName: "Vatandaşlık",
    color: "#5856d6",
    badgeBg: "bg-[#5856d6]/10 dark:bg-[#5856d6]/20",
    badgeBorder: "border-[#5856d6]/30",
    badgeTextColor: "text-[#5856d6]",
    iconBg: "bg-[#5856d6]/10 dark:bg-[#5856d6]/20",
    iconBorder: "border-2 border-b-4 border-[#5856d6]/30",
    buttonBg: "bg-[#5856d6]",
    buttonBorder: "border-[#5856d6] border-b-[#4744b8]",
    emoji: "⚖️",
    tag: "ÖSYM Tuzağı",
    kavramCount: "10",
    duration: "~4 Dk",
    xp: "+50 XP",
    typeLabel: "SİMÜLATÖR",
    title: "Yüksek Mahkeme Üyeleri Seçimi",
    description: "AYM, Yargıtay, Danıştay, Uyuşmazlık Mahkemesi ve HSK üye seçim kaynaklarını interaktif simülatörle öğren.",
    href: "/etkinlik/yuksek-yargi-secim"
  },
  {
    id: "tbmm-yeter-sayilari",
    subject: "vatandaslik",
    subjectName: "Vatandaşlık",
    color: "#5856d6",
    badgeBg: "bg-[#5856d6]/10 dark:bg-[#5856d6]/20",
    badgeBorder: "border-[#5856d6]/30",
    badgeTextColor: "text-[#5856d6]",
    iconBg: "bg-[#5856d6]/10 dark:bg-[#5856d6]/20",
    iconBorder: "border-2 border-b-4 border-[#5856d6]/30",
    buttonBg: "bg-[#5856d6]",
    buttonBorder: "border-[#5856d6] border-b-[#4744b8]",
    emoji: "🗳️",
    tag: "Görsel Hafıza",
    kavramCount: "5",
    duration: "~3 Dk",
    xp: "+60 XP",
    typeLabel: "ARENA",
    title: "TBMM Yeter Sayıları Arenası",
    description: "Toplantı (200), Karar (151), Salt Çoğunluk (301), 3/5 (360) ve 2/3 (400) karar sayılarını 4 köşeli arenayla zihnine kazı.",
    href: "/etkinlik/tbmm-yeter-sayilari"
  },
  {
    id: "guncel-bilgiler",
    subject: "vatandaslik",
    subjectName: "Vatandaşlık",
    color: "#5856d6",
    badgeBg: "bg-[#5856d6]/10 dark:bg-[#5856d6]/20",
    badgeBorder: "border-[#5856d6]/30",
    badgeTextColor: "text-[#5856d6]",
    iconBg: "bg-[#5856d6]/10 dark:bg-[#5856d6]/20",
    iconBorder: "border-2 border-b-4 border-[#5856d6]/30",
    buttonBg: "bg-[#5856d6]",
    buttonBorder: "border-[#5856d6] border-b-[#4744b8]",
    emoji: "🌍",
    tag: "Genel Kültür",
    kavramCount: "50+",
    duration: "~5 Dk",
    xp: "+75 XP",
    typeLabel: "GÜNCEL",
    title: "Güncel Bilgiler & Genel Kültür",
    description: "Edebiyat, tarih, uluslararası kuruluşlar ve genel kültür hakkındaki pratik KPSS güncel sorularını çöz.",
    href: "/etkinlik/guncel"
  },
  {
    id: "vatandaslik-80",
    subject: "vatandaslik",
    subjectName: "Vatandaşlık",
    color: "#5856d6",
    badgeBg: "bg-[#5856d6]/10 dark:bg-[#5856d6]/20",
    badgeBorder: "border-[#5856d6]/30",
    badgeTextColor: "text-[#5856d6]",
    iconBg: "bg-[#5856d6]/10 dark:bg-[#5856d6]/20",
    iconBorder: "border-2 border-b-4 border-[#5856d6]/30",
    buttonBg: "bg-[#5856d6]",
    buttonBorder: "border-[#5856d6] border-b-[#4744b8]",
    emoji: "📘",
    tag: "Karma Test",
    kavramCount: "80 Soru",
    duration: "~15 Dk",
    xp: "+120 XP",
    typeLabel: "TEST",
    title: "Vatandaşlık & Anayasa Hukuku",
    description: "Temel Hukuk, Anayasa Tarihi, Haklar, Yasama, Yürütme, Yargı, İdare ve İnsan Hakları Hukuku pratik testleri.",
    href: "/etkinlik/vatandaslik"
  },
  {
    id: "daglar",
    subject: "cografya",
    subjectName: "Coğrafya",
    color: "#10B981",
    badgeBg: "bg-[#10B981]/10 dark:bg-[#10B981]/20",
    badgeBorder: "border-[#10B981]/30",
    badgeTextColor: "text-[#10B981]",
    iconBg: "bg-[#10B981]/10 dark:bg-[#10B981]/20",
    iconBorder: "border-2 border-b-4 border-[#10B981]/30",
    buttonBg: "bg-[#10B981]",
    buttonBorder: "border-[#10B981] border-b-[#059669]",
    emoji: "🏔️",
    tag: "Sürükle-Bırak",
    kavramCount: "49 Dağ",
    duration: "~6 Dk",
    xp: "+90 XP",
    typeLabel: "HARİTA",
    title: "Türkiye'nin Dağları",
    description: "Kıvrım, Kırık ve Volkanik dağlarımızı harita üzerinde doğru yerlerine sürükleyin.",
    href: "/etkinlik/harita?topic=daglar"
  },
  {
    id: "platolar",
    subject: "cografya",
    subjectName: "Coğrafya",
    color: "#10B981",
    badgeBg: "bg-[#10B981]/10 dark:bg-[#10B981]/20",
    badgeBorder: "border-[#10B981]/30",
    badgeTextColor: "text-[#10B981]",
    iconBg: "bg-[#10B981]/10 dark:bg-[#10B981]/20",
    iconBorder: "border-2 border-b-4 border-[#10B981]/30",
    buttonBg: "bg-[#10B981]",
    buttonBorder: "border-[#10B981] border-b-[#059669]",
    emoji: "🗺️",
    tag: "Eşleştirme",
    kavramCount: "18 Plato",
    duration: "~4 Dk",
    xp: "+70 XP",
    typeLabel: "EŞLEŞTİRME",
    title: "Türkiye'nin Platoları",
    description: "Tabaka düzü, lav, karstik ve aşınım platolarımızı harita üzerinde bulun.",
    href: "/etkinlik/platolar"
  },
  {
    id: "ovalar",
    subject: "cografya",
    subjectName: "Coğrafya",
    color: "#10B981",
    badgeBg: "bg-[#10B981]/10 dark:bg-[#10B981]/20",
    badgeBorder: "border-[#10B981]/30",
    badgeTextColor: "text-[#10B981]",
    iconBg: "bg-[#10B981]/10 dark:bg-[#10B981]/20",
    iconBorder: "border-2 border-b-4 border-[#10B981]/30",
    buttonBg: "bg-[#10B981]",
    buttonBorder: "border-[#10B981] border-b-[#059669]",
    emoji: "🏞️",
    tag: "Delta & Tektonik",
    kavramCount: "29 Ova",
    duration: "~5 Dk",
    xp: "+80 XP",
    typeLabel: "HARİTA",
    title: "Türkiye'nin Ovaları",
    description: "Kıyı, tektonik, karstik ve volkanik ovalarımızı harita üzerinde bulun.",
    href: "/etkinlik/ovalar"
  },
  {
    id: "goller",
    subject: "cografya",
    subjectName: "Coğrafya",
    color: "#10B981",
    badgeBg: "bg-[#10B981]/10 dark:bg-[#10B981]/20",
    badgeBorder: "border-[#10B981]/30",
    badgeTextColor: "text-[#10B981]",
    iconBg: "bg-[#10B981]/10 dark:bg-[#10B981]/20",
    iconBorder: "border-2 border-b-4 border-[#10B981]/30",
    buttonBg: "bg-[#10B981]",
    buttonBorder: "border-[#10B981] border-b-[#059669]",
    emoji: "💧",
    tag: "Göller",
    kavramCount: "53 Göl",
    duration: "~7 Dk",
    xp: "+95 XP",
    typeLabel: "HARİTA",
    title: "Türkiye'nin Gölleri",
    description: "Tektonik, karstik, volkanik ve set göllerini harita üzerinde bulun.",
    href: "/etkinlik/harita?topic=goller"
  },
  {
    id: "akarsular",
    subject: "cografya",
    subjectName: "Coğrafya",
    color: "#10B981",
    badgeBg: "bg-[#10B981]/10 dark:bg-[#10B981]/20",
    badgeBorder: "border-[#10B981]/30",
    badgeTextColor: "text-[#10B981]",
    iconBg: "bg-[#10B981]/10 dark:bg-[#10B981]/20",
    iconBorder: "border-2 border-b-4 border-[#10B981]/30",
    buttonBg: "bg-[#10B981]",
    buttonBorder: "border-[#10B981] border-b-[#059669]",
    emoji: "🌊",
    tag: "Barajlar",
    kavramCount: "42 Akarsu",
    duration: "~6 Dk",
    xp: "+85 XP",
    typeLabel: "İNTERAKTİF",
    title: "Türkiye'nin Akarsuları",
    description: "Akarsuların döküldüğü denizleri ve üzerindeki barajları interaktif kartlarla çalış.",
    href: "/etkinlik/akarsular"
  },
  {
    id: "tarih-kronoloji",
    subject: "tarih",
    subjectName: "Tarih",
    color: "#ff9500",
    badgeBg: "bg-[#ff9500]/10 dark:bg-[#ff9500]/20",
    badgeBorder: "border-[#ff9500]/30",
    badgeTextColor: "text-[#ff9500]",
    iconBg: "bg-[#ff9500]/10 dark:bg-[#ff9500]/20",
    iconBorder: "border-2 border-b-4 border-[#ff9500]/30",
    buttonBg: "bg-[#ff9500]",
    buttonBorder: "border-[#ff9500] border-b-[#e08400]",
    emoji: "🏛️",
    tag: "Çok Yakında",
    kavramCount: "25 Olay",
    duration: "~5 Dk",
    xp: "+80 XP",
    typeLabel: "KRONOLOJİ",
    title: "Tarih Kronoloji & Antlaşmalar",
    description: "Osmanlı ve İnkılap Tarihi antlaşmalarını sıraya dizerek zihnine kazı.",
    href: "#",
    isLocked: true
  }
];

interface ActivityScore {
  accuracy: number; // e.g. 90 -> 90%
  completedCount: number;
  lastDate?: string;
}

const DEFAULT_ACTIVITY_SCORES: Record<string, ActivityScore> = {
  "yuksek-yargi-secim": { accuracy: 90, completedCount: 3, lastDate: "Bugün" },
  "tbmm-yeter-sayilari": { accuracy: 80, completedCount: 2, lastDate: "Dün" },
  "guncel-bilgiler": { accuracy: 65, completedCount: 1, lastDate: "1 gün önce" },
  "vatandaslik-80": { accuracy: 88, completedCount: 2, lastDate: "Bugün" },
  "daglar": { accuracy: 95, completedCount: 4, lastDate: "Bugün" },
  "platolar": { accuracy: 85, completedCount: 1, lastDate: "2 gün önce" },
  "ovalar": { accuracy: 70, completedCount: 1, lastDate: "3 gün önce" },
  "goller": { accuracy: 100, completedCount: 5, lastDate: "Bugün" },
  "akarsular": { accuracy: 75, completedCount: 2, lastDate: "Dün" },
};

export default function EtkinlikIndexPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<SubjectTab>("all");
  const [launchingActivity, setLaunchingActivity] = useState<ActivityItem | null>(null);
  const [activityScores, setActivityScores] = useState<Record<string, ActivityScore>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kpss_activity_scores");
      if (saved) {
        setActivityScores(JSON.parse(saved));
      } else {
        setActivityScores(DEFAULT_ACTIVITY_SCORES);
        localStorage.setItem("kpss_activity_scores", JSON.stringify(DEFAULT_ACTIVITY_SCORES));
      }
    } catch (e) {
      setActivityScores(DEFAULT_ACTIVITY_SCORES);
    }
  }, []);

  const handleLaunch = (act: ActivityItem) => {
    setLaunchingActivity(act);
    setTimeout(() => {
      router.push(act.href);
    }, 450);
  };

  const filteredActivities = selectedSubject === "all"
    ? ACTIVITIES
    : ACTIVITIES.filter(a => a.subject === selectedSubject);

  const completedActivitiesList = Object.values(activityScores);
  const avgAccuracy = completedActivitiesList.length > 0
    ? Math.round(completedActivitiesList.reduce((acc, s) => acc + s.accuracy, 0) / completedActivitiesList.length)
    : 0;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* ━━━ ASYMMETRICAL 2-COLUMN APP DASHBOARD LAYOUT ━━━ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ━━━ LEFT STICKY CONTROL & NAVIGATION PANEL (col-span-3) ━━━ */}
          <aside className="lg:col-span-3 space-y-5 lg:sticky lg:top-20">

            {/* 1 · 3D User Gamification & Progress Pedestal */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 p-5 shadow-sm relative overflow-hidden group">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-13 h-13 rounded-2xl bg-[#58cc02]/15 border-2 border-b-4 border-[#58cc02] border-b-[#46a302] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden relative">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "Profil"}
                      className="w-full h-full object-cover"
                    />
                  ) : user?.displayName ? (
                    <span className="text-xl font-black text-[#58cc02]">
                      {user.displayName.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <AppleEmoji emoji="👤" size={24} color="#58cc02" />
                  )}
                  {/* Floating Mini Trophy Badge */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                    <AppleEmoji emoji="🏆" size={10} />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-black text-slate-800 dark:text-white truncate">
                    {user?.displayName || "KPSS Adayı"}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    Öğrenci Profili
                  </p>
                </div>
              </div>

              {/* Progress & Quest Stats */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-slate-400 dark:text-slate-500">Modül Başarısı</span>
                  <span className="text-[#58cc02] font-black">%{avgAccuracy} İsabet</span>
                </div>
                {/* 3D Segmented Bar */}
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 p-0.5 shadow-inner overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#58cc02] shadow-xs transition-all duration-700"
                    style={{ width: `${avgAccuracy}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 dark:text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#58cc02]" />
                    <span>{Object.keys(activityScores).length}/{ACTIVITIES.filter(a => !a.isLocked).length} modül çözüldü</span>
                  </span>
                  <span className="text-[#58cc02] font-black">
                    Aktif
                  </span>
                </div>
              </div>
            </div>

            {/* 2 · 3D Subject Filter Navigation */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 p-3.5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between px-3 pt-1.5 pb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Ders Filtresi
                </span>
                <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2.5 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-600/60">
                  {ACTIVITIES.length} Toplam
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  { id: "all", label: "Tüm Modüller", emoji: "⚡", color: "#1cb0f6", darkBorder: "#1899d6", count: ACTIVITIES.length },
                  { id: "vatandaslik", label: "Vatandaşlık", emoji: "⚖️", color: "#5856d6", darkBorder: "#4744b8", count: ACTIVITIES.filter(a => a.subject === "vatandaslik").length },
                  { id: "cografya", label: "Coğrafya", emoji: "🗺️", color: "#10B981", darkBorder: "#059669", count: ACTIVITIES.filter(a => a.subject === "cografya").length },
                  { id: "tarih", label: "Tarih", emoji: "🏛️", color: "#ff9500", darkBorder: "#e08400", count: ACTIVITIES.filter(a => a.subject === "tarih").length },
                ].map(cat => {
                  const isActive = selectedSubject === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedSubject(cat.id as SubjectTab)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer border-2 border-b-4 active:translate-y-0.5 relative select-none ${isActive
                          ? "text-white shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                        }`}
                      style={isActive ? {
                        backgroundColor: cat.color,
                        borderColor: cat.color,
                        borderBottomColor: "rgba(0, 0, 0, 0.35)"
                      } : {}}
                    >
                      <div className="flex items-center gap-2.5">
                        <AppleEmoji emoji={cat.emoji} size={18} color={isActive ? "#ffffff" : cat.color} />
                        <span>{cat.label}</span>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-lg font-black transition-colors ${isActive
                            ? "bg-black/25 text-white"
                            : "bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400"
                          }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ━━━ RIGHT MAIN CANVAS & ACTIVITIES STREAM (col-span-9) ━━━ */}
          <main className="lg:col-span-9 space-y-6">

            <div className="space-y-5">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                  Pratik Aktivite Modülleri
                </h3>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSubject}
                  initial={{ opacity: 0, y: 12, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.99 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {filteredActivities.map((act) => {
                    const actScore = activityScores[act.id];

                    if (act.isLocked) {
                      return (
                        <div
                          key={act.id}
                          className="bg-white/40 dark:bg-slate-800/40 rounded-[2.25rem] p-6 sm:p-7 border-2 border-dashed border-slate-300 dark:border-slate-700 opacity-60 flex flex-col justify-between cursor-not-allowed"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 border-2 border-b-4 border-slate-300 dark:border-slate-600">
                              <Lock className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                            </div>
                          </div>
                          <h3 className="text-xl font-black text-slate-400 dark:text-slate-500 mb-2">{act.title}</h3>
                          <p className="text-[13px] font-bold text-slate-400 dark:text-slate-500 mb-6">{act.description}</p>
                          <div className="w-full py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-400 font-black text-sm text-center">YAKINDA</div>
                        </div>
                      );
                    }

                    return (
                      <motion.div
                        key={act.id}
                        whileHover={{ y: -5, scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        onClick={() => handleLaunch(act)}
                        style={{
                          ["--act-color" as any]: act.color,
                        }}
                        className="group relative bg-white dark:bg-slate-800 rounded-[2.25rem] p-6 sm:p-7 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-2xl hover:border-[var(--act-color)]/60 dark:hover:border-[var(--act-color)]/70 hover:bg-slate-50/40 dark:hover:bg-slate-800/90 transition-all flex flex-col justify-between cursor-pointer select-none h-full overflow-hidden"
                      >
                        <div>
                          <div className="flex items-start gap-4 mb-4">
                            <div
                              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 border-b-4 shadow-sm group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-300 relative"
                              style={{
                                backgroundColor: `${act.color}15`,
                                borderColor: `${act.color}40`,
                                borderBottomColor: act.color
                              }}
                            >
                              <AppleEmoji emoji={act.emoji} size={30} color={act.color} />
                              <span
                                className="absolute -bottom-2 -right-1 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md text-white border border-white/20 shadow-2xs leading-none"
                                style={{ backgroundColor: act.color }}
                              >
                                {act.typeLabel || "QUEST"}
                              </span>
                            </div>

                            <div className="flex flex-col pt-0.5 min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                                {/* 3D High-Contrast Accuracy Percentage Chip */}
                                {actScore ? (
                                  <span
                                    className={`text-xs font-black tracking-tight px-3 py-1 rounded-xl border-2 border-b-4 shadow-2xs inline-block ${
                                      actScore.accuracy >= 85
                                        ? "bg-[#58cc02]/15 text-[#2d7d00] dark:text-[#58cc02] border-[#58cc02]/40 border-b-[#58cc02] dark:bg-[#58cc02]/25"
                                        : actScore.accuracy >= 70
                                          ? "bg-[#ff9500]/15 text-[#c76300] dark:text-[#ff9500] border-[#ff9500]/40 border-b-[#ff9500] dark:bg-[#ff9500]/25"
                                          : "bg-[#ff4b4b]/15 text-[#c72626] dark:text-[#ff4b4b] border-[#ff4b4b]/40 border-b-[#ff4b4b] dark:bg-[#ff4b4b]/25"
                                    }`}
                                  >
                                    %{actScore.accuracy} Doğru
                                  </span>
                                ) : (
                                  <span className="text-xs font-black tracking-tight px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs inline-block">
                                    Yeni Modül
                                  </span>
                                )}
                              </div>

                              <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-tight group-hover:text-[var(--act-color)] transition-colors">
                                {act.title}
                              </h3>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                              {act.description}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3.5 pt-2">
                          {/* Micro Stats: Duration, Accuracy Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between px-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1.5 font-semibold">
                                <AppleEmoji emoji="⏱️" size={13} />
                                <span>{act.duration || "~3 Dk"}</span>
                              </span>

                              {actScore ? (
                                <span className="font-semibold text-slate-500 dark:text-slate-400">
                                  {actScore.completedCount} kez çözüldü
                                </span>
                              ) : (
                                <span className="font-medium text-slate-400 dark:text-slate-500">
                                  Henüz çözülmedi
                                </span>
                              )}
                            </div>

                            {/* Mini accuracy progress bar on card */}
                            {actScore && (
                              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${actScore.accuracy}%`,
                                    backgroundColor: actScore.accuracy >= 85 ? "#58cc02" : actScore.accuracy >= 70 ? "#ff9500" : "#ff4b4b"
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            className="w-full py-3.5 rounded-2xl text-white font-black text-xs uppercase tracking-widest text-center border-2 border-b-4 active:translate-y-0.5 transition-all shadow-sm flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                            style={{
                              backgroundColor: act.color,
                              borderColor: act.color,
                              borderBottomColor: "rgba(0, 0, 0, 0.35)",
                            }}
                          >
                            <span>BAŞLA</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

          </main>

        </div>
      </div>

      {/* ━━━ CLEAN SOLID 3D DUOLINGO LAUNCH MODAL OVERLAY ━━━ */}
      <AnimatePresence>
        {launchingActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.88, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 25 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              className="bg-white dark:bg-slate-900 rounded-[2.75rem] p-8 sm:p-9 max-w-md w-full border-2 border-b-[8px] border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden"
            >
              {/* 3D Hero Vault */}
              <div className="relative pt-2">
                <motion.div
                  initial={{ scale: 0.7, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 18 }}
                  className="w-24 h-24 rounded-3xl flex items-center justify-center border-2 border-b-[6px] shadow-sm relative"
                  style={{
                    backgroundColor: `${launchingActivity.color}15`,
                    borderColor: `${launchingActivity.color}40`,
                    borderBottomColor: launchingActivity.color,
                  }}
                >
                  <AppleEmoji emoji={launchingActivity.emoji} size={44} color={launchingActivity.color} />
                  
                  {/* Micro Type Corner Badge */}
                  <span 
                    className="absolute -top-2 -right-2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg text-white border border-white/20 shadow-xs"
                    style={{ backgroundColor: launchingActivity.color }}
                  >
                    {launchingActivity.typeLabel || "QUEST"}
                  </span>
                </motion.div>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-center">
                  <span 
                    className="text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl border-2 border-b-4 shadow-2xs inline-block"
                    style={{
                      backgroundColor: `${launchingActivity.color}15`,
                      borderColor: `${launchingActivity.color}35`,
                      borderBottomColor: launchingActivity.color,
                      color: launchingActivity.color,
                    }}
                  >
                    {launchingActivity.subjectName}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-snug pt-1">
                  {launchingActivity.title}
                </h3>

                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 pt-1">
                  Aktivite Hazırlanıyor...
                </p>
              </div>

              {/* 3D Duolingo Progress Bar */}
              <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full border-2 border-slate-200 dark:border-slate-700 overflow-hidden relative p-0.5">
                <motion.div
                  initial={{ width: "8%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ backgroundColor: launchingActivity.color }}
                  className="h-full rounded-full relative"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
