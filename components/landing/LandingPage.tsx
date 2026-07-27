"use client";

import { useAuth } from "@/contexts/AuthContext";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, Zap, Sparkles, Trophy, Target, ShieldCheck, ChevronDown, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import AppleEmoji from "@/components/AppleEmoji";
import { estimateP3Score, estimateP1Score, estimateP2Score } from "@/lib/denemeUtils";

/* ── Subject Brand Colors (Rule #3) ── */
const SUBJECTS = [
  { title: "Türkçe",          emoji: "📘", color: "#1cb0f6", bg: "bg-[#e8f7ff] dark:bg-[#1cb0f6]/10", border: "border-[#1cb0f6]/30", q: 30, desc: "Paragraf, dil bilgisi ve sözel mantık" },
  { title: "Matematik",       emoji: "🔢", color: "#af52de", bg: "bg-[#f8f0fc] dark:bg-[#af52de]/10", border: "border-[#af52de]/30", q: 30, desc: "Problemler, cebir ve sayısal mantık" },
  { title: "Tarih",           emoji: "🏛️", color: "#ff9500", bg: "bg-[#fff8ed] dark:bg-[#ff9500]/10", border: "border-[#ff9500]/30", q: 27, desc: "İslamiyet öncesi, Osmanlı ve İnkılap tarihi" },
  { title: "Coğrafya",        emoji: "🗺️", color: "#58cc02", bg: "bg-[#f0fce8] dark:bg-[#58cc02]/10", border: "border-[#58cc02]/30", q: 18, desc: "Türkiye fiziki, beşeri ve ekonomik coğrafyası" },
  { title: "Vatandaşlık",     emoji: "⚖️", color: "#5856d6", bg: "bg-[#f0f0fc] dark:bg-[#5856d6]/10", border: "border-[#5856d6]/30", q: 9,  desc: "Anayasa hukuku, idare yapısı ve temel haklar" },
  { title: "Güncel Bilgiler", emoji: "🌍", color: "#ff2d55", bg: "bg-[#fff0f3] dark:bg-[#ff2d55]/10", border: "border-[#ff2d55]/30", q: 6,  desc: "Güncel olaylar, uluslararası kuruluşlar ve kültür" },
];

/* ── Social Proof Metrics ── */
const METRICS = [
  { value: "14.290+",  label: "Soru Çözüldü",       emoji: "🎯" },
  { value: "R² 0.983", label: "Tahmin Doğruluğu",    emoji: "📊" },
  { value: "2.500+",   label: "Aktif KPSS Adayı",   emoji: "⚡" },
  { value: "11 Sınav", label: "ÖSYM Verisiyle Eğitildi", emoji: "🏆" },
];

/* ── Bento Features ── */
const FEATURES = [
  {
    tag: "ÖSYM Regresyon Modeli",
    tagColor: "#1cb0f6",
    title: "ÖSYM Verileriyle P3 Puan Tahmini",
    body: "11 onaylanmış ÖSYM Lisans sınav belgesinden elde edilen katsayılarla GY ve GK netlerinizden P3 puanınızı R² = 0.983 doğrulukla hesaplar.",
    icon: "📊",
    badge: "R² 0.983 Hassasiyet"
  },
  {
    tag: "Gemini AI Akıllı Koç",
    tagColor: "#af52de",
    title: "Yapay Zeka Destekli Eksik Tespiti",
    body: "Google Gemini 3.5 altyapısıyla denemelerinizi analiz eder, zayıf olduğunuz alt konuları çıkarır ve kişisel haftalık çalışma rotanızı çizer.",
    icon: "🧠",
    badge: "Gemini 3.5 AI"
  },
  {
    tag: "ÖSYM Simülatörü",
    tagColor: "#58cc02",
    title: "130 Dakikalık Gerçek Sınav Odak Odası",
    body: "Optik form balonları, 130 dakikalık canlı sayaç ve sınav ortam ses efekti ile ÖSYM atmosferini evinizde simüle edin.",
    icon: "⏱️",
    badge: "130 Dk Odak Odası"
  },
  {
    tag: "Elmas Lig & Rekabet",
    tagColor: "#ff9500",
    title: "Liderlik Tablosu & XP Oyunlaştırma",
    body: "Çözdüğünüz her net ve tamamladığınız her Pomodoro için XP kazanın. Haftalık liglerde rakiplerinizin önüne geçin.",
    icon: "🏆",
    badge: "Canlı Lig Tablosu"
  },
];

export default function LandingPage() {
  const { signInWithGoogle } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  
  /* Scroll Progress */
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /* ── Interactive Score Predictor State ── */
  const [gyNet, setGyNet] = useState(48);
  const [gkNet, setGkNet] = useState(42);
  const p3 = estimateP3Score(gyNet, gkNet);
  const p1 = estimateP1Score(gyNet, gkNet);
  const p2 = estimateP2Score(gyNet, gkNet);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1cb0f6", "#58cc02", "#ff9500", "#af52de"]
    });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#020c1b] text-slate-100 font-sans selection:bg-[#1cb0f6]/30 overflow-x-hidden">
      
      {/* ── Top Scroll Progress Bar ── */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1cb0f6] via-[#af52de] to-[#58cc02] z-50 origin-left shadow-[0_0_12px_#1cb0f6]"
      />

      {/* ════════════════════════════════════════════════════════════
          1. FULLSCREEN VIDEO BACKGROUND
      ════════════════════════════════════════════════════════════ */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none filter contrast-110 saturate-125"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
      />
      {/* Dark cinematic overlay */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-[#020c1b]/80 via-[#020c1b]/60 to-[#020c1b] pointer-events-none" />

      {/* ════════════════════════════════════════════════════════════
          2. FLOATING NAVIGATION BAR
      ════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-8 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between w-full max-w-6xl mx-auto rounded-2xl sm:rounded-[2rem] px-4 sm:px-6 py-3 bg-slate-900/80 backdrop-blur-xl border-2 border-b-4 border-slate-700/80 shadow-xl">
          
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="font-black text-2xl sm:text-3xl tracking-tight text-white flex items-center gap-1.5">
              KPSS
              <span className="inline-flex items-center px-2.5 py-0.5 text-sm sm:text-base rounded-xl bg-[#1cb0f6] text-white font-black border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-2xs">
                2<span className="text-[#58cc02] ml-0.5">X</span>
              </span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-black text-slate-300">
            <a href="#ozellikler" className="hover:text-[#1cb0f6] transition-colors">Özellikler</a>
            <a href="#puan"       className="hover:text-[#1cb0f6] transition-colors">Puan Hesapla</a>
            <a href="#dersler"    className="hover:text-[#1cb0f6] transition-colors">Dersler</a>
            <a href="#sss"        className="hover:text-[#1cb0f6] transition-colors">SSS</a>
          </nav>

          {/* Google Login 3D Push Button */}
          <button
            onClick={signInWithGoogle}
            type="button"
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl sm:rounded-2xl bg-[#1cb0f6] text-white font-black text-xs sm:text-sm border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-md hover:scale-105 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Ücretsiz Başla</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════
          3. HERO SECTION (Nunito Extra-Bold Brand Style)
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 pt-32 sm:pt-44 pb-24 sm:pb-36 max-w-5xl mx-auto">
        
        {/* Badge Chip */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/90 border-2 border-b-4 border-slate-700 shadow-md mb-8"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1cb0f6] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1cb0f6]"></span>
          </span>
          <span className="font-black text-xs sm:text-sm tracking-wide text-slate-200 uppercase">
            2026 KPSS Lisans · AI Destekli İvme Platformu
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] text-white drop-shadow-md"
        >
          KPSS&apos;ye <span className="text-[#1cb0f6]">2 Kat Hızlı</span> Hazırlan.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-extrabold text-slate-300 text-base sm:text-xl max-w-3xl mt-6 sm:mt-8 leading-relaxed"
        >
          Gerçek ÖSYM sınav verileriyle eğitilmiş <span className="text-[#1cb0f6]">AI puan tahmini</span>, 
          görsel konu takibi ve <span className="text-[#58cc02]">3D oyunlaştırılmış lig sistemi</span> ile başarını 2&apos;ye katla.
        </motion.p>

        {/* Hero CTAs (3D Physical Push Buttons) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10 w-full sm:w-auto"
        >
          <button
            onClick={signInWithGoogle}
            type="button"
            className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-[#1cb0f6] text-white font-black text-base sm:text-lg border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xl hover:scale-105 active:translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <AppleEmoji emoji="🚀" size={24} />
            <span>Google ile Ücretsiz Katıl</span>
          </button>
          
          <a
            href="#puan"
            className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-slate-800/90 text-slate-200 font-black text-base sm:text-lg border-2 border-b-4 border-slate-700 hover:border-slate-600 hover:text-white shadow-md hover:scale-105 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <span>Puanını Hesapla</span>
            <ArrowRight className="w-5 h-5 text-[#1cb0f6]" />
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs sm:text-sm font-black text-slate-400"
        >
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#58cc02]" /> Kredi kartı gerekmez</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1cb0f6]" /> 100% Ücretsiz & Açık</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#ff9500]" /> ÖSYM Regresyon Modeli</span>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          4. METRICS STRIP (3D Physical Cards)
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-12 px-4 sm:px-8 border-y border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {METRICS.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-slate-800/80 rounded-2xl p-5 border-2 border-b-4 border-slate-700 shadow-md text-center group hover:border-[#1cb0f6]/50 transition-all"
            >
              <div className="flex items-center justify-center mb-2">
                <AppleEmoji emoji={m.emoji} size={28} />
              </div>
              <div className="font-black text-2xl sm:text-4xl text-white tracking-tight">
                {m.value}
              </div>
              <div className="font-extrabold text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider">
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          5. BENTO FEATURE SHOWCASE (Scroll Animations & 3D Cards)
      ════════════════════════════════════════════════════════════ */}
      <section id="ozellikler" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-black text-xs sm:text-sm text-[#1cb0f6] uppercase tracking-widest bg-[#1cb0f6]/10 px-4 py-1.5 rounded-xl border border-[#1cb0f6]/20 inline-block mb-4"
          >
            Neden KPSS2X?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-black text-3xl sm:text-5xl text-white tracking-tight"
          >
            Sadece Çalışma. <span className="text-[#1cb0f6]">Stratejik Derece Yap.</span>
          </motion.h2>
        </div>

        {/* 3D Bento Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="bg-slate-800/90 rounded-[2rem] p-7 sm:p-9 border-2 border-b-4 border-slate-700 shadow-xl flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-b-4 border-slate-700 flex items-center justify-center">
                    <AppleEmoji emoji={f.icon} size={28} />
                  </div>
                  <span
                    className="font-black text-xs px-3.5 py-1.5 rounded-xl border-2 border-b-4"
                    style={{
                      backgroundColor: `${f.tagColor}15`,
                      borderColor: f.tagColor,
                      color: f.tagColor,
                    }}
                  >
                    {f.badge}
                  </span>
                </div>

                <h3 className="font-black text-2xl text-white mb-3 tracking-tight">
                  {f.title}
                </h3>
                <p className="font-extrabold text-slate-300 text-sm leading-relaxed">
                  {f.body}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <span className="font-black text-xs uppercase tracking-wider text-slate-400">
                  {f.tag}
                </span>
                <span className="w-8 h-8 rounded-xl bg-slate-700/50 flex items-center justify-center group-hover:bg-[#1cb0f6] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          6. INTERACTIVE SCORE PREDICTOR (Confetti & Live Sliders)
      ════════════════════════════════════════════════════════════ */}
      <section id="puan" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 bg-slate-900/80 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-black text-xs sm:text-sm text-[#58cc02] uppercase tracking-widest bg-[#58cc02]/10 px-4 py-1.5 rounded-xl border border-[#58cc02]/20 inline-block mb-4"
            >
              Canlı Simülatör
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-black text-3xl sm:text-5xl text-white tracking-tight"
            >
              Tahmini P3 Puanını <span className="text-[#58cc02]">Şimdi Hesapla</span>
            </motion.h2>
            <p className="font-extrabold text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
              Netlerini kaydır, 11 ÖSYM belgesiyle kalibre edilmiş OLS modeliyle puanını anında öğren.
            </p>
          </div>

          {/* Calculator Card (3D Style) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-slate-800 rounded-[2.5rem] p-6 sm:p-10 border-2 border-b-4 border-slate-700 shadow-2xl"
          >
            <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              
              {/* Sliders Area */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* GY Slider */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border-2 border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-black text-sm text-slate-200 flex items-center gap-2">
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
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1cb0f6]"
                  />
                  <div className="flex justify-between font-bold text-xs text-slate-400 mt-2">
                    <span>0 Net</span>
                    <span>30 Net</span>
                    <span>60 Net</span>
                  </div>
                </div>

                {/* GK Slider */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border-2 border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-black text-sm text-slate-200 flex items-center gap-2">
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
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#ff9500]"
                  />
                  <div className="flex justify-between font-bold text-xs text-slate-400 mt-2">
                    <span>0 Net</span>
                    <span>30 Net</span>
                    <span>60 Net</span>
                  </div>
                </div>

                {/* Total & Reset */}
                <div className="flex items-center justify-between pt-2">
                  <div className="font-black text-sm text-slate-300">
                    Toplam Net: <span className="text-white text-lg font-black ml-1">{gyNet + gkNet} / 120</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setGyNet(48); setGkNet(42); }}
                    className="font-black text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-700/60 px-3 py-1.5 rounded-xl border border-slate-600 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Sıfırla
                  </button>
                </div>
              </div>

              {/* Score Display Area (3D Card) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#1cb0f6]/20 to-[#af52de]/20 p-8 rounded-3xl border-2 border-b-4 border-[#1cb0f6]/40 text-center flex flex-col items-center justify-center space-y-5">
                <span className="font-black text-xs uppercase tracking-widest text-[#1cb0f6] bg-slate-900/80 px-3 py-1 rounded-xl border border-[#1cb0f6]/30">
                  Tahmini KPSS P3 Puanı
                </span>
                
                <div className="font-black text-6xl sm:text-7xl text-white tracking-tight drop-shadow-md">
                  {p3.toFixed(2)}
                </div>

                {/* P1 & P2 Sub-scores */}
                <div className="flex items-center justify-center gap-6 w-full pt-3 border-t border-white/10">
                  <div>
                    <div className="font-black text-xs text-slate-400 uppercase">P1 Puanı</div>
                    <div className="font-black text-xl text-slate-200">{p1.toFixed(2)}</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div>
                    <div className="font-black text-xs text-slate-400 uppercase">P2 Puanı</div>
                    <div className="font-black text-xl text-slate-200">{p2.toFixed(2)}</div>
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
                  <span>Bu Puanı Kaydet & Takip Et</span>
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          7. SUBJECT CARDS GRID (Rule #3 Brand Colors)
      ════════════════════════════════════════════════════════════ */}
      <section id="dersler" className="relative z-10 py-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-black text-xs sm:text-sm text-[#ff9500] uppercase tracking-widest bg-[#ff9500]/10 px-4 py-1.5 rounded-xl border border-[#ff9500]/20 inline-block mb-4"
          >
            Kapsamlı İçerik
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-black text-3xl sm:text-5xl text-white tracking-tight"
          >
            120 Soru. <span className="text-[#ff9500]">6 Branş Tam Takip.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {SUBJECTS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              className="bg-slate-800/90 rounded-2xl p-6 border-2 border-b-4 border-slate-700 shadow-md group transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${s.bg} border-2 border-b-4 ${s.border} flex items-center justify-center`}>
                  <AppleEmoji emoji={s.emoji} size={26} />
                </div>
                <span
                  className="font-black text-xs px-3 py-1 rounded-xl border-2 border-b-2"
                  style={{ color: s.color, backgroundColor: `${s.color}15`, borderColor: `${s.color}40` }}
                >
                  {s.q} Soru
                </span>
              </div>
              <h3 className="font-black text-xl text-white mb-1">{s.title}</h3>
              <p className="font-extrabold text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              
              <div
                className="h-1.5 rounded-full mt-4 w-12 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: s.color }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          8. FAQ ACCORDION (Framer Motion Height Animation)
      ════════════════════════════════════════════════════════════ */}
      <FaqSection />

      {/* ════════════════════════════════════════════════════════════
          9. FINAL CTA SECTION (3D Button)
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-28 sm:py-36 px-4 sm:px-8 text-center bg-slate-900/90 border-t border-slate-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gradient-to-b from-slate-800 to-slate-800/90 rounded-[2.5rem] p-8 sm:p-14 border-2 border-b-4 border-slate-700 shadow-2xl"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#1cb0f6]/20 border-2 border-[#1cb0f6] text-[#1cb0f6] mb-6">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="font-black text-4xl sm:text-6xl text-white tracking-tight mb-4">
            KPSS2X ile <span className="text-[#1cb0f6]">Hedefine Ulaş.</span>
          </h2>
          <p className="font-extrabold text-slate-300 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Stratejini bugün belirle. Yapay zeka koçun ve ÖSYM verileriyle 2026 KPSS&apos;de derece yap.
          </p>

          <button
            onClick={signInWithGoogle}
            type="button"
            className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-[#1cb0f6] text-white font-black text-lg sm:text-xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xl hover:scale-105 active:translate-y-0.5 transition-all inline-flex items-center justify-center gap-3 cursor-pointer"
          >
            <AppleEmoji emoji="⚡" size={24} />
            <span>Google ile Hemen Başla</span>
          </button>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          10. FOOTER
      ════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-slate-800 py-8 px-6 bg-[#020c1b]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-black text-xs">
          <span className="text-slate-400 flex items-center gap-2">
            <span className="text-white font-black text-base">KPSS<span className="text-[#1cb0f6]">2</span><span className="text-[#58cc02]">X</span></span> · 2 Kat Hızlı KPSS Hazırlık Platformu
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
      q: "KPSS P3 puanı nedir ve nasıl hesaplanır?",
      a: "P3, Lisans mezunlarının Genel Yetenek ve Genel Kültür testlerinden hesaplanan puan türüdür. B Grubu memurluklarda kullanılır. KPSS2X modeli, 11 ÖSYM lisans sınav verisi üzerinden eğitilmiş En Küçük Kareler Regresyonu (OLS) ile P3 puanını R² = 0.983 hassasiyetle hesaplar.",
    },
    {
      q: "KPSS2X platformu tamamen ücretsiz mi?",
      a: "Evet! Puan tahmini, ÖSYM simülatörü, konu takip paneli, Gemini AI koçu ve lig sıralaması dahil tüm temel özellikler adaylara tamamen ücretsiz sunulmaktadır.",
    },
    {
      q: "Gemini AI Koç nasıl çalışır?",
      a: "Girdiğiniz deneme netlerini analiz ederek Türkçe, Matematik veya Tarih gibi derslerde hangi konularda eksik olduğunuzu tespit eder ve size haftalık kişiselleştirilmiş bir çalışma reçetesi verir.",
    },
    {
      q: "Verilerim güvende mi?",
      a: "Evet, Google Auth güvenli oturum altyapısı ve Firebase şifreli veritabanı kullanıyoruz. Kişisel çalışma verileriniz 3. taraflarla asla paylaşılmaz.",
    },
  ];

  return (
    <section id="sss" className="relative z-10 py-24 px-4 sm:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-14">
        <span className="font-black text-xs sm:text-sm text-[#af52de] uppercase tracking-widest bg-[#af52de]/10 px-4 py-1.5 rounded-xl border border-[#af52de]/20 inline-block mb-4">
          Merak Edilenler
        </span>
        <h2 className="font-black text-3xl sm:text-5xl text-white tracking-tight">
          Sıkça Sorulan <span className="text-[#af52de]">Sorular</span>
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="bg-slate-800/90 rounded-2xl border-2 border-b-4 border-slate-700 overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-black text-base sm:text-lg text-white">{item.q}</span>
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
                    <div className="px-6 pb-6 font-extrabold text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-700/60 pt-4">
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
