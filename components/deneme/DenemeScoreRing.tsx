"use client";

import { motion } from "framer-motion";

type Props = {
  value: number;
  max?: number;
  size?: number;
  label: string;
  sublabel?: string;
  color?: string;
};

export default function DenemeScoreRing({
  value,
  max = 120,
  size = 140,
  label,
  sublabel,
  color,
}: Props) {
  const stroke = size * 0.1; // Clean 10% thickness
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (pct / 100) * circumference;

  const ringColor = color || "#1cb0f6"; // Primary Duolingo Blue or selected subject color

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group" style={{ width: size, height: size }}>
        {/* Soft Ambient Glow */}
        {pct > 0 && (
          <div
            className="absolute inset-0 rounded-full scale-90 blur-xl opacity-20 transition-all duration-500 pointer-events-none"
            style={{ backgroundColor: ringColor }}
          />
        )}

        <svg width={size} height={size} className="-rotate-90 relative z-10 overflow-visible">
          {/* Base Neutral Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-200/80 dark:text-slate-800/80"
            strokeWidth={stroke}
          />

          {/* Active Progress Ring */}
          {pct > 0 && (
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            />
          )}
        </svg>

        {/* Central Text Metrics */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <motion.span
            key={value}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-800 dark:text-white leading-none"
          >
            {value.toFixed(2).replace(/\.?0+$/, "")}
          </motion.span>
          {sublabel && (
            <span className="text-[11px] font-extrabold text-slate-400 mt-1 uppercase tracking-wider">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {label && (
        <span className="text-xs font-black text-slate-500 dark:text-slate-400 tracking-wide mt-1">
          {label}
        </span>
      )}
    </div>
  );
}
