"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { MapPoint, MapTopic } from "@/lib/mapData";
import { Check, RefreshCw, X, Trophy, Target, Play, Lightbulb } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoMercator, geoCentroid } from "d3-geo";
import { motion, AnimatePresence } from "framer-motion";
import AppleEmoji from "@/components/AppleEmoji";

const GEO_URL = "/turkey-topo.json";

const MAP_CENTER: [number, number] = [35.2, 39.0];
const MAP_SCALE = 3000;
const VIEW_W = 1200;
const VIEW_H = 550;

function lngLatToPercent(lng: number, lat: number): { x: number; y: number } {
  const projection = geoMercator()
    .center(MAP_CENTER)
    .scale(MAP_SCALE)
    .translate([VIEW_W / 2, VIEW_H / 2]);
  const [px, py] = projection([lng, lat]) ?? [0, 0];
  return { x: (px / VIEW_W) * 100, y: (py / VIEW_H) * 100 };
}

// ── Canonical Type visuals ──
const TYPE_COLORS: Record<string, { color: string; emoji: string }> = {
  tektonik: { color: "#1cb0f6", emoji: "💥" },
  karstik: { color: "#2bced6", emoji: "💧" },
  volkanik: { color: "#ff4b4b", emoji: "🌋" },
  heyelan: { color: "#ff9500", emoji: "🪨" },
  aluvyal: { color: "#58cc02", emoji: "🌿" },
  kiyi: { color: "#00c1ac", emoji: "🏖️" },
  karma: { color: "#af52de", emoji: "🔄" },
  kivrim: { color: "#5856d6", emoji: "🏔️" },
  kirik: { color: "#ff9500", emoji: "⛰️" },
  plato: { color: "#ff9500", emoji: "🌄" },
  tabaka: { color: "#ff9500", emoji: "🥞" },
  lav: { color: "#ff4b4b", emoji: "🌋" },
  asinim: { color: "#8965f0", emoji: "💨" },
  delta: { color: "#58cc02", emoji: "🌱" },
  kiyiduzlugu: { color: "#2bced6", emoji: "🏖️" },
  buzul: { color: "#7dd3fc", emoji: "🧊" },
  traverten: { color: "#d6d3d1", emoji: "🧱" },
  baraj: { color: "#475569", emoji: "🏗️" },
};

const TYPE_LABELS: Record<string, string> = {
  tektonik: "Tektonik",
  karstik: "Karstik",
  volkanik: "Volkanik",
  heyelan: "Heyelan Set",
  aluvyal: "Alüvyal Set",
  kiyi: "Kıyı Set",
  karma: "Karma Yapılı",
  kivrim: "Kıvrım",
  kirik: "Kırık",
  plato: "Plato",
  tabaka: "Tabaka Düzü",
  lav: "Lav",
  asinim: "Aşınım",
  delta: "Delta Ovası",
  kiyiduzlugu: "Kıyı Düzlüğü Ovası",
  buzul: "Buzul (Sirk)",
  traverten: "Traverten Set",
  baraj: "Yapay Baraj",
};

function getTypeVisual(type: string) {
  const conf = TYPE_COLORS[type] || { color: "#1cb0f6", emoji: "📍" };
  return {
    color: conf.color,
    icon: conf.emoji,
    bg: "bg-slate-800",
    border: "border-slate-900",
    text: "text-white",
  };
}

function formatName(name: string) {
  return name.replace(/\s+(Dağları|Dağı|Dağ)\s*$/i, "");
}

// ── Progress Bar ──
function ProgressBar({ progress, total }: { progress: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (progress / total) * 100)) : 0;

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

// ── Clickable Spot ──
function ClickableSpot({
  lake, placed, isError, isActiveTarget, onClick, showHint
}: {
  lake: MapPoint; placed: boolean; isError: boolean; isActiveTarget: boolean; onClick: () => void; showHint?: boolean
}) {
  const pos = useMemo(() => lngLatToPercent(lake.lng, lake.lat), [lake.lng, lake.lat]);
  const c = getTypeVisual(lake.type);

  if (placed) {
    return (
      <div
        key="placed"
        className="absolute flex flex-col items-center group hover:z-[60] cursor-pointer"
        style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)", zIndex: 20 }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.15 }}
          style={{
            backgroundColor: c.color,
            borderColor: c.color,
            borderBottomColor: "rgba(0, 0, 0, 0.35)",
          }}
          className="px-2.5 py-1 rounded-xl text-[10px] md:text-xs font-black shadow-md flex flex-col items-center text-white border-2 border-b-4 whitespace-nowrap"
        >
          <div className="flex items-center gap-1.5">
            <AppleEmoji emoji={c.icon} size={13} color="#ffffff" />
            <span>{formatName(lake.name)}</span>
          </div>
          {lake.type === "karma" && lake.description && (
            <span className="text-[8px] font-bold opacity-90 -mt-0.5">{lake.description}</span>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      key="unplaced"
      className={`absolute flex flex-col items-center group cursor-pointer ${showHint && isActiveTarget ? 'z-[60]' : 'z-40'}`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
      onClick={onClick}
    >
      <motion.div
        animate={isError ? { x: [-6, 6, -6, 6, 0] } : (showHint && isActiveTarget ? { scale: [1, 1.4, 1] } : { scale: 1 })}
        transition={isError ? { duration: 0.4 } : (showHint && isActiveTarget ? { repeat: Infinity, duration: 1.5 } : { type: "spring", stiffness: 400, damping: 15 })}
        whileHover={{ scale: 1.2 }}
        className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all border-b-[4px] shadow-sm
          ${isError
            ? `bg-[#ff4b4b] border-[#e04343] text-white`
            : showHint && isActiveTarget
              ? `bg-[#ffc800] border-[#e0b000] text-white ring-4 ring-[#ffc800]/50`
              : `bg-white dark:bg-slate-800 text-slate-400 border-gray-300 dark:border-slate-500 hover:border-[#1899d6] hover:bg-[#1cb0f6] hover:text-white`
          }`}
      >
        <div className={`w-2.5 h-2.5 rounded-full ${isError || (showHint && isActiveTarget) ? 'bg-white' : 'bg-gray-300 dark:bg-slate-500 group-hover:bg-white'}`} />
      </motion.div>
    </div>
  );
}

// ── Main Component ──
export default function TurkeyMapGame({ topic, onQuit }: { topic: MapTopic, onQuit?: () => void }) {
  const [placedItems, setPlacedItems] = useState<Record<string, boolean>>({});
  const [shuffledPoints, setShuffledPoints] = useState<MapPoint[]>([]);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const initGame = useCallback(() => {
    // Karmaşık (rastgele) sıra
    setShuffledPoints([...topic.points].sort(() => Math.random() - 0.5));
    setPlacedItems({});
    setErrorId(null);
    setFailCount(0);
    setShowHint(false);
    setIsStarted(true);
  }, [topic]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const progress = Object.keys(placedItems).length;
  const total = topic.points.length;
  const isComplete = progress === total && total > 0;

  // Sıradaki ilk yerleştirilmemiş öğe aktif sorudur
  const activePoint = shuffledPoints.find(p => !placedItems[p.id]);
  const activeVisual = activePoint ? getTypeVisual(activePoint.type) : null;

  const handleSpotClick = (spotId: string) => {
    if (!activePoint || placedItems[spotId]) return;

    if (spotId === activePoint.id) {
      // Doğru
      setPlacedItems(prev => ({ ...prev, [spotId]: true }));
      setErrorId(null);
      setFailCount(0);
      setShowHint(false);
      // Play ding sound conceptually
    } else {
      // Yanlış
      setErrorId(spotId);
      setFailCount(prev => prev + 1);
      setTimeout(() => setErrorId(null), 600);
    }
  };

  return (
    <div className="flex flex-col w-full h-full relative">

      {/* ── Game Header ── */}
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
          style={{
            maxHeight: "calc(100vh - 200px)",
          }}
        >
          <div className="relative w-full" style={{ aspectRatio: `${VIEW_W}/${VIEW_H}`, maxHeight: "100%", maxWidth: "100%" }}>
            <ComposableMap
              width={VIEW_W} height={VIEW_H}
              projection="geoMercator"
              projectionConfig={{ center: MAP_CENTER, scale: MAP_SCALE }}
              style={{ width: "100%", height: "100%" }}
            >
              <defs>
                <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e5e7eb" />
                  <stop offset="100%" stopColor="#d1d5db" />
                </linearGradient>
              </defs>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => {
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
            </ComposableMap>

            <div className="absolute inset-0">
              {topic.points.map((point) => (
                <ClickableSpot
                  key={point.id}
                  lake={point}
                  placed={!!placedItems[point.id]}
                  isError={errorId === point.id}
                  isActiveTarget={activePoint?.id === point.id}
                  showHint={showHint}
                  onClick={() => handleSpotClick(point.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3D Floating Target Island Capsule ── */}
      <AnimatePresence mode="wait">
        {!isComplete && activePoint && activeVisual && (
          <motion.div
            key={activePoint.id}
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-xl w-[92%] sm:w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.25rem] p-4 sm:p-5 border-2 border-b-[6px] border-slate-200 dark:border-slate-800 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.35)] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              {/* 3D Pedestal Icon */}
              <div 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 border-b-4 shadow-sm"
                style={{
                  backgroundColor: `${activeVisual.color}18`,
                  borderColor: `${activeVisual.color}40`,
                  borderBottomColor: activeVisual.color,
                }}
              >
                <AppleEmoji emoji={activeVisual.icon} size={30} color={activeVisual.color} />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  HEDEFİNİ BUL
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight truncate leading-tight">
                  {formatName(activePoint.name)}
                </h3>
              </div>
            </div>

            <div className="flex items-center shrink-0">
              {failCount >= 3 && !showHint ? (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="px-4 py-2.5 rounded-2xl bg-[#ff9500] hover:bg-[#e08400] text-white font-black text-xs uppercase tracking-wider border-2 border-b-4 border-[#ff9500] border-b-[#c76300] active:translate-y-0.5 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <AppleEmoji emoji="💡" size={16} color="#ffffff" />
                  <span>İPUCU</span>
                </button>
              ) : (
                <div className="flex flex-col items-end gap-0.5">
                  <span 
                    className="text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl border-2 border-b-2 shadow-2xs text-white"
                    style={{
                      backgroundColor: activeVisual.color,
                      borderColor: activeVisual.color,
                      borderBottomColor: "rgba(0, 0, 0, 0.35)",
                    }}
                  >
                    {TYPE_LABELS[activePoint.type] || `${activePoint.type}`}
                  </span>
                  {activePoint.type === "karma" && activePoint.description && (
                    <span className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]">
                      ({activePoint.description})
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Completion Modal ── */}
      <AnimatePresence>
        {isComplete && (
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
                    Tüm şekilleri yerleştirdin. Haritayı inceleyebilir veya devam edebilirsin.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
                <button
                  onClick={onQuit}
                  className="w-full md:w-auto px-8 py-4 rounded-2xl font-black text-[#1cb0f6] text-lg border-2 border-[#1cb0f6] bg-white hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  Kategorilere Dön
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
