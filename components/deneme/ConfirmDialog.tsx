"use client";

import { motion, AnimatePresence } from "framer-motion";
import AppleEmoji from "../AppleEmoji";

type Variant = "danger" | "warning" | "info";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  onClose: () => void;
  onConfirm: () => void;
};

const variantConfig: Record<
  Variant,
  { emoji: string; iconBoxClass: string; confirmClass: string; confirmEmoji: string }
> = {
  danger: {
    emoji: "🗑️",
    iconBoxClass: "bg-[#ffebeb] dark:bg-[#ff4b4b]/20 border-2 border-b-4 border-[#ff4b4b]",
    confirmClass: "bg-[#ff4b4b] hover:bg-[#e03e3e] text-white border-2 border-b-4 border-[#ff4b4b] border-b-[#d93838] shadow-xs",
    confirmEmoji: "🗑️",
  },
  warning: {
    emoji: "⚠️",
    iconBoxClass: "bg-[#fff7e6] dark:bg-amber-500/20 border-2 border-b-4 border-amber-400 border-b-amber-500",
    confirmClass: "bg-[#ff9500] hover:bg-[#e08400] text-white border-2 border-b-4 border-[#ff9500] border-b-[#e08400] shadow-xs",
    confirmEmoji: "⚠️",
  },
  info: {
    emoji: "💡",
    iconBoxClass: "bg-[#e8f7ff] dark:bg-[#1cb0f6]/20 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6]",
    confirmClass: "bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] shadow-xs",
    confirmEmoji: "✨",
  },
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  variant = "warning",
  onClose,
  onConfirm,
}: Props) {
  const cfg = variantConfig[variant];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <button
            type="button"
            aria-label="Kapat"
            onClick={onClose}
            className="absolute inset-0 bg-transparent cursor-default"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-7 overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${cfg.iconBoxClass}`}>
                <AppleEmoji emoji={cfg.emoji} size={24} />
              </div>
              <div className="min-w-0 pt-0.5">
                <h3
                  id="confirm-dialog-title"
                  className="text-lg font-black text-slate-800 dark:text-white tracking-tight leading-tight mb-1"
                >
                  {title}
                </h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-600 dark:border-b-slate-700 shadow-2xs hover:border-[#1cb0f6] active:translate-y-0.5 transition-all cursor-pointer text-center"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-3 px-3 font-black text-xs uppercase tracking-wider rounded-2xl active:translate-y-0.5 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${cfg.confirmClass}`}
              >
                <span>{confirmLabel}</span>
                <AppleEmoji emoji={cfg.confirmEmoji} size={15} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
