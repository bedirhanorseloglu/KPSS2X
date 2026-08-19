"use client";

import React from "react";
import { 
  BookText, Calculator, Landmark, Globe2, Scale, Newspaper, 
  Trophy, Target, CheckCircle2, XCircle, MinusCircle, Clock, 
  Calendar, Edit3, Tag, Award, Sparkles, Inbox, Zap, Rocket, 
  GraduationCap, Flame, Crown, BarChart3, TrendingUp, TrendingDown, 
  Star, Pin, Lightbulb, AlertTriangle, PartyPopper, Mountain,
  Droplets, Waves, Layers, Gamepad2, Key, Lock, Sprout, Compass,
  User, Mail, Shield, Trash2, BookOpen, Sun, Moon, Ruler, HelpCircle,
  Building2, Hourglass, Coffee, Swords, Settings2, Brain, Vote, FileText, Scroll,
  Percent, Divide, PlusSquare, Binary
} from "lucide-react";

// Duolingo 3D Vector Icon Mapping for Clean Seamless Rendering
const EMOJI_VECTOR_MAP: Record<string, { icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>; defaultColor: string }> = {
  // Settings & System
  "⚙️": { icon: Settings2, defaultColor: "#1cb0f6" },
  "⚙": { icon: Settings2, defaultColor: "#1cb0f6" },
  "⚔️": { icon: Swords, defaultColor: "#ff4b4b" },
  "⚔": { icon: Swords, defaultColor: "#ff4b4b" },
  "☕": { icon: Coffee, defaultColor: "#ff9500" },
  "🗳️": { icon: Vote, defaultColor: "#5856d6" },
  "🗳": { icon: Vote, defaultColor: "#5856d6" },
  "📜": { icon: Scroll, defaultColor: "#5856d6" },
  "🧠": { icon: Brain, defaultColor: "#ff9500" },
  "👩‍💻": { icon: User, defaultColor: "#af52de" },
  "💻": { icon: User, defaultColor: "#1cb0f6" },
  "❓": { icon: HelpCircle, defaultColor: "#1cb0f6" },
  "🏗️": { icon: Building2, defaultColor: "#ff9500" },
  "🏗": { icon: Building2, defaultColor: "#ff9500" },
  "🛤️": { icon: Compass, defaultColor: "#58cc02" },
  "🛤": { icon: Compass, defaultColor: "#58cc02" },
  "🏞️": { icon: Compass, defaultColor: "#58cc02" },
  "🏞": { icon: Compass, defaultColor: "#58cc02" },
  "⏳": { icon: Hourglass, defaultColor: "#ff9500" },
  "📐": { icon: Ruler, defaultColor: "#af52de" },
  "👤": { icon: User, defaultColor: "#1cb0f6" },
  "✉️": { icon: Mail, defaultColor: "#1cb0f6" },
  "✉": { icon: Mail, defaultColor: "#1cb0f6" },
  "🛡️": { icon: Shield, defaultColor: "#1cb0f6" },
  "🛡": { icon: Shield, defaultColor: "#1cb0f6" },
  "🗑️": { icon: Trash2, defaultColor: "#ff4b4b" },
  "🗑": { icon: Trash2, defaultColor: "#ff4b4b" },
  "✏️": { icon: Edit3, defaultColor: "#1cb0f6" },
  "✏": { icon: Edit3, defaultColor: "#1cb0f6" },
  "📚": { icon: BookOpen, defaultColor: "#1cb0f6" },
  "📰": { icon: Newspaper, defaultColor: "#1cb0f6" },
  "🗞️": { icon: Newspaper, defaultColor: "#1cb0f6" },
  "🗞": { icon: Newspaper, defaultColor: "#1cb0f6" },
  "☀️": { icon: Sun, defaultColor: "#ff9500" },
  "🌙": { icon: Moon, defaultColor: "#1cb0f6" },

  // KPSS Core Subjects
  "📘": { icon: BookText, defaultColor: "#fa5fea" },
  "📖": { icon: BookOpen, defaultColor: "#fa5fea" },
  "📕": { icon: BookText, defaultColor: "#fa5fea" },
  "🔢": { icon: Calculator, defaultColor: "#af52de" },
  "🧮": { icon: Calculator, defaultColor: "#af52de" },
  "➕": { icon: PlusSquare, defaultColor: "#af52de" },
  "➗": { icon: Divide, defaultColor: "#af52de" },
  "％": { icon: Percent, defaultColor: "#af52de" },
  "%": { icon: Percent, defaultColor: "#af52de" },
  "🏛️": { icon: Landmark, defaultColor: "#ff9500" },
  "🏛": { icon: Landmark, defaultColor: "#ff9500" },
  "🗺️": { icon: Globe2, defaultColor: "#10B981" },
  "🗺": { icon: Globe2, defaultColor: "#10B981" },
  "⚖️": { icon: Scale, defaultColor: "#5856d6" },
  "⚖": { icon: Scale, defaultColor: "#5856d6" },
  "🌍": { icon: Globe2, defaultColor: "#1cb0f6" },
  "🌎": { icon: Globe2, defaultColor: "#1cb0f6" },
  "🌏": { icon: Globe2, defaultColor: "#1cb0f6" },
  "🌐": { icon: Globe2, defaultColor: "#1cb0f6" },

  // Gamification & Status
  "🏆": { icon: Trophy, defaultColor: "#ff9500" },
  "🎯": { icon: Target, defaultColor: "#af52de" },
  "✅": { icon: CheckCircle2, defaultColor: "#58cc02" },
  "❌": { icon: XCircle, defaultColor: "#ff4b4b" },
  "⚪": { icon: MinusCircle, defaultColor: "#94a3b8" },
  "📊": { icon: BarChart3, defaultColor: "#1cb0f6" },
  "📈": { icon: TrendingUp, defaultColor: "#58cc02" },
  "📉": { icon: TrendingDown, defaultColor: "#ff4b4b" },
  "✨": { icon: Sparkles, defaultColor: "#1cb0f6" },
  "🔥": { icon: Flame, defaultColor: "#ff9500" },
  "👑": { icon: Crown, defaultColor: "#ff9500" },
  "🎓": { icon: GraduationCap, defaultColor: "#af52de" },
  "📝": { icon: Edit3, defaultColor: "#1cb0f6" },
  "📅": { icon: Calendar, defaultColor: "#58cc02" },
  "🏷️": { icon: Tag, defaultColor: "#ff9500" },
  "🏷": { icon: Tag, defaultColor: "#ff9500" },
  "📭": { icon: Inbox, defaultColor: "#1cb0f6" },
  "⚡": { icon: Zap, defaultColor: "#ff9500" },
  "🚀": { icon: Rocket, defaultColor: "#1cb0f6" },
  "⏱️": { icon: Clock, defaultColor: "#1cb0f6" },
  "⏱": { icon: Clock, defaultColor: "#1cb0f6" },
  "🌟": { icon: Star, defaultColor: "#ff9500" },
  "⭐": { icon: Star, defaultColor: "#ff9500" },
  "📌": { icon: Pin, defaultColor: "#ff9500" },
  "💡": { icon: Lightbulb, defaultColor: "#ff9500" },
  "🚨": { icon: AlertTriangle, defaultColor: "#ff4b4b" },
  "🚨️": { icon: AlertTriangle, defaultColor: "#ff4b4b" },
  "⚠️": { icon: AlertTriangle, defaultColor: "#ff4b4b" },
  "🎉": { icon: PartyPopper, defaultColor: "#ff9500" },
  "⛰️": { icon: Mountain, defaultColor: "#ff9500" },
  "⛰": { icon: Mountain, defaultColor: "#ff9500" },
  "🏔️": { icon: Mountain, defaultColor: "#5856d6" },
  "🏔": { icon: Mountain, defaultColor: "#5856d6" },
  "🌋": { icon: Mountain, defaultColor: "#ff4b4b" },
  "💧": { icon: Droplets, defaultColor: "#af52de" },
  "🌊": { icon: Waves, defaultColor: "#1cb0f6" },
  "🎴": { icon: Layers, defaultColor: "#58cc02" },
  "🎮": { icon: Gamepad2, defaultColor: "#1cb0f6" },
  "🔑": { icon: Key, defaultColor: "#ff9500" },
  "🔒": { icon: Lock, defaultColor: "#94a3b8" },
  "🌾": { icon: Sprout, defaultColor: "#58cc02" },
  "🌱": { icon: Sprout, defaultColor: "#58cc02" },
};

export default function AppleEmoji({ emoji, size = 24, className, color }: { emoji: string; size?: number; className?: string; color?: string }) {
  if (!emoji) return null;

  const normalized = emoji.replace(/\uFE0F/g, "").trim();
  const matched = EMOJI_VECTOR_MAP[emoji] || EMOJI_VECTOR_MAP[normalized];

  if (matched) {
    const IconComponent = matched.icon;
    
    // If color prop is passed or className contains text- color modifier, inherit parent text color
    const hasTextClass = className && /\btext-/i.test(className);
    const finalColor = (color === "currentColor" || hasTextClass) 
      ? "currentColor" 
      : (color || matched.defaultColor);

    return (
      <span className={`inline-flex items-center justify-center align-middle transition-transform duration-200 shrink-0 ${className || ""}`}>
        <IconComponent style={{ width: size, height: size, color: finalColor }} />
      </span>
    );
  }

  // Fallback to native text emoji
  return (
    <span className={`inline-flex items-center justify-center align-middle font-emoji shrink-0 ${className || ""}`} style={{ fontSize: size }}>
      {emoji}
    </span>
  );
}
