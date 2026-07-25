"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AppleEmoji from "@/components/AppleEmoji";

type SubjectTab = "all" | "cografya" | "tarih" | "vatandaslik";

export default function EtkinlikIndexPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SubjectTab>("all");

  const TABS: { id: SubjectTab; name: string; emoji: string; color: string }[] = [
    { id: "all", name: "Tümü", emoji: "🌟", color: "border-[#1cb0f6] border-b-[#1899d6] text-[#1cb0f6]" },
    { id: "cografya", name: "Coğrafya", emoji: "🗺️", color: "border-[#58cc02] border-b-[#46a302] text-[#58cc02]" },
    { id: "tarih", name: "Tarih", emoji: "🏛️", color: "border-[#ff9500] border-b-[#e08400] text-[#ff9500]" },
    { id: "vatandaslik", name: "Vatandaşlık", emoji: "⚖️", color: "border-[#5856d6] border-b-[#4744b8] text-[#5856d6]" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header - 3D Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-[1.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs overflow-hidden shrink-0 flex items-center justify-center">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1cb0f6] flex items-center justify-center text-white text-2xl font-black">
                  {user?.displayName?.charAt(0)?.toUpperCase() || "K"}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
                <AppleEmoji emoji="🎮" size={32} />
                <span>Pratik Merkezi</span>
              </h1>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">
                İnteraktif Harita & Konu Pratikleri
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2.5 rounded-2xl border-2 border-b-2 border-slate-200 dark:border-slate-700 shadow-2xs self-start md:self-auto">
            <span className="text-xs font-black text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <AppleEmoji emoji="⚡" size={16} />
              <span>Oyunla Öğren & Serini Koru</span>
            </span>
          </div>
        </motion.div>

        {/* 3D Segmented Control Filter Tabs */}
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 w-fit shadow-xs gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? `bg-white dark:bg-slate-800 border-2 border-b-4 ${tab.color} shadow-xs`
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white border-2 border-transparent"
                }`}
              >
                <AppleEmoji emoji={tab.emoji} size={18} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Activities Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* ━━━ COĞRAFYA BÖLÜMÜ ━━━ */}
            {(activeTab === "all" || activeTab === "cografya") && (
              <div className="space-y-8">
                {activeTab === "all" && (
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-[#e5f9e7] dark:bg-[#58cc02]/10 border-2 border-b-4 border-[#58cc02] border-b-[#46a302] flex items-center justify-center shadow-xs">
                      <AppleEmoji emoji="🗺️" size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Coğrafya</h2>
                  </div>
                )}

                {/* Alt Kategori: Yer Şekilleri */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2 tracking-widest uppercase">
                    <AppleEmoji emoji="⛰️" size={16} />
                    <span>Yer Şekilleri</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Dağlar Card */}
                    <Link 
                      href="/etkinlik/harita?topic=daglar" 
                      className="group bg-white dark:bg-slate-800 rounded-[2.25rem] p-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#ff4b4b] transition-all flex flex-col justify-between h-full block"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-5">
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#ff4b4b] text-white border-2 border-b-4 border-[#ff4b4b] border-b-[#e03030] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <AppleEmoji emoji="🏔️" size={38} className="text-white" />
                        </div>
                        <div className="flex flex-col justify-between h-full space-y-4">
                          <div>
                            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1.5 group-hover:text-[#ff4b4b] transition-colors">
                              Türkiye'nin Dağları
                            </h4>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                              Türkiye üzerindeki dağları (kıvrım, kırık, volkanik) haritaya yerleştirerek öğren.
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-2 bg-[#ffebeb] text-[#ff4b4b] dark:bg-[#ff4b4b]/10 font-black px-5 py-2.5 rounded-xl text-xs border-2 border-b-4 border-[#ff4b4b] border-b-[#e03030] shadow-2xs self-start group-active:translate-y-0.5 transition-transform">
                            <span>Hemen Başla</span>
                            <AppleEmoji emoji="🚀" size={14} className="text-[#ff4b4b]" />
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Platolar Card */}
                    <Link 
                      href="/etkinlik/platolar" 
                      className="group bg-white dark:bg-slate-800 rounded-[2.25rem] p-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#ff9500] transition-all flex flex-col justify-between h-full block"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-5">
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#ff9500] text-white border-2 border-b-4 border-[#ff9500] border-b-[#e08400] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <AppleEmoji emoji="⛰️" size={38} className="text-white" />
                        </div>
                        <div className="flex flex-col justify-between h-full space-y-4">
                          <div>
                            <div className="mb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#ff9500] bg-[#fff8ed] dark:bg-[#ff9500]/10 px-2.5 py-1 rounded-lg border-2 border-b-2 border-[#ff9500]/30 shadow-2xs">
                                2 Aşamalı
                              </span>
                            </div>
                            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1.5 group-hover:text-[#ff9500] transition-colors">
                              Türkiye'nin Platoları
                            </h4>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                              Platoları interaktif hikayelerle öğren ve harita üzerinde yerleştirerek pratiğini yap.
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-2 bg-[#fff8ed] text-[#ff9500] dark:bg-[#ff9500]/10 font-black px-5 py-2.5 rounded-xl text-xs border-2 border-b-4 border-[#ff9500] border-b-[#e08400] shadow-2xs self-start group-active:translate-y-0.5 transition-transform">
                            <span>Hemen Başla</span>
                            <AppleEmoji emoji="🚀" size={14} className="text-[#ff9500]" />
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Ovalar Card */}
                    <Link 
                      href="/etkinlik/ovalar" 
                      className="group bg-white dark:bg-slate-800 rounded-[2.25rem] p-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#58cc02] transition-all flex flex-col justify-between h-full block"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-5">
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#58cc02] text-white border-2 border-b-4 border-[#58cc02] border-b-[#46a302] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <AppleEmoji emoji="🌾" size={38} className="text-white" />
                        </div>
                        <div className="flex flex-col justify-between h-full space-y-4">
                          <div>
                            <div className="mb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#58cc02] bg-[#e5f9e7] dark:bg-[#58cc02]/10 px-2.5 py-1 rounded-lg border-2 border-b-2 border-[#58cc02]/30 shadow-2xs">
                                Yeni Mod
                              </span>
                            </div>
                            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1.5 group-hover:text-[#58cc02] transition-colors">
                              Türkiye'nin Ovaları
                            </h4>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                              Ova Dedektifi oyunuyla ipuçlarını bul, ardından harita üzerinde ovaları yerleştir.
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-2 bg-[#e5f9e7] text-[#58cc02] dark:bg-[#58cc02]/10 font-black px-5 py-2.5 rounded-xl text-xs border-2 border-b-4 border-[#58cc02] border-b-[#46a302] shadow-2xs self-start group-active:translate-y-0.5 transition-transform">
                            <span>Hemen Başla</span>
                            <AppleEmoji emoji="🚀" size={14} className="text-[#58cc02]" />
                          </div>
                        </div>
                      </div>
                    </Link>

                  </div>
                </div>

                {/* Alt Kategori: Su Kaynakları */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2 tracking-widest uppercase mt-4">
                    <AppleEmoji emoji="💧" size={16} />
                    <span>Su Kaynakları</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Göller Card */}
                    <Link 
                      href="/etkinlik/goller" 
                      className="group bg-white dark:bg-slate-800 rounded-[2.25rem] p-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#af52de] transition-all flex flex-col justify-between h-full block"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-5">
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#af52de] text-white border-2 border-b-4 border-[#af52de] border-b-[#963ec7] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <AppleEmoji emoji="💧" size={38} className="text-white" />
                        </div>
                        <div className="flex flex-col justify-between h-full space-y-4">
                          <div>
                            <div className="mb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#af52de] bg-[#f8f0fc] dark:bg-[#af52de]/10 px-2.5 py-1 rounded-lg border-2 border-b-2 border-[#af52de]/30 shadow-2xs">
                                2 Aşamalı
                              </span>
                            </div>
                            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1.5 group-hover:text-[#af52de] transition-colors">
                              Türkiye'nin Gölleri
                            </h4>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                              Göl Dedektifi ile göllerin oluşum türlerini sınıflandır, ardından harita üzerinde yerlerini bul!
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-2 bg-[#f8f0fc] text-[#af52de] dark:bg-[#af52de]/10 font-black px-5 py-2.5 rounded-xl text-xs border-2 border-b-4 border-[#af52de] border-b-[#963ec7] shadow-2xs self-start group-active:translate-y-0.5 transition-transform">
                            <span>Hemen Başla</span>
                            <AppleEmoji emoji="🚀" size={14} className="text-[#af52de]" />
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Akarsular Card */}
                    <Link 
                      href="/etkinlik/akarsular" 
                      className="group bg-white dark:bg-slate-800 rounded-[2.25rem] p-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#1cb0f6] transition-all flex flex-col justify-between h-full block"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-5">
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#1cb0f6] text-white border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <AppleEmoji emoji="🌊" size={38} className="text-white" />
                        </div>
                        <div className="flex flex-col justify-between h-full space-y-4">
                          <div>
                            <div className="mb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#1cb0f6] bg-[#e8f7ff] dark:bg-[#1cb0f6]/10 px-2.5 py-1 rounded-lg border-2 border-b-2 border-[#1cb0f6]/30 shadow-2xs">
                                2 Aşamalı
                              </span>
                            </div>
                            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1.5 group-hover:text-[#1cb0f6] transition-colors">
                              Akarsular
                            </h4>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                              Türkiye'nin akarsularını hikaye tarzında boşluk doldurarak öğren ve haritada yerlerini bul.
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-2 bg-[#e8f7ff] text-[#1cb0f6] dark:bg-[#1cb0f6]/10 font-black px-5 py-2.5 rounded-xl text-xs border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-2xs self-start group-active:translate-y-0.5 transition-transform">
                            <span>Hemen Başla</span>
                            <AppleEmoji emoji="🚀" size={14} className="text-[#1cb0f6]" />
                          </div>
                        </div>
                      </div>
                    </Link>

                  </div>
                </div>

                {/* Alt Kategori: Genel Tekrar */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2 tracking-widest uppercase mt-4">
                    <AppleEmoji emoji="🎴" size={16} />
                    <span>Genel Tekrar</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Bilgi Kartları */}
                    <Link 
                      href="/etkinlik/kart" 
                      className="group bg-white dark:bg-slate-800 rounded-[2.25rem] p-6 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#58cc02] transition-all flex flex-col justify-between h-full block"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-5">
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#58cc02] text-white border-2 border-b-4 border-[#58cc02] border-b-[#46a302] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <AppleEmoji emoji="🎴" size={38} className="text-white" />
                        </div>
                        <div className="flex flex-col justify-between h-full space-y-4">
                          <div>
                            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1.5 group-hover:text-[#58cc02] transition-colors">
                              Tüm Konular (Bilgi Kartları)
                            </h4>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                              Hızlı tekrar yöntemiyle kavramları arkalı-önlü kartlarla ezberle ve serini koru.
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-2 bg-[#e5f9e7] text-[#58cc02] dark:bg-[#58cc02]/10 font-black px-5 py-2.5 rounded-xl text-xs border-2 border-b-4 border-[#58cc02] border-b-[#46a302] shadow-2xs self-start group-active:translate-y-0.5 transition-transform">
                            <span>Kartları Çalış</span>
                            <AppleEmoji emoji="🚀" size={14} className="text-[#58cc02]" />
                          </div>
                        </div>
                      </div>
                    </Link>

                  </div>
                </div>
              </div>
            )}

            {/* ━━━ TARİH BÖLÜMÜ ━━━ */}
            {(activeTab === "all" || activeTab === "tarih") && (
              <div className="space-y-6 pt-4">
                {activeTab === "all" && (
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-[#fff8ed] dark:bg-[#ff9500]/10 border-2 border-b-4 border-[#ff9500] border-b-[#e08400] flex items-center justify-center shadow-xs">
                      <AppleEmoji emoji="🏛️" size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Tarih</h2>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Placeholder Tarih Locked Card */}
                  <div className="bg-slate-100 dark:bg-slate-800/40 rounded-[2.25rem] p-6 border-2 border-b-4 border-dashed border-slate-300 dark:border-slate-700 opacity-75">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/10 border-2 border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        <Lock className="w-8 h-8" />
                      </div>
                      <div className="flex flex-col justify-between h-full space-y-4">
                        <div>
                          <h4 className="text-xl font-black text-slate-600 dark:text-slate-300 mb-1.5">
                            Kronoloji Zinciri
                          </h4>
                          <p className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500 leading-relaxed">
                            Önemli tarihi olayları sıraya dizerek kronolojik hafızanı test et. Çok yakında eklenecek.
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-black px-4 py-2 rounded-xl text-xs self-start">
                          <AppleEmoji emoji="🔒" size={14} />
                          <span>Yakında</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ━━━ VATANDAŞLIK BÖLÜMÜ ━━━ */}
            {(activeTab === "all" || activeTab === "vatandaslik") && (
              <div className="space-y-6 pt-4">
                {activeTab === "all" && (
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-[#f8f0fc] dark:bg-[#5856d6]/10 border-2 border-b-4 border-[#5856d6] border-b-[#4744b8] flex items-center justify-center shadow-xs">
                      <AppleEmoji emoji="⚖️" size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Vatandaşlık</h2>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Placeholder Vatandaşlık Locked Card */}
                  <div className="bg-slate-100 dark:bg-slate-800/40 rounded-[2.25rem] p-6 border-2 border-b-4 border-dashed border-slate-300 dark:border-slate-700 opacity-75">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                        <Lock className="w-8 h-8" />
                      </div>
                      <div className="flex flex-col justify-between h-full space-y-4">
                        <div>
                          <h4 className="text-xl font-black text-slate-600 dark:text-slate-300 mb-1.5">
                            Anayasa Kartları
                          </h4>
                          <p className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500 leading-relaxed">
                            Temel hukuk kurallarını ve anayasa maddelerini boşluk doldurma ile öğren. Çok yakında.
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-black px-4 py-2 rounded-xl text-xs self-start">
                          <AppleEmoji emoji="🔒" size={14} />
                          <span>Yakında</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
