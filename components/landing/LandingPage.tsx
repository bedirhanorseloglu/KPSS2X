"use client";

import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import AppleEmoji from "@/components/AppleEmoji";
import { estimateP3Score, estimateP1Score, estimateP2Score } from "@/lib/denemeUtils";

/* ── Display Font Name ── */
const SERIF = "'Instrument Serif', serif";

/* ── Subject Brand Colors (Rule #3) ── */
const SUBJECTS = [
  { title: "Türkçe",           emoji: "📘", color: "#1cb0f6", q: 30 },
  { title: "Matematik",        emoji: "🔢", color: "#af52de", q: 30 },
  { title: "Tarih",            emoji: "🏛️", color: "#ff9500", q: 27 },
  { title: "Coğrafya",         emoji: "🗺️", color: "#58cc02", q: 18 },
  { title: "Vatandaşlık",      emoji: "⚖️", color: "#5856d6", q: 9  },
  { title: "Güncel Bilgiler",  emoji: "🌍", color: "#ff2d55", q: 6  },
];

/* ── Metrics Strip Data ── */
const METRICS = [
  { value: "14,290+",   label: "soru çözüldü" },
  { value: "R² 0.983",  label: "tahmin doğruluğu" },
  { value: "2,500+",    label: "aktif aday" },
  { value: "11",        label: "ÖSYM belgesiyle eğitilmiş" },
];

/* ── Feature Showcase ── */
const FEATURES = [
  {
    tag: "Puan Tahmini",
    tagColor: "#1cb0f6",
    title: "Gerçek ÖSYM verileriyle kalibre edilmiş",
    body: "11 onaylanmış ÖSYM Lisans sınav belgesinden türetilen OLS regresyon modeli, GY ve GK netlerinden P3 puanını R² = 0.983 doğrulukla tahmin eder.",
    image: "/hero_3d_dashboard.png",
  },
  {
    tag: "Gemini AI Koç",
    tagColor: "#af52de",
    title: "Zayıf noktalarını yapay zeka tespit etsin",
    body: "Google Gemini 3.5 destekli kişisel koçun deneme sonuçlarını analiz eder, eksik konularını belirler ve kişiselleştirilmiş çalışma stratejisi sunar.",
    image: "/ai_coach_3d_mockup.png",
  },
  {
    tag: "ÖSYM Odak Odası",
    tagColor: "#58cc02",
    title: "Gerçek sınav ortamını simüle et",
    body: "130 dakikalık geri sayım, optik form balonları ve ortam ses modları ile sınav günündeki konsantrasyonu bugünden deneyimle.",
    image: "/osym_focus_3d_mockup.png",
  },
  {
    tag: "Elmas Lig",
    tagColor: "#ff9500",
    title: "Rakiplerinin önüne geç, motivasyonunu koru",
    body: "Haftalık liderlik tablosu, XP sistemi ve seri ödülleriyle çalışmayı bir rekabete dönüştür. Düştüğün yerde yeniden başla.",
    image: "/badges_3d_collection.png",
  },
];

export default function LandingPage() {
  const { signInWithGoogle } = useAuth();

  /* ── Score Predictor State ── */
  const [gyNet, setGyNet] = useState(48);
  const [gkNet, setGkNet] = useState(42);
  const p3 = estimateP3Score(gyNet, gkNet);
  const p1 = estimateP1Score(gyNet, gkNet);
  const p2 = estimateP2Score(gyNet, gkNet);

  return (
    <>
      {/* ── Google Font: Instrument Serif ── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
        rel="stylesheet"
      />

      <div className="relative min-h-screen bg-[#020c1b] text-white selection:bg-[#1cb0f6]/30 overflow-x-hidden">

        {/* ════════════════════════════════════════════════════════════
            1. FULLSCREEN VIDEO BACKGROUND
        ════════════════════════════════════════════════════════════ */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
        />
        {/* Dark cinematic overlay */}
        <div className="fixed inset-0 z-[1] landing-overlay" />

        {/* ════════════════════════════════════════════════════════════
            2. LIQUID-GLASS FLOATING NAVIGATION
        ════════════════════════════════════════════════════════════ */}
        <nav className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-5 max-w-7xl mx-auto anim-rise">
          {/* Logo */}
          <div
            className="flex items-center gap-1.5 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {/* Wordmark: KPSS + 3D 2X Badge */}
            <span className="font-black text-2xl sm:text-3xl tracking-tight text-white flex items-center gap-2">
              KPSS
              <span className="inline-flex items-center px-3 py-0.5 text-base sm:text-lg rounded-xl bg-[#1cb0f6] text-white font-black border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-2xs">
                2<span className="text-[#58cc02] ml-0.5">X</span>
              </span>
              <sup className="text-[10px] ml-0.5 opacity-50 font-normal">®</sup>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-[13px] tracking-wide">
            <a href="#ozellikler" className="text-white/50 hover:text-white transition-colors">Özellikler</a>
            <a href="#puan"       className="text-white/50 hover:text-white transition-colors">Puan Tahmini</a>
            <a href="#dersler"    className="text-white/50 hover:text-white transition-colors">Dersler</a>
            <a href="#sss"        className="text-white/50 hover:text-white transition-colors">SSS</a>
          </div>

          {/* CTA */}
          <button
            onClick={signInWithGoogle}
            type="button"
            className="liquid-glass rounded-full px-6 py-2.5 text-[13px] text-white hover:scale-[1.03] transition-transform cursor-pointer"
          >
            Başla
          </button>
        </nav>

        {/* ════════════════════════════════════════════════════════════
            3. CINEMATIC HERO
        ════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 pt-28 sm:pt-36 pb-32 sm:pb-44">
          {/* Badge */}
          <div className="anim-rise mb-10">
            <span className="liquid-glass rounded-full px-5 py-2 text-[11px] sm:text-xs tracking-widest uppercase text-white/70 font-medium">
              2026 KPSS Lisans · AI Destekli Platform
            </span>
          </div>

          {/* Headline */}
          <h1
            className="anim-rise-d1 text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] tracking-[-2.5px] max-w-5xl font-normal"
            style={{ fontFamily: SERIF }}
          >
            Hedefini belirle.{" "}
            <em className="not-italic text-white/40">Sessizce çalış.</em>{" "}
            <br className="hidden sm:inline" />
            Derece yap.
          </h1>

          {/* Subtitle */}
          <p className="anim-rise-d2 text-white/45 text-base sm:text-lg max-w-2xl mt-8 leading-relaxed font-normal">
            Gerçek ÖSYM sınav verileriyle eğitilmiş yapay zeka destekli puan tahmini, 
            kişiselleştirilmiş çalışma stratejisi ve oyunlaştırılmış rekabet sistemiyle
            2026 KPSS&apos;de fark yarat.
          </p>

          {/* Hero CTAs */}
          <div className="anim-rise-d3 flex flex-col sm:flex-row items-center gap-4 mt-12">
            <button
              onClick={signInWithGoogle}
              type="button"
              className="liquid-glass rounded-full px-14 py-5 text-base text-white hover:scale-[1.03] transition-transform cursor-pointer"
            >
              Hemen Başla
            </button>
            <a
              href="#puan"
              className="text-white/40 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
              Puanını hesapla <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            4. SOCIAL PROOF METRICS STRIP
        ════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 border-y border-white/[0.06]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {METRICS.map((m, i) => (
              <div
                key={i}
                className={`px-6 py-8 text-center ${
                  i < METRICS.length - 1 ? "border-r border-white/[0.06]" : ""
                }`}
              >
                <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight" style={{ fontFamily: SERIF }}>
                  {m.value}
                </div>
                <div className="text-[11px] text-white/35 mt-1.5 uppercase tracking-widest font-medium">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            5. PROBLEM → SOLUTION
        ════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-28 sm:py-36 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-5xl md:text-6xl tracking-[-1.5px] leading-[1.05]"
              style={{ fontFamily: SERIF }}
            >
              Binlerce konu.{" "}
              <em className="not-italic text-white/35">Sınırlı zaman.</em>{" "}
              <br className="hidden sm:inline" />
              <em className="not-italic text-white/35">Belirsiz bir hedef.</em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-white/40 text-base sm:text-lg max-w-2xl mx-auto mt-8 leading-relaxed"
            >
              KPSS&apos;ye hazırlanan adayların en büyük sorunu, nerede durduğunu bilmemek.
              Doğru veri ve strateji olmadan harcanan saatler motivasyonu tüketir.
              <strong className="text-white/70"> Veriye dayalı strateji, her şeyi değiştirir.</strong>
            </motion.p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            6. FEATURE SHOWCASE — LIQUID-GLASS BENTO GRID
        ════════════════════════════════════════════════════════════ */}
        <section id="ozellikler" className="relative z-10 pb-28 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="liquid-glass rounded-[2rem] p-7 sm:p-9 flex flex-col justify-between group"
              >
                {/* Tag */}
                <div>
                  <span
                    className="text-[11px] uppercase tracking-widest font-semibold"
                    style={{ color: f.tagColor }}
                  >
                    {f.tag}
                  </span>

                  <h3
                    className="text-xl sm:text-2xl text-white mt-3 mb-3 tracking-tight leading-snug"
                    style={{ fontFamily: SERIF }}
                  >
                    {f.title}
                  </h3>

                  <p className="text-white/40 text-sm leading-relaxed">
                    {f.body}
                  </p>
                </div>

                {/* Image */}
                <div className="mt-6 rounded-xl overflow-hidden border border-white/[0.06]">
                  <img
                    src={f.image}
                    alt={f.tag}
                    className="w-full h-44 sm:h-52 object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            7. INTERACTIVE SCORE PREDICTOR
        ════════════════════════════════════════════════════════════ */}
        <section id="puan" className="relative z-10 py-28 px-6 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto">

            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-3xl sm:text-5xl tracking-[-1.5px]"
                style={{ fontFamily: SERIF }}
              >
                Puanını <em className="not-italic text-white/35">şimdi</em> hesapla.
              </motion.h2>
              <p className="text-white/40 text-sm sm:text-base mt-4 max-w-xl mx-auto">
                GY ve GK netlerini kaydır, tahmini KPSS puanını anında gör.
                11 gerçek ÖSYM belgesiyle eğitilmiş model — R² = 0.983.
              </p>
            </div>

            {/* Calculator Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="liquid-glass rounded-[2rem] p-8 sm:p-12"
            >
              <div className="grid lg:grid-cols-12 gap-10 items-start">

                {/* Sliders */}
                <div className="lg:col-span-7 space-y-10">
                  {/* GY */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-white/60 text-sm font-medium flex items-center gap-2">
                        <AppleEmoji emoji="📘" size={18} />
                        Genel Yetenek (GY)
                      </label>
                      <span className="text-white text-lg font-semibold tabular-nums" style={{ fontFamily: SERIF }}>
                        {gyNet}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      step={0.25}
                      value={gyNet}
                      onChange={(e) => setGyNet(parseFloat(e.target.value))}
                      className="landing-slider"
                    />
                    <div className="flex justify-between text-[10px] text-white/20 mt-2 tracking-wider uppercase">
                      <span>0</span>
                      <span>30</span>
                      <span>60</span>
                    </div>
                  </div>

                  {/* GK */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-white/60 text-sm font-medium flex items-center gap-2">
                        <AppleEmoji emoji="🌍" size={18} />
                        Genel Kültür (GK)
                      </label>
                      <span className="text-white text-lg font-semibold tabular-nums" style={{ fontFamily: SERIF }}>
                        {gkNet}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      step={0.25}
                      value={gkNet}
                      onChange={(e) => setGkNet(parseFloat(e.target.value))}
                      className="landing-slider"
                    />
                    <div className="flex justify-between text-[10px] text-white/20 mt-2 tracking-wider uppercase">
                      <span>0</span>
                      <span>30</span>
                      <span>60</span>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest">Toplam Net</div>
                      <div className="text-white text-xl font-semibold tabular-nums" style={{ fontFamily: SERIF }}>
                        {gyNet + gkNet} <span className="text-white/20">/ 120</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setGyNet(48); setGkNet(42); }}
                      className="text-white/30 hover:text-white/60 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Sıfırla
                    </button>
                  </div>
                </div>

                {/* Score Output */}
                <div className="lg:col-span-5 text-center lg:text-right space-y-6">
                  <div>
                    <div className="text-[10px] text-white/25 uppercase tracking-[0.2em] mb-2">
                      Tahmini KPSS P3
                    </div>
                    <div
                      className="text-6xl sm:text-7xl text-white tabular-nums leading-none"
                      style={{ fontFamily: SERIF }}
                    >
                      {p3.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex justify-center lg:justify-end gap-6 pt-2">
                    <div>
                      <div className="text-[10px] text-white/25 uppercase tracking-widest">P1</div>
                      <div className="text-xl text-white/70 tabular-nums" style={{ fontFamily: SERIF }}>
                        {p1.toFixed(2)}
                      </div>
                    </div>
                    <div className="w-px bg-white/[0.06]" />
                    <div>
                      <div className="text-[10px] text-white/25 uppercase tracking-widest">P2</div>
                      <div className="text-xl text-white/70 tabular-nums" style={{ fontFamily: SERIF }}>
                        {p2.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={signInWithGoogle}
                    type="button"
                    className="liquid-glass rounded-full px-8 py-3.5 text-sm text-white hover:scale-[1.03] transition-transform cursor-pointer mt-4"
                  >
                    Denemelerini Kaydet & Takip Et
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            8. SUBJECT IDENTITY CARDS (Rule #3)
        ════════════════════════════════════════════════════════════ */}
        <section id="dersler" className="relative z-10 py-24 px-6 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2
                className="text-3xl sm:text-4xl tracking-[-1px]"
                style={{ fontFamily: SERIF }}
              >
                120 soru. <em className="not-italic text-white/35">6 branş.</em>
              </h2>
              <p className="text-white/35 text-sm mt-3">
                KPSS Lisans sınavındaki her branşı kendi kimlik rengiyle takip et.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SUBJECTS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="liquid-glass rounded-2xl p-5 sm:p-6 group cursor-default"
                >
                  <div className="flex items-center justify-between mb-3">
                    <AppleEmoji emoji={s.emoji} size={24} />
                    <span
                      className="text-[11px] font-semibold tabular-nums"
                      style={{ color: s.color }}
                    >
                      {s.q} Soru
                    </span>
                  </div>
                  <div className="text-white text-base font-medium">{s.title}</div>
                  {/* Accent line */}
                  <div
                    className="h-[2px] rounded-full mt-3 w-8 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: s.color }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            9. FAQ
        ════════════════════════════════════════════════════════════ */}
        <FaqSection />

        {/* ════════════════════════════════════════════════════════════
            10. FINAL CTA
        ════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-32 sm:py-40 px-6 text-center border-t border-white/[0.06]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <h2
              className="text-4xl sm:text-6xl md:text-7xl tracking-[-2px] leading-[0.95] mb-6"
              style={{ fontFamily: SERIF }}
            >
              Her geçen gün{" "}
              <em className="not-italic text-white/35">
                daha az kalıyor.
              </em>
            </h2>
            <p className="text-white/40 text-base sm:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
              Stratejini bugün belirle. Hedefine adım adım ilerle.
              İlk adım her zaman en zor olandır — ama ücretsiz.
            </p>
            <button
              onClick={signInWithGoogle}
              type="button"
              className="liquid-glass rounded-full px-16 py-5 text-base text-white hover:scale-[1.03] transition-transform cursor-pointer"
            >
              Ücretsiz Başla
            </button>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            11. FOOTER
        ════════════════════════════════════════════════════════════ */}
        <footer className="relative z-10 border-t border-white/[0.06] py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-white/25 text-xs" style={{ fontFamily: SERIF }}>
              KPSS 2026 Komuta Merkezi
            </span>
            <span className="text-white/15 text-[11px]">
              © 2026 — Sınav yolculuğunuzda başarılar.
            </span>
          </div>
        </footer>

      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FAQ Accordion — Separated for readability
══════════════════════════════════════════════════════════════════ */
function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  const items = [
    {
      q: "KPSS P3 puanı nedir?",
      a: "P3, Lisans mezunlarının Genel Yetenek ve Genel Kültür testlerinden hesaplanan puan türüdür. Mühendislik, avukatlık ve B Grubu kamu kadrolarına merkezi atamada kullanılır.",
    },
    {
      q: "Puan tahmin modeli ne kadar güvenilir?",
      a: "Modelimiz 11 onaylanmış ÖSYM Lisans Sınav Belgesi verileri üzerinden En Küçük Kareler Regresyonu (OLS) ile kalibre edilmiştir. R² = 0.983 doğruluğa sahiptir ve GY testinin P3 üzerindeki yüksek katsayı ağırlığını hesaba katar.",
    },
    {
      q: "Platform tamamen ücretsiz mi?",
      a: "Evet. Puan tahmini, ÖSYM simülatörü, konu takibi, Gemini AI koç ve lig sistemi dahil tüm özellikler ücretsizdir.",
    },
    {
      q: "Verilerim güvende mi?",
      a: "Google hesabınızla giriş yaparsınız. Verileriniz Firebase altyapısında şifreli olarak saklanır ve üçüncü taraflarla paylaşılmaz.",
    },
  ];

  return (
    <section id="sss" className="relative z-10 py-24 px-6 border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl tracking-[-1px] text-center mb-12"
          style={{ fontFamily: SERIF }}
        >
          Sıkça sorulan <em className="not-italic text-white/35">sorular.</em>
        </h2>

        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="liquid-glass rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-white text-sm font-medium">{item.q}</span>
                  <span className={`text-white/30 text-xl transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-white/40 text-sm leading-relaxed border-t border-white/[0.04] pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
