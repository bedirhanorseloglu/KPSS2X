"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Award, Swords } from "lucide-react";
import { LeaderboardEntry } from "@/lib/leaderboardService";
import { loadFromFirebase, loadDenemeYeniden } from "@/lib/firebaseService";
import { evaluateDeneme } from "@/lib/denemeUtils";
import { Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, YAxis, XAxis, Legend } from "recharts";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { useAuth } from "@/contexts/AuthContext";
import { getEarnedBadges } from "@/lib/badgesConfig";
import { DenemeRecord, migrateDenemeler } from "@/lib/denemeUtils";
import { DENEME_SUBJECTS } from "@/lib/denemeConfig";
import AppleEmoji from "../AppleEmoji";

const calculateSubjectAverages = (denemeler: DenemeRecord[], type: "genel" | "brans") => {
  const filtered = denemeler.filter(d => type === "genel" ? d.examType !== "brans" : d.examType === "brans");
  const subjectTotals: Record<string, { net: number; count: number }> = {};

  filtered.forEach(d => {
    d.scores.forEach(s => {
      const bId = d.bransSubjectId || d.scores[0]?.subjectId;
      if (type === "brans" && bId && s.subjectId !== bId) return;
      if (!subjectTotals[s.subjectId]) {
        subjectTotals[s.subjectId] = { net: 0, count: 0 };
      }
      subjectTotals[s.subjectId].net += (s.correct - (s.wrong / 4));
      subjectTotals[s.subjectId].count += 1;
    });
  });

  const averages: Record<string, number> = {};
  for (const [subj, data] of Object.entries(subjectTotals)) {
    if (data.count > 0) {
      averages[subj] = data.net / data.count;
    }
  }
  return averages;
};

interface UserProfileModalProps {
  userEntry: LeaderboardEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ userEntry, isOpen, onClose }: UserProfileModalProps) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [stats, setStats] = useState({ 
    gkgyNet: 0, 
    totalGenel: 0,
    avgNetGenel: 0,
    maxNetGenel: 0,
    totalBrans: 0,
    avgNetBrans: 0,
    maxNetBrans: 0,
    bestBransName: "",
    bestBransScore: 0,
    bestGenelSubj: "",
    worstGenelSubj: "",
  });
  const [userDenemeler, setUserDenemeler] = useState<DenemeRecord[]>([]);
  
  const [currentUserStats, setCurrentUserStats] = useState<any>(null);
  const [currentUserDenemeler, setCurrentUserDenemeler] = useState<DenemeRecord[]>([]);
  const [userGenelSubjectAverages, setUserGenelSubjectAverages] = useState<Record<string, number>>({});
  const [userBransSubjectAverages, setUserBransSubjectAverages] = useState<Record<string, number>>({});
  const [kiyasType, setKiyasType] = useState<"genel" | "brans">("genel");
  const [kiyasBransSubject, setKiyasBransSubject] = useState<string>("turkce");
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userEntry) return;
      setLoading(true);
      setLoadError(null);
      try {
        const data = await loadFromFirebase(userEntry.userId);
        const denemeData = await loadDenemeYeniden(userEntry.userId);
        
        if (data && denemeData) {
          data.denemeler = denemeData.denemeler || [];
        } else if (denemeData) {
          Object.assign(data || {}, { denemeler: denemeData.denemeler || [] });
        }
        
        if (!data && !denemeData) {
          setLoadError(`${userEntry.displayName} adlı kullanıcının verisi bulunamadı.`);
        }
        
        const combinedData = data || denemeData || {};
        
        if (combinedData) {
          if (combinedData.denemeler && (combinedData.denemeler as any[]).length > 0) {
            const migrated = migrateDenemeler(combinedData.denemeler as DenemeRecord[]);
            combinedData.denemeler = migrated as any;
            setUserDenemeler(migrated);
            setUserGenelSubjectAverages(calculateSubjectAverages(migrated, "genel"));
            setUserBransSubjectAverages(calculateSubjectAverages(migrated, "brans"));
          }
        }
        
        if (combinedData && combinedData.denemeler) {
          const allDenemeler = combinedData.denemeler as any[];
          
          const genel = allDenemeler.filter(d => d.examType !== "brans");
          const brans = allDenemeler.filter(d => d.examType === "brans");

          let avgGenel = 0;
          let maxGenel = 0;
          if (genel.length > 0) {
            const nets = genel.map(d => evaluateDeneme(d.scores).totalNet);
            avgGenel = nets.reduce((a, b) => a + b, 0) / nets.length;
            maxGenel = Math.max(...nets);
          }

          let avgBrans = 0;
          let maxBrans = 0;
          if (brans.length > 0) {
            const bransNets = brans.map(d => {
              const bId = d.bransSubjectId || d.scores[0]?.subjectId;
              if (!bId) return 0;
              const s = d.scores.find((x: any) => x.subjectId === bId);
              return s ? s.correct - (s.wrong / 4) : 0;
            });
            avgBrans = bransNets.reduce((a, b) => a + b, 0) / bransNets.length;
            maxBrans = Math.max(...bransNets);
          }

          setStats({
            gkgyNet: avgGenel,
            totalGenel: genel.length,
            avgNetGenel: avgGenel,
            maxNetGenel: maxGenel,
            totalBrans: brans.length,
            avgNetBrans: avgBrans,
            maxNetBrans: maxBrans,
            bestBransName: "",
            bestBransScore: 0,
            bestGenelSubj: "",
            worstGenelSubj: "",
          });
        }
      } catch (error) {
        console.error("Kullanıcı verisi çekilemedi:", error);
        setLoadError(`Veri yükleme hatası: ${(error as Error)?.message || 'Bilinmeyen hata'}`);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentUserStats = async () => {
      if (!user) return;
      const denemeData = await loadDenemeYeniden(user.uid);
      const local = migrateDenemeler((denemeData?.denemeler as DenemeRecord[]) || []);
      setCurrentUserDenemeler(local);
      const genel = local.filter(d => d.examType !== "brans");
      const brans = local.filter(d => d.examType === "brans");
      
      let avgGenel = 0;
      let maxGenel = 0;
      if (genel.length > 0) {
        const nets = genel.map(d => evaluateDeneme(d.scores).totalNet);
        avgGenel = nets.reduce((a, b) => a + b, 0) / nets.length;
        maxGenel = Math.max(...nets);
      }
      
      let avgBrans = 0;
      let maxBrans = 0;
      if (brans.length > 0) {
        const bransNets = brans.map(d => {
          const bId = d.bransSubjectId || d.scores[0]?.subjectId;
          if (!bId) return 0;
          const s = d.scores.find((x: any) => x.subjectId === bId);
          return s ? s.correct - (s.wrong / 4) : 0;
        });
        avgBrans = bransNets.reduce((a, b) => a + b, 0) / bransNets.length;
        maxBrans = Math.max(...bransNets);
      }
      
      setCurrentUserStats({
         totalGenel: genel.length,
         avgNetGenel: avgGenel,
         maxNetGenel: maxGenel,
         totalBrans: brans.length,
         avgNetBrans: avgBrans,
         maxNetBrans: maxBrans,
         genelSubjectAverages: calculateSubjectAverages(local, "genel"),
         bransSubjectAverages: calculateSubjectAverages(local, "brans"),
      });
    };

    if (isOpen) {
      fetchUserData();
      fetchCurrentUserStats();
    }
  }, [userEntry, isOpen, user]);

  if (!isOpen || !userEntry) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* 3D Main Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* 3D Push Button Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#ff4b4b] hover:border-[#ff4b4b] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center z-30 shadow-2xs"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 3D Site-Standard Profile Header */}
          <div className="p-6 sm:p-8 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-6 border-b-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 relative">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] bg-[#e8f7ff] dark:bg-[#1cb0f6]/20 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                {userEntry.photoURL ? (
                   <img src={userEntry.photoURL} alt={userEntry.displayName} className="w-full h-full object-cover" />
                ) : (
                   <span className="text-4xl font-black text-[#1cb0f6]">
                     {userEntry.displayName.charAt(0).toUpperCase()}
                   </span>
                )}
              </div>
              
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">{userEntry.displayName}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                   <span className="text-xs font-bold text-[#1cb0f6] flex items-center gap-1.5 bg-[#e8f7ff] dark:bg-[#1cb0f6]/20 px-3.5 py-1.5 rounded-xl border-2 border-b-2 border-[#1cb0f6]/30 shadow-2xs">
                     <Award className="w-4 h-4 text-[#1cb0f6]" /> KPSS Adayı
                   </span>
                </div>
              </div>
            </div>

            {(() => {
              const headerAvgRakip = (() => {
                if (kiyasType === "genel") return stats.avgNetGenel || 0;
                const rakipBransList = userDenemeler.filter(d => d.examType === "brans" && (d.bransSubjectId || d.scores[0]?.subjectId) === kiyasBransSubject);
                if (!rakipBransList.length) return 0;
                const nets = rakipBransList.map(d => {
                  const s = d.scores.find((x: any) => x.subjectId === kiyasBransSubject);
                  return s ? s.correct - (s.wrong / 4) : 0;
                });
                return nets.reduce((a, b) => a + b, 0) / nets.length;
              })();

              const isBrans = kiyasType === "brans";
              const activeSubject = isBrans ? DENEME_SUBJECTS.find(s => s.id === kiyasBransSubject) : null;
              
              const title = isBrans && activeSubject ? `${activeSubject.title} Ort.` : "Genel Net Ort.";
              const color = isBrans && activeSubject ? activeSubject.color : "#1cb0f6";

              return (
                <div 
                  className="text-center sm:text-right px-6 py-3.5 rounded-2xl border-2 border-b-4 shadow-xs shrink-0 transition-all duration-300 sm:mr-12"
                  style={{ backgroundColor: `${color}15`, borderColor: color }}
                >
                   <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color }}>{title}</p>
                   <p className="text-3xl sm:text-4xl font-black font-mono tracking-tight" style={{ color }}>
                     {headerAvgRakip.toFixed(2)}
                   </p>
                </div>
              );
            })()}
          </div>

          {/* Modal Content Scroll Area */}
          <div className="bg-white dark:bg-slate-900 flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6">
            {currentUserStats ? (
              <div className="space-y-6">
                
                {/* Mode Selector & Versus Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-black text-slate-800 dark:text-white tracking-tight">Detaylı Karşılaştırma</h3>
                    
                    {/* 3D Segmented Control */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs gap-1">
                      <button 
                        type="button"
                        onClick={() => setKiyasType("genel")}
                        className={`px-4 py-1.5 text-xs font-black tracking-widest uppercase rounded-xl transition-all cursor-pointer ${
                          kiyasType === "genel" 
                            ? "bg-[#1cb0f6] text-white border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-2xs" 
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border-2 border-transparent"
                        }`}
                      >
                        Genel
                      </button>
                      <button 
                        type="button"
                        onClick={() => setKiyasType("brans")}
                        className={`px-4 py-1.5 text-xs font-black tracking-widest uppercase rounded-xl transition-all cursor-pointer ${
                          kiyasType === "brans" 
                            ? "bg-[#af52de] text-white border-2 border-b-4 border-[#af52de] border-b-[#963ec7] shadow-2xs" 
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border-2 border-transparent"
                        }`}
                      >
                        Branş
                      </button>
                    </div>
                  </div>

                  {/* 3D Versus Badge */}
                  <span className="text-xs font-black text-white bg-slate-800 dark:bg-slate-950 px-4 py-2 rounded-2xl border-2 border-b-4 border-slate-900 border-b-black uppercase tracking-widest shadow-2xs flex items-center justify-center gap-2 self-start sm:self-auto">
                    <span>Sen</span>
                    <AppleEmoji emoji="⚔️" size={16} />
                    <span>{userEntry.displayName}</span>
                  </span>
                </div>
                
                {/* Branş Sub-Subject Pills */}
                {kiyasType === "brans" && (
                  <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                    {DENEME_SUBJECTS.map(subj => {
                      const isActive = kiyasBransSubject === subj.id;
                      return (
                        <button
                          key={subj.id}
                          type="button"
                          onClick={() => setKiyasBransSubject(subj.id)}
                          className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap border-2 border-b-4 cursor-pointer ${
                            isActive 
                              ? "text-white shadow-2xs active:translate-y-0.5" 
                              : "bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                          style={isActive ? { backgroundColor: subj.color, borderColor: subj.color } : {}}
                        >
                          {subj.title}
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {(() => {
                  let kiyasAvgSen = 0, kiyasAvgRakip = 0, kiyasMaxSen = 0, kiyasMaxRakip = 0, kiyasTotalSen = 0, kiyasTotalRakip = 0;
                  const typeLabel = kiyasType === "genel" ? "Genel" : "Branş";
                  const senSbjAvg = kiyasType === "genel" ? currentUserStats.genelSubjectAverages : currentUserStats.bransSubjectAverages;
                  const rakipSbjAvg = kiyasType === "genel" ? userGenelSubjectAverages : userBransSubjectAverages;

                  if (kiyasType === "genel") {
                    kiyasAvgSen = currentUserStats.avgNetGenel;
                    kiyasAvgRakip = stats.avgNetGenel;
                    kiyasMaxSen = currentUserStats.maxNetGenel;
                    kiyasMaxRakip = stats.maxNetGenel;
                    kiyasTotalSen = currentUserStats.totalGenel;
                    kiyasTotalRakip = stats.totalGenel;
                  } else {
                    const senBransList = currentUserDenemeler.filter(d => d.examType === "brans" && (d.bransSubjectId || d.scores[0]?.subjectId) === kiyasBransSubject);
                    const rakipBransList = userDenemeler.filter(d => d.examType === "brans" && (d.bransSubjectId || d.scores[0]?.subjectId) === kiyasBransSubject);
                    
                    const getBransStats = (list: DenemeRecord[]) => {
                      if (!list.length) return { avg: 0, max: 0, count: 0 };
                      const nets = list.map(d => {
                        const s = d.scores.find((x: any) => x.subjectId === kiyasBransSubject);
                        return s ? s.correct - (s.wrong / 4) : 0;
                      });
                      return {
                        avg: nets.reduce((a, b) => a + b, 0) / nets.length,
                        max: Math.max(...nets),
                        count: nets.length
                      };
                    };
                    
                    const senStats = getBransStats(senBransList);
                    const rakipBransStatsObj = getBransStats(rakipBransList);
                    
                    kiyasAvgSen = senStats.avg;
                    kiyasAvgRakip = rakipBransStatsObj.avg;
                    kiyasMaxSen = senStats.max;
                    kiyasMaxRakip = rakipBransStatsObj.max;
                    kiyasTotalSen = senStats.count;
                    kiyasTotalRakip = rakipBransStatsObj.count;
                  }
                  
                  return (
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                      
                      {/* Left Column: 3D Comparison Bars */}
                      <div className="space-y-4">
                        
                        {/* Ortalamalar Card */}
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs">
                          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                             <span className={kiyasAvgSen >= kiyasAvgRakip ? "text-[#1cb0f6]" : ""}>
                               Sen ({kiyasAvgSen.toFixed(1)}) {kiyasAvgSen >= kiyasAvgRakip && kiyasAvgSen > 0 && <AppleEmoji emoji="👑" size={14} />}
                             </span>
                             <span className="text-slate-600 dark:text-slate-300">{typeLabel} Net Ortalaması</span>
                             <span className={kiyasAvgRakip > kiyasAvgSen ? "text-[#ff2d55]" : ""}>
                               {kiyasAvgRakip > kiyasAvgSen && <AppleEmoji emoji="👑" size={14} />} Rakip ({kiyasAvgRakip.toFixed(1)})
                             </span>
                          </div>
                          <div className="flex h-3.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 p-0.5 shadow-inner">
                             <div className="h-full transition-all rounded-full" style={{ backgroundColor: "#1cb0f6", width: `${(kiyasAvgSen / (kiyasAvgSen + kiyasAvgRakip || 1)) * 100}%` }} />
                             <div className="h-full transition-all rounded-full" style={{ backgroundColor: "#ff2d55", width: `${(kiyasAvgRakip / (kiyasAvgSen + kiyasAvgRakip || 1)) * 100}%` }} />
                          </div>
                        </div>

                        {/* En Yüksek Net Card */}
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs">
                          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                             <span className={kiyasMaxSen >= kiyasMaxRakip ? "text-[#1cb0f6]" : ""}>
                               Sen ({kiyasMaxSen.toFixed(1)}) {kiyasMaxSen >= kiyasMaxRakip && kiyasMaxSen > 0 && <AppleEmoji emoji="👑" size={14} />}
                             </span>
                             <span className="text-slate-600 dark:text-slate-300">En Yüksek {typeLabel} Net</span>
                             <span className={kiyasMaxRakip > kiyasMaxSen ? "text-[#ff2d55]" : ""}>
                               {kiyasMaxRakip > kiyasMaxSen && <AppleEmoji emoji="👑" size={14} />} Rakip ({kiyasMaxRakip.toFixed(1)})
                             </span>
                          </div>
                          <div className="flex h-3.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 p-0.5 shadow-inner">
                             <div className="h-full transition-all rounded-full" style={{ backgroundColor: "#1cb0f6", width: `${(kiyasMaxSen / (kiyasMaxSen + kiyasMaxRakip || 1)) * 100}%` }} />
                             <div className="h-full transition-all rounded-full" style={{ backgroundColor: "#ff2d55", width: `${(kiyasMaxRakip / (kiyasMaxSen + kiyasMaxRakip || 1)) * 100}%` }} />
                          </div>
                        </div>

                        {/* Çözülen Denemeler Cards */}
                        <div className="flex items-center justify-between gap-3">
                           <div className="flex-1 bg-[#e8f7ff] dark:bg-[#1cb0f6]/10 p-5 rounded-2xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-center shadow-2xs">
                              <p className="text-xs font-black uppercase tracking-widest text-[#1cb0f6] mb-1">Sen</p>
                              <p className="text-3xl font-black text-[#1cb0f6] font-mono leading-none mb-1">{kiyasTotalSen}</p>
                              <p className="text-[10px] font-extrabold text-[#1cb0f6]/80 uppercase tracking-wider leading-tight">
                                Tane {kiyasType === "brans" ? DENEME_SUBJECTS.find(s=>s.id===kiyasBransSubject)?.title + " Branş Denemesi" : "Genel Deneme"} Çözüldü
                              </p>
                           </div>
                           
                           <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-b-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                             <AppleEmoji emoji="⚔️" size={20} />
                           </div>
                           
                           <div className="flex-1 bg-[#fff0f3] dark:bg-[#ff2d55]/10 p-5 rounded-2xl border-2 border-b-4 border-[#ff2d55] border-b-[#e02649] text-center shadow-2xs">
                              <p className="text-xs font-black uppercase tracking-widest text-[#ff2d55] mb-1">Rakip</p>
                              <p className="text-3xl font-black text-[#ff2d55] font-mono leading-none mb-1">{kiyasTotalRakip}</p>
                              <p className="text-[10px] font-extrabold text-[#ff2d55]/80 uppercase tracking-wider leading-tight">
                                Tane {kiyasType === "brans" ? DENEME_SUBJECTS.find(s=>s.id===kiyasBransSubject)?.title + " Branş Denemesi" : "Genel Deneme"} Çözüldü
                              </p>
                           </div>
                        </div>
                      </div>

                      {/* Right Column: 3D Bar Chart Container */}
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col h-[380px]">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center">
                          {typeLabel} - Ders Bazlı Net Ortalamaları
                        </p>
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { subject: 'Türkçe', sen: senSbjAvg?.['turkce'] || 0, rakip: rakipSbjAvg['turkce'] || 0 },
                                { subject: 'Matematik', sen: senSbjAvg?.['matematik'] || 0, rakip: rakipSbjAvg['matematik'] || 0 },
                                { subject: 'Tarih', sen: senSbjAvg?.['tarih'] || 0, rakip: rakipSbjAvg['tarih'] || 0 },
                                { subject: 'Coğrafya', sen: senSbjAvg?.['cografya'] || 0, rakip: rakipSbjAvg['cografya'] || 0 },
                                { subject: 'Vatandaşlık', sen: senSbjAvg?.['vatandaslik'] || 0, rakip: rakipSbjAvg['vatandaslik'] || 0 },
                                { subject: 'Güncel', sen: senSbjAvg?.['guncel-bilgiler'] || 0, rakip: rakipSbjAvg['guncel-bilgiler'] || 0 },
                              ]}
                              layout="vertical"
                              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                              <XAxis type="number" hide />
                              <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} width={80} />
                              <Tooltip 
                                cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                                contentStyle={{ borderRadius: '1rem', border: '2px solid rgba(148, 163, 184, 0.3)', fontWeight: 900, fontSize: '12px', background: 'var(--color-surface, #ffffff)' }}
                                formatter={(value: any) => Number(value).toFixed(1) + " Net"}
                              />
                              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 900 }} />
                              <Bar dataKey="sen" name="Sen" fill="#1cb0f6" radius={[0, 6, 6, 0]} barSize={12} />
                              <Bar dataKey="rakip" name="Rakip" fill="#ff2d55" radius={[0, 6, 6, 0]} barSize={12} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <p className="text-sm font-bold">Kıyaslama yapılabilmesi için sisteme giriş yapmış olmalısınız.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
