"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Clock,
  Users,
  BookOpen,
  ChevronDown,
  Flame,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import Tilt from "react-parallax-tilt";
import AppleEmoji from "@/components/AppleEmoji";
import {
  estimateP3Score,
  estimateP1Score,
  estimateP2Score,
} from "@/lib/denemeUtils";

/* ═══════════════════════════════════════════════════════
   ANIMATED COUNTER — counts from 0 to end on viewport enter
═══════════════════════════════════════════════════════ */
function CountUp({
  end,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1600;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(end * ease);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? val.toFixed(decimals) : Math.round(val)}
      {suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════════════ */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

/* ═══════════════════════════════════════════════════════
   DATA CONSTANTS — STRICT AGENTS.MD COLORS
═══════════════════════════════════════════════════════ */
const SUBJECTS = [
  { title: "Türkçe", emoji: "📘", color: "#fa5fea", q: 30, desc: "Sözel Mantık & Paragraf", pct: 82 },
  { title: "Matematik", emoji: "🔢", color: "#af52de", q: 30, desc: "Sayısal Mantık & Problem", pct: 64 },
  { title: "Tarih", emoji: "🏛️", color: "#ff9500", q: 27, desc: "Osmanlı & İnkılap Tarihi", pct: 76 },
  { title: "Coğrafya", emoji: "🗺️", color: "#10B981", q: 18, desc: "Fiziki & Beşeri Coğrafya", pct: 88 },
  { title: "Vatandaşlık", emoji: "⚖️", color: "#5856d6", q: 15, desc: "Anayasa & Güncel Bilgi", pct: 70 },
];

const FEATURES = [
  {
    title: "ÖSYM Kalibre Puan Tahmini",
    desc: "11 resmi ÖSYM belgesiyle kalibre edilen algoritmamız, netlerinizin sınav gününde tam olarak kaç puana karşılık geleceğini virgülden sonra iki basamak hassasiyetle hesaplar.",
    badge: "Regresyon Algoritması",
    Icon: BarChart3,
    emoji: "📊",
    color: "#1cb0f6",
  },
  {
    title: "Türkiye Geneli Karşılaştırma",
    desc: "Genel Deneme ve Branş Denemeleri bazında Türkiye genelindeki tüm adaylarla anlık sıralama karşılaştırması yapın, zayıf noktalarınızı keşfedin.",
    badge: "Canlı Liderlik Tablosu",
    Icon: Users,
    emoji: "🏆",
    color: "#ff9500",
  },
  {
    title: "Deneme & Müfredat Takibi",
    desc: "Her denemenin doğru, yanlış ve net istatistiklerini kaydedin. Konu bazlı ilerlemenizi ve net artış grafiğinizi zaman içinde izleyin.",
    badge: "Otomatik Performans Raporu",
    Icon: BookOpen,
    emoji: "📈",
    color: "#af52de",
  },
  {
    title: "130 Dakika ÖSYM Odak Odası",
    desc: "Gerçek sınav sayacı, optik form simülasyonu ve ortam sesleriyle sınav gününün zaman baskısını evinizde deneyimleyin.",
    badge: "Gerçek Sınav Provası",
    Icon: Clock,
    emoji: "⏱️",
    color: "#10B981",
  },
];

const EXAM_TYPES = [
  {
    title: "KPSS Lisans",
    badge: "P3 Puanı",
    color: "#1cb0f6",
    emoji: "🎓",
    q: 120,
    dur: 130,
    desc: "4 yıllık fakülte mezunlarının B Grubu kadroları ve A Grubu atamalarında esas alınan ana sınav.",
  },
  {
    title: "KPSS Önlisans",
    badge: "P93 Puanı",
    color: "#af52de",
    emoji: "📘",
    q: 120,
    dur: 130,
    desc: "2 yıllık meslek yüksekokulu ve önlisans mezunlarının kamu kadrolarına atamasında kullanılan puan.",
  },
  {
    title: "KPSS Ortaöğretim",
    badge: "P94 Puanı",
    color: "#10B981",
    emoji: "🎯",
    q: 120,
    dur: 130,
    desc: "Lise ve dengi okul mezunu adayların kamu kurumlarına yerleştirilmesinde esas alınan puan.",
  },
  {
    title: "EKPSS",
    badge: "EKSS P1/2/3",
    color: "#ff9500",
    emoji: "⚡",
    q: 60,
    dur: 60,
    desc: "%40 ve üzeri engeli bulunan adayların kamu kurumlarında istihdam edilmesi için düzenlenen özel sınav.",
  },
];

const FAQ_ITEMS = [
  {
    q: "KPSS2X tamamen ücretsiz mi?",
    a: "Evet, platformumuzun tüm özellikleri %100 ücretsizdir. Google hesabınızla giriş yaparak hemen kullanmaya başlayabilirsiniz. Herhangi bir gizli ücretlendirme bulunmamaktadır.",
  },
  {
    q: "Puan tahmini ne kadar doğru?",
    a: "ÖSYM'nin resmi 11 sınav belgesinden kalibre edilen regresyon algoritmamız %98.3 hassasiyetle puan tahmini yapmaktadır. Girdiğiniz netlere göre P3, P1 ve P2 puanlarınızı virgülden sonra iki basamak doğruluğuyla hesaplayabilirsiniz.",
  },
  {
    q: "Hangi sınav türleri destekleniyor?",
    a: "KPSS Lisans (P3), Önlisans (P93), Ortaöğretim (P94) ve EKPSS olmak üzere 4 ana sınav türünü tam destekliyoruz. Her sınav türü için ayrı puan hesaplama ve karşılaştırma modülleri mevcuttur.",
  },
  {
    q: "Verilerim güvende mi?",
    a: "Tüm verileriniz Google Firebase altyapısında şifrelenerek saklanır ve yalnızca sizin Google hesabınızla erişilebilir. Verileriniz hiçbir üçüncü tarafla paylaşılmaz.",
  },
  {
    q: "Türkiye geneli sıralama nasıl çalışıyor?",
    a: "Deneme sonuçlarınızı kaydettikten sonra hem Genel Deneme hem de Branş bazında (Türkçe, Matematik, Tarih vb.) Türkiye genelindeki diğer adaylarla anlık olarak karşılaştırabilirsiniz.",
  },
];

/* ═══════════════════════════════════════════════════════
   MAIN LANDING PAGE COMPONENT
═══════════════════════════════════════════════════════ */
export default function LandingPage() {
  const { signInWithGoogle } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Scroll Progress ── */
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /* ── Navbar Hide/Show on Scroll ── */
  const [navVisible, setNavVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setNavVisible(latest < lastY || latest < 0.04);
    setLastY(latest);
  });

  /* ── Score Simulator State ── */
  const [gyNet, setGyNet] = useState(48);
  const [gkNet, setGkNet] = useState(42);
  const p3 = estimateP3Score(gyNet, gkNet);
  const p1 = estimateP1Score(gyNet, gkNet);
  const p2 = estimateP2Score(gyNet, gkNet);

  /* ── FAQ State ── */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ── Confetti ── */
  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#1cb0f6", "#10B981", "#ff9500", "#af52de", "#F43F5E"],
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1a] text-slate-800 dark:text-slate-100 selection:bg-[#1cb0f6]/20 font-sans overflow-x-hidden"
    >
      {/* ── Neon Scroll Progress Line ── */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1cb0f6] via-[#af52de] to-[#10B981] z-[70] origin-left"
      />

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-[#0a0f1a] dark:to-[#060a12]" />
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#1cb0f6]/8 dark:bg-[#1cb0f6]/4 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-[#af52de]/8 dark:bg-[#af52de]/4 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      {/* ════════════════════════════════════════════════════════
          FLOATING GLASSMORPHIC NAVBAR
      ════════════════════════════════════════════════════════ */}
      <motion.header
        animate={{ y: navVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 py-3 px-4 sm:px-8 flex justify-center pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center justify-between w-full max-w-6xl mx-auto rounded-2xl sm:rounded-[2rem] px-5 py-3 bg-white/92 dark:bg-slate-900/92 backdrop-blur-xl border-2 border-b-4 border-slate-200/90 dark:border-slate-700/90 shadow-lg">
          {/* Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center cursor-pointer group transition-transform hover:scale-[1.02]"
          >
            <span className="font-black text-2xl sm:text-3xl tracking-tighter text-slate-800 dark:text-white select-none">
              KPSS<span className="text-[#1cb0f6]">2</span>
              <span className="text-[#10B981]">X</span>
            </span>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-black text-slate-600 dark:text-slate-300">
            <a href="#ozellikler" className="hover:text-[#1cb0f6] transition-colors">
              Özellikler
            </a>
            <a href="#dersler" className="hover:text-[#1cb0f6] transition-colors">
              Dersler
            </a>
            <a href="#sinavlar" className="hover:text-[#1cb0f6] transition-colors">
              Sınav Türleri
            </a>
            <a href="#simulasyon" className="hover:text-[#1cb0f6] transition-colors">
              Simülatör
            </a>
          </nav>

          {/* CTA Button */}
          <button
            onClick={signInWithGoogle}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl sm:rounded-2xl bg-[#1cb0f6] hover:bg-[#1cb0f6]/90 text-white font-black text-xs sm:text-sm border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] active:border-b-2 active:translate-y-0.5 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
          >
            <span>Giriş Yap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.header>

      {/* ════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-32 sm:pt-44 pb-16 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* ── Left: High Impact Copy ── */}
          <div className="lg:col-span-7 space-y-7 text-left">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md"
            >
              <Flame className="w-4 h-4 text-[#ff9500] animate-pulse" />
              <span className="font-black text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                Lisans · Önlisans · Ortaöğretim · EKPSS
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="font-black text-[2.5rem] sm:text-6xl lg:text-[4.25rem] tracking-tight text-slate-900 dark:text-white leading-[1.08]"
            >
              KPSS 2026&apos;ya{" "}
              <br className="hidden sm:inline" />
              <span className="relative inline-block">
                <span className="text-[#1cb0f6]">Akıllı Hazırlan</span>
                <svg
                  className="absolute -bottom-1.5 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8c50-6 100 2 148-2s100 4 148-2"
                    stroke="#1cb0f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.35"
                  />
                </svg>
              </span>
              ,{" "}
              <br className="hidden lg:inline" />
              Hedefine Ulaş.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="font-extrabold text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl"
            >
              Netlerini gir, ÖSYM kalibre algoritmamızla tahmini puanını anında
              gör, Türkiye genelinde diğer adaylarla karşılaştır — tamamen{" "}
              <span className="text-[#10B981]">ücretsiz</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                onClick={signInWithGoogle}
                type="button"
                className="px-8 py-4 sm:px-10 sm:py-[18px] rounded-2xl bg-[#1cb0f6] hover:bg-[#1cb0f6]/90 text-white font-black text-base sm:text-lg border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] active:border-b-2 active:translate-y-0.5 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <AppleEmoji emoji="🚀" size={22} />
                <span>Google ile Ücretsiz Başla</span>
              </button>

              <a
                href="#simulasyon"
                className="px-8 py-4 sm:px-10 sm:py-[18px] rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-black text-base sm:text-lg border-2 border-b-4 border-slate-200 dark:border-slate-700 hover:border-slate-300 shadow-md hover:scale-[1.02] active:border-b-2 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Puanını Hesapla</span>
                <ArrowRight className="w-5 h-5 text-[#1cb0f6]" />
              </a>
            </motion.div>

            {/* Trust Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.36 }}
              className="pt-7 grid grid-cols-3 gap-5 border-t-2 border-slate-200/80 dark:border-slate-700/60"
            >
              {[
                {
                  value: 98.3,
                  decimals: 1,
                  prefix: "%",
                  label: "Puan Hassasiyeti",
                  color: "#1cb0f6",
                },
                {
                  value: 120,
                  decimals: 0,
                  prefix: "",
                  suffix: " Soru",
                  label: "GY + GK Müfredat",
                  color: "#10B981",
                },
                {
                  value: 0,
                  decimals: 0,
                  prefix: "",
                  suffix: "₺",
                  label: "Tamamen Ücretsiz",
                  color: "#af52de",
                },
              ].map((stat, i) => (
                <div key={i}>
                  <div
                    className="font-black text-2xl sm:text-3xl"
                    style={{ color: stat.color }}
                  >
                    {stat.prefix}
                    {i === 2 ? (
                      "0₺"
                    ) : (
                      <CountUp
                        end={stat.value}
                        decimals={stat.decimals}
                        suffix={stat.suffix}
                      />
                    )}
                  </div>
                  <div className="font-extrabold text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Interactive Dashboard Mockup ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <Tilt
              tiltMaxAngleX={5}
              tiltMaxAngleY={5}
              perspective={1200}
              glareEnable
              glareMaxOpacity={0.08}
              glareBorderRadius="2.5rem"
            >
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-7 space-y-5">
                {/* Window Chrome */}
                <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100 dark:border-slate-700/70">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F43F5E]" />
                    <div className="w-3 h-3 rounded-full bg-[#ff9500]" />
                    <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                    <span className="ml-2 font-black text-xs text-slate-400">
                      KPSS2X Panel
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-lg border border-[#10B981]/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    Aktif
                  </span>
                </div>

                {/* P3 Score Preview */}
                <div className="bg-gradient-to-r from-[#1cb0f6]/10 via-[#af52de]/5 to-[#1cb0f6]/10 dark:from-[#1cb0f6]/15 dark:via-[#af52de]/8 dark:to-[#1cb0f6]/15 p-5 rounded-2xl border-2 border-b-4 border-[#1cb0f6]/20 dark:border-[#1cb0f6]/30">
                  <span className="font-black text-[10px] uppercase tracking-widest text-[#1cb0f6]">
                    Tahmini KPSS P3
                  </span>
                  <div className="flex items-end justify-between mt-1">
                    <span className="font-black text-4xl text-slate-900 dark:text-white tabular-nums">
                      89.42
                    </span>
                    <span className="font-bold text-xs text-[#10B981] flex items-center gap-1 pb-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +3.2 Net
                    </span>
                  </div>
                </div>

                {/* Subject Mini Bars */}
                <div className="space-y-2.5">
                  {SUBJECTS.map((sub) => (
                    <div key={sub.title} className="flex items-center gap-3">
                      <AppleEmoji emoji={sub.emoji} size={16} />
                      <span className="font-black text-[11px] text-slate-500 dark:text-slate-400 w-20 truncate">
                        {sub.title}
                      </span>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sub.pct}%` }}
                          transition={{
                            delay: 0.6 + SUBJECTS.indexOf(sub) * 0.1,
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: sub.color }}
                        />
                      </div>
                      <span
                        className="font-black text-[10px] w-8 text-right tabular-nums"
                        style={{ color: sub.color }}
                      >
                        {sub.pct}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Rank Preview */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/70 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                  <span className="flex items-center gap-2 text-xs font-black text-slate-600 dark:text-slate-300">
                    <AppleEmoji emoji="🏆" size={16} />
                    Türkiye Sıralaması
                  </span>
                  <span className="font-black text-sm text-[#ff9500] tabular-nums">
                    #14 / 1,420
                  </span>
                </div>

                {/* Timer Bar */}
                <div className="flex items-center justify-between bg-slate-900 dark:bg-slate-950 text-white p-3.5 rounded-2xl border-2 border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <AppleEmoji emoji="⏱️" size={16} />
                    <div>
                      <div className="font-black text-[10px] text-slate-500 uppercase">
                        Odak Odası
                      </div>
                      <div className="font-black text-lg text-[#10B981] tabular-nums leading-none">
                        130:00
                      </div>
                    </div>
                  </div>
                  <span className="font-black text-[10px] px-3 py-1.5 rounded-xl bg-[#10B981] text-white border-2 border-b-4 border-[#10B981] border-b-[#0e9f6e]">
                    Başlat
                  </span>
                </div>
              </div>
            </Tilt>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PLATFORM FEATURES — 4 MODULE SHOWCASE
      ════════════════════════════════════════════════════════ */}
      <section
        id="ozellikler"
        className="relative z-10 py-20 sm:py-28 px-4 sm:px-8 max-w-6xl mx-auto"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-14 space-y-3"
        >
          <motion.span
            variants={fadeUp}
            className="font-black text-xs sm:text-sm text-[#1cb0f6] uppercase tracking-widest bg-[#1cb0f6]/10 px-4 py-1.5 rounded-xl border border-[#1cb0f6]/20 inline-block"
          >
            Platformun Gücü
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight"
          >
            Her Şey{" "}
            <span className="text-[#1cb0f6]">Tek Çatı Altında</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="font-extrabold text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto"
          >
            Puan tahmini, karşılaştırma, analiz ve sınav provası — KPSS
            hazırlığınızın tüm araçları burada.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 gap-6"
        >
          {FEATURES.map((feat) => (
            <motion.div key={feat.title} variants={fadeUp}>
              <div className="group bg-white dark:bg-slate-800 rounded-[2.5rem] p-7 sm:p-9 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                {/* Icon & Badge Row */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-b-4 shadow-sm group-hover:scale-110 transition-transform duration-300"
                    style={{
                      backgroundColor: `${feat.color}12`,
                      borderColor: `${feat.color}35`,
                    }}
                  >
                    <AppleEmoji emoji={feat.emoji} size={28} />
                  </div>
                  <span
                    className="font-black text-[10px] px-3 py-1.5 rounded-xl border-2"
                    style={{
                      color: feat.color,
                      backgroundColor: `${feat.color}12`,
                      borderColor: `${feat.color}25`,
                    }}
                  >
                    {feat.badge}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight mb-3">
                  {feat.title}
                </h3>
                <p className="font-extrabold text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  {feat.desc}
                </p>

                {/* Bottom Arrow */}
                <div className="mt-6 pt-4 border-t-2 border-slate-100 dark:border-slate-700/50">
                  <span
                    className="flex items-center gap-2 font-black text-xs group-hover:gap-3 transition-all"
                    style={{ color: feat.color }}
                  >
                    Keşfet <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SUBJECT IDENTITY COLORS — 5 DERS
      ════════════════════════════════════════════════════════ */}
      <section
        id="dersler"
        className="relative z-10 py-20 sm:py-28 px-4 sm:px-8 bg-white dark:bg-slate-900/60 border-y-2 border-slate-200/80 dark:border-slate-800"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14 space-y-3"
          >
            <motion.span
              variants={fadeUp}
              className="font-black text-xs sm:text-sm text-[#ff9500] uppercase tracking-widest bg-[#ff9500]/10 px-4 py-1.5 rounded-xl border border-[#ff9500]/20 inline-block"
            >
              ÖSYM Müfredatı
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight"
            >
              5 Ders,{" "}
              <span className="text-[#ff9500]">120 Soru</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="font-extrabold text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto"
            >
              Her dersin soru dağılımı ve ağırlığı, ÖSYM standart branş kimlik
              renkleriyle kodlanmıştır.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5"
          >
            {SUBJECTS.map((sub) => (
              <motion.div key={sub.title} variants={fadeUp}>
                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} perspective={1000}>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-[2rem] p-5 sm:p-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all text-center space-y-3 h-full flex flex-col items-center justify-between group">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-b-4 shadow-sm group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: `${sub.color}12`,
                        borderColor: `${sub.color}35`,
                      }}
                    >
                      <AppleEmoji emoji={sub.emoji} size={28} />
                    </div>

                    {/* Title + Desc */}
                    <div className="space-y-1">
                      <h3 className="font-black text-base text-slate-900 dark:text-white">
                        {sub.title}
                      </h3>
                      <p className="font-extrabold text-[11px] text-slate-400 dark:text-slate-500 leading-snug">
                        {sub.desc}
                      </p>
                    </div>

                    {/* Question Count Chip */}
                    <span
                      className="font-black text-xs px-4 py-1.5 rounded-xl border-2 border-b-4"
                      style={{
                        color: sub.color,
                        backgroundColor: `${sub.color}12`,
                        borderColor: `${sub.color}30`,
                      }}
                    >
                      {sub.q} Soru
                    </span>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          EXAM TYPES — 4 SINAV TÜRÜ
      ════════════════════════════════════════════════════════ */}
      <section
        id="sinavlar"
        className="relative z-10 py-20 sm:py-28 px-4 sm:px-8 max-w-6xl mx-auto"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-14 space-y-3"
        >
          <motion.span
            variants={fadeUp}
            className="font-black text-xs sm:text-sm text-[#af52de] uppercase tracking-widest bg-[#af52de]/10 px-4 py-1.5 rounded-xl border border-[#af52de]/20 inline-block"
          >
            Tam Uyumluluk
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight"
          >
            4 Sınav Türü{" "}
            <span className="text-[#af52de]">Destekleniyor</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {EXAM_TYPES.map((exam) => (
            <motion.div key={exam.title} variants={fadeUp}>
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col justify-between group">
                <div>
                  {/* Icon + Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-b-4 shadow-sm"
                      style={{
                        backgroundColor: `${exam.color}12`,
                        borderColor: `${exam.color}35`,
                      }}
                    >
                      <AppleEmoji emoji={exam.emoji} size={24} />
                    </div>
                    <span
                      className="font-black text-[10px] px-3 py-1 rounded-xl border-2"
                      style={{
                        color: exam.color,
                        backgroundColor: `${exam.color}12`,
                        borderColor: `${exam.color}25`,
                      }}
                    >
                      {exam.badge}
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2">
                    {exam.title}
                  </h3>
                  <p className="font-extrabold text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {exam.desc}
                  </p>
                </div>

                {/* Stats Footer */}
                <div className="mt-5 pt-4 border-t-2 border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs font-black text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <AppleEmoji emoji="📝" size={14} /> {exam.q} Soru
                  </span>
                  <span className="flex items-center gap-1.5">
                    <AppleEmoji emoji="⏱️" size={14} /> {exam.dur} Dk
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          INTERACTIVE SCORE SIMULATOR
      ════════════════════════════════════════════════════════ */}
      <section
        id="simulasyon"
        className="relative z-10 py-20 sm:py-28 px-4 sm:px-8 bg-white dark:bg-slate-900/60 border-y-2 border-slate-200/80 dark:border-slate-800"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14 space-y-3"
          >
            <motion.span
              variants={fadeUp}
              className="font-black text-xs sm:text-sm text-[#10B981] uppercase tracking-widest bg-[#10B981]/10 px-4 py-1.5 rounded-xl border border-[#10B981]/20 inline-block"
            >
              Canlı Puan Hesaplayıcı
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight"
            >
              Hedefin İçin{" "}
              <span className="text-[#10B981]">Kaç Net Lazım?</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="font-extrabold text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto"
            >
              Slider&apos;ları sürükleyin, ÖSYM regresyon modelimiz tahmini puanınızı anında hesaplasın.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-10 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xl"
          >
            <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-stretch">
              {/* ── Sliders ── */}
              <div className="lg:col-span-7 space-y-6">
                {/* GY Slider */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-black text-sm text-slate-800 dark:text-white flex items-center gap-2">
                      <AppleEmoji emoji="📘" size={20} />
                      Genel Yetenek (GY)
                    </label>
                    <span className="font-black text-lg text-[#1cb0f6] bg-[#1cb0f6]/10 px-3 py-1 rounded-xl border border-[#1cb0f6]/25 tabular-nums">
                      {gyNet} Net
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    step={0.25}
                    value={gyNet}
                    onChange={(e) => setGyNet(parseFloat(e.target.value))}
                    className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1cb0f6]"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-400 mt-2 tabular-nums">
                    <span>0</span>
                    <span>15</span>
                    <span>30</span>
                    <span>45</span>
                    <span>60</span>
                  </div>
                </div>

                {/* GK Slider */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-black text-sm text-slate-800 dark:text-white flex items-center gap-2">
                      <AppleEmoji emoji="🏛️" size={20} />
                      Genel Kültür (GK)
                    </label>
                    <span className="font-black text-lg text-[#ff9500] bg-[#ff9500]/10 px-3 py-1 rounded-xl border border-[#ff9500]/25 tabular-nums">
                      {gkNet} Net
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    step={0.25}
                    value={gkNet}
                    onChange={(e) => setGkNet(parseFloat(e.target.value))}
                    className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#ff9500]"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-400 mt-2 tabular-nums">
                    <span>0</span>
                    <span>15</span>
                    <span>30</span>
                    <span>45</span>
                    <span>60</span>
                  </div>
                </div>

                {/* Total Net Summary */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-black text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <AppleEmoji emoji="📊" size={18} /> Toplam Net
                  </span>
                  <span className="font-black text-xl text-slate-900 dark:text-white tabular-nums">
                    {(gyNet + gkNet).toFixed(2)} / 120
                  </span>
                </div>

                {/* Confetti Button */}
                <button
                  type="button"
                  onClick={triggerConfetti}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1cb0f6] to-[#af52de] text-white font-black text-sm border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] active:border-b-2 active:translate-y-0.5 hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <AppleEmoji emoji="🎉" size={20} />
                  Kutlama Konfetisi Patlat!
                </button>
              </div>

              {/* ── Score Results ── */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {/* P3 Main Score */}
                <div className="bg-gradient-to-br from-[#1cb0f6]/10 via-[#af52de]/5 to-[#10B981]/10 dark:from-[#1cb0f6]/15 dark:via-[#af52de]/8 dark:to-[#10B981]/15 p-6 sm:p-8 rounded-[2rem] border-2 border-b-4 border-[#1cb0f6]/25 text-center space-y-2 flex-1 flex flex-col items-center justify-center">
                  <span className="font-black text-[10px] uppercase tracking-widest text-[#1cb0f6]">
                    Tahmini KPSS P3 Puanı
                  </span>
                  <motion.div
                    key={p3.toFixed(2)}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="font-black text-5xl sm:text-6xl text-slate-900 dark:text-white tabular-nums"
                  >
                    {p3.toFixed(2)}
                  </motion.div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#10B981]">
                    <ShieldCheck className="w-4 h-4" />
                    %98.3 ÖSYM Kalibrasyon
                  </div>
                </div>

                {/* P1 & P2 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 text-center space-y-1">
                    <span className="font-black text-[10px] uppercase text-[#af52de] tracking-wider">
                      P1 Puanı
                    </span>
                    <div className="font-black text-2xl text-slate-900 dark:text-white tabular-nums">
                      {p1.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 text-center space-y-1">
                    <span className="font-black text-[10px] uppercase text-[#10B981] tracking-wider">
                      P2 Puanı
                    </span>
                    <div className="font-black text-2xl text-slate-900 dark:text-white tabular-nums">
                      {p2.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* İsabet Oranı */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-center">
                  <span className="font-black text-[10px] uppercase text-slate-400 tracking-wider">
                    İsabet Oranı
                  </span>
                  <div className="font-black text-xl text-slate-900 dark:text-white tabular-nums">
                    {(((gyNet + gkNet) / 120) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FAQ — SIKÇA SORULAN SORULAR
      ════════════════════════════════════════════════════════ */}
      <section
        id="sss"
        className="relative z-10 py-20 sm:py-28 px-4 sm:px-8 max-w-3xl mx-auto"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-14 space-y-3"
        >
          <motion.span
            variants={fadeUp}
            className="font-black text-xs sm:text-sm text-[#5856d6] uppercase tracking-widest bg-[#5856d6]/10 px-4 py-1.5 rounded-xl border border-[#5856d6]/20 inline-block"
          >
            Sıkça Sorulan Sorular
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight"
          >
            Merak Ettiklerin
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="space-y-4"
        >
          {FAQ_ITEMS.map((item, i) => (
            <motion.div key={i} variants={fadeUp}>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer group"
                >
                  <span className="font-black text-sm sm:text-base text-slate-800 dark:text-white pr-4">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-[#1cb0f6]/10 group-hover:text-[#1cb0f6] transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 font-extrabold text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t-2 border-slate-100 dark:border-slate-700/50 pt-4">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER CTA
      ════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 sm:py-28 px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-[#1cb0f6] via-[#1cb0f6] to-[#af52de] rounded-[2.5rem] p-10 sm:p-16 text-center text-white border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-2xl relative overflow-hidden"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="font-black text-xs">Hemen Başla, Tamamen Ücretsiz</span>
            </div>

            <h2 className="font-black text-3xl sm:text-5xl tracking-tight leading-tight">
              KPSS 2026&apos;da Hedefine{" "}
              <br className="hidden sm:inline" />
              Emin Adımlarla Ulaş.
            </h2>

            <p className="font-extrabold text-white/80 text-sm sm:text-base max-w-lg mx-auto">
              Google hesabınla 30 saniyede kayıt ol, netlerini gir ve
              sıralaman ile puanını anında keşfet.
            </p>

            <button
              onClick={signInWithGoogle}
              type="button"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-[#1cb0f6] font-black text-lg border-2 border-b-4 border-white border-b-slate-200 active:border-b-2 active:translate-y-0.5 shadow-xl hover:scale-[1.03] transition-all cursor-pointer"
            >
              <AppleEmoji emoji="🚀" size={22} />
              <span>Google ile Ücretsiz Başla</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 py-10 px-4 sm:px-8 border-t-2 border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl tracking-tighter text-slate-800 dark:text-white">
              KPSS<span className="text-[#1cb0f6]">2</span>
              <span className="text-[#10B981]">X</span>
            </span>
            <span className="text-xs font-extrabold text-slate-400">
              © 2026 Tüm hakları saklıdır.
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-extrabold text-slate-400">
            <span>Made with</span>
            <AppleEmoji emoji="🔥" size={14} />
            <span>for KPSS Adayları</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
