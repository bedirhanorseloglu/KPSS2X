"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { getLeaderboard, getBranchLeaderboard, LeaderboardEntry } from "@/lib/leaderboardService";
import { DENEME_SUBJECTS } from "@/lib/denemeConfig";
import { estimateP3Score } from "@/lib/denemeUtils";
import { useAuth } from "@/contexts/AuthContext";
import GlobalLoading from "../GlobalLoading";
import AppleEmoji from "../AppleEmoji";
import dynamic from "next/dynamic";

const UserProfileModal = dynamic(() => import("./UserProfileModal"), { ssr: false });

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);

  const [leaderboardType, setLeaderboardType] = useState<"genel" | "brans">("genel");
  const [selectedBranch, setSelectedBranch] = useState<string>("turkce");

  useEffect(() => {
    if (!user) return;
    const fetchLeaders = async () => {
      setLoading(true);
      let data = [];
      if (leaderboardType === "genel") {
        data = await getLeaderboard(50);
      } else {
        data = await getBranchLeaderboard(selectedBranch, 50);
      }
      setLeaders(data);
      setLoading(false);
    };
    fetchLeaders();
  }, [user, leaderboardType, selectedBranch]);

  if (!user) {
    return (
      <GlobalLoading
        title="Liderlik Tablosu Yükleniyor..."
        description="Sıralamalar ve kullanıcı performansları getiriliyor."
        emoji="🏆"
        fullScreen={false}
      />
    );
  }

  const top3 = leaders.slice(0, 3);
  const others = leaders.slice(3);

  const PodiumBlock = ({ leader, rank, height, delay }: any) => {
    const isCurrentUser = user?.uid === leader.userId;
    const emoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
    const p3 = leaderboardType === "genel" ? estimateP3Score(leader.averageNet).toFixed(2) : null;

    const rankTheme = rank === 1 
      ? { border: "border-[#ff9500]", borderBottom: "border-b-[#e08400]", stripe: "bg-[#ff9500]", text: "text-[#ff9500]", glow: "shadow-amber-500/20" }
      : rank === 2 
      ? { border: "border-[#ce82ff]", borderBottom: "border-b-[#b560e8]", stripe: "bg-[#ce82ff]", text: "text-[#ce82ff]", glow: "shadow-purple-500/20" }
      : { border: "border-[#ff4b4b]", borderBottom: "border-b-[#e03030]", stripe: "bg-[#ff4b4b]", text: "text-[#ff4b4b]", glow: "shadow-red-500/20" };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: "spring", stiffness: 100 }}
        onClick={() => setSelectedUser(leader)}
        className="flex flex-col items-center cursor-pointer group relative z-10 mx-1.5 sm:mx-4"
      >
        {/* Top Avatar with 3D Border & Medal Badge */}
        <div className={`relative z-20 -mb-7 ${rank === 1 ? 'w-24 h-24 sm:w-26 sm:h-26' : 'w-20 h-20 sm:w-22 sm:h-22'}`}>
          {leader.photoURL ? (
            <img 
              src={leader.photoURL} 
              alt={leader.displayName} 
              className={`w-full h-full rounded-full border-4 ${rankTheme.border} bg-white dark:bg-slate-800 shadow-lg object-cover relative z-10 group-hover:scale-105 transition-transform`} 
            />
          ) : (
            <div className={`w-full h-full rounded-full flex items-center justify-center text-2xl sm:text-3xl font-black border-4 ${rankTheme.border} ${rankTheme.text} bg-white dark:bg-slate-800 shadow-lg relative z-10 group-hover:scale-105 transition-transform`}>
              {leader.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* 3D Medal Badge */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white dark:bg-slate-800 rounded-full border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center absolute -top-2 -right-2 z-30 transform group-hover:scale-115 group-hover:rotate-12 transition-transform">
            <AppleEmoji emoji={emoji} size={22} />
          </div>

          {/* Current User Pill */}
          {isCurrentUser && (
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#1cb0f6] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full z-30 border-2 border-white shadow-xs">
              SEN
            </div>
          )}
        </div>
        
        {/* 3D Podium Column Card */}
        <div className={`w-32 sm:w-40 ${height} rounded-t-[2.5rem] flex flex-col items-center justify-end pb-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden bg-white dark:bg-slate-800`}>
           {/* Top Color Stripe */}
           <div className={`absolute top-0 left-0 right-0 h-3.5 ${rankTheme.stripe}`} />
           
           <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white text-center truncate w-full px-3 tracking-tight">{leader.displayName}</p>
           
           {/* 3D NET Stat Chip */}
           <div className="mt-2.5 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col items-center">
             <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest leading-none mb-1">NET</p>
             <p className={`text-lg sm:text-xl font-black font-mono leading-none ${rankTheme.text}`}>
               {leader.averageNet.toFixed(1)}
             </p>
           </div>

           {p3 && (
             <div className="mt-2 px-3 py-1 rounded-xl text-[11px] font-black text-[#1cb0f6] bg-[#e8f7ff] dark:bg-[#1cb0f6]/10 border-2 border-b-2 border-[#1cb0f6]/30 shadow-2xs">
               P3: {p3}
             </div>
           )}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Background Soft Glow Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1cb0f6]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#af52de]/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/2 pointer-events-none" />
        
        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-[1.5rem] bg-[#fff8ed] dark:bg-amber-500/10 border-2 border-b-4 border-[#ff9500] border-b-[#e08400] flex items-center justify-center shadow-xs shrink-0">
              <AppleEmoji emoji="🏆" size={34} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Şampiyonlar Ligi</h3>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">
                {leaderboardType === "genel" ? "Türkiye Geneli Sıralama" : "Branş Bazlı Sıralama"}
              </p>
            </div>
          </div>
          
          {/* 3D Segmented Control Tab Switcher */}
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 w-fit shadow-xs gap-1">
            <button
              type="button"
              onClick={() => setLeaderboardType("genel")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                leaderboardType === "genel"
                  ? "bg-white dark:bg-slate-800 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-[#1cb0f6] shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Genel Deneme
            </button>
            <button
              type="button"
              onClick={() => setLeaderboardType("brans")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                leaderboardType === "brans"
                  ? "bg-white dark:bg-slate-800 border-2 border-b-4 border-[#af52de] border-b-[#963ec7] text-[#af52de] shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Branş
            </button>
          </div>
        </div>

        {/* 3D Branş Subject Filter Bar */}
        {leaderboardType === "brans" && (
          <div className="mb-8 flex gap-2.5 p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs relative z-10 overflow-x-auto no-scrollbar snap-x">
            {DENEME_SUBJECTS.map((subject) => (
              <button
                key={subject.id}
                type="button"
                onClick={() => setSelectedBranch(subject.id)}
                className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-black transition-all snap-start flex items-center gap-2.5 cursor-pointer ${
                  selectedBranch === subject.id
                    ? "bg-white dark:bg-slate-800 border-2 border-b-4 text-slate-800 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white border-2 border-transparent"
                }`}
                style={selectedBranch === subject.id ? { 
                  borderColor: subject.color,
                  borderBottomColor: subject.color,
                } : {}}
              >
                <AppleEmoji emoji={subject.icon} size={20} />
                <span>{subject.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        {loading ? (
          <GlobalLoading
            title="Liderlik Tablosu Yükleniyor..."
            description="Sıralamalar ve kullanıcı performansları getiriliyor."
            emoji="🏆"
            fullScreen={false}
          />
        ) : leaders.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-[2.25rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs max-w-md mx-auto relative z-10 my-8">
            <div className="w-16 h-16 bg-[#e8f7ff] dark:bg-slate-700/50 rounded-2xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <AppleEmoji emoji="📭" size={36} />
            </div>
            <h4 className="text-lg font-black text-slate-800 dark:text-white">Henüz bu alanda kimse yok</h4>
            <p className="text-xs font-bold text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              İlk denemeni çöz ve liderlik tablosuna adını gururla yazdır!
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {top3.length > 0 && (
              <div className="relative z-10 flex justify-center items-end gap-0 sm:gap-4 mb-16 mt-12 h-64 px-2">
                {top3[1] && <PodiumBlock leader={top3[1]} rank={2} height="h-36 sm:h-40" color="bg-slate-400" delay={0.2} />}
                {top3[0] && <PodiumBlock leader={top3[0]} rank={1} height="h-48 sm:h-56" color="bg-amber-400" delay={0.1} />}
                {top3[2] && <PodiumBlock leader={top3[2]} rank={3} height="h-28 sm:h-32" color="bg-orange-500" delay={0.3} />}
              </div>
            )}
            
            {/* Other Rankings List */}
            <div className="relative z-10 space-y-3">
              {others.map((leader, idx) => {
                const isCurrentUser = user?.uid === leader.userId;
                const rankInGlobal = idx + 4;
                const p3 = leaderboardType === "genel" ? estimateP3Score(leader.averageNet).toFixed(2) : null;
                
                return (
                  <motion.div
                    key={leader.userId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (idx * 0.05) + 0.3 }}
                    onClick={() => setSelectedUser(leader)}
                    className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 border-b-4 transition-all cursor-pointer group hover:-translate-y-0.5 ${
                      isCurrentUser 
                        ? "bg-[#e8f7ff] dark:bg-blue-500/10 border-[#1cb0f6] border-b-[#1899d6] shadow-xs" 
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#1cb0f6] shadow-xs"
                    }`}
                  >
                    <div className="w-10 text-center shrink-0">
                      <span className={`text-lg font-black ${isCurrentUser ? 'text-[#1cb0f6]' : 'text-slate-400'}`}>#{rankInGlobal}</span>
                    </div>
                    
                    <div className="relative shrink-0">
                      {leader.photoURL ? (
                        <img src={leader.photoURL} alt={leader.displayName} className="w-13 h-13 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-2xs object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-13 h-13 rounded-xl flex items-center justify-center text-lg font-black border-2 border-slate-200 dark:border-slate-700 shadow-2xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:scale-105 transition-transform">
                          {leader.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-800 dark:text-white text-base truncate group-hover:text-[#1cb0f6] transition-colors">
                          {leader.displayName}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[10px] font-black uppercase text-[#1cb0f6] bg-[#e8f7ff] dark:bg-[#1cb0f6]/20 px-2.5 py-0.5 rounded-full border border-[#1cb0f6]/30">
                            Sen
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#1cb0f6]" /> {leader.totalTrials} Sınav Çözdü
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center px-4 py-2 rounded-xl border-2 border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-2xs">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-0.5 text-slate-400">Ort. Net</p>
                        <p className="text-lg font-black font-mono leading-none text-slate-800 dark:text-white">
                          {leader.averageNet.toFixed(2)}
                        </p>
                      </div>
                      {p3 && (
                        <div className="hidden sm:block text-center bg-[#e8f7ff] dark:bg-[#1cb0f6]/15 px-3 py-2 rounded-xl border-2 border-b-2 border-[#1cb0f6]/30">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#1cb0f6]">P3 Puan</p>
                          <p className="font-mono font-black text-[#1cb0f6]">{p3}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <AnimatePresence>
        {selectedUser && (
          <UserProfileModal
            userEntry={selectedUser}
            isOpen={!!selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
