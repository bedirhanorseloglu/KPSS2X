"use client";

import React from "react";
import AppleEmoji from "@/components/AppleEmoji";
import { BookText, Calculator, Landmark, Globe2, Scale, BookOpen } from "lucide-react";

export function Section({
  title,
  desc,
  icon,
  action,
  children,
}: {
  title: string;
  desc?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
              {title}
            </h3>
            {desc && (
              <p className="text-xs font-bold text-slate-400 dark:text-slate-400 mt-0.5">
                {desc}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

export function SummaryCard({
  label,
  value,
  sub,
  emoji,
  accent,
  highlight,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  emoji: string;
  accent?: boolean;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div
      className={`p-5 sm:p-6 rounded-[2rem] border-2 border-b-4 transition-all duration-150 hover:-translate-y-0.5 shadow-xs relative overflow-hidden flex flex-col justify-between ${
        accent
          ? "bg-white dark:bg-slate-800 border-[#1cb0f6] border-b-[#1899d6]"
          : highlight
          ? "bg-white dark:bg-slate-800 border-[#58cc02] border-b-[#46a302]"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </span>
        <AppleEmoji emoji={emoji} size={24} />
      </div>
      <div>
        <div
          className={`text-2xl sm:text-3xl font-black tracking-tight ${
            color
              ? ""
              : accent
              ? "text-[#1cb0f6]"
              : highlight
              ? "text-[#58cc02]"
              : "text-slate-800 dark:text-white"
          }`}
          style={color ? { color } : {}}
        >
          {value}
        </div>
        {sub && (
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 mt-1">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export function Tip({
  emoji,
  title,
  children,
  accentColor = "#1cb0f6",
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div
      className="p-5 sm:p-6 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-b-4 shadow-xs relative overflow-hidden flex items-start gap-4 transition-transform hover:-translate-y-0.5"
      style={{ borderColor: `${accentColor}40`, borderBottomColor: accentColor }}
    >
      <div
        className="w-12 h-12 rounded-2xl border-2 border-b-4 flex items-center justify-center shrink-0 shadow-2xs"
        style={{
          backgroundColor: `${accentColor}15`,
          borderColor: `${accentColor}40`,
          borderBottomColor: accentColor,
        }}
      >
        <AppleEmoji emoji={emoji} size={26} />
      </div>
      <div className="space-y-1 min-w-0 flex-1">
        <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
          {title}
        </h4>
        <div className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Row({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-[11px] gap-4">
      <span className="text-slate-500 font-medium">{label}</span>
      <span
        className={`font-mono ${bold ? "font-black text-sm" : "font-black"} ${
          color || "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export const getSubjectIcon = (id: string, color: string) => {
  switch (id) {
    case "turkce":
      return <BookText className="w-5 h-5" style={{ color }} />;
    case "matematik":
      return <Calculator className="w-5 h-5" style={{ color }} />;
    case "tarih":
      return <Landmark className="w-5 h-5" style={{ color }} />;
    case "cografya":
      return <Globe2 className="w-5 h-5" style={{ color }} />;
    case "vatandaslik":
      return <Scale className="w-5 h-5" style={{ color }} />;
    default:
      return <BookOpen className="w-5 h-5" style={{ color }} />;
  }
};

export const CustomRechartsTooltip = ({
  active,
  payload,
  label,
  mainColor = "#1cb0f6",
}: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-xl text-xs space-y-1.5 min-w-[140px]">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-1.5">
          <span className="font-black text-slate-800 dark:text-white">
            {data.fullName || label}
          </span>
          {data.date && (
            <span className="text-[10px] font-bold text-slate-400">
              {data.date}
            </span>
          )}
        </div>
        {payload.map((item: any, i: number) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 text-[11px]"
          >
            <span className="font-bold text-slate-500">{item.name}:</span>
            <span
              className="font-black font-mono"
              style={{ color: item.color || item.stroke || mainColor }}
            >
              {typeof item.value === "number"
                ? item.value.toFixed(2)
                : item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const renderRefLabel = (
  text: string,
  color: string,
  align: "left" | "right" = "right"
) => {
  return (props: any) => {
    const { viewBox } = props;
    if (!viewBox) return null;
    const x = align === "right" ? viewBox.width + viewBox.x - 10 : viewBox.x + 10;
    const y = viewBox.y - 6;
    return (
      <text
        x={x}
        y={y}
        fill={color}
        fontSize={10}
        fontWeight={800}
        textAnchor={align === "right" ? "end" : "start"}
        className="font-mono"
      >
        {text}
      </text>
    );
  };
};
