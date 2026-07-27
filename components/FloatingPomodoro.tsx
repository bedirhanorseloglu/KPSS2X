"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Users, Play, Pause, RotateCcw, X, Coffee, Brain, Settings2, Target, Clock, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updatePresence, getOnlineUsersCount } from "@/lib/firebaseService";
import AppleEmoji from "@/components/AppleEmoji";

type Mode = "focus" | "break" | "stopwatch";

export default function FloatingPomodoro() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [mode, setMode] = useState<Mode>("stopwatch");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [isFinishedAlert, setIsFinishedAlert] = useState(false);
  const [lapsCompleted, setLapsCompleted] = useState(0);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(240);
  
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [totalBreakMinutes, setTotalBreakMinutes] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsElapsedRef = useRef(0);
  const isInitializedRef = useRef(false);
  const lastTickRef = useRef(Date.now());
  
  // Gece 04:00'a kadar olan çalışmaları önceki güne say (Öğrenci dostu gün atlama mantığı)
  const getStudyDay = () => {
    const now = new Date();
    if (now.getHours() < 4) {
      now.setDate(now.getDate() - 1);
    }
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };
  const currentStudyDayRef = useRef(getStudyDay());

  const updateHistory = (dayStr: string, focusMins: number) => {
    try {
      const historyRaw = localStorage.getItem("pomodoro_history");
      const history = historyRaw ? JSON.parse(historyRaw) : {};
      history[dayStr] = focusMins;
      localStorage.setItem("pomodoro_history", JSON.stringify(history));
      // Dispatch event to notify other components (like DailyPlanView)
      window.dispatchEvent(new CustomEvent("pomodoro_update", { detail: { date: dayStr, focus: focusMins } }));
    } catch (e) {
      console.error(e);
    }
  };

  const [isRestored, setIsRestored] = useState(false);
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);
  const [earnedBreakData, setEarnedBreakData] = useState<{workedMins: number, earnedMins: number} | null>(null);
  const [bankingAnim, setBankingAnim] = useState(false);
  const [displayTotalFocus, setDisplayTotalFocus] = useState(totalFocusMinutes);

  useEffect(() => {
    setDisplayTotalFocus(totalFocusMinutes);
  }, [totalFocusMinutes]);

  useEffect(() => {
    if (earnedBreakData) {
      setDisplayTotalFocus(Math.max(0, totalFocusMinutes - earnedBreakData.workedMins));
      const timer1 = setTimeout(() => {
        setBankingAnim(true);
        setDisplayTotalFocus(totalFocusMinutes);
      }, 600);
      const timer2 = setTimeout(() => {
        setBankingAnim(false);
      }, 2500);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    } else {
      setDisplayTotalFocus(totalFocusMinutes);
      setBankingAnim(false);
    }
  }, [earnedBreakData]);

  // Initialize timer with local storage values if present
  useEffect(() => {
    const savedFocus = localStorage.getItem("pomodoro_focus");
    const savedBreak = localStorage.getItem("pomodoro_break");
    const savedGoal = localStorage.getItem("pomodoro_daily_goal");
    
    if (savedFocus) setFocusDuration(parseInt(savedFocus));
    if (savedBreak) setBreakDuration(parseInt(savedBreak));
    if (savedGoal) setDailyGoalMinutes(parseInt(savedGoal));

    // Günlük Sıfırlama Mantığı (Daily Reset)
    const todayStr = getStudyDay();
    const savedDate = localStorage.getItem("pomodoro_last_date");
    
    if (savedDate !== todayStr) {
      // Yeni gün! Eski verileri sıfırla
      localStorage.setItem("pomodoro_last_date", todayStr);
      localStorage.setItem("pomodoro_total_focus", "0");
      localStorage.setItem("pomodoro_total_break", "0");
      localStorage.setItem("pomodoro_laps", "0");
    } else {
      // Aynı gün, verileri yükle
      const savedTotalFocus = localStorage.getItem("pomodoro_total_focus");
      const savedTotalBreak = localStorage.getItem("pomodoro_total_break");
      const savedLaps = localStorage.getItem("pomodoro_laps");
      
      if (savedTotalFocus) setTotalFocusMinutes(parseInt(savedTotalFocus));
      if (savedTotalBreak) setTotalBreakMinutes(parseInt(savedTotalBreak));
      if (savedLaps) setLapsCompleted(parseInt(savedLaps));
    }

    // Restore timer state
    const savedIsActive = localStorage.getItem("pomodoro_is_active") === "true";
    const savedMode = localStorage.getItem("pomodoro_mode") as Mode;
    const actualMode = savedMode === "focus" ? "stopwatch" : (savedMode || "stopwatch");
    setMode(actualMode);
    
    // Set time left based on the resolved mode
    const savedTime = localStorage.getItem("pomodoro_time_left");
    let initialTimeLeft = savedTime ? parseInt(savedTime, 10) : (actualMode === "stopwatch" ? 0 : parseInt(savedBreak || "5") * 60);

    if (savedIsActive) {
      const savedLastTick = localStorage.getItem("pomodoro_last_tick");
      if (savedLastTick) {
        const elapsedSeconds = Math.floor((Date.now() - parseInt(savedLastTick)) / 1000);
        if (actualMode === "stopwatch") {
          initialTimeLeft += elapsedSeconds;
        } else {
          initialTimeLeft = Math.max(0, initialTimeLeft - elapsedSeconds);
        }
      }
    }

    setTimeLeft(initialTimeLeft);
    setIsActive(savedIsActive);
    lastTickRef.current = Date.now();
    setIsRestored(true); 
  }, []);

  useEffect(() => {
    if (!isRestored) return; 
    localStorage.setItem("pomodoro_time_left", timeLeft.toString());
    localStorage.setItem("pomodoro_is_active", isActive.toString());
    localStorage.setItem("pomodoro_mode", mode);
    localStorage.setItem("pomodoro_last_tick", Date.now().toString());
  }, [timeLeft, isActive, mode, isRestored]);

  const saveSettings = (f: number, b: number) => {
    setFocusDuration(f);
    setBreakDuration(b);
    localStorage.setItem("pomodoro_focus", f.toString());
    localStorage.setItem("pomodoro_break", b.toString());
  };

  // Real-time online user tracking
  useEffect(() => {
    if (!user?.uid) return; 
    const trackPresence = async () => {
      await updatePresence(user.uid);
      const count = await getOnlineUsersCount();
      setOnlineUsers(count);
    };
    
    trackPresence();
    const interval = setInterval(trackPresence, 240000); // Kota dostu: 4 dakikada bir güncelle
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (isActive && (timeLeft > 0 || mode === "stopwatch")) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const deltaMs = now - lastTickRef.current;
        const deltaSeconds = Math.floor(deltaMs / 1000);

        if (deltaSeconds >= 1) {
          // Gece yarısı / Yeni gün kontrolü
          const currentDay = getStudyDay();
          if (currentDay !== currentStudyDayRef.current) {
             currentStudyDayRef.current = currentDay;
             localStorage.setItem("pomodoro_last_date", currentDay);
             localStorage.setItem("pomodoro_total_focus", "0");
             localStorage.setItem("pomodoro_total_break", "0");
             localStorage.setItem("pomodoro_laps", "0");
             setTotalFocusMinutes(0);
             setTotalBreakMinutes(0);
             setLapsCompleted(0);
          }

          secondsElapsedRef.current += deltaSeconds;
          if (secondsElapsedRef.current >= 60) {
             const earnedMins = Math.floor(secondsElapsedRef.current / 60);
             secondsElapsedRef.current = secondsElapsedRef.current % 60;
             if (mode === "stopwatch") {
                setTotalFocusMinutes(prev => {
                  const newVal = prev + earnedMins;
                  localStorage.setItem("pomodoro_total_focus", newVal.toString());
                  updateHistory(currentStudyDayRef.current, newVal);
                  return newVal;
                });
             } else {
                setTotalBreakMinutes(prev => {
                  const newVal = prev + earnedMins;
                  localStorage.setItem("pomodoro_total_break", newVal.toString());
                  return newVal;
                });
             }
          }
          
          lastTickRef.current = now - (deltaMs % 1000);

          setTimeLeft(prev => {
             if (mode === "stopwatch") {
                 return prev + deltaSeconds;
             } else {
                 return prev > deltaSeconds ? prev - deltaSeconds : 0;
             }
          });
        }
      }, 500);
    } else if (timeLeft === 0 && isActive && mode !== "stopwatch") {
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
      audio.volume = 1.0; 
      audio.play().catch(e => console.log("Otomatik ses çalma tarayıcı tarafından engellendi", e));
      
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 3000);
      
      setIsFinishedAlert(true);
      secondsElapsedRef.current = 0;
      setMode("stopwatch");
      setTimeLeft(0);
      setIsActive(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, focusDuration, breakDuration]);

  const toggleTimer = () => {
    if (!isActive) {
      lastTickRef.current = Date.now();
    }
    setIsActive(!isActive);
    setIsFinishedAlert(false);
  };
  const resetTimer = () => {
    setIsActive(false);
    setIsFinishedAlert(false);
    secondsElapsedRef.current = 0;
    setTimeLeft(mode === "stopwatch" ? 0 : breakDuration * 60);
  };

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    setIsFinishedAlert(false);
    secondsElapsedRef.current = 0;
    setTimeLeft(newMode === "stopwatch" ? 0 : breakDuration * 60);
  };

  const requestModeChange = (newMode: Mode) => {
    if (mode === newMode) return;
    
    let isAborting = false;
    if (mode === "stopwatch" && timeLeft > 0) isAborting = true;

    if (isAborting && !isFinishedAlert) {
      setPendingMode(newMode);
    } else {
      if (mode === "stopwatch" && newMode === "break") {
         const workedMins = Math.floor(timeLeft / 60);
         if (workedMins >= 1) {
            const earnedMins = Math.max(1, Math.round(workedMins * (breakDuration / focusDuration)));
            setEarnedBreakData({ workedMins, earnedMins });
            return;
         }
      }
      changeMode(newMode);
    }
  };

  const getStopwatchColor = (seconds: number) => {
    return { text: "text-[#1cb0f6]", textDark: "dark:text-[#1cb0f6]", bg: "bg-[#1cb0f6]", glow: "bg-[#1cb0f6]/50", shadow: "shadow-[#1cb0f6]/40" };
  };

  const swColor = getStopwatchColor(mode === "stopwatch" ? timeLeft : 0);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const displayHours = Math.floor(timeLeft / 3600);
  const displayMinutes = Math.floor((timeLeft % 3600) / 60);
  const displaySeconds = timeLeft % 60;
  
  let formatTime = "";
  if (mode === "stopwatch") {
    formatTime = displayHours > 0 
      ? `${displayHours.toString().padStart(2, '0')}:${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`
      : `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
  } else {
    formatTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  let progress = 0;
  if (mode === "stopwatch") {
    progress = (timeLeft % 3600) / 3600 * 100; // 1 saatte tamamlanır
  } else {
    const totalSeconds = breakDuration * 60;
    progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  }
  
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const totalMinutesAll = totalFocusMinutes + totalBreakMinutes;
  const efficiencyScore = totalMinutesAll > 0 ? Math.round((totalFocusMinutes / totalMinutesAll) * 100) : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isFinishedAlert) {
      let toggle = false;
      interval = setInterval(() => {
        document.title = toggle ? "🚨 SÜRE BİTTİ! · KPSS 2026" : "⚠️ ZAMAN DOLDU · KPSS 2026";
        toggle = !toggle;
      }, 1000);
      document.title = "🚨 SÜRE BİTTİ! · KPSS 2026";
    } else if (isActive) {
      document.title = `${mode === 'stopwatch' ? '⏱️' : '☕'} ${formatTime} · ${mode === 'stopwatch' ? 'Kronometre' : 'Mola Vakti'} | KPSS 2026`;
    } else {
      document.title = "KPSS 2026 Komuta Merkezi";
    }

    return () => {
      if (interval) clearInterval(interval);
      document.title = "KPSS 2026 Komuta Merkezi";
    };
  }, [isActive, formatTime, isFinishedAlert, mode]);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center group"
          >
            {/* Main 3D Floating Pill Button */}
            <div
              onClick={() => { setIsOpen(true); setIsFinishedAlert(false); }}
              className={`relative overflow-hidden flex items-center gap-3 px-4 py-2.5 rounded-full border-2 border-b-4 transition-all duration-300 cursor-pointer shadow-lg active:translate-y-0.5 ${
                isActive
                  ? (mode === 'stopwatch' 
                      ? "bg-white dark:bg-slate-900 border-[#1cb0f6] border-b-[#1899d6] text-slate-800 dark:text-white" 
                      : "bg-white dark:bg-slate-900 border-[#58cc02] border-b-[#46a302] text-slate-800 dark:text-white")
                  : "bg-white dark:bg-slate-800 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 text-slate-800 dark:text-white hover:border-[#1cb0f6]"
              }`}
            >
              {/* Ultra-Sleek Bottom Progress Line Bar when Active */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      mode === 'stopwatch' ? 'bg-[#1cb0f6]' : 'bg-[#58cc02]'
                    }`} 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              )}

              {/* Expand Chevron Icon Button */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                isActive 
                  ? (mode === 'stopwatch'
                      ? "bg-[#e8f7ff] dark:bg-slate-800 border-[#1cb0f6]/30 text-[#1cb0f6] group-hover:bg-[#1cb0f6] group-hover:text-white group-hover:border-[#1cb0f6]"
                      : "bg-[#e5f9e7] dark:bg-slate-800 border-[#58cc02]/30 text-[#58cc02] group-hover:bg-[#58cc02] group-hover:text-white group-hover:border-[#58cc02]")
                  : "bg-slate-100 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 group-hover:border-[#1cb0f6] group-hover:text-[#1cb0f6]"
              }`}>
                <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" strokeWidth={3} />
              </div>

              {/* Live Status Pulse & Vector Emoji */}
              <div className="relative flex items-center justify-center shrink-0">
                <AppleEmoji emoji={mode === 'break' ? '☕' : '⏱️'} size={22} />
                {isActive && (
                  <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping border-2 border-white dark:border-slate-900 ${
                    mode === 'stopwatch' ? 'bg-[#1cb0f6]' : 'bg-[#58cc02]'
                  }`} />
                )}
              </div>
              
              {/* Time & Title Readout */}
              <div className="relative z-10 flex flex-col items-start justify-center">
                <div className="flex items-center gap-2">
                  <span className={`text-xs sm:text-sm font-black tracking-wider uppercase ${
                    isActive 
                      ? (mode === 'stopwatch' ? 'font-mono text-[#1cb0f6] text-base leading-none' : 'font-mono text-[#58cc02] text-base leading-none') 
                      : 'text-slate-800 dark:text-white'
                  }`}>
                    {isFinishedAlert ? 'Süre Bitti!' : (isActive ? formatTime : (mode === 'stopwatch' ? 'KRONOMETRE' : 'MOLA'))}
                  </span>
                </div>
                {totalFocusMinutes > 0 && (
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest hidden sm:block mt-0.5">
                    {Math.floor(displayTotalFocus / 60)}s {displayTotalFocus % 60}dk Çalışıldı
                  </span>
                )}
              </div>

              {/* Quick Play/Pause Mini Action Button on Pill */}
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTimer();
                }}
                className={`ml-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-b-2 transition-all cursor-pointer shadow-2xs hover:scale-110 active:scale-95 ${
                  isActive
                    ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white'
                    : 'bg-[#e8f7ff] dark:bg-[#1cb0f6]/20 border-[#1cb0f6]/40 text-[#1cb0f6] hover:bg-[#1cb0f6] hover:text-white'
                }`}
                title={isActive ? "Duraklat" : "Başlat"}
              >
                {isActive ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[380px] bg-white dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden transition-colors duration-300"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-6 pb-2">
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-[#58cc02]/20 px-3.5 py-1.5 rounded-xl border-2 border-b-2 border-emerald-200 dark:border-[#58cc02]/30 shadow-2xs">
                <div className="relative flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-[#58cc02] rounded-full animate-pulse absolute" />
                  <div className="w-2.5 h-2.5 bg-[#58cc02] rounded-full" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#58cc02]">
                  Canlı Çalışma
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 border-b-2 transition-all shadow-2xs active:translate-y-0.5 cursor-pointer ${
                    showSettings 
                      ? 'bg-[#1cb0f6] text-white border-[#1cb0f6] border-b-[#1899d6]' 
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 border-b-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#1cb0f6]'
                  }`}
                  title="Ayarlar"
                >
                  <Settings2 className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <button 
                  type="button"
                  onClick={() => { setIsOpen(false); setShowSettings(false); }}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-b-2 border-slate-200 border-b-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#ff4b4b] active:translate-y-0.5 transition-all shadow-2xs cursor-pointer"
                  title="Kapat"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="p-6 pt-4 relative overflow-hidden">
              <AnimatePresence>
                {pendingMode && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
                  >
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xl w-full transform transition-all">
                      <div className="flex items-start gap-3.5">
                        <div className={`w-12 h-12 rounded-2xl border-2 border-b-4 flex items-center justify-center shrink-0 shadow-2xs ${
                          mode === "stopwatch" 
                            ? "bg-[#e8f7ff] dark:bg-[#1cb0f6]/20 border-[#1cb0f6] border-b-[#1899d6]" 
                            : "bg-[#fff7e6] dark:bg-[#ff9500]/20 border-[#ff9500] border-b-[#e08400]"
                        }`}>
                          <AppleEmoji emoji={mode === "stopwatch" ? "⏱️" : "☕"} size={24} />
                        </div>
                        <div className="pt-0.5 min-w-0">
                          <h4 className="text-base font-black text-slate-800 dark:text-white mb-1 tracking-tight leading-tight">
                             {mode === "stopwatch" ? "Dersi bitirmek ister misin?" : "Seansı İptal Et?"}
                          </h4>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                             {mode === "stopwatch" ? "Mevcut çalışmanız sonlandırılıp molaya geçilecek." : "Mevcut seansınız henüz tamamlanmadı. Yeni moda geçerseniz bu seans iptal edilecek."}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 mt-6">
                        <button 
                          type="button"
                          onClick={() => setPendingMode(null)}
                          className="flex-1 py-3 px-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white font-black text-[11px] uppercase tracking-wider rounded-2xl border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-600 dark:border-b-slate-700 shadow-2xs hover:border-[#1cb0f6] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <span>{mode === "stopwatch" ? "Devam Et" : "Vazgeç"}</span>
                          {mode === "stopwatch" && <AppleEmoji emoji="🚀" size={15} />}
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            if (mode === "stopwatch" && pendingMode === "break") {
                                const workedMins = Math.floor(timeLeft / 60);
                                if (workedMins >= 1) {
                                    const earnedMins = Math.max(1, Math.round(workedMins * (breakDuration / focusDuration)));
                                    setEarnedBreakData({ workedMins, earnedMins });
                                    setPendingMode(null);
                                    return;
                                }
                            }
                            if (pendingMode) changeMode(pendingMode);
                            setPendingMode(null);
                          }}
                          className="flex-1 py-3 px-2 bg-[#ff9500] hover:bg-[#e08400] text-white font-black text-[11px] uppercase tracking-wider rounded-2xl border-2 border-b-4 border-[#ff9500] border-b-[#e08400] shadow-xs active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <span>{mode === "stopwatch" ? "Molaya Çık" : "Yine de Geç"}</span>
                          {mode === "stopwatch" && <AppleEmoji emoji="☕" size={15} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {earnedBreakData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
                  >
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xl w-full text-center flex flex-col items-center">
                       <motion.div 
                         initial={{ scale: 0, y: 10 }}
                         animate={{ scale: 1, y: 0 }}
                         transition={{ type: "spring", stiffness: 300, damping: 20 }}
                         className="w-20 h-20 rounded-2xl bg-[#e5f9e7] dark:bg-[#58cc02]/20 border-2 border-b-4 border-[#58cc02] flex items-center justify-center shadow-2xs mb-4"
                       >
                         <AppleEmoji emoji="💎" size={36} />
                       </motion.div>
                       
                       <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Harika İş!</h3>
                       
                       <div className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mb-6">
                          Tam <span className="font-mono font-black text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600">{earnedBreakData.workedMins} dk</span> odaklandınız. 
                          <div className="mt-2.5 mb-1 flex items-center justify-center gap-1.5">
                            <span className="px-3 py-1 rounded-xl bg-[#58cc02] text-white font-black font-mono border-2 border-b-2 border-[#46a302] shadow-2xs text-xs uppercase tracking-wider inline-flex items-center gap-1.5">
                              <AppleEmoji emoji="☕" size={16} />
                              <span>{earnedBreakData.earnedMins} DAKİKA</span>
                            </span>
                          </div>
                          <span>mola kazandınız!</span>
                       </div>

                       <div className="w-full space-y-2.5">
                         <button 
                           type="button"
                           onClick={() => {
                             changeMode("break");
                             setTimeLeft(earnedBreakData.earnedMins * 60);
                             setEarnedBreakData(null);
                             lastTickRef.current = Date.now();
                             setIsActive(true);
                           }}
                           className="w-full py-3.5 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase tracking-widest rounded-2xl border-2 border-b-4 border-[#58cc02] border-b-[#46a302] active:translate-y-0.5 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                         >
                           <AppleEmoji emoji="☕" size={16} />
                           <span>ÖDÜL MOLASINI BAŞLAT</span>
                         </button>
                         
                         <button 
                           type="button"
                           onClick={() => {
                             changeMode("break");
                             setEarnedBreakData(null);
                           }}
                           className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 font-black text-xs uppercase tracking-widest rounded-2xl border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-600 dark:border-b-slate-700 active:translate-y-0.5 shadow-2xs transition-all cursor-pointer"
                         >
                           STANDART MOLA ({breakDuration} DK)
                         </button>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {showSettings ? (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-100 dark:border-slate-700/60">
                      <AppleEmoji emoji="⚙️" size={20} />
                      <h3 className="text-base font-black text-slate-800 dark:text-white tracking-tight">Ayarlar</h3>
                    </div>

                    <div className="space-y-4">
                      {/* Ödül Oranı Çarpanı */}
                      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-200 mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <AppleEmoji emoji="⚡" size={16} />
                            <span>Ödül Oranı Çarpanı (dk)</span>
                          </span>
                        </label>
                        <input 
                          type="number" 
                          value={focusDuration}
                          onChange={(e) => setFocusDuration(Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-mono font-black text-base outline-none focus:border-[#1cb0f6] shadow-2xs transition-all"
                          min="1"
                        />
                        <p className="text-[10px] font-bold text-slate-400 mt-2 leading-tight">
                          Bu süreye karşılık yandaki mola kazanılır (Örn: {focusDuration} dk çalış = {breakDuration} dk mola hak et)
                        </p>
                      </div>
                      
                      {/* Mola Süresi Slider */}
                      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-200 mb-3">
                          <span className="flex items-center gap-2">
                            <AppleEmoji emoji="☕" size={18} />
                            <span>Mola Süresi</span>
                          </span>
                          <span className="bg-[#fff8ed] dark:bg-[#ff9500]/20 text-[#ff9500] border-2 border-b-2 border-[#ff9500]/40 px-3 py-1 rounded-xl text-xs font-mono font-black shadow-2xs">
                            {breakDuration} dk
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="1" max="30" step="1"
                          value={breakDuration}
                          onChange={(e) => saveSettings(focusDuration, parseInt(e.target.value))}
                          className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#ff9500]"
                        />
                      </div>

                      {/* Günlük Hedef Slider */}
                      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-200 mb-3">
                          <span className="flex items-center gap-2">
                            <AppleEmoji emoji="🎯" size={18} />
                            <span>Günlük Hedef</span>
                          </span>
                          <span className="bg-[#e8f7ff] dark:bg-[#1cb0f6]/20 text-[#1cb0f6] border-2 border-b-2 border-[#1cb0f6]/40 px-3 py-1 rounded-xl text-xs font-mono font-black shadow-2xs">
                            {Math.floor(dailyGoalMinutes/60) > 0 ? `${Math.floor(dailyGoalMinutes/60)}s ` : ''}{dailyGoalMinutes%60}dk
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="30" max="600" step="30"
                          value={dailyGoalMinutes}
                          onChange={(e) => {
                             setDailyGoalMinutes(parseInt(e.target.value));
                             localStorage.setItem("pomodoro_daily_goal", e.target.value);
                          }}
                          className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1cb0f6]"
                        />
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => setShowSettings(false)}
                      className="w-full mt-6 py-3.5 bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-black text-xs uppercase tracking-widest rounded-2xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] active:translate-y-0.5 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <AppleEmoji emoji="✅" size={18} />
                      <span>BİTTİ</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="timer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                      {/* 3D Daily Goal Hero Card */}
                      <div className="mb-6 p-4.5 bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-900/60 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700/80 shadow-2xs relative overflow-hidden group">
                         <div className="absolute right-0 top-0 opacity-[0.05]">
                            <Target className="w-28 h-28 -mr-6 -mt-6 text-[#58cc02]" />
                         </div>
                         <div className="flex justify-between items-end mb-3 relative z-10">
                            <div>
                              <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                                <AppleEmoji emoji="🎯" size={14} />
                                <span>Günlük Hedef</span>
                              </div>
                              <div className="text-base font-black text-slate-800 dark:text-slate-100 font-mono">
                                 {Math.floor(displayTotalFocus/60)}s {displayTotalFocus%60}dk <span className="text-slate-400 text-sm font-sans font-bold">/ {Math.floor(dailyGoalMinutes/60)}s {dailyGoalMinutes%60 > 0 ? `${dailyGoalMinutes%60}dk` : ''}</span>
                              </div>
                            </div>
                            <div className="text-xs font-black text-[#58cc02] bg-[#e5f9e7] dark:bg-[#58cc02]/20 px-3 py-1 rounded-xl border-2 border-b-2 border-[#58cc02]/40 shadow-2xs relative font-mono">
                               %{Math.min(100, Math.round((displayTotalFocus / dailyGoalMinutes) * 100))}
                               
                               <AnimatePresence>
                                 {bankingAnim && earnedBreakData && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10, scale: 0.5 }}
                                      animate={{ opacity: 1, y: -25, scale: 1.5 }}
                                      exit={{ opacity: 0, y: -35 }}
                                      transition={{ duration: 1.2, ease: "easeOut" }}
                                      className="absolute -top-2 right-0 text-[#58cc02] font-black drop-shadow-md z-50 whitespace-nowrap"
                                    >
                                      +{earnedBreakData.workedMins} dk
                                    </motion.div>
                                 )}
                               </AnimatePresence>
                            </div>
                         </div>
                         <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-950 rounded-full border-2 border-slate-300/40 dark:border-slate-800 p-0.5 overflow-hidden">
                            <div 
                               className="h-full bg-gradient-to-r from-[#58cc02] to-[#46a302] transition-all duration-1000 rounded-full relative shadow-2xs"
                               style={{ width: `${Math.min(100, (displayTotalFocus / dailyGoalMinutes) * 100)}%` }}
                            >
                               <div className="absolute inset-x-0 top-0 h-1/3 bg-white/30 rounded-full" />
                            </div>
                         </div>
                      </div>

                    {/* 3D Segmented Mode Switcher */}
                    <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/90 rounded-2xl mb-6 border-2 border-b-4 border-slate-200 dark:border-slate-700/80 shadow-2xs gap-2">
                      <button
                        type="button"
                        onClick={() => requestModeChange("stopwatch")}
                        className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all border-2 border-b-4 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 ${
                          mode === "stopwatch" 
                            ? "bg-white dark:bg-slate-900 text-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] shadow-sm" 
                            : "bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border-transparent"
                        }`}
                      >
                        <AppleEmoji emoji="⏱️" size={16} />
                        <span>Krono</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => requestModeChange("break")}
                        className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all border-2 border-b-4 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 ${
                          mode === "break" 
                            ? "bg-white dark:bg-slate-900 text-[#58cc02] border-[#58cc02] border-b-[#46a302] shadow-sm" 
                            : "bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border-transparent"
                        }`}
                      >
                        <AppleEmoji emoji="☕" size={16} />
                        <span>Mola</span>
                      </button>
                    </div>

                    {/* Central 3D Timer Ring & Display */}
                    <div className="relative w-60 h-60 mx-auto mb-6 flex items-center justify-center rounded-full bg-slate-100/50 dark:bg-slate-800/40 border-2 border-slate-200/80 dark:border-slate-700/60 shadow-inner">
                      <svg className="w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 200 200">
                        <circle 
                          cx="100" cy="100" r={radius} 
                          fill="none" 
                          className="stroke-slate-200 dark:stroke-slate-800" 
                          strokeWidth="10" 
                        />
                        <motion.circle 
                          cx="100" cy="100" r={radius} 
                          fill="none" 
                          stroke="currentColor"
                          className={`${mode === "focus" ? "text-emerald-500" : (mode === "stopwatch" ? "text-[#1cb0f6]" : "text-[#58cc02]")}`}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1, ease: "linear" }}
                        />
                      </svg>
                      
                      {/* Timer Display Inside */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <div className="mb-1">
                           <AppleEmoji emoji={mode === "stopwatch" ? "⚡" : "☕"} size={22} />
                         </div>
                         <p className={`${formatTime.length > 5 ? 'text-4xl' : 'text-5xl'} font-black font-mono tracking-tight text-slate-800 dark:text-white transition-colors duration-300 drop-shadow-2xs`}>
                           {formatTime}
                         </p>
                         <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 border shadow-2xs ${
                           mode === "stopwatch"
                             ? "bg-[#e8f7ff] dark:bg-[#1cb0f6]/20 text-[#1cb0f6] border-[#1cb0f6]/30"
                             : "bg-[#e5f9e7] dark:bg-[#58cc02]/20 text-[#58cc02] border-[#58cc02]/30"
                         }`}>
                           {mode === "focus" ? "Kesintisiz Odak" : (mode === "stopwatch" ? "Çalışma Süresi" : "Dinlenme Vakti")}
                         </span>
                      </div>
                    </div>

                    {/* 3D Push Control Dock */}
                    <div className="flex items-center justify-center gap-3 mb-2">
                       <button 
                         type="button"
                         onClick={resetTimer}
                         className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 shadow-2xs hover:border-[#1cb0f6] active:translate-y-0.5 transition-all cursor-pointer shrink-0"
                         title="Sıfırla"
                       >
                         <RotateCcw className="w-5 h-5" />
                       </button>
                       <button 
                         type="button"
                         onClick={toggleTimer}
                         className={`flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl text-white font-black text-xs uppercase tracking-wider border-2 border-b-4 shadow-md hover:scale-[1.02] active:translate-y-0.5 transition-all cursor-pointer ${
                           isActive 
                             ? "bg-amber-500 border-amber-500 border-b-amber-600 dark:bg-amber-500 dark:border-amber-600 text-white" 
                             : (mode === "stopwatch" ? "bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6]" : "bg-[#58cc02] border-[#58cc02] border-b-[#46a302]")
                         }`}
                       >
                         {isActive ? (
                           <>
                             <Pause className="w-5 h-5 fill-current" />
                             <span>DURAKLAT</span>
                           </>
                         ) : (
                           <>
                             <Play className="w-5 h-5 ml-0.5 fill-current" />
                             <span>{mode === "stopwatch" ? "BAŞLAT" : "MOLAYI BAŞLAT"}</span>
                           </>
                         )}
                       </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
