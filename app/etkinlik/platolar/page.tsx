"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PlateauStoryGame from "@/components/etkinlik/PlateauStoryGame";
import TurkeyMapGame from "@/components/etkinlik/TurkeyMapGame";
import { MAP_TOPICS } from "@/lib/mapData";
import AppleEmoji from "@/components/AppleEmoji";

type Stage = "menu" | "story" | "map";

export default function PlatolarPage() {
  const [stage, setStage] = useState<Stage>("menu");
  const topic = MAP_TOPICS.find((t) => t.id === "platolar");

  return (
    <main className="min-h-[100dvh] bg-slate-50 dark:bg-[#0f172a] pt-28 pb-12 px-4 sm:px-6">
      <div className={`mx-auto w-full transition-all duration-500 ${stage === "map" ? "max-w-[1600px]" : "max-w-4xl"}`}>
        {/* Top bar back button */}
        <div className="mb-8">
          <Link
            href="/etkinlik"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] hover:text-[#1cb0f6] dark:hover:text-[#38bdf8] active:translate-y-0.5 transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> ETKİNLİKLERE DÖN
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {stage === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex flex-col items-center max-w-3xl mx-auto text-center"
            >
              {/* 3D Hero Pedestal */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="w-24 h-24 rounded-[2rem] bg-[#ff9500]/15 border-2 border-b-[6px] border-[#ff9500]/40 border-b-[#ff9500] flex items-center justify-center mb-6 shadow-xl relative"
              >
                <AppleEmoji emoji="🏔️" size={48} color="#ff9500" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">
                Platoların Serüveni
              </h1>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-bold mb-10 max-w-xl">
                Türkiye'nin platolarını keşfet. Önce oluşum türlerini öğren, ardından interaktif haritada yerlerini tespit et!
              </p>

              {/* 2-Stage Macera Arenası Cards */}
              <div className="grid sm:grid-cols-2 gap-6 w-full">
                {/* 1. Aşama Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ y: 0 }}
                  onClick={() => setStage("story")}
                  className="bg-white dark:bg-slate-800 p-6 sm:p-7 rounded-[2rem] border-2 border-b-[6px] border-slate-200 dark:border-slate-700 shadow-lg text-left flex flex-col justify-between group cursor-pointer relative overflow-hidden transition-colors hover:border-[#58cc02] dark:hover:border-[#58cc02]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-[#58cc02]/15 border-2 border-b-4 border-[#58cc02]/40 border-b-[#58cc02] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <AppleEmoji emoji="🥞" size={32} color="#58cc02" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-[#58cc02]/15 text-[#2d7d00] dark:text-[#58cc02] border-2 border-b-2 border-[#58cc02]/30">
                        1. AŞAMA
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight group-hover:text-[#58cc02] transition-colors">
                      Platoların Serüveni
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs sm:text-sm leading-relaxed mb-6">
                      Boşluk doldurma ve eşleştirmeler ile karstik, lav, volkanik ve aşınım platolarını zihnine kazı.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full py-3.5 rounded-xl bg-[#58cc02] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-b-4 border-[#58cc02] border-b-[#46a302] shadow-sm active:translate-y-0.5 transition-all"
                  >
                    <span>ÖĞREN & BAŞLA</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>

                {/* 2. Aşama Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ y: 0 }}
                  onClick={() => setStage("map")}
                  className="bg-white dark:bg-slate-800 p-6 sm:p-7 rounded-[2rem] border-2 border-b-[6px] border-slate-200 dark:border-slate-700 shadow-lg text-left flex flex-col justify-between group cursor-pointer relative overflow-hidden transition-colors hover:border-[#ff9500] dark:hover:border-[#ff9500]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-[#ff9500]/15 border-2 border-b-4 border-[#ff9500]/40 border-b-[#ff9500] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <AppleEmoji emoji="🗺️" size={32} color="#ff9500" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-[#ff9500]/15 text-[#ff9500] border-2 border-b-2 border-[#ff9500]/30">
                        2. AŞAMA
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight group-hover:text-[#ff9500] transition-colors">
                      Harita Simülatörü
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs sm:text-sm leading-relaxed mb-6">
                      Seterra tarzı interaktif Türkiye haritasında platoların konumlarını bularak pratiğini yap.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full py-3.5 rounded-xl bg-[#ff9500] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-b-4 border-[#ff9500] border-b-[#e08400] shadow-sm active:translate-y-0.5 transition-all"
                  >
                    <span>HARİTAYI AÇ</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {stage === "story" && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Platoların Serüveni</h2>
                <button 
                  onClick={() => setStage("menu")} 
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-slate-800 rounded-xl border-2 border-b-4 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-wider hover:border-[#1cb0f6] hover:text-[#1cb0f6] dark:hover:border-[#1cb0f6] dark:hover:text-[#38bdf8] active:translate-y-0.5 transition-all shadow-sm cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Menüye Dön
                </button>
              </div>
              <PlateauStoryGame onComplete={() => setStage("map")} />
            </motion.div>
          )}

          {stage === "map" && topic && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Haritada Plato Avcısı</h2>
                <button 
                  onClick={() => setStage("menu")} 
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-slate-800 rounded-xl border-2 border-b-4 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-wider hover:border-[#1cb0f6] hover:text-[#1cb0f6] dark:hover:border-[#1cb0f6] dark:hover:text-[#38bdf8] active:translate-y-0.5 transition-all shadow-sm cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Menüye Dön
                </button>
              </div>
              <TurkeyMapGame topic={topic} onQuit={() => setStage("menu")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
