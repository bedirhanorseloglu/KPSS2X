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
    if (!leader) {
      // Boş podyum basamağı (1 veya 2 kullanıcı varken boş slotlar için davetkar kart)
      const rankEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
      const rankColor = rank === 1 ? "text-[#ff9500]" : rank === 2 ? "text-[#1cb0f6]" : "text-[#ff4b4b]";
      return (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay, type: "spring", stiffness: 120 }}
          className="flex flex-col items-center mx-1 sm:mx-3 shrink-0"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center mb-3 bg-slate-50/50 dark:bg-slate-900/50">
            <span className={`text-xl sm:text-2xl font-black ${rankColor}`}>#{rank}</span>
          </div>
          <div className={`w-28 sm:w-36 md:w-40 ${height} rounded-t-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col items-center justify-center p-3 text-center`}>
            <p className="text-[11px] font-black text-slate-400 dark:text-slate-500">Bu sıra boş</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1"></p>
          </div>
        </motion.div>
      );
    }

    const isCurrentUser = user?.uid === leader.userId;
    const emoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
    const p3 = leaderboardType === "genel" && leader.averageNet ? estimateP3Score(leader.averageNet).toFixed(2) : null;

    const rankTheme = rank === 1
      ? {
        border: "border-[#ff9500]",
        borderBottom: "border-b-[#e08400]",
        avatarBorder: "border-[#ff9500]",
        stripe: "bg-[#ff9500]",
        text: "text-[#ff9500]",
        bgGlow: "bg-amber-500/10",
        badgeBg: "bg-amber-500",
        pillBg: "bg-[#fff8ed] dark:bg-amber-500/15"
      }
      : rank === 2
        ? {
          border: "border-[#1cb0f6]",
          borderBottom: "border-b-[#1899d6]",
          avatarBorder: "border-[#1cb0f6]",
          stripe: "bg-[#1cb0f6]",
          text: "text-[#1cb0f6]",
          bgGlow: "bg-blue-500/10",
          badgeBg: "bg-[#1cb0f6]",
          pillBg: "bg-[#e8f7ff] dark:bg-blue-500/15"
        }
        : {
          border: "border-[#ff4b4b]",
          borderBottom: "border-b-[#e03030]",
          avatarBorder: "border-[#ff4b4b]",
          stripe: "bg-[#ff4b4b]",
          text: "text-[#ff4b4b]",
          bgGlow: "bg-red-500/10",
          badgeBg: "bg-[#ff4b4b]",
          pillBg: "bg-[#fff0f0] dark:bg-red-500/15"
        };

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: "spring", stiffness: 100, damping: 15 }}
        onClick={() => setSelectedUser(leader)}
        className="flex flex-col items-center cursor-pointer group relative z-10 mx-1 sm:mx-3 shrink-0"
      >
        {/* Floating Avatar Container */}
        <div className="relative mb-3 flex flex-col items-center">
          <div className={`relative rounded-full p-1 border-4 ${rankTheme.avatarBorder} bg-white dark:bg-slate-800 shadow-md group-hover:scale-105 transition-all duration-300 ${rank === 1 ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-16 h-16 sm:w-20 sm:h-20'}`}>
            {leader.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={leader.photoURL}
                alt={leader.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className={`w-full h-full rounded-full flex items-center justify-center text-xl sm:text-2xl font-black ${rankTheme.text} bg-slate-50 dark:bg-slate-900`}>
                {leader.displayName?.charAt(0)?.toUpperCase() || "K"}
              </div>
            )}

            {/* 3D Circular Medal Badge */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white dark:bg-slate-800 rounded-full border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center absolute -top-2 -right-2 z-30 transform group-hover:scale-115 group-hover:rotate-12 transition-all">
              <AppleEmoji emoji={emoji} size={20} />
            </div>
          </div>

          {/* Current User Pill */}
          {isCurrentUser && (
            <div className="mt-1.5 bg-[#1cb0f6] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full z-30 border-2 border-white dark:border-slate-800 shadow-2xs animate-pulse">
              SEN
            </div>
          )}
        </div>

        {/* 3D Physical Podium Column */}
        <div className={`w-28 sm:w-36 md:w-44 ${height} rounded-t-[2.25rem] flex flex-col items-center justify-between pt-4 pb-5 px-2.5 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden bg-white dark:bg-slate-800`}>
          {/* Top Vibrant Color Cap */}
          <div className={`absolute top-0 left-0 right-0 h-3 ${rankTheme.stripe}`} />

          {/* User Name */}
          <div className="w-full text-center px-1">
            <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white truncate tracking-tight">
              {leader.displayName || "Kullanıcı"}
            </p>
          </div>

          {/* 3D Stat Badge */}
          <div className="w-full flex flex-col items-center gap-1.5 my-auto">
            <div className={`w-full py-2 px-2 rounded-2xl ${rankTheme.pillBg} border-2 border-b-4 ${rankTheme.border} ${rankTheme.borderBottom} shadow-2xs flex flex-col items-center justify-center`}>
              <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider leading-none mb-1">ORT. NET</span>
              <span className={`text-base sm:text-xl font-black font-mono leading-none ${rankTheme.text}`}>
                {typeof leader.averageNet === 'number' ? leader.averageNet.toFixed(1) : leader.averageNet}
              </span>
            </div>

            {p3 && (
              <div className="px-2.5 py-0.5 rounded-xl text-[10px] font-black text-[#1cb0f6] bg-[#e8f7ff] dark:bg-[#1cb0f6]/10 border border-[#1cb0f6]/30 shadow-2xs">
                P3: {p3}
              </div>
            )}
          </div>

          {/* Exam count */}
          <div className="text-[10px] font-bold text-slate-400 tracking-tight">
            {leader.totalTrials} Deneme
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Background Soft Glow Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1cb0f6]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff9500]/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/2 pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
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
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 w-fit shadow-xs gap-1 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setLeaderboardType("genel")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${leaderboardType === "genel"
                ? "bg-white dark:bg-slate-800 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-[#1cb0f6] shadow-xs active:translate-y-0.5"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
            >
              Genel Deneme
            </button>
            <button
              type="button"
              onClick={() => setLeaderboardType("brans")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${leaderboardType === "brans"
                ? "bg-white dark:bg-slate-800 border-2 border-b-4 border-[#af52de] border-b-[#963ec7] text-[#af52de] shadow-xs active:translate-y-0.5"
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
                className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-black transition-all snap-start flex items-center gap-2.5 cursor-pointer active:translate-y-0.5 ${selectedBranch === subject.id
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
            {/* Top 3 Tournament Podium (Rank 2 Left, Rank 1 Center Tallest, Rank 3 Right) */}
            <div className="relative z-10 flex justify-center items-end gap-1 sm:gap-4 mb-14 mt-6 min-h-[300px] px-1 overflow-x-auto no-scrollbar">
              <PodiumBlock leader={top3[1]} rank={2} height="h-44 sm:h-52" delay={0.2} />
              <PodiumBlock leader={top3[0]} rank={1} height="h-56 sm:h-64" delay={0.1} />
              <PodiumBlock leader={top3[2]} rank={3} height="h-36 sm:h-44" delay={0.3} />
            </div>

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
                    className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 border-b-4 transition-all cursor-pointer group hover:-translate-y-0.5 ${isCurrentUser
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
