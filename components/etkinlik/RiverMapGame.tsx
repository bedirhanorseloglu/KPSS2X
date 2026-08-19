"use client";

import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Line, Marker } from "react-simple-maps";
import { geoMercator, geoCentroid } from "d3-geo";
import { RIVER_PATHS, RiverPath } from "@/lib/riverData";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, RefreshCw, Droplets } from "lucide-react";
import confetti from "canvas-confetti";
import AppleEmoji from "@/components/AppleEmoji";

const GEO_URL = "/turkey-topo.json";

const MAP_CENTER: [number, number] = [35.2, 39.0];
const MAP_SCALE = 3000;
const VIEW_W = 1200;
const VIEW_H = 550;

interface RiverMapGameProps {
  onQuit: () => void;
}

// ── Progress Bar ──
function ProgressBar({ progress, total }: { progress: number; total: number }) {
  const pct = total > 0 ? (progress / total) * 100 : 0;

  return (
    <div className="flex-1 max-w-2xl mx-auto h-4 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
      <motion.div
        className="h-full bg-[#58cc02] rounded-full relative"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="absolute top-1 left-2 right-2 h-1 bg-white/30 rounded-full" />
      </motion.div>
    </div>
  );
}

export default function RiverMapGame({ onQuit }: RiverMapGameProps) {
  const [gameRivers] = useState(() => [...RIVER_PATHS].sort(() => Math.random() - 0.5));
  const [targetIndex, setTargetIndex] = useState(0);
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [fails, setFails] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [errorId, setErrorId] = useState<string | null>(null);

  const targetRiver = gameRivers[targetIndex];
  const progress = placedIds.length;
  const total = gameRivers.length;

  const initGame = () => {
    setTargetIndex(0);
    setPlacedIds([]);
    setFails(0);
    setShowHint(false);
    setIsGameOver(false);
    setErrorId(null);
  };

  const handleRiverClick = (river: RiverPath) => {
    if (isGameOver) return;
    if (placedIds.includes(river.id)) return;

    if (river.id === targetRiver.id) {
      // Correct!
      setPlacedIds((prev) => [...prev, river.id]);
      setFails(0);
      setShowHint(false);

      if (targetIndex === gameRivers.length - 1) {
        setIsGameOver(true);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      } else {
        setTargetIndex(targetIndex + 1);
      }
    } else {
      // Wrong!
      const newFails = fails + 1;
      setFails(newFails);
      setErrorId(river.id);
      setTimeout(() => setErrorId(null), 500);

      if (newFails >= 3) {
        setShowHint(true);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full relative">

      {/* ── Game Header (Progress Bar + X) ── */}
      <div className="flex items-center gap-4 py-4 px-4 sm:px-8 w-full max-w-5xl mx-auto z-10">
        <button
          onClick={onQuit}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        <ProgressBar progress={progress} total={total} />
        <div className="w-8 h-8 flex items-center justify-center font-black text-gray-400">
          {progress}/{total}
        </div>
      </div>

      {/* ── Map Content ── */}
      <div className="flex-1 w-full overflow-hidden flex flex-col items-center justify-center relative z-0 pb-32">

        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div className="relative w-full" style={{ aspectRatio: `${VIEW_W}/${VIEW_H}`, maxHeight: "100%", maxWidth: "100%" }}>
            <ComposableMap
              width={VIEW_W}
              height={VIEW_H}
              projection="geoMercator"
              projectionConfig={{ center: MAP_CENTER, scale: MAP_SCALE }}
              style={{ width: "100%", height: "100%" }}
            >
              {/* Turkey Base Land with city names */}
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const centroid = geoCentroid(geo);
                    return (
                      <g key={geo.rsmKey}>
                        <Geography
                          geography={geo}
                          fill="#e2e8f0"
                          stroke="#cbd5e1"
                          strokeWidth={0.8}
                          className="outline-none dark:fill-[#1e293b] dark:stroke-slate-700 pointer-events-none"
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                        <Marker coordinates={centroid} className="pointer-events-none">
                          <text
                            textAnchor="middle"
                            y={3}
                            style={{ fontSize: "10px", fontWeight: 700, userSelect: "none" }}
                            className="fill-slate-500 dark:fill-slate-300 dark:opacity-75"
                          >
                            {geo.properties.name}
                          </text>
                        </Marker>
                      </g>
                    );
                  })
                }
              </Geographies>

              {/* Rivers */}
              {gameRivers.map((river) => {
                const isPlaced = placedIds.includes(river.id);
                const isTarget = river.id === targetRiver?.id;

                let strokeColor = "#94a3b8"; // subtle default in light mode
                let strokeWidth = 2.5;
                let opacity = 0.5;

                if (isPlaced) {
                  strokeColor = "#1cb0f6"; // Duolingo blue when placed
                  strokeWidth = 4;
                  opacity = 1;
                } else if (errorId === river.id) {
                  strokeColor = "#ff4b4b"; // red for error
                  strokeWidth = 5;
                  opacity = 1;
                } else if (isTarget && showHint) {
                  strokeColor = "#ffc800"; // glowing gold hint
                  strokeWidth = 5;
                  opacity = 1;
                }

                return (
                  <g key={river.id} onClick={() => handleRiverClick(river)} className="cursor-pointer outline-none group">
                    <Line
                      from={river.coordinates[0]}
                      to={river.coordinates[river.coordinates.length - 1]}
                      coordinates={river.coordinates}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-all ${errorId === river.id
                          ? "duration-75"
                          : isPlaced
                            ? "duration-200"
                            : "duration-200 dark:stroke-slate-500 hover:stroke-[#1cb0f6] dark:hover:stroke-[#38bdf8]"
                        }`}
                      style={{ opacity }}
                    />
                  </g>
                );
              })}

              {/* Labels for placed rivers */}
              {gameRivers.map((river) => {
                if (!placedIds.includes(river.id)) return null;
                const midPoint = river.coordinates[Math.floor(river.coordinates.length / 2)];

                // Çok yakın olan nehirlerin etiketlerinin çakışmaması için ince ayarlar
                const LABEL_OFFSETS: Record<string, { x: number, y: number }> = {
                  "aksu": { x: -25, y: -15 },
                  "kopru_cayi": { x: 0, y: -25 },
                  "manavgat": { x: 25, y: 15 },
                  "buyuk_menderes": { x: 0, y: 15 },
                  "kucuk_menderes": { x: 0, y: -15 },
                  "seyhan": { x: -15, y: -15 },
                  "ceyhan": { x: 15, y: 15 },
                };

                const offset = LABEL_OFFSETS[river.id] || { x: 0, y: 0 };

                // Uzun isimlerin kutuya sığması için dinamik genişlik hesaplaması
                const labelWidth = Math.max(72, river.name.length * 6.5);
                const rectX = -(labelWidth / 2);

                return (
                  <Marker key={`label-${river.id}`} coordinates={midPoint}>
                    <g transform={`translate(${offset.x}, ${offset.y})`}>
                      <rect
                        x={rectX}
                        y="-9"
                        width={labelWidth}
                        height="18"
                        rx="6"
                        fill="white"
                        className="dark:fill-slate-900"
                        stroke="#1cb0f6"
                        strokeWidth="2"
                      />
                      <text
                        textAnchor="middle"
                        y="3"
                        style={{ fontFamily: "inherit", fontSize: "10px", fontWeight: "900" }}
                        className="fill-[#1cb0f6]"
                      >
                        {river.name}
                      </text>
                    </g>
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>
        </div>
      </div>

      {/* ── 3D Floating Target Island Capsule ── */}
      <AnimatePresence mode="wait">
        {!isGameOver && targetRiver && (
          <motion.div
            key={targetRiver.id}
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-xl w-[92%] sm:w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.25rem] p-4 sm:p-5 border-2 border-b-[6px] border-slate-200 dark:border-slate-800 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.35)] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              {/* 3D Pedestal Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 border-b-4 bg-[#1cb0f6]/15 border-[#1cb0f6]/40 border-b-[#1cb0f6] shadow-sm">
                <AppleEmoji emoji="🌊" size={30} color="#1cb0f6" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  HARİTADA BUL
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight truncate leading-tight">
                  {targetRiver.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center shrink-0">
              {fails >= 3 && !showHint ? (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="px-4 py-2.5 rounded-2xl bg-[#ff9500] hover:bg-[#e08400] text-white font-black text-xs uppercase tracking-wider border-2 border-b-4 border-[#ff9500] border-b-[#c76300] active:translate-y-0.5 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <AppleEmoji emoji="💡" size={16} color="#ffffff" />
                  <span>İPUCU</span>
                </button>
              ) : (
                <span className="text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl bg-[#1cb0f6] text-white border-2 border-b-2 border-[#1899d6] shadow-2xs">
                  AKARSU
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Completion Modal ── */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t-2 border-gray-200 dark:border-slate-800 p-6 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]"
          >
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-[#58cc02] rounded-[1.5rem] border-b-[6px] border-[#46a302] flex items-center justify-center animate-bounce shrink-0">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[#58cc02] mb-1">Harika İş Çıkardın!</h2>
                  <p className="text-slate-500 font-bold">
                    Tüm nehirlerin yerini başarıyla öğrendin. Haritayı inceleyebilir veya devam edebilirsin.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
                <button
                  onClick={onQuit}
                  className="w-full md:w-auto px-8 py-4 rounded-2xl font-black text-[#1cb0f6] text-lg border-2 border-[#1cb0f6] bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  Menüye Dön
                </button>
                <button
                  onClick={initGame}
                  className="w-full md:w-auto px-8 py-4 rounded-2xl font-black text-white text-lg bg-[#1cb0f6] border-b-4 border-[#1899d6] hover:bg-[#1899d6] hover:border-[#1cb0f6] hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-2"
                >
                  Yeniden Oyna
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
