"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import AppleEmoji from "@/components/AppleEmoji";
import { RotateCcw, AlertOctagon } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 sm:p-10 border-2 border-b-4 border-slate-200 dark:border-slate-700 shadow-2xl max-w-lg w-full text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-[#ff4b4b]/10 border-2 border-b-4 border-[#ff4b4b]/30 flex items-center justify-center mx-auto shadow-2xs">
              <AppleEmoji emoji="⚠️" size={40} />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#ff4b4b]">
                Beklenmeyen Bir Hata Oluştu
              </span>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                Bir şeyler yolunda gitmedi
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                Endişelenmeyin, verileriniz güvende. Sayfayı yenileyerek çalışmanıza kaldığınız yerden devam edebilirsiniz.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left overflow-x-auto">
                <p className="text-[11px] font-mono text-red-500 font-bold break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-4 px-6 bg-[#1cb0f6] text-white font-black rounded-2xl border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] active:translate-y-0.5 transition-all text-sm cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Sayfayı Yenile ve Devam Et</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
