"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { loadData, saveData } from "@/lib/storage"
import { loadFromFirebase, saveToFirebase, forceUploadToFirebase, updateUserProfile, loadPlannerYeniden, savePlannerYeniden } from "@/lib/firebaseService"
import { initialData } from "@/lib/data"
import { format } from "date-fns"
import TopicList from "@/components/TopicList"
import ProgressRing from "@/components/ProgressRing"
import KPSSCountdown from "@/components/KPSSCountdown"
import StatsBar from "@/components/StatsBar"
import ResetModal from "@/components/ResetModal"
import KPSSInfoCards from "@/components/KPSSInfoCards"
import MonthlyCalendar from "@/components/MonthlyCalendar"
import DailyPlanView from "@/components/DailyPlanView"
import AutoPlanGenerator from "@/components/AutoPlanGenerator"
import DailyGoalWidget from "@/components/DailyGoalWidget"
import { LocalDashboardData, Subject } from "@/types"
import DenemeLinkButton from "@/components/deneme/DenemeLinkButton"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/components/ThemeProvider"
import { getStudyDate } from "@/lib/dateUtils"
import AppleEmoji from "@/components/AppleEmoji"
import GlobalLoading from "@/components/GlobalLoading"

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Suspense } from 'react'

function HomeContent() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [data, setData] = useState<LocalDashboardData | null>(null)
  
  const [activeSubjectId, setActiveSubjectIdState] = useState(searchParams.get('subject') || "turkce")
  
  useEffect(() => {
    const subject = searchParams.get('subject');
    if (subject && subject !== activeSubjectId) {
      setActiveSubjectIdState(subject);
    }
  }, [searchParams]);

  const setActiveSubjectId = (id: string) => {
    setActiveSubjectIdState(id)
  }
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [isAutoPlanOpen, setIsAutoPlanOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(getStudyDate())
  const [activeView, setActiveView] = useState<'daily'|'monthly'>('daily')
  const [isSaving, setIsSaving] = useState(false)
  // isSyncing: Firebase'den ilk yükleme tamamlanana kadar geri kaydetmeyi engeller
  const isSyncing = useRef(false)
  // syncedUserId: hangi kullanıcı için sync yapıldığını takip eder
  const syncedUserId = useRef<string | null>(null)
  const lastSavedDataString = useRef<string>("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const dailyPlanRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  )

  useEffect(() => {
    const initData = async () => {
      isSyncing.current = true
      const local = loadData()
      
      if (user?.uid) {
        try {
          const remoteData = await loadFromFirebase(user.uid)
          const remotePlanner = await loadPlannerYeniden(user.uid)
          
          let remote = null;
          if (remoteData || remotePlanner) {
            remote = { ...(remoteData || {}), ...(remotePlanner || {}) } as LocalDashboardData;
            
            // Eğer remotePlanner yoksa (yeni migration), eski remoteData içindeki verileri kullanarak kaydet
            if (!remotePlanner && remoteData && (remoteData as any).subjects) {
               console.log("Migration: Saving planner data from old structure");
               const plannerPayload = {
                  subjects: (remoteData as any).subjects,
                  slotNotes: (remoteData as any).slotNotes || {},
                  completedNotes: (remoteData as any).completedNotes || {},
                  holidays: (remoteData as any).holidays || [],
                  dailyGoals: (remoteData as any).dailyGoals || {},
                  dailyGoalTarget: (remoteData as any).dailyGoalTarget || 100,
               };
               savePlannerYeniden(user.uid, plannerPayload);
            }
          }
          
          if (remote) {
            const localTime = local.lastUpdated || 0
            const remoteTime = remote.lastUpdated || 0
            
            if (remoteTime > localTime) {
              // Bulut verisi daha güncel
              setData(remote)
              saveData(remote)
              lastSavedDataString.current = JSON.stringify(remote)
            } else if (localTime > remoteTime) {
              // Lokal veri daha güncel — buluta eşitle
              setData(local)
              lastSavedDataString.current = JSON.stringify(local)
              
              const appDataPayload = { streak: local.streak, lastActiveDate: local.lastActiveDate, denemeTargetNet: local.denemeTargetNet };
              const plannerPayload = { subjects: local.subjects, slotNotes: local.slotNotes, completedNotes: local.completedNotes, holidays: local.holidays, dailyGoals: local.dailyGoals, dailyGoalTarget: local.dailyGoalTarget };
              
              saveToFirebase(user.uid, appDataPayload as any)
              savePlannerYeniden(user.uid, plannerPayload)
            } else {
              setData(local)
              lastSavedDataString.current = JSON.stringify(local)
            }
          } else {
            // Firebase'de henüz hiç veri yok
            setData(local)
            lastSavedDataString.current = JSON.stringify(local)
            const appDataPayload = { streak: local.streak, lastActiveDate: local.lastActiveDate, denemeTargetNet: local.denemeTargetNet };
            const plannerPayload = { subjects: local.subjects, slotNotes: local.slotNotes, completedNotes: local.completedNotes, holidays: local.holidays, dailyGoals: local.dailyGoals, dailyGoalTarget: local.dailyGoalTarget };
            saveToFirebase(user.uid, appDataPayload as any)
            savePlannerYeniden(user.uid, plannerPayload)
          }
        } catch (e) {
          console.error("Sync error:", e)
          setData(local)
          lastSavedDataString.current = JSON.stringify(local)
        }
        updateUserProfile(user.uid, user.displayName, user.email)
      } else {
        setData(local)
        lastSavedDataString.current = JSON.stringify(local)
      }

      syncedUserId.current = user?.uid ?? null
      isSyncing.current = false
    }
    initData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]) // Sadece UID değişince yeniden çalış — token yenilenince tetiklenme

  useEffect(() => {
    // İlk async yükleme bitene kadar veya kullanıcı değişene kadar geri yazma yapma
    if (!data || isSyncing.current) return
    if (user?.uid && user.uid !== syncedUserId.current) return

    const currentDataString = JSON.stringify(data)
    if (currentDataString === lastSavedDataString.current) {
      // Veri değişmediyse boşuna sunucuya kaydetme (ekstra yük ve okuma/yazma kotasını korur)
      return
    }

    lastSavedDataString.current = currentDataString
    saveData(data)
    setIsSaving(true)

    // Debounce: 1.5 sn bekle, sürekli sunucuyu yormamak için
    const timeoutId = setTimeout(() => {
      if (user?.uid) {
        const appDataPayload = { streak: data.streak, lastActiveDate: data.lastActiveDate, denemeTargetNet: data.denemeTargetNet };
        const plannerPayload = { subjects: data.subjects, slotNotes: data.slotNotes, completedNotes: data.completedNotes, holidays: data.holidays, dailyGoals: data.dailyGoals, dailyGoalTarget: data.dailyGoalTarget };
        
        Promise.all([
          saveToFirebase(user.uid, appDataPayload as any),
          savePlannerYeniden(user.uid, plannerPayload)
        ]).then(() => {
          setIsSaving(false)
        }).catch(() => setIsSaving(false))
      } else {
        setIsSaving(false)
      }
    }, 1500)

    return () => clearTimeout(timeoutId)
  }, [data, user])

  if (!data) return (
    <GlobalLoading
      title="Sistem Hazırlanıyor..."
      description="Kişiselleştirilmiş KPSS çalışma verileriniz yükleniyor, lütfen bekleyin."
      emoji="🚀"
    />
  )

  const safeSubjects = data.subjects || initialData

  const toggleTopic = (topicId: string, subjectId?: string) => {
    if (!data) return
    let wasCompleted = false
    const newSubjects = safeSubjects.map(subject => {
      if (subjectId && subject.id !== subjectId) return subject
      return {
        ...subject,
        topics: subject.topics.map(t => {
          if (t.id === topicId) {
            wasCompleted = !t.done
            return { ...t, done: wasCompleted }
          }
          return t
        })
      }
    })
    setData({ ...data, subjects: newSubjects })
    if (wasCompleted) {
      toast.custom(() => (
        <div className="flex items-center justify-center w-full mt-2 pointer-events-auto">
          <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-5 py-3.5 rounded-2xl border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 shadow-2xl flex items-center gap-3.5 min-w-[320px]">
            <div className="w-10 h-10 rounded-xl bg-[#e8f7ff] dark:bg-[#1cb0f6]/20 border-2 border-b-2 border-[#1cb0f6] flex items-center justify-center shrink-0 shadow-2xs">
              <AppleEmoji emoji="📘" size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                Müfredat Konusu Tamamlandı!
              </span>
              <span className="text-xs font-black text-[#1cb0f6] flex items-center gap-1 mt-0.5">
                <span>Tebrikler!</span>
                <AppleEmoji emoji="🚀" size={14} />
              </span>
            </div>
          </div>
        </div>
      ), { position: 'top-center', duration: 3000 });
    }
  }

  const handleReset = () => {
    setData({ subjects: initialData, streak: 0, lastActiveDate: null })
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString())
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || !active.data.current) return
    if (!over.data.current?.acceptsDrop) return

    const draggedTopicId = active.id.toString().replace("topic_", "")
    const targetId = over.id.toString()
    let scheduledDate = ""
    let scheduledTime = ""

    if (targetId.includes("_")) {
      [scheduledDate, scheduledTime] = targetId.split("_")
    } else {
      scheduledDate = targetId
    }

    const newSubjects = safeSubjects.map(subject => {
      return {
        ...subject,
        topics: subject.topics.map(t => {
          if (t.id === draggedTopicId) {
            const newSchedule = { date: scheduledDate, time: scheduledTime || "" }
            const existingSchedules = t.schedules || []
            const isDuplicate = existingSchedules.some(s => s.date === newSchedule.date && s.time === newSchedule.time)
            return { 
              ...t, 
              schedules: isDuplicate ? existingSchedules : [...existingSchedules, newSchedule]
            }
          }
          return t
        })
      }
    })
    setData({ ...data, subjects: newSubjects })
  }

  const scheduleTopic = (topicId: string, dateStr: string, timeStr?: string) => {
    if (!data) return
    const newSubjects = safeSubjects.map(subject => ({
      ...subject,
      topics: subject.topics.map(t => {
        if (t.id === topicId) {
          const newSchedule = { date: dateStr, time: timeStr || "" }
          const existingSchedules = t.schedules || []
          const isDuplicate = existingSchedules.some(s => s.date === newSchedule.date && s.time === newSchedule.time)
          return { 
            ...t, 
            schedules: isDuplicate ? existingSchedules : [...existingSchedules, newSchedule]
          }
        }
        return t
      })
    }))
    setData({ ...data, subjects: newSubjects })
  }

  const removeTopic = (topicId: string, dateStr?: string, timeStr?: string) => {
    if (!data) return
    const newSubjects = safeSubjects.map(subject => {
      return {
        ...subject,
        topics: subject.topics.map(t => {
          if (t.id === topicId) {
            if (dateStr) {
              return { 
                ...t, 
                schedules: t.schedules?.filter(s => !(s.date === dateStr && s.time === (timeStr || "")))
              }
            }
            return { ...t, schedules: [] }
          }
          return t
        })
      }
    })
    setData({ ...data, subjects: newSubjects })
  }

  const updateSlotNote = (slotId: string, note: string) => {
    if (!data) return
    const newSlotNotes = { ...(data.slotNotes || {}), [slotId]: note }
    if (!note) {
      delete newSlotNotes[slotId]
      // Also clean up completed status if note is deleted
      const newCompletedNotes = { ...(data.completedNotes || {}) }
      delete newCompletedNotes[slotId]
      setData({ ...data, slotNotes: newSlotNotes, completedNotes: newCompletedNotes })
    } else {
      setData({ ...data, slotNotes: newSlotNotes })
    }
  }

  const toggleNote = (slotId: string) => {
    if (!data) return
    const currentCompleted = data.completedNotes || {}
    const isNowCompleted = !currentCompleted[slotId]
    const newCompletedNotes = { ...currentCompleted, [slotId]: isNowCompleted }
    setData({ ...data, completedNotes: newCompletedNotes })
    if (isNowCompleted) {
      toast.custom(() => (
        <div className="flex items-center justify-center w-full mt-2 pointer-events-auto">
          <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-5 py-3.5 rounded-2xl border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 shadow-2xl flex items-center gap-3.5 min-w-[320px]">
            <div className="w-10 h-10 rounded-xl bg-[#e5f9e7] dark:bg-[#58cc02]/20 border-2 border-b-2 border-[#58cc02] flex items-center justify-center shrink-0 shadow-2xs">
              <AppleEmoji emoji="✅" size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                Günlük Görev Tamamlandı!
              </span>
              <span className="text-xs font-black text-[#58cc02] flex items-center gap-1 mt-0.5">
                <span>Harika gidiyorsun!</span>
                <AppleEmoji emoji="🚀" size={14} />
              </span>
            </div>
          </div>
        </div>
      ), { position: 'top-center', duration: 3500 });
    }
  }

  const updateSubjectName = (subjectId: string, newName: string) => {
    if (!data) return
    const newSubjects = safeSubjects.map(s => s.id === subjectId ? { ...s, title: newName } : s)
    setData({ ...data, subjects: newSubjects })
  }

  const toggleHoliday = (dateStr: string) => {
    if (!data) return
    const currentHolidays = data.holidays || []
    const isHoliday = currentHolidays.includes(dateStr)
    const newHolidays = isHoliday ? currentHolidays.filter(d => d !== dateStr) : [...currentHolidays, dateStr]
    setData({ ...data, holidays: newHolidays })
  }

  const handleApplyAutoPlan = (newSubjects: Subject[]) => {
    setData({ ...data, subjects: newSubjects })
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setActiveView('daily')
    setTimeout(() => {
      if (dailyPlanRef.current) {
        dailyPlanRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  const handleUpdateDailyGoal = (dateStr: string, solved: number) => {
    if (!data) return
    const currentGoals = data.dailyGoals || {}
    const newGoals = { ...currentGoals, [dateStr]: solved }
    
    // Check if goal met to increase streak
    let newStreak = data.streak
    const target = data.dailyGoalTarget || 100
    if (solved >= target && (currentGoals[dateStr] || 0) < target) {
      newStreak += 1
      toast.success(`Hedefe Ulaşıldı! Seri +1 🔥`)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    }
    
    setData({ ...data, dailyGoals: newGoals, streak: newStreak, lastActiveDate: format(getStudyDate(), "yyyy-MM-dd") })
  }

  const handleSetGoalTarget = (target: number) => {
    if (!data) return
    setData({ ...data, dailyGoalTarget: target })
    toast.success(`Günlük hedef ${target} soru olarak güncellendi!`)
  }

  const activeSubject = safeSubjects.find(s => s.id === activeSubjectId) || safeSubjects[0]
  const allTopicsFlat = safeSubjects.flatMap(s => s.topics.flatMap(t => {
    if (t.schedules && t.schedules.length > 0) {
      return t.schedules.map(sch => ({ ...t, scheduledDate: sch.date, scheduledTime: sch.time }))
    }
    return [t]
  }))
  const activeTopic = activeId ? allTopicsFlat.find(t => `topic_${t.id}` === activeId) : null

  const totalTopics = safeSubjects.reduce((acc, curr) => acc + curr.topics.length, 0)
  const completedTopics = safeSubjects.reduce((acc, curr) => acc + curr.topics.filter(t => t.done).length, 0)
  const totalPercent = totalTopics === 0 ? 0 : (completedTopics / totalTopics) * 100

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col min-h-screen bg-bg text-text-main font-sans selection:bg-accent/30">

          {/* Main Content Area */}
          <main ref={scrollAreaRef} className="flex-1 px-4 sm:px-6 md:px-12 pb-24">
            <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
              
              {/* Overview Section */}
              {/* Unified EdTech Header */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-4"
              >
                <div className="flex items-center gap-5">
                  <div className="relative w-16 h-16 rounded-2xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xs overflow-hidden shrink-0 bg-white dark:bg-slate-800">
                    {user?.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.photoURL} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1cb0f6] text-white flex items-center justify-center text-2xl font-black">
                        {user?.displayName?.charAt(0)?.toUpperCase() || "K"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                      Merhaba, {user?.displayName?.split(" ")[0] || "Şampiyon"}!
                    </h1>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Sınava Hazırlık Merkezi
                      </p>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-500/10 rounded-xl border-2 border-b-2 border-rose-200 dark:border-rose-500/30 shadow-2xs">
                         <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Busis ❤️</span>
                      </div>
                      <AnimatePresence mode="wait">
                        {isSaving ? (
                          <motion.div 
                            key="saving"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-xl border-2 border-b-2 border-emerald-200 dark:border-emerald-500/30 shadow-2xs"
                          >
                            <div className="w-2 h-2 rounded-full bg-[#58cc02] animate-pulse" />
                            Senkronize ediliyor...
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="synced"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-xl border-2 border-b-2 border-emerald-200 dark:border-emerald-500/30 shadow-2xs"
                          >
                            <div className="w-2 h-2 rounded-full bg-[#58cc02]" />
                            Bulutla Eşitlendi ✓
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 mt-4 xl:mt-0">
                  <div 
                    className="flex items-center gap-3.5 bg-white dark:bg-slate-800 pl-3 pr-6 py-3 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#1cb0f6] border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] flex items-center justify-center text-white shadow-2xs shrink-0">
                      <span className="text-xs font-black tracking-tight">%{Math.round(totalPercent)}</span>
                    </div>
                    <div className="flex flex-col w-36">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Müfredat İlerlemesi</span>
                      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700/80 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
                        <motion.div 
                          className="h-full rounded-full bg-[#1cb0f6]"
                          initial={{ width: 0 }}
                          animate={{ width: `${totalPercent}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                className="mb-2"
              >
                <KPSSCountdown />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              >
                <StatsBar 
                   total={totalTopics} 
                   completed={completedTopics} 
                 />
              </motion.div>

              {/* Strategy Details (Collapsible) */}
              <section>
                <details className="group bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md">
                  <summary className="list-none cursor-pointer p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#ff9500] border-2 border-b-4 border-[#ff9500] border-b-[#e08400] text-white flex items-center justify-center shadow-xs shrink-0">
                        <AppleEmoji emoji="💡" size={24} className="text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">
                        Sınav Stratejileri & Bilgi Kartları
                      </span>
                    </div>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs font-black">▼</span>
                  </summary>
                  <div className="p-6 sm:p-8 border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <KPSSInfoCards />
                  </div>
                </details>
              </section>

              {/* Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 items-start">
                
                {/* Left Col: Knowledge Base */}
                <div className="xl:col-span-4 flex flex-col gap-6 xl:sticky xl:top-24">
                  <div className="flex items-center justify-between px-2">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">MÜFREDAT HAVUZU</h3>
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#1cb0f6] bg-[#e8f7ff] dark:bg-[#1cb0f6]/10 px-3 py-1 rounded-xl border-2 border-b-2 border-[#1cb0f6]/30 shadow-2xs">
                       Sürüklenebilir
                     </span>
                  </div>
                  <TopicList 
                    subjects={safeSubjects} 
                    activeSubjectId={activeSubjectId}
                    onSelectSubject={setActiveSubjectId}
                    onToggleTopic={toggleTopic} 
                    onScheduleTopic={(topicId, subjectId) => scheduleTopic(topicId, format(selectedDate, "yyyy-MM-dd"))} 
                    onUpdateSubjectName={updateSubjectName}
                  />
                </div>
                
                {/* Right Col: Timeline & Context */}
                <div className="xl:col-span-8 flex flex-col gap-6">
                  {/* 3D View Switcher Tabs */}
                  <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setActiveView('daily')}
                      className={`flex-1 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-3 relative cursor-pointer ${
                        activeView === 'daily' 
                          ? 'bg-white dark:bg-slate-800 text-[#1cb0f6] border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xs' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white border-2 border-transparent'
                      }`}
                    >
                      <span>Günlük Operasyon</span>
                      {activeView === 'daily' && <div className="w-2 h-2 rounded-full bg-[#1cb0f6]" />}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveView('monthly')}
                      className={`flex-1 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-3 relative cursor-pointer ${
                        activeView === 'monthly' 
                          ? 'bg-white dark:bg-slate-800 text-[#1cb0f6] border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xs' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white border-2 border-transparent'
                      }`}
                    >
                      <span>Aylık Projeksiyon</span>
                      {activeView === 'monthly' && <div className="w-2 h-2 rounded-full bg-[#1cb0f6]" />}
                    </button>
                  </div>

                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {activeView === 'daily' ? (
                        <motion.div 
                          key="daily"
                          ref={dailyPlanRef}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <DailyPlanView 
                            date={selectedDate} 
                            topics={allTopicsFlat} 
                            subjects={safeSubjects} 
                            isDragging={!!activeId} 
                            onDateChange={setSelectedDate} 
                            onRemoveTopic={removeTopic} 
                            slotNotes={data.slotNotes || {}}
                            completedNotes={data.completedNotes || {}}
                            onUpdateNote={updateSlotNote}
                            onToggleNote={toggleNote}
                            holidays={data.holidays || []}
                            onToggleHoliday={toggleHoliday}
                          />
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="monthly"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <MonthlyCalendar 
                            topics={allTopicsFlat} 
                            subjects={safeSubjects} 
                            slotNotes={data.slotNotes || {}}
                            completedNotes={data.completedNotes || {}}
                            isDragging={!!activeId} 
                            onDayClick={handleDayClick} 
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Footer Spacer */}
              <div className="h-24" />
            </div>
          </main>


        {/* Drag Overlay Redesign */}
        <DragOverlay>
          {activeTopic ? (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-2xl cursor-grabbing w-80 z-[100] flex items-center gap-4 rotate-2">
               <div className="w-12 h-12 rounded-xl bg-[#1cb0f6] border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-white flex items-center justify-center shadow-xs shrink-0">
                  <AppleEmoji emoji={safeSubjects.find(s => s.topics.some(t => t.id === activeTopic.id))?.icon || '📚'} size={28} className="text-white" />
               </div>
               <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1cb0f6]">Yerleştiriliyor</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white truncate">{activeTopic.title}</span>
               </div>
            </div>
          ) : null}
        </DragOverlay>

        <ResetModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} onConfirm={handleReset} />
        <AutoPlanGenerator isOpen={isAutoPlanOpen} onClose={() => setIsAutoPlanOpen(false)} subjects={safeSubjects} onApplyPlan={handleApplyAutoPlan} />
      </div>
    </DndContext>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg text-text-main flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,168,132,0.1)]" />
        <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Sistem Yükleniyor...</span>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
