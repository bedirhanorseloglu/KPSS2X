"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  ChevronDown,
  Flame,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BookOpen,
  Users,
  Award,
  Filter,
} from "lucide-react";
import { useState, useRef, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import Tilt from "react-parallax-tilt";
import CountUp from "react-countup";
import AppleEmoji from "@/components/AppleEmoji";
import {
  estimateP3Score,
  estimateP1Score,
  estimateP2Score,
} from "@/lib/denemeUtils";

/* ═══════════════════════════════════════════════════════════════
   1. EXAM MODES & DATA
═══════════════════════════════════════════════════════════════ */
const EXAM_MODES = [
  {
    id: "lisans",
    title: "KPSS Lisans",
    badge: "P3 Puanı",
    color: "#1cb0f6",
    emoji: "🎓",
    desc: "4 yıllık fakülte mezunlarının mühendislik, mimarlık ve memurluk atamalarında geçerli temel sınav.",
    questions: 120,
    duration: 130,
    validity: "2 Yıl",
  },
  {
    id: "onlisans",
    title: "KPSS Önlisans",
    badge: "P93 Puanı",
    color: "#af52de",
    emoji: "📘",
    desc: "2 yıllık meslek yüksekokulu ve önlisans mezunlarının B grubu kadrolara atanması için kullanılan puan.",
    questions: 120,
    duration: 130,
    validity: "2 Yıl",
  },
  {
    id: "ortaogretim",
    title: "KPSS Ortaöğretim",
    badge: "P94 Puanı",
    color: "#58cc02",
    emoji: "🏫",
    desc: "Lise ve dengi okul mezunu adayların kamu memurluklarına yerleştirilmesinde esas alınan puan.",
    questions: 120,
    duration: 130,
    validity: "2 Yıl",
  },
  {
    id: "ekpss",
    title: "EKPSS (Engelli)",
    badge: "EKSSP1/2/3",
    color: "#ff9500",
    emoji: "♿",
    desc: "%40 ve üzeri engeli bulunan adayların kamu kurumlarında istihdam edilmesi için düzenlenen özel sınav.",
    questions: 60,
    duration: 60,
    validity: "4 Yıl",
  },
];

const SUBJECTS = [
  { title: "Türkçe",          emoji: "📘", color: "#1cb0f6", q: 30, qEkpss: 15 },
  { title: "Matematik",       emoji: "🔢", color: "#af52de", q: 30, qEkpss: 15 },
  { title: "Tarih",           emoji: "🏛️", color: "#ff9500", q: 27, qEkpss: 10 },
  { title: "Coğrafya",        emoji: "🗺️", color: "#58cc02", q: 18, qEkpss: 8  },
  { title: "Vatandaşlık",     emoji: "⚖️", color: "#5856d6", q: 9,  qEkpss: 4  },
  { title: "Güncel Bilgiler", emoji: "🌍", color: "#ff2d55", q: 6,  qEkpss: 3  },
];

/* ═══════════════════════════════════════════════════════════════
   2. SYSTEM MODULES (REAL EXISTING PLATFORM FEATURES)
═══════════════════════════════════════════════════════════════ */
const CORE_SYSTEMS = [
  {
    title: "1. ÖSYM Regresyon Puan Tahmini",
    desc: "11 onaylanmış ÖSYM belgesiyle kalibre edilen algoritma sayesinde, girdiğiniz netlerin sınav gününde tam olarak kaç puana karşılık geleceğini virgülden sonra iki basamağına kadar hesaplıyoruz.",
    benefit: "%98.3 Puan Doğruluğu",
    icon: BarChart3,
    color: "#1cb0f6",
  },
  {
    title: "2. Türkiye Geneli Aday Karşılaştırma",
    desc: "Netlerinizi girerek Türkiye genelindeki diğer adaylarla kendinizi hem Genel Deneme hem de Branş Denemeleri (Türkçe, Matematik, Tarih vb.) bazında anlık olarak karşılaştırın.",
    benefit: "Genel & Branş Sıralaması",
    icon: Users,
    color: "#ff9500",
  },
  {
    title: "3. Deneme & Konu Takip Paneli",
    desc: "Çözdüğünüz her denemenin ardından doğru, yanlış ve net istatistiklerinizi kaydedin. Konu bazlı ilerlemenizi ve net grafiğinizi zaman içinde takip edin.",
    benefit: "Görsel İlerleme Analizi",
    icon: BookOpen,
    color: "#af52de",
  },
  {
    title: "4. 130 Dakika ÖSYM Odak Odası",
    desc: "Optik form doldurma simülasyonu, gerçek sınav sayacı ve ortam sesleri ile sınav günündeki zaman baskısını evinizde tecrübe edin, kaygıyı sıfırlayın.",
    benefit: "Sınav Günü Stres Yönetimi",
    icon: Clock,
    color: "#58cc02",
  },
];

/* ═══════════════════════════════════════════════════════════════
   3. MAIN LANDING PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const { signInWithGoogle } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Navbar Hide/Show
  const [navVisible, setNavVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setNavVisible(latest < lastY || latest < 0.04);
    setLastY(latest);
  });

  // Active Interactive Tab in Showcase Section
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<
    "tahmin" | "karsilastirma" | "analiz" | "odak"
  >("tahmin");

  // Simulator State
  const [activeExamMode, setActiveExamMode] = useState("lisans");
  const [gyNet, setGyNet] = useState(48);
  const [gkNet, setGkNet] = useState(42);

  const p3 = estimateP3Score(gyNet, gkNet);
  const p1 = estimateP1Score(gyNet, gkNet);
  const p2 = estimateP2Score(gyNet, gkNet);

  const selectedExam = useMemo(
    () => EXAM_MODES.find((e) => e.id === activeExamMode)!,
    [activeExamMode]
  );

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 85,
      origin: { y: 0.6 },
      colors: ["#1cb0f6", "#58cc02", "#ff9500", "#af52de", "#ff2d55"],
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-[#1cb0f6]/20 overflow-x-hidden font-sans"
      style={{ fontFamily: "var(--font-nunito), sans-serif" }}
    >
      {/* ── Top Neon Progress Line ── */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1cb0f6] via-[#af52de] to-[#58cc02] z-[70] origin-left shadow-sm"
      />

      {/* ── Background Gradients & Soft Micro Dots ── */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-slate-50 to-slate-100" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#1cb0f6]/5 blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#af52de]/5 blur-3xl pointer-events-none z-0" />
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* ════════════════════════════════════════════════════════════
          FLOATING LIGHT NAVBAR
      ════════════════════════════════════════════════════════════ */}
      <motion.header
        animate={{ y: navVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 py-3.5 px-4 sm:px-8 flex justify-center pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center justify-between w-full max-w-6xl mx-auto rounded-2xl sm:rounded-[2rem] px-5 py-3 bg-white/90 backdrop-blur-xl border-2 border-b-4 border-slate-200/90 shadow-lg">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="font-black text-2xl sm:text-3xl tracking-tight text-slate-800 flex items-center gap-1.5">
              KPSS
              <span className="inline-flex items-center px-2.5 py-0.5 text-sm sm:text-base rounded-xl bg-[#1cb0f6] text-white font-black border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6]">
                2<span className="text-[#58cc02] ml-0.5">X</span>
              </span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-black text-slate-600">
            <a href="#tanitim" className="hover:text-[#1cb0f6] transition-colors">Platform</a>
            <a href="#sinavlar" className="hover:text-[#1cb0f6] transition-colors">Sınav Türleri</a>
            <a href="#simulasyon" className="hover:text-[#1cb0f6] transition-colors">Net Simülatörü</a>
            <a href="#sss" className="hover:text-[#1cb0f6] transition-colors">SSS</a>
          </nav>

          {/* CTA */}
          <button
            onClick={signInWithGoogle}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl sm:rounded-2xl bg-[#1cb0f6] text-white font-black text-xs sm:text-sm border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-md hover:scale-105 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Giriş Yap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.header>

      {/* ════════════════════════════════════════════════════════════
          HERO SECTION — ASYMMETRIC EDITORIAL SPLIT
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-36 sm:pt-48 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column — Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border-2 border-b-4 border-slate-200 shadow-md"
            >
              <Flame className="w-4 h-4 text-[#ff9500] animate-pulse" />
              <span className="font-black text-xs sm:text-sm text-slate-700">
                Lisans · Önlisans · Ortaöğretim · EKPSS
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-slate-900 leading-[1.08]"
            >
              KPSS Hazırlığında <br className="hidden sm:inline" />
              <span className="text-[#1cb0f6] underline decoration-[#1cb0f6]/30 decoration-wavy underline-offset-8">
                Netlerini Katlayan
              </span>{" "}
              Akıllı Platform.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-extrabold text-slate-600 text-base sm:text-xl leading-relaxed max-w-2xl"
            >
              Netlerinizi girin; hem genel hem de branş bazında Türkiye geneli adaylarla kendinizi anında kıyaslayın, ÖSYM puanınızı görün.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <button
                onClick={signInWithGoogle}
                type="button"
                className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-[#1cb0f6] text-white font-black text-base sm:text-lg border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xl hover:scale-105 active:translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <AppleEmoji emoji="🚀" size={24} />
                <span>Google İle Başla (%100 Ücretsiz)</span>
              </button>

              <a
                href="#simulasyon"
                className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-white text-slate-800 font-black text-base sm:text-lg border-2 border-b-4 border-slate-200 hover:border-slate-300 shadow-md hover:scale-105 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Netini Gir, Puanını Gör</span>
                <ArrowRight className="w-5 h-5 text-[#1cb0f6]" />
              </a>
            </motion.div>

            {/* Social Proof Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-6 grid grid-cols-3 gap-4 border-t-2 border-slate-200/80"
            >
              <div>
                <div className="font-black text-2xl sm:text-3xl text-slate-900">%98.3</div>
                <div className="font-extrabold text-xs text-slate-500">Puan Doğruluğu</div>
              </div>
              <div>
                <div className="font-black text-2xl sm:text-3xl text-[#58cc02]">4 Sınav</div>
                <div className="font-extrabold text-xs text-slate-500">Lisans/Ön/Orta/EKPSS</div>
              </div>
              <div>
                <div className="font-black text-2xl sm:text-3xl text-[#af52de]">0₺</div>
                <div className="font-extrabold text-xs text-slate-500">Tamamen Ücretsiz</div>
              </div>
            </motion.div>

          </div>

          {/* Right Column — Live Dashboard Mockup Preview */}
          <div className="lg:col-span-5">
            <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} perspective={1000} glareEnable glareMaxOpacity={0.1} glareBorderRadius="2.5rem">
              <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-b-4 border-slate-200 shadow-2xl space-y-6">
                
                {/* Header Widget */}
                <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff2d55]" />
                    <div className="w-3 h-3 rounded-full bg-[#ff9500]" />
                    <div className="w-3 h-3 rounded-full bg-[#58cc02]" />
                    <span className="font-black text-xs text-slate-400 ml-2">KPSS2X Canlı Panel</span>
                  </div>
                  <span className="font-black text-xs text-[#1cb0f6] bg-[#1cb0f6]/10 px-3 py-1 rounded-xl border border-[#1cb0f6]/20">
                    Sistem Aktif
                  </span>
                </div>

                {/* Score Prediction Mock Card */}
                <div className="bg-gradient-to-br from-[#1cb0f6]/10 via-[#af52de]/10 to-slate-50 p-5 rounded-2xl border-2 border-b-4 border-[#1cb0f6]/30 flex items-center justify-between">
                  <div>
                    <span className="font-black text-[10px] uppercase text-[#1cb0f6] tracking-wider">Tahmini KPSS P3</span>
                    <div className="font-black text-4xl text-slate-900">89.42</div>
                    <span className="font-bold text-xs text-[#58cc02] flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3.5 h-3.5" /> Son denemeden +3.2 Net artış
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1cb0f6] text-white flex items-center justify-center font-black shadow-md border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6]">
                    <AppleEmoji emoji="🎯" size={24} />
                  </div>
                </div>

                {/* Türkiye Geneli Sıralama Mock Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-black text-[#ff9500]">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Türkiye Geneli Sıralamanız</span>
                    <span className="bg-[#ff9500]/10 px-2 py-0.5 rounded-lg border border-[#ff9500]/30">Genel & Branş</span>
                  </div>
                  <div className="flex items-center justify-between font-extrabold text-xs text-slate-800">
                    <span>Genel Deneme Sıralaması: <strong className="text-slate-900 font-black">#14 / 1,420</strong></span>
                    <span>Matematik Branşı: <strong className="text-[#af52de] font-black">#3</strong></span>
                  </div>
                </div>

                {/* 130m Timer Bar */}
                <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl border-2 border-slate-800">
                  <div className="flex items-center gap-3">
                    <AppleEmoji emoji="⏱️" size={22} />
                    <div>
                      <div className="font-black text-xs text-slate-400 uppercase">ÖSYM Odak Odası</div>
                      <div className="font-black text-lg text-[#58cc02]">130 : 00 Dakika</div>
                    </div>
                  </div>
                  <span className="font-black text-xs px-3 py-1.5 rounded-xl bg-[#58cc02] text-white border-2 border-b-4 border-[#58cc02] border-b-[#46a302]">
                    Başlat
                  </span>
                </div>

              </div>
            </Tilt>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PLATFORM SHOWCASE (Tablı İnteraktif Paneli)
      ════════════════════════════════════════════════════════════ */}
      <section id="tanitim" className="relative z-10 py-20 sm:py-28 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="font-black text-xs sm:text-sm text-[#1cb0f6] uppercase tracking-widest bg-[#1cb0f6]/10 px-4 py-1.5 rounded-xl border border-[#1cb0f6]/20 inline-block mb-3">
            Sistemin Gücü
          </span>
          <h2 className="font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
            Neler Yapabilirsiniz? <span className="text-[#1cb0f6]">Canlı Keşfedin</span>
          </h2>
        </div>

        {/* Showcase Tabs */}
        <div className="flex items-center justify-center gap-3 mb-10 overflow-x-auto pb-2">
          {[
            { id: "tahmin", label: "Puan Tahmin Motoru", emoji: "📊", color: "#1cb0f6" },
            { id: "karsilastirma", label: "Türkiye Karşılaştırması", emoji: "👥", color: "#ff9500" },
            { id: "analiz", label: "Deneme Takip Paneli", emoji: "📘", color: "#af52de" },
            { id: "odak", label: "130 Dk Odak Odası", emoji: "⏱️", color: "#58cc02" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveShowcaseTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black border-2 border-b-4 transition-all cursor-pointer shrink-0 ${
                activeShowcaseTab === tab.id
                  ? "text-white shadow-md scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
              style={
                activeShowcaseTab === tab.id
                  ? {
                      backgroundColor: tab.color,
                      borderColor: tab.color,
                      borderBottomColor: `color-mix(in srgb, ${tab.color} 75%, black)`,
                    }
                  : undefined
              }
            >
              <AppleEmoji emoji={tab.emoji} size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeShowcaseTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[2.5rem] p-7 sm:p-10 border-2 border-b-4 border-slate-200 shadow-xl"
          >
            {activeShowcaseTab === "tahmin" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="font-black text-xs text-[#1cb0f6] bg-[#1cb0f6]/10 px-3 py-1 rounded-xl border border-[#1cb0f6]/20">
                    ÖSYM Algoritması
                  </span>
                  <h3 className="font-black text-2xl sm:text-3xl text-slate-900">
                    11 Onaylanmış ÖSYM Belgesiyle Eğitilmiş Regresyon
                  </h3>
                  <p className="font-extrabold text-slate-600 text-sm sm:text-base leading-relaxed">
                    Tahmini netlerinizi girdiğiniz anda virgülden sonra iki basamak hassasiyetle KPSS Lisans P3, Önlisans P93 veya Ortaöğretim P94 puanınızı görün.
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 space-y-4 text-center">
                  <span className="font-black text-xs uppercase text-slate-500">Örnek Lisans P3 Hesabı</span>
                  <div className="font-black text-5xl text-[#1cb0f6]">91.84 Puan</div>
                  <div className="text-xs font-bold text-slate-500">GY: 52.5 Net · GK: 46.0 Net</div>
                </div>
              </div>
            )}

            {activeShowcaseTab === "karsilastirma" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="font-black text-xs text-[#ff9500] bg-[#ff9500]/10 px-3 py-1 rounded-xl border border-[#ff9500]/20">
                    Aday Karşılaştırması
                  </span>
                  <h3 className="font-black text-2xl sm:text-3xl text-slate-900">
                    Hem Genel Hem Branş Bazında Türkiye Sıralamanız
                  </h3>
                  <p className="font-extrabold text-slate-600 text-sm sm:text-base leading-relaxed">
                    Girdiğiniz her genel deneme ve branş denemesi netiyle, Türkiye genelindeki diğer tüm KPSS adayları arasındaki canlı sıralamanızı anında görün.
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-slate-200">
                    <span className="font-black text-sm text-slate-900 flex items-center gap-2">🥇 1. Mehmet A. (Lisans)</span>
                    <span className="font-black text-xs text-[#ff9500]">108.50 Net</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#1cb0f6]/10 rounded-xl border-2 border-[#1cb0f6]">
                    <span className="font-black text-sm text-slate-900 flex items-center gap-2">🥈 2. Sen (Aday)</span>
                    <span className="font-black text-xs text-[#1cb0f6]">98.25 Net</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-slate-200">
                    <span className="font-black text-sm text-slate-900 flex items-center gap-2">🥉 3. Elif K. (Türkçe Branş)</span>
                    <span className="font-black text-xs text-[#af52de]">28.75 Net</span>
                  </div>
                </div>
              </div>
            )}

            {activeShowcaseTab === "analiz" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="font-black text-xs text-[#af52de] bg-[#af52de]/10 px-3 py-1 rounded-xl border border-[#af52de]/20">
                    Detaylı İstatistik Takibi
                  </span>
                  <h3 className="font-black text-2xl sm:text-3xl text-slate-900">
                    Çözdüğünüz Tüm Denemelerin Net Grafik Paneli
                  </h3>
                  <p className="font-extrabold text-slate-600 text-sm sm:text-base leading-relaxed">
                    Tüm branşlardaki doğru, yanlış ve boş sayılarınızı kaydedin. Zaman içindeki net yükselişinizi ve ortalama performansınızı görsel olarak takip edin.
                  </p>
                </div>
                <div className="bg-[#af52de]/10 p-6 rounded-2xl border-2 border-[#af52de]/30 space-y-3">
                  <div className="flex items-center gap-2 font-black text-sm text-[#af52de]">
                    <AppleEmoji emoji="📘" size={20} /> Deneme İstatistiği Örneği
                  </div>
                  <p className="font-extrabold text-sm text-slate-800 leading-relaxed">
                    &ldquo;Son 5 deneme ortalamanız: GY 48.50 Net, GK 41.25 Net. Hedef puanınıza ulaşmak için 4.25 Net daha artış gerekiyor.&rdquo;
                  </p>
                </div>
              </div>
            )}

            {activeShowcaseTab === "odak" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="font-black text-xs text-[#58cc02] bg-[#58cc02]/10 px-3 py-1 rounded-xl border border-[#58cc02]/20">
                    Sınav Provası
                  </span>
                  <h3 className="font-black text-2xl sm:text-3xl text-slate-900">
                    130 Dakikalık Gerçek Sınav Sayacı & Optik Form
                  </h3>
                  <p className="font-extrabold text-slate-600 text-sm sm:text-base leading-relaxed">
                    Sınav günü süre yetiştirememe stresine son verin. Optik form işaretleme simülasyonu ve geri sayım sayacıyla evinizde tam prova yapın.
                  </p>
                </div>
                <div className="bg-slate-900 text-white p-8 rounded-2xl border-2 border-slate-800 text-center space-y-2">
                  <div className="font-black text-5xl text-[#58cc02]">130 : 00</div>
                  <div className="font-black text-xs text-slate-400 uppercase">ÖSYM Lisans Süre Sayacı</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ════════════════════════════════════════════════════════════
          EXAM MODES STRIP (4 Sınav Türü)
      ════════════════════════════════════════════════════════════ */}
      <section id="sinavlar" className="relative z-10 py-20 sm:py-28 px-4 sm:px-8 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="font-black text-xs sm:text-sm text-[#ff9500] uppercase tracking-widest bg-[#ff9500]/10 px-4 py-1.5 rounded-xl border border-[#ff9500]/20 inline-block mb-3">
              Tüm Adaylar İçin
            </span>
            <h2 className="font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
              4 Ana Sınav Türü <span className="text-[#ff9500]">Destekleniyor</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXAM_MODES.map((exam, i) => (
              <Tilt key={i} tiltMaxAngleX={8} tiltMaxAngleY={8} perspective={1000}>
                <div className="bg-slate-50 rounded-[2rem] p-6 border-2 border-b-4 border-slate-200 shadow-md flex flex-col justify-between h-full group hover:border-[#1cb0f6] transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-b-4 shadow-2xs"
                        style={{
                          backgroundColor: `${exam.color}15`,
                          borderColor: `${exam.color}40`,
                        }}
                      >
                        <AppleEmoji emoji={exam.emoji} size={26} />
                      </div>
                      <span
                        className="font-black text-xs px-3 py-1 rounded-xl border-2 border-b-2"
                        style={{
                          color: exam.color,
                          backgroundColor: `${exam.color}15`,
                          borderColor: `${exam.color}30`,
                        }}
                      >
                        {exam.badge}
                      </span>
                    </div>

                    <h3 className="font-black text-xl text-slate-900 mb-2">
                      {exam.title}
                    </h3>
                    <p className="font-extrabold text-xs text-slate-600 leading-relaxed mb-4">
                      {exam.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between text-xs font-black text-slate-700">
                    <span>{exam.questions} Soru</span>
                    <span>{exam.duration} Dk</span>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          INTERACTIVE SCORE SIMULATOR SECTION
      ════════════════════════════════════════════════════════════ */}
      <section id="simulasyon" className="relative z-10 py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="font-black text-xs sm:text-sm text-[#58cc02] uppercase tracking-widest bg-[#58cc02]/10 px-4 py-1.5 rounded-xl border border-[#58cc02]/20 inline-block mb-3">
            Canlı Puan Hesaplayıcı
          </span>
          <h2 className="font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
            Hedefindeki Puan İçin <span className="text-[#58cc02]">Kaç Net Lazım?</span>
          </h2>
          <p className="font-extrabold text-slate-600 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Slider&apos;ları sürükleyin; ÖSYM regresyon modelimiz tahmini KPSS P3 puanınızı anında hesaplasın.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[2.5rem] p-6 sm:p-10 border-2 border-b-4 border-slate-200 shadow-xl"
        >
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Sliders Area */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* GY Slider */}
              <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-black text-sm text-slate-800 flex items-center gap-2">
                    <AppleEmoji emoji="📘" size={20} />
                    <span>Genel Yetenek (GY) Neti</span>
                  </label>
                  <span className="font-black text-xl text-[#1cb0f6] bg-[#1cb0f6]/10 px-3 py-1 rounded-xl border border-[#1cb0f6]/30">
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
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1cb0f6]"
                />
              </div>

              {/* GK Slider */}
              <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-black text-sm text-slate-800 flex items-center gap-2">
                    <AppleEmoji emoji="🌍" size={20} />
                    <span>Genel Kültür (GK) Neti</span>
                  </label>
                  <span className="font-black text-xl text-[#ff9500] bg-[#ff9500]/10 px-3 py-1 rounded-xl border border-[#ff9500]/30">
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
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ff9500]"
                />
              </div>

              {/* Total & Reset */}
              <div className="flex items-center justify-between pt-2">
                <div className="font-black text-sm text-slate-600">
                  Toplam Net: <span className="text-slate-900 text-lg font-black ml-1">{gyNet + gkNet} / 120</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setGyNet(48); setGkNet(42); }}
                  className="font-black text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Sıfırla
                </button>
              </div>
            </div>

            {/* Score Display Card */}
            <div className="lg:col-span-5">
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000}>
                <div className="bg-gradient-to-br from-[#1cb0f6]/10 via-[#af52de]/10 to-slate-50 p-8 rounded-3xl border-2 border-b-4 border-[#1cb0f6]/30 text-center flex flex-col items-center justify-center space-y-5 shadow-md">
                  <span className="font-black text-xs uppercase tracking-widest text-[#1cb0f6] bg-white px-3 py-1 rounded-xl border border-[#1cb0f6]/30 shadow-2xs">
                    Tahmini KPSS P3 Puanı
                  </span>
                  
                  <div className="font-black text-6xl sm:text-7xl text-slate-900 tracking-tight drop-shadow-sm">
                    {p3.toFixed(2)}
                  </div>

                  <div className="flex items-center justify-center gap-6 w-full pt-3 border-t border-slate-200">
                    <div>
                      <div className="font-black text-xs text-slate-500 uppercase">P1 Puanı</div>
                      <div className="font-black text-xl text-slate-800">{p1.toFixed(2)}</div>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div>
                      <div className="font-black text-xs text-slate-500 uppercase">P2 Puanı</div>
                      <div className="font-black text-xl text-slate-800">{p2.toFixed(2)}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      triggerConfetti();
                      signInWithGoogle();
                    }}
                    type="button"
                    className="w-full py-3.5 rounded-2xl bg-[#58cc02] text-white font-black text-sm border-2 border-b-4 border-[#58cc02] border-b-[#46a302] shadow-lg hover:scale-105 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Bu Puanı Kaydet & Hedef Belirle</span>
                  </button>
                </div>
              </Tilt>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FAQ ACCORDION
      ════════════════════════════════════════════════════════════ */}
      <FaqSection />

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 text-center bg-white border-t border-slate-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gradient-to-b from-slate-50 to-white rounded-[2.5rem] p-8 sm:p-14 border-2 border-b-4 border-slate-200 shadow-xl"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#1cb0f6]/10 border-2 border-[#1cb0f6] text-[#1cb0f6] mb-6">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="font-black text-4xl sm:text-6xl text-slate-900 tracking-tight mb-4">
            KPSS Yolculuğunu <span className="text-[#1cb0f6]">Bugün Başlat.</span>
          </h2>
          <p className="font-extrabold text-slate-600 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Lisans, Önlisans, Ortaöğretim veya EKPSS — Mazeretleri bir kenara bırak. KPSS2X ile netlerini katlamaya hemen başla.
          </p>

          <button
            onClick={signInWithGoogle}
            type="button"
            className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-[#1cb0f6] text-white font-black text-lg sm:text-xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xl hover:scale-105 active:translate-y-0.5 transition-all inline-flex items-center justify-center gap-3 cursor-pointer"
          >
            <AppleEmoji emoji="⚡" size={24} />
            <span>Google ile Şimdi Başla</span>
          </button>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-slate-200 py-8 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-black text-xs">
          <span className="text-slate-500 flex items-center gap-2">
            <span className="text-slate-900 font-black text-base">KPSS<span className="text-[#1cb0f6]">2</span><span className="text-[#58cc02]">X</span></span> · Tüm KPSS & EKPSS Adayları İçin
          </span>
          <span className="text-slate-500 font-extrabold">
            © 2026 KPSS2X — Sınav yolculuğunuzda başarılar dileriz.
          </span>
        </div>
      </footer>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FAQ ACCORDION COMPONENT
══════════════════════════════════════════════════════════════════ */
function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  const items = [
    {
      q: "KPSS2X hangi sınav türlerini destekliyor?",
      a: "KPSS Lisans (P3), KPSS Önlisans (P93), KPSS Ortaöğretim (P94) ve EKPSS (EKSSP1/2/3) sınavlarının tamamını destekler. Deneme netlerinizi kaydedebilir, puan tahmini alabilir ve Türkiye geneli sıralama karşılaştırması yapabilirsiniz.",
    },
    {
      q: "Türkiye Geneli Karşılaştırma nasıl çalışır?",
      a: "Girdiğiniz Genel Deneme ve Branş Denemeleri (Türkçe, Matematik, Tarih vb.) netleri üzerinden sistem, Türkiye genelindeki diğer tüm KPSS2X kullanıcıları arasındaki anlık sıralamanızı ve başarı yüzdelenizi hesaplar.",
    },
    {
      q: "EKPSS ile KPSS arasındaki temel farklar nedir?",
      a: "EKPSS, %40 ve üzeri engeli bulunan adaylar için düzenlenen özel sınavdır. 60 soru / 60 dakikadır ve puanı 4 yıl geçerlidir. Standart KPSS ise 120 soru / 130 dakikadır ve puanı 2 yıl geçerlidir.",
    },
    {
      q: "Platform gerçekten tamamen ücretsiz mi?",
      a: "Evet! Puan hesaplama simülatörü, Türkiye geneli sıralama paneli, ÖSYM 130 dakikalık odak odası, konu takip paneli ve deneme takibi tüm adaylara tamamen ücretsiz sunulmaktadır.",
    },
  ];

  return (
    <section id="sss" className="relative z-10 py-20 sm:py-28 px-4 sm:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-14">
        <span className="font-black text-xs sm:text-sm text-[#af52de] uppercase tracking-widest bg-[#af52de]/10 px-4 py-1.5 rounded-xl border border-[#af52de]/20 inline-block mb-3">
          Aklına Takılanlar
        </span>
        <h2 className="font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Sıkça Sorulan <span className="text-[#af52de]">Sorular</span>
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border-2 border-b-4 border-slate-200 overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-black text-base sm:text-lg text-slate-900">{item.q}</span>
                <span className={`font-black text-2xl text-[#1cb0f6] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 font-extrabold text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
