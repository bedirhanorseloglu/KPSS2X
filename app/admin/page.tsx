"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import AppleEmoji from "@/components/AppleEmoji";
import { 
  Users, 
  BarChart3, 
  Trophy, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Lock, 
  Brain, 
  BookOpen, 
  Award,
  Zap,
  CheckCircle2,
  TrendingUp,
  Download,
  Eye,
  X
} from "lucide-react";

interface AdminUserRecord {
  id: string;
  displayName: string;
  email: string;
  targetNet?: number;
  examType?: string;
  denemeCount?: number;
  latestNet?: number;
  averageNet?: number;
  totalFocusMins?: number;
  turkceAvg?: number;
  matematikAvg?: number;
  tarihAvg?: number;
  cografyaAvg?: number;
  vatandaslikAvg?: number;
  denemeler?: any[];
}

export default function AdminDashboardPage() {
  const { user, signInWithGoogle } = useAuth();
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "subjects" | "leaderboard" | "system">("users");
  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUserRecord | null>(null);

  // Admin yetki kontrolü — Proje sahibi ve geliştiriciler
  const isAdmin = user && (
    user.email === "bedirhanorseloglu@gmail.com" ||
    user.email?.endsWith("@admin.com") ||
    process.env.NODE_ENV === "development"
  );

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const recordsMap: Record<string, AdminUserRecord> = {};

      // 1. Fetch user_data collection
      const userDataSnap = await getDocs(collection(db, "user_data"));
      userDataSnap.forEach((d) => {
        const data = d.data();
        const denemeler = Array.isArray(data.denemeler) ? data.denemeler : [];
        
        let totalNetSum = 0;
        let turkceSum = 0, matSum = 0, tarihSum = 0, cogSum = 0, vatSum = 0;
        let count = 0;

        denemeler.forEach((dn: any) => {
          if (typeof dn.net === "number") {
            totalNetSum += dn.net;
            count++;
          }
          if (dn.dersler) {
            if (dn.dersler.turkce?.net) turkceSum += dn.dersler.turkce.net;
            if (dn.dersler.matematik?.net) matSum += dn.dersler.matematik.net;
            if (dn.dersler.tarih?.net) tarihSum += dn.dersler.tarih.net;
            if (dn.dersler.cografya?.net) cogSum += dn.dersler.cografya.net;
            if (dn.dersler.vatandaslik?.net) vatSum += dn.dersler.vatandaslik.net;
          }
        });

        recordsMap[d.id] = {
          id: d.id,
          displayName: data.displayName || "Kullanıcı",
          email: data.email || "E-posta Yok",
          targetNet: data.denemeTargetNet || 90,
          examType: data.examType || "Lisans",
          denemeCount: count,
          latestNet: count > 0 ? denemeler[count - 1]?.net : undefined,
          averageNet: count > 0 ? Math.round((totalNetSum / count) * 100) / 100 : 0,
          totalFocusMins: data.totalFocusMinutes || 0,
          turkceAvg: count > 0 ? Math.round((turkceSum / count) * 10) / 10 : 0,
          matematikAvg: count > 0 ? Math.round((matSum / count) * 10) / 10 : 0,
          tarihAvg: count > 0 ? Math.round((tarihSum / count) * 10) / 10 : 0,
          cografyaAvg: count > 0 ? Math.round((cogSum / count) * 10) / 10 : 0,
          vatandaslikAvg: count > 0 ? Math.round((vatSum / count) * 10) / 10 : 0,
          denemeler: denemeler
        };
      });

      // 2. Fetch general leaderboard to supplement users
      const lbSnap = await getDocs(collection(db, "leaderboard"));
      lbSnap.forEach((d) => {
        const data = d.data();
        if (!recordsMap[d.id]) {
          recordsMap[d.id] = {
            id: d.id,
            displayName: data.displayName || "Liderlik Kullanıcısı",
            email: "Firestore Liderlik",
            averageNet: data.averageNet || 0,
            denemeCount: data.denemeCount || 0,
            targetNet: 90,
            denemeler: []
          };
        }
      });

      setUsersList(Object.values(recordsMap));
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [user]);

  if (!user || !isAdmin) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 sm:p-10 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-[#5856d6]/10 border-2 border-b-4 border-[#5856d6]/30 flex items-center justify-center mx-auto shadow-2xs">
            <Lock className="w-10 h-10 text-[#5856d6]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#5856d6]">
              YÖNETİCİ GİRİŞİ GEREKLİ
            </span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              Yönetici Paneli (Admin)
            </h2>
            <p className="text-xs font-bold text-slate-400 leading-relaxed">
              Bu alan platform analizleri için yönetici yetkisine tabidir. Lütfen admin hesabınızla giriş yapın.
            </p>
          </div>

          {!user ? (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full py-4 bg-[#1cb0f6] text-white font-black text-sm rounded-2xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Google İle Yetkili Girişi Yap</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-300 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
              Mevcut e-posta hesabınız ({user.email}) admin yetkisine sahip değil.
            </div>
          )}
        </div>
      </main>
    );
  }

  // Filtered Users
  const filteredUsers = usersList.filter(
    (u) =>
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Platform Aggregate KPIs
  const totalStudents = usersList.length;
  const totalExamsSolved = usersList.reduce((acc, u) => acc + (u.denemeCount || 0), 0);
  const totalFocusTime = usersList.reduce((acc, u) => acc + (u.totalFocusMins || 0), 0);
  const platformAvgNet =
    totalStudents > 0
      ? Math.round(
          (usersList.reduce((acc, u) => acc + (u.averageNet || 0), 0) / totalStudents) * 10
        ) / 10
      : 0;

  // Subject Averages Platform-wide
  const activeStudentsWithExams = usersList.filter((u) => (u.denemeCount || 0) > 0);
  const countWithExams = Math.max(1, activeStudentsWithExams.length);

  const avgTurkce =
    Math.round(
      (activeStudentsWithExams.reduce((acc, u) => acc + (u.turkceAvg || 0), 0) / countWithExams) * 10
    ) / 10;
  const avgMat =
    Math.round(
      (activeStudentsWithExams.reduce((acc, u) => acc + (u.matematikAvg || 0), 0) / countWithExams) * 10
    ) / 10;
  const avgTarih =
    Math.round(
      (activeStudentsWithExams.reduce((acc, u) => acc + (u.tarihAvg || 0), 0) / countWithExams) * 10
    ) / 10;
  const avgCog =
    Math.round(
      (activeStudentsWithExams.reduce((acc, u) => acc + (u.cografyaAvg || 0), 0) / countWithExams) * 10
    ) / 10;
  const avgVat =
    Math.round(
      (activeStudentsWithExams.reduce((acc, u) => acc + (u.vatandaslikAvg || 0), 0) / countWithExams) * 10
    ) / 10;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ━━━ EXECUTIVE ADMIN HEADER BAR ━━━ */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.25rem] p-6 sm:p-8 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#5856d6] text-white border-2 border-b-4 border-[#5856d6] border-b-[#4744b8] flex items-center justify-center font-black text-2xl shadow-2xs shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg bg-[#5856d6]/10 text-[#5856d6] border border-[#5856d6]/30">
                  MASTER ANALYTICS CONTROL
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Yönetici Paneli
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                Platform Veri & Öğrenci Analiz Laboratuvarı
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchAdminData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#1cb0f6] text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] active:translate-y-0.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Verileri Yenile</span>
          </button>
        </div>

        {/* ━━━ 4 CORE KPI METRIC CARDS ━━━ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Students */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1cb0f6]/10 text-[#1cb0f6] border-2 border-b-4 border-[#1cb0f6]/30 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Kayıtlı Öğrenciler
              </span>
              <div className="text-2xl font-black text-slate-800 dark:text-white">
                {totalStudents} <span className="text-xs font-bold text-[#58cc02]">Aktif</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Practice Exams Solved */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#58cc02]/10 text-[#58cc02] border-2 border-b-4 border-[#58cc02]/30 flex items-center justify-center shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Çözülen Denemeler
              </span>
              <div className="text-2xl font-black text-slate-800 dark:text-white">
                {totalExamsSolved} <span className="text-xs font-bold text-slate-400">Adet</span>
              </div>
            </div>
          </div>

          {/* Card 3: Total Focus Hours */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ff9500]/10 text-[#ff9500] border-2 border-b-4 border-[#ff9500]/30 flex items-center justify-center shrink-0">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Toplam Odaklanma
              </span>
              <div className="text-2xl font-black text-slate-800 dark:text-white">
                {Math.round(totalFocusTime / 60)} <span className="text-xs font-bold text-slate-400">Saat</span>
              </div>
            </div>
          </div>

          {/* Card 4: Platform Avg Net */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#af52de]/10 text-[#af52de] border-2 border-b-4 border-[#af52de]/30 flex items-center justify-center shrink-0">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Platform Ort. Net
              </span>
              <div className="text-2xl font-black text-slate-800 dark:text-white">
                {platformAvgNet} <span className="text-xs font-bold text-[#af52de]">Net</span>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ NAVIGATION TAB BAR ━━━ */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: "users", label: "Öğrenci Yönetimi & Detay", emoji: "👥", color: "#1cb0f6" },
            { id: "subjects", label: "Ders Bazlı Başarı Analizi", emoji: "📊", color: "#58cc02" },
            { id: "leaderboard", label: "Sıralama Tabloları", emoji: "🏆", color: "#ff9500" },
            { id: "system", label: "Sistem & İnovasyon Özeti", emoji: "💡", color: "#5856d6" }
          ].map((tb) => {
            const isActive = activeTab === tb.id;
            return (
              <button
                key={tb.id}
                type="button"
                onClick={() => setActiveTab(tb.id as any)}
                className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-b-4 transition-all cursor-pointer whitespace-nowrap active:translate-y-0.5 ${
                  isActive
                    ? "bg-[#1cb0f6] text-white border-[#1cb0f6] border-b-[#1899d6] shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <AppleEmoji emoji={tb.emoji} size={16} />
                  <span>{tb.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ━━━ TAB 1: USERS REGISTRY TABLE ━━━ */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-100 dark:border-slate-700 pb-5">
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#1cb0f6]" />
                  <span>Tüm Öğrenci Kayıtları ({filteredUsers.length})</span>
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">
                  Öğrencilerin net gelişimlerini, çalışma sürelerini ve çözdükleri denemeleri inceleyin.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="İsim veya e-posta ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:border-[#1cb0f6]"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 font-bold text-sm">
                Veriler yükleniyor...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold text-sm">
                Kayıtlı öğrenci bulunamadı.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 dark:border-slate-700 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Öğrenci</th>
                      <th className="py-3 px-4">Hedef Sınav</th>
                      <th className="py-3 px-4">Çözülen Deneme</th>
                      <th className="py-3 px-4">Ortalama Net</th>
                      <th className="py-3 px-4">Odak Süresi</th>
                      <th className="py-3 px-4 text-right">İncele</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-xs font-bold">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#1cb0f6] text-white font-black flex items-center justify-center border-2 border-b-2 border-[#1899d6] shrink-0">
                              {u.displayName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-slate-800 dark:text-white font-black">{u.displayName}</div>
                              <div className="text-[10px] text-slate-400 font-medium">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-extrabold text-[10px]">
                            {u.examType || "Lisans"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200">
                          {u.denemeCount || 0} Sınav
                        </td>
                        <td className="py-3.5 px-4 text-[#58cc02] font-black text-sm">
                          {u.averageNet || 0} Net
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {Math.round((u.totalFocusMins || 0) / 60)} Saat
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedUserDetail(u)}
                            className="px-3 py-1.5 rounded-xl bg-[#1cb0f6]/10 text-[#1cb0f6] border border-[#1cb0f6]/30 font-black text-[11px] hover:bg-[#1cb0f6] hover:text-white transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detay</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ━━━ TAB 2: SUBJECT PERFORMANCE BREAKDOWN ━━━ */}
        {activeTab === "subjects" && (
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#58cc02]" />
                <span>Ders Bazlı Platform Başarı Analizi</span>
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                Kullanıcıların ders bazındaki ortalama net ortalamaları. İçerik ve pratik modülü geliştirmek için kullanın.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {[
                { name: "Türkçe", avg: avgTurkce, max: 30, color: "#F43F5E", emoji: "📝" },
                { name: "Matematik", avg: avgMat, max: 30, color: "#af52de", emoji: "🔢" },
                { name: "Tarih", avg: avgTarih, max: 27, color: "#ff9500", emoji: "🏛️" },
                { name: "Coğrafya", avg: avgCog, max: 18, color: "#10B981", emoji: "🗺️" },
                { name: "Vatandaşlık", avg: avgVat, max: 15, color: "#5856d6", emoji: "⚖️" }
              ].map((sb) => (
                <div
                  key={sb.name}
                  className="p-5 rounded-3xl border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AppleEmoji emoji={sb.emoji} size={20} />
                      <span className="font-black text-sm text-slate-800 dark:text-white">{sb.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-400">/{sb.max}</span>
                  </div>

                  <div className="text-2xl font-black" style={{ color: sb.color }}>
                    {sb.avg} <span className="text-xs font-bold text-slate-400">Net</span>
                  </div>

                  {/* Progress gauge bar */}
                  <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300 dark:border-slate-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, (sb.avg / sb.max) * 100))}%`,
                        backgroundColor: sb.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ━━━ TAB 3: LEADERBOARD OVERVIEW ━━━ */}
        {activeTab === "leaderboard" && (
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#ff9500]" />
                <span>En Yüksek Net Yapan Lider Öğrenciler</span>
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                Genel ve branş denemelerinde zirvedeki sıralama kayıtları.
              </p>
            </div>

            <div className="space-y-3">
              {usersList
                .filter((u) => (u.averageNet || 0) > 0)
                .sort((a, b) => (b.averageNet || 0) - (a.averageNet || 0))
                .slice(0, 10)
                .map((u, idx) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl font-black flex items-center justify-center text-xs text-white border-2 border-b-2 ${
                        idx === 0 ? "bg-[#ff9500] border-[#e08400]" : idx === 1 ? "bg-slate-400 border-slate-500" : idx === 2 ? "bg-amber-700 border-amber-800" : "bg-slate-700 border-slate-800"
                      }`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-black text-sm text-slate-800 dark:text-white">{u.displayName}</div>
                        <div className="text-[10px] font-bold text-slate-400">{u.denemeCount} Sınav Çözüldü</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-[#58cc02]">{u.averageNet} Net</div>
                      <div className="text-[10px] font-bold text-slate-400">Ortalama İsabet</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ━━━ TAB 4: SYSTEM HEALTH & INNOVATION INSIGHTS ━━━ */}
        {activeTab === "system" && (
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#5856d6]" />
                <span>Sistem Durumu & Genel Yayın Tavsiyeleri</span>
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                Platformun genel kullanıcıya açılması için teknik ve içerik yönergeleri.
              </p>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-b-4 border-emerald-500 border-b-emerald-600 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Ücretsiz Katman Mimari Uyum Tamamlandı</span>
                </div>
                <p>
                  Vercel + Firebase Spark Plan optimizasyonları sayesinde 50.000 günlük okuma ve 20.000 yazma limitleri içerisinde platform %100 ücretsiz işletilebilir.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sky-50 dark:bg-sky-500/10 border-2 border-b-4 border-sky-500 border-b-sky-600 space-y-2">
                <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-black text-sm">
                  <Zap className="w-5 h-5" />
                  <span>Öneri: Branş Denemesi Çeşitliliğini Artırma</span>
                </div>
                <p>
                  Tarih ve Vatandaşlık derslerindeki öğrenci net ortalamalarını yükseltmek için `/etkinlik` altındaki yeni görsel hafıza harita modüllerini öne çıkarabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ━━━ USER DETAIL INSPECTOR MODAL ━━━ */}
        <AnimatePresence>
          {selectedUserDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setSelectedUserDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-2xl w-full border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1cb0f6] text-white font-black flex items-center justify-center text-xl border-2 border-b-4 border-[#1899d6]">
                      {selectedUserDetail.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white">
                        {selectedUserDetail.displayName}
                      </h3>
                      <p className="text-xs font-bold text-slate-400">
                        {selectedUserDetail.email}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedUserDetail(null)}
                    className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-black flex items-center justify-center border-2 border-b-4 border-slate-200 dark:border-slate-700 hover:border-slate-400 cursor-pointer transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Çözülen Sınav</span>
                    <div className="text-lg font-black text-slate-800 dark:text-white">{selectedUserDetail.denemeCount || 0}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Ortalama Net</span>
                    <div className="text-lg font-black text-[#58cc02]">{selectedUserDetail.averageNet || 0}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Hedef Net</span>
                    <div className="text-lg font-black text-[#1cb0f6]">{selectedUserDetail.targetNet || 90}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Odak Süresi</span>
                    <div className="text-lg font-black text-[#ff9500]">{Math.round((selectedUserDetail.totalFocusMins || 0) / 60)} Sa</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-black text-sm text-slate-800 dark:text-white">Ders Ortalamaları</h4>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold">
                    <div className="p-2.5 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-[#F43F5E]">
                      <div className="text-[10px] font-black">Türkçe</div>
                      <div className="font-black text-sm">{selectedUserDetail.turkceAvg || 0}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#af52de]/10 border border-[#af52de]/30 text-[#af52de]">
                      <div className="text-[10px] font-black">Matematik</div>
                      <div className="font-black text-sm">{selectedUserDetail.matematikAvg || 0}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#ff9500]/10 border border-[#ff9500]/30 text-[#ff9500]">
                      <div className="text-[10px] font-black">Tarih</div>
                      <div className="font-black text-sm">{selectedUserDetail.tarihAvg || 0}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]">
                      <div className="text-[10px] font-black">Coğrafya</div>
                      <div className="font-black text-sm">{selectedUserDetail.cografyaAvg || 0}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#5856d6]/10 border border-[#5856d6]/30 text-[#5856d6]">
                      <div className="text-[10px] font-black">Vatandaşlık</div>
                      <div className="font-black text-sm">{selectedUserDetail.vatandaslikAvg || 0}</div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUserDetail(null)}
                    className="py-3 px-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 active:translate-y-0.5 transition-all text-xs cursor-pointer"
                  >
                    Kapat
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
