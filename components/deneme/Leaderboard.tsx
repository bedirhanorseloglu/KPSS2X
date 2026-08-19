"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, TrendingUp, Trophy } from "lucide-react";
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

  const top3 = [leaders[0] || null, leaders[1] || null, leaders[2] || null];
  const others = leaders.slice(3);

  const PodiumBlock = ({ leader, rank, height, delay }: { leader: LeaderboardEntry | null; rank: 1 | 2 | 3; height: string; delay: number }) => {
    const isRank1 = rank === 1;
    const isRank2 = rank === 2;
    const isRank3 = rank === 3;

    const rankTheme = isRank1
      ? {
        name: "Altın",
        emoji: "🥇",
        crownEmoji: "👑",
        color: "#ff9500",
        border: "border-[#ff9500]",
        borderBottom: "border-b-[#d97706]",
        avatarBorder: "border-[#ff9500]",
        ringGlow: "ring-4 ring-[#ff9500]/30 shadow-lg shadow-[#ff9500]/25",
        capGradient: "bg-gradient-to-r from-[#ff9500] via-[#ffb03a] to-[#d97706]",
        text: "text-[#ff9500]",
        bgGlow: "from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/15 dark:via-slate-900/80 dark:to-slate-800",
        pillBg: "bg-amber-50 dark:bg-amber-500/15 border-[#ff9500]/40",
      }
      : isRank2
        ? {
          name: "Gümüş",
          emoji: "🥈",
          crownEmoji: null,
          color: "#1cb0f6",
          border: "border-[#1cb0f6]",
          borderBottom: "border-b-[#0284c7]",
          avatarBorder: "border-[#1cb0f6]",
          ringGlow: "ring-4 ring-[#1cb0f6]/30 shadow-lg shadow-[#1cb0f6]/20",
          capGradient: "bg-gradient-to-r from-[#1cb0f6] via-[#38bdf8] to-[#0284c7]",
          text: "text-[#1cb0f6]",
          bgGlow: "from-sky-500/10 via-sky-500/5 to-transparent dark:from-sky-500/15 dark:via-slate-900/80 dark:to-slate-800",
          pillBg: "bg-sky-50 dark:bg-sky-500/15 border-[#1cb0f6]/40",
        }
        : {
          name: "Bronz",
          emoji: "🥉",
          crownEmoji: null,
          color: "#af52de",
          border: "border-[#af52de]",
          borderBottom: "border-b-[#9333ea]",
          avatarBorder: "border-[#af52de]",
          ringGlow: "ring-4 ring-[#af52de]/30 shadow-lg shadow-[#af52de]/20",
          capGradient: "bg-gradient-to-r from-[#af52de] via-[#c084fc] to-[#9333ea]",
          text: "text-[#af52de]",
          bgGlow: "from-purple-500/10 via-purple-500/5 to-transparent dark:from-purple-500/15 dark:via-slate-900/80 dark:to-slate-800",
          pillBg: "bg-purple-50 dark:bg-purple-500/15 border-[#af52de]/40",
        };

    if (!leader) {
      // Boş podyum basamağı için 3D Kürsüye Çık kartı
      return (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay, type: "spring", stiffness: 120 }}
          className="flex flex-col items-center mx-1 sm:mx-3 shrink-0 group"
        >
          {/* Avatar Yuvası */}
          <div className="relative mb-3 pt-2 flex flex-col items-center">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-100/60 dark:bg-slate-900/60 shadow-inner group-hover:scale-105 transition-transform`}>
              <span className={`text-xl sm:text-2xl font-black ${rankTheme.text}`}>#{rank}</span>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white dark:bg-slate-800 rounded-full border-2 border-b-2 border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center absolute bottom-0 z-20">
              <AppleEmoji emoji={rankTheme.emoji} size={16} />
            </div>
          </div>

          {/* 3D Boş Podyum Sütunu */}
          <div className={`w-28 sm:w-36 md:w-44 ${height} rounded-t-[2.25rem] border-2 border-b-4 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 flex flex-col items-center justify-between p-3.5 text-center transition-all`}>
            <div className="w-full text-center mt-2">
              <span className="text-[11px] sm:text-xs font-black text-slate-500 dark:text-slate-400 block tracking-tight">
                Kürsüye Çık!
              </span>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 block">
                Sıradaki Şampiyon Sen Ol
              </span>
            </div>

            <div className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-b-2 border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <span>Deneme Çöz</span>
              </span>
            </div>
          </div>
        </motion.div>
      );
    }

    const isCurrentUser = user?.uid === leader.userId;
    const p3 = leaderboardType === "genel" && leader.averageNet ? estimateP3Score(leader.averageNet).toFixed(2) : null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: "spring", stiffness: 120, damping: 14 }}
        onClick={() => setSelectedUser(leader)}
        className="flex flex-col items-center cursor-pointer group relative z-10 mx-1 sm:mx-3 shrink-0"
      >
        {/* Floating Avatar & Crown Container */}
        <div className={`relative mb-3 flex flex-col items-center ${isRank1 ? 'pt-7' : 'pt-2'}`}>

          {/* 1. Sıra İçin 3D Altın Taç */}
          {isRank1 && (
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 z-30 drop-shadow-md"
            >
              <AppleEmoji emoji="👑" size={26} />
            </motion.div>
          )}

          {/* Avatar Ring */}
          <div className={`relative rounded-full p-1 border-4 ${rankTheme.avatarBorder} ${rankTheme.ringGlow} bg-white dark:bg-slate-800 group-hover:scale-105 transition-all duration-300 ${isRank1 ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-16 h-16 sm:w-20 sm:h-20'}`}>
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
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white dark:bg-slate-800 rounded-full border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center absolute -bottom-1 -right-1 z-30 transform group-hover:scale-115 group-hover:rotate-6 transition-all">
              <AppleEmoji emoji={rankTheme.emoji} size={20} />
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
        <div className={`w-28 sm:w-36 md:w-44 ${height} rounded-t-[2.25rem] flex flex-col items-center justify-between pt-4 pb-4 px-2.5 border-2 border-b-6 border-slate-200 dark:border-slate-700 shadow-md transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden bg-gradient-to-b ${rankTheme.bgGlow} bg-white dark:bg-slate-800`}>

          {/* Top Metallic Cap Strip */}
          <div className={`absolute top-0 left-0 right-0 h-3.5 ${rankTheme.capGradient} shadow-xs`} />

          {/* User Name */}
          <div className="w-full text-center px-1 mt-1">
            <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white truncate tracking-tight">
              {leader.displayName || "Kullanıcı"}
            </p>
          </div>

          {/* 3D Stat Badge */}
          <div className="w-full flex flex-col items-center gap-1.5 my-auto">
            <div className={`w-full py-2 px-2 rounded-2xl ${rankTheme.pillBg} border-2 border-b-4 ${rankTheme.border} ${rankTheme.borderBottom} shadow-2xs flex flex-col items-center justify-center`}>
              <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider leading-none mb-1">
                ORT. NET
              </span>
              <span className={`text-base sm:text-2xl font-black font-mono leading-none ${rankTheme.text}`}>
                {typeof leader.averageNet === 'number' ? leader.averageNet.toFixed(1) : leader.averageNet}
              </span>
            </div>

            {p3 && (
              <div className="px-2.5 py-0.5 rounded-xl text-[10px] font-black text-[#ff9500] bg-amber-50 dark:bg-amber-500/15 border border-[#ff9500]/30 shadow-2xs">
                P3: {p3}
              </div>
            )}
          </div>

          {/* Exam count */}
          <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-tight bg-slate-100/80 dark:bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            {leader.totalTrials} Deneme
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 p-6 sm:p-10 shadow-lg relative overflow-hidden">

        {/* Background Soft Glow Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1cb0f6]/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff9500]/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/2 pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-[1.5rem] bg-[#fff8ed] dark:bg-amber-500/10 border-2 border-b-4 border-[#ff9500] border-b-[#e08400] flex items-center justify-center shadow-xs shrink-0 group hover:scale-105 transition-transform">
              <AppleEmoji emoji="🏆" size={34} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Şampiyonlar Ligi</h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-[#ff9500] border border-[#ff9500]/30">
                  TOP 50
                </span>
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">
                {leaderboardType === "genel" ? "Türkiye Geneli KPSS Sıralaması" : "Branş Bazlı Sıralama Arenası"}
              </p>
            </div>
          </div>

          {/* 3D Segmented Control Tab Switcher */}
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 w-fit shadow-xs gap-1.5 self-start md:self-auto relative">
            <button
              type="button"
              onClick={() => setLeaderboardType("genel")}
              className={`relative px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer z-10 ${leaderboardType === "genel" ? "text-[#1cb0f6]" : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
            >
              {leaderboardType === "genel" && (
                <motion.div
                  layoutId="leaderboardTabBg"
                  className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Genel Deneme</span>
            </button>
            <button
              type="button"
              onClick={() => setLeaderboardType("brans")}
              className={`relative px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer z-10 ${leaderboardType === "brans" ? "text-[#af52de]" : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
            >
              {leaderboardType === "brans" && (
                <motion.div
                  layoutId="leaderboardTabBg"
                  className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl border-2 border-b-4 border-[#af52de] border-b-[#963ec7] shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Branş</span>
            </button>
          </div>
        </div>

        {/* 3D Branş Subject Filter Bar */}
        {leaderboardType === "brans" && (
          <div className="mb-8 flex gap-2.5 p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs relative z-10 overflow-x-auto no-scrollbar snap-x">
            {DENEME_SUBJECTS.map((subject) => {
              const isSelected = selectedBranch === subject.id;
              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => setSelectedBranch(subject.id)}
                  className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-black transition-all snap-start flex items-center gap-2.5 cursor-pointer border-2 border-b-4 active:translate-y-0.5 ${
                    isSelected
                      ? "text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                  style={isSelected ? {
                    backgroundColor: subject.color,
                    borderColor: subject.color,
                    borderBottomColor: "rgba(0,0,0,0.35)",
                  } : {}}
                >
                  <AppleEmoji emoji={subject.icon} size={18} color={isSelected ? "white" : subject.color} />
                  <span>{subject.title}</span>
                </button>
              );
            })}
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
            <div className="relative z-10 flex justify-center items-end gap-2 sm:gap-5 mb-14 mt-4 pt-10 pb-4 min-h-[340px] px-2 overflow-x-auto no-scrollbar">
              <PodiumBlock leader={top3[1]} rank={2} height="h-48 sm:h-56" delay={0.2} />
              <PodiumBlock leader={top3[0]} rank={1} height="h-60 sm:h-72" delay={0.1} />
              <PodiumBlock leader={top3[2]} rank={3} height="h-40 sm:h-48" delay={0.3} />
            </div>

            {/* Other Rankings List */}
            {others.length > 0 && (
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2 px-2 pb-2">
                  <AppleEmoji emoji="📜" size={16} />
                  <h5 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Diğer Sıralamalar (#{4} - #{leaders.length})
                  </h5>
                </div>

                {others.map((leader, idx) => {
                  const isCurrentUser = user?.uid === leader.userId;
                  const rankInGlobal = idx + 4;
                  const p3 = leaderboardType === "genel" ? estimateP3Score(leader.averageNet).toFixed(2) : null;

                  return (
                    <motion.div
                      key={leader.userId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (idx * 0.04) + 0.2 }}
                      onClick={() => setSelectedUser(leader)}
                      className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 border-b-4 transition-all cursor-pointer group hover:-translate-y-0.5 ${isCurrentUser
                          ? "bg-[#e8f7ff] dark:bg-blue-500/10 border-[#1cb0f6] border-b-[#1899d6] shadow-xs"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#1cb0f6] shadow-xs"
                        }`}
                    >
                      {/* Rank Chip */}
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/60 border-2 border-b-2 border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0">
                        <span className={`text-base font-black font-mono ${isCurrentUser ? 'text-[#1cb0f6]' : 'text-slate-500 dark:text-slate-400'}`}>
                          #{rankInGlobal}
                        </span>
                      </div>

                      {/* User Avatar */}
                      <div className="relative shrink-0">
                        {leader.photoURL ? (
                          <img src={leader.photoURL} alt={leader.displayName} className="w-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-2xs object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black border-2 border-slate-200 dark:border-slate-700 shadow-2xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:scale-105 transition-transform">
                            {leader.displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Name & Stats */}
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
                          <BookOpen className="w-3.5 h-3.5 text-[#1cb0f6]" /> {leader.totalTrials} Deneme Çözdü
                        </p>
                      </div>

                      {/* Score Badges */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-center px-4 py-2 rounded-xl border-2 border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-2xs">
                          <p className="text-[10px] font-black uppercase tracking-widest mb-0.5 text-slate-400">Ort. Net</p>
                          <p className="text-lg font-black font-mono leading-none text-slate-800 dark:text-white">
                            {leader.averageNet.toFixed(2)}
                          </p>
                        </div>
                        {p3 && (
                          <div className="hidden sm:block text-center bg-[#fff8ed] dark:bg-amber-500/15 px-3 py-2 rounded-xl border-2 border-b-2 border-[#ff9500]/40">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#ff9500]">P3 Puan</p>
                            <p className="font-mono font-black text-[#ff9500]">{p3}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
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
