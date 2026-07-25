"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  type LucideIcon,
} from "lucide-react";

type Variant = "error" | "warning" | "info" | "success";

type Props = {
  variant: Variant;
  title?: string;
  children: React.ReactNode;
  compact?: boolean;
  className?: string;
};

const config: Record<
  Variant,
  { Icon: LucideIcon; box: string; iconColor: string; title: string; text: string }
> = {
  error: {
    Icon: XCircle,
    box: "bg-[#ffebeb] dark:bg-[#ff4b4b]/15 border-2 border-b-4 border-[#ff4b4b] border-b-[#ea2b2b]",
    iconColor: "text-[#ff4b4b]",
    title: "text-[#ff4b4b] dark:text-red-400 font-extrabold",
    text: "text-[#ea2b2b] dark:text-red-300 font-bold",
  },
  warning: {
    Icon: AlertTriangle,
    box: "bg-[#fff7e6] dark:bg-amber-500/15 border-2 border-b-4 border-amber-400 border-b-amber-500",
    iconColor: "text-amber-500",
    title: "text-amber-700 dark:text-amber-300 font-extrabold",
    text: "text-amber-800 dark:text-amber-200 font-bold",
  },
  info: {
    Icon: Info,
    box: "bg-[#ddf4ff] dark:bg-[#1cb0f6]/15 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6]",
    iconColor: "text-[#1cb0f6]",
    title: "text-[#1cb0f6] font-extrabold",
    text: "text-[#1899d6] dark:text-blue-300 font-bold",
  },
  success: {
    Icon: CheckCircle2,
    box: "bg-[#e5f9e7] dark:bg-[#58cc02]/15 border-2 border-b-4 border-[#58cc02] border-b-[#46a302]",
    iconColor: "text-[#58cc02]",
    title: "text-[#58cc02] font-extrabold",
    text: "text-[#46a302] dark:text-emerald-300 font-bold",
  },
};

export default function DenemeAlert({
  variant,
  title,
  children,
  compact = false,
  className = "",
}: Props) {
  const { Icon, box, iconColor, title: titleClass, text } = config[variant];

  return (
    <div
      role="alert"
      className={`flex gap-3 rounded-2xl ${box} ${
        compact ? "p-3.5" : "p-4.5"
      } ${className}`}
    >
      <Icon
        className={`shrink-0 ${iconColor} ${compact ? "w-5 h-5 mt-0.5" : "w-6 h-6"}`}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        {title && (
          <p
            className={`font-black tracking-tight ${titleClass} ${compact ? "text-xs mb-1" : "text-sm mb-1.5"}`}
          >
            {title}
          </p>
        )}
        <div
          className={`leading-relaxed ${text} ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
