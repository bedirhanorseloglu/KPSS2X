"use client";

import React, { useState } from "react";
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
    tag: "ÖSYM Tuzakları • Yüksek Yargı",
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
    tag: "Mekânsal Görsel Hafıza",
    title: "TBMM Yeter Sayıları Arenası",
    description: "Toplantı (200), Karar (151), Salt Çoğunluk (301), 3/5 (360) ve 2/3 (400) karar sayılarını 4 köşeli arenayla zihnine kazı.",
    href: "/etkinlik/tbmm-yeter-sayilari"
  },
  {
    id: "guncel-bilgiler",
    subject: "vatandaslik",
    subjectName: "Güncel & GK",
    color: "#1cb0f6",
    badgeBg: "bg-[#1cb0f6]/10 dark:bg-[#1cb0f6]/20",
    badgeBorder: "border-[#1cb0f6]/30",
    badgeTextColor: "text-[#1cb0f6]",
    iconBg: "bg-[#1cb0f6]/10 dark:bg-[#1cb0f6]/20",
    iconBorder: "border-2 border-b-4 border-[#1cb0f6]/30",
    buttonBg: "bg-[#1cb0f6]",
    buttonBorder: "border-[#1cb0f6] border-b-[#1899d6]",
    emoji: "🌍",
    tag: "Genel Kültür",
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
    tag: "80 Soru Test",
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
    tag: "Harita Aktivitesi",
    kavramCount: "49",
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
    kavramCount: "18",
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
    kavramCount: "29",
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
    kavramCount: "53",
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
    kavramCount: "42",
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
    title: "Tarih Kronoloji & Antlaşmalar",
    description: "Osmanlı ve İnkılap Tarihi antlaşmalarını sıraya dizerek zihnine kazı.",
    href: "#",
    isLocked: true
  }
];

export default function EtkinlikIndexPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<SubjectTab>("all");
  const [launchingActivity, setLaunchingActivity] = useState<ActivityItem | null>(null);

  const handleLaunch = (act: ActivityItem) => {
    setLaunchingActivity(act);
    setTimeout(() => {
      router.push(act.href);
    }, 450);
  };

  const filteredActivities = selectedSubject === "all" 
    ? ACTIVITIES 
    : ACTIVITIES.filter(a => a.subject === selectedSubject);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* ━━━ ASYMMETRICAL 2-COLUMN APP DASHBOARD LAYOUT ━━━ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ━━━ LEFT STICKY CONTROL & NAVIGATION PANEL (col-span-3) ━━━ */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-20">
            
            {/* User Progress Mini Chip */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1cb0f6] border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] flex items-center justify-center text-white font-black text-lg shadow-2xs shrink-0">
                {user?.displayName?.charAt(0)?.toUpperCase() || "K"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-slate-800 dark:text-white truncate">
                  {user?.displayName || "KPSS Öğrencisi"}
                </div>
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  Pratikte İlerle
                </div>
              </div>
            </div>

            {/* Vertical Segmented Subject Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 p-3 shadow-xs space-y-1.5">
              <div className="px-3 pt-2 pb-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
                Pratik Kategorisi
              </div>
              
              {[
                { id: "all", label: "Tüm Pratikler", emoji: "🌟", color: "#1cb0f6", borderColor: "#1899d6", count: ACTIVITIES.length },
                { id: "vatandaslik", label: "Vatandaşlık", emoji: "⚖️", color: "#5856d6", borderColor: "#4744b8", count: ACTIVITIES.filter(a => a.subject === "vatandaslik").length },
                { id: "cografya", label: "Coğrafya", emoji: "🗺️", color: "#10B981", borderColor: "#059669", count: ACTIVITIES.filter(a => a.subject === "cografya").length },
                { id: "tarih", label: "Tarih", emoji: "🏛️", color: "#ff9500", borderColor: "#e08400", count: ACTIVITIES.filter(a => a.subject === "tarih").length }
              ].map((cat) => {
                const isActive = selectedSubject === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedSubject(cat.id as SubjectTab)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-black text-xs transition-all cursor-pointer relative ${
                      !isActive
                        ? "bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 border-2 border-b-4 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        : "border-0 text-white"
                    }`}
                    style={isActive ? { padding: "10px 16px 14px 16px" } : {}}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="category-pill"
                        className="absolute inset-0 shadow-xs border-2 border-b-4 rounded-xl"
                        style={{ 
                          backgroundColor: cat.color,
                          borderColor: cat.borderColor 
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <div className={`relative z-10 flex items-center gap-2.5 ${isActive ? "text-white" : ""}`}>
                      <AppleEmoji emoji={cat.emoji} size={18} color={isActive ? "#ffffff" : undefined} />
                      <span>{cat.label}</span>
                    </div>
                    <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-lg font-bold ${isActive ? "bg-black/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ━━━ RIGHT MAIN CANVAS & ACTIVITIES STREAM (col-span-9) ━━━ */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* REGULAR ACTIVITIES STREAM */}
            <div className="space-y-5">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                  <AppleEmoji emoji="🎯" size={24} color="#1cb0f6" />
                  <span>Pratik Aktivite Modülleri</span>
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  {filteredActivities.length} Pratik Listeleniyor
                </span>
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
                            <div className="flex flex-col pt-1">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">
                                KİLİTLİ
                              </span>
                              <h3 className="text-xl font-black text-slate-400 dark:text-slate-500">
                                {act.title}
                              </h3>
                            </div>
                          </div>

                          <div className="mb-6 flex-grow">
                            <p className="text-[13px] font-bold text-slate-400 dark:text-slate-500 leading-relaxed">
                              {act.description}
                            </p>
                          </div>

                          <div className="w-full py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 font-black text-sm text-center border-2 border-b-4 border-slate-300 dark:border-slate-600">
                            YAKINDA
                          </div>
                        </div>
                      );
                    }

                    return (
                      <motion.div
                        key={act.id}
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        onClick={() => handleLaunch(act)}
                        className="group bg-white dark:bg-slate-800 rounded-[2.25rem] p-6 sm:p-7 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between cursor-pointer select-none h-full"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-16 h-16 rounded-2xl ${act.iconBg} flex items-center justify-center shrink-0 ${act.iconBorder} shadow-2xs group-hover:scale-105 transition-transform`}>
                            <AppleEmoji emoji={act.emoji} size={32} color={act.color} />
                          </div>
                          <div className="flex flex-col pt-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg border-2 border-b-2 shadow-2xs ${act.badgeBg} ${act.badgeBorder} ${act.badgeTextColor}`}>
                                {act.kavramCount || "10"} KAVRAM
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                {act.subjectName}
                              </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-tight group-hover:text-[#1cb0f6] transition-colors">
                              {act.title}
                            </h3>
                          </div>
                        </div>

                        <div className="mb-6 flex-grow">
                          <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                            {act.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          className={`w-full py-3.5 rounded-2xl text-white font-black text-sm text-center border-2 border-b-4 ${act.buttonBg} ${act.buttonBorder} active:translate-y-0.5 transition-all shadow-sm flex items-center justify-center gap-2 group-hover:scale-[1.01]`}
                        >
                          <span>BAŞLA</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

          </main>

        </div>
      </div>

      {/* ━━━ SIGNATURE 3D DUOLINGO LAUNCH MODAL OVERLAY ━━━ */}
      <AnimatePresence>
        {launchingActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.85, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-sm w-full border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center text-center space-y-5 relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div 
                className="absolute top-0 left-0 right-0 h-2.5" 
                style={{ backgroundColor: launchingActivity.color }} 
              />

              {/* Clean Apple Emoji Vector (Unboxed) */}
              <motion.div
                initial={{ scale: 0.5, rotate: -12 }}
                animate={{ scale: 1.1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="p-2"
              >
                <AppleEmoji emoji={launchingActivity.emoji} size={64} />
              </motion.div>

              <div className="space-y-1.5 w-full">
                <span className={`text-[10px] font-black uppercase tracking-widest ${launchingActivity.badgeTextColor} ${launchingActivity.badgeBg} px-3 py-1 rounded-xl border-2 border-b-2 ${launchingActivity.badgeBorder} inline-block shadow-2xs`}>
                  {launchingActivity.subjectName}
                </span>
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                  {launchingActivity.title}
                </h3>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  Aktivite Başlatılıyor...
                </p>
              </div>

              {/* 3D Duolingo Physical Progress Bar */}
              <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 overflow-hidden relative shadow-inner">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  style={{ backgroundColor: launchingActivity.color }}
                  className="h-full rounded-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
