"use client";

import React, { useRef, useCallback, useEffect } from "react";

type Props = {
  label: string;
  value: number;
  max?: number;
  onChange: (value: number) => void;
  variant: "correct" | "wrong" | "empty";
};

const variants = {
  correct: {
    label: "text-[#58cc02]",
    text: "text-[#58cc02]",
    card: "bg-slate-50 dark:bg-slate-900/60 border-2 border-b-4 border-emerald-200 dark:border-emerald-800/60 border-b-[#58cc02]",
    btn: "bg-[#58cc02]/15 text-[#58cc02] border-2 border-b-2 border-[#58cc02]/40 hover:bg-[#58cc02] hover:text-white active:translate-y-0.5 shadow-2xs",
  },
  wrong: {
    label: "text-[#ff4b4b]",
    text: "text-[#ff4b4b]",
    card: "bg-slate-50 dark:bg-slate-900/60 border-2 border-b-4 border-rose-200 dark:border-rose-800/60 border-b-[#ff4b4b]",
    btn: "bg-[#ff4b4b]/15 text-[#ff4b4b] border-2 border-b-2 border-[#ff4b4b]/40 hover:bg-[#ff4b4b] hover:text-white active:translate-y-0.5 shadow-2xs",
  },
  empty: {
    label: "text-slate-400 dark:text-slate-400",
    text: "text-slate-700 dark:text-slate-200",
    card: "bg-slate-50 dark:bg-slate-900/60 border-2 border-b-4 border-slate-200 dark:border-slate-700",
    btn: "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-2 border-b-2 border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-700 active:translate-y-0.5 shadow-2xs",
  },
};

export default function ScoreStepper({
  label,
  value,
  max = 999,
  onChange,
  variant,
}: Props) {
  const v = variants[variant];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const valueRef = useRef(value);
  valueRef.current = value;

  const maxRef = useRef(max);
  maxRef.current = max;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const stopRepeat = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopRepeat();
  }, [stopRepeat]);

  const decStep = useCallback(() => {
    const next = Math.max(0, valueRef.current - 1);
    onChangeRef.current(next);
  }, []);

  const incStep = useCallback(() => {
    const next = Math.min(maxRef.current, valueRef.current + 1);
    onChangeRef.current(next);
  }, []);

  const startRepeat = useCallback((stepFn: () => void) => {
    stopRepeat();
    stepFn(); // Immediate first step

    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        stepFn();
      }, 70); // Rapid step every 70ms when held down
    }, 350); // 350ms hold delay before auto-repeat starts
  }, [stopRepeat]);

  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 ml-1">
        {label}
      </span>
      
      <div className={`flex items-center justify-between rounded-2xl p-1.5 h-11 w-full transition-all shadow-xs ${v.card}`}>
        {/* Decrement Button */}
        <button
          type="button"
          onMouseDown={() => startRepeat(decStep)}
          onMouseUp={stopRepeat}
          onMouseLeave={stopRepeat}
          onTouchStart={(e) => {
            startRepeat(decStep);
          }}
          onTouchEnd={stopRepeat}
          onTouchCancel={stopRepeat}
          className={`w-9 h-8 rounded-xl flex items-center justify-center font-black transition-all cursor-pointer select-none shrink-0 ${v.btn}`}
          aria-label={`${label} azalt`}
        >
          <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
          </svg>
        </button>

        {/* Numeric Input */}
        <input
          type="number"
          min={0}
          max={max}
          inputMode="numeric"
          value={value === 0 ? "" : value}
          placeholder="0"
          onChange={(e) => {
            const raw = e.target.value;
            const n = raw === "" ? 0 : parseInt(raw, 10) || 0;
            onChange(Math.min(max, Math.max(0, n)));
          }}
          className={`w-full min-w-0 h-8 text-center font-mono text-lg font-black bg-transparent border-0 focus:outline-none placeholder-slate-300 dark:placeholder-slate-600 ${v.text}`}
        />

        {/* Increment Button */}
        <button
          type="button"
          onMouseDown={() => startRepeat(incStep)}
          onMouseUp={stopRepeat}
          onMouseLeave={stopRepeat}
          onTouchStart={(e) => {
            startRepeat(incStep);
          }}
          onTouchEnd={stopRepeat}
          onTouchCancel={stopRepeat}
          className={`w-9 h-8 rounded-xl flex items-center justify-center font-black transition-all cursor-pointer select-none shrink-0 ${v.btn}`}
          aria-label={`${label} artır`}
        >
          <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>
  );
}
