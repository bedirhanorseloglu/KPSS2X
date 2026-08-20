"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import ProfileSettingsModal from "@/components/ProfileSettingsModal";
import AppleEmoji from "@/components/AppleEmoji";

const NAV_LINKS = [
  { name: "Gösterge Paneli", href: "/dashboard", emoji: "🌟" },
  { name: "Deneme Merkezi", href: "/deneme", emoji: "📊" },
  { name: "Simülatör", href: "/simulator", emoji: "⏱️" },
  { name: "Liderlik", href: "/liderlik", emoji: "🏆" },
  { name: "Etkinlikler", href: "/etkinlik", emoji: "🎮" },
];

export default function FloatingNavbar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const lastScrollY = useRef(0);

  const [isSimulatorActive, setIsSimulatorActive] = useState(false);

  useEffect(() => {
    const checkSimulator = () => {
      setIsSimulatorActive(document.body.classList.contains("simulator-active"));
    };

    checkSimulator();

    const observer = new MutationObserver(checkSimulator);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isSimulatorActive) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isHidden ? -150 : 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          isScrolled ? "py-2" : "py-3.5"
        } px-4 md:px-8 flex justify-center pointer-events-none`}
      >
        <div 
          className={`pointer-events-auto flex items-center justify-between w-full max-w-[90rem] mx-auto rounded-2xl md:rounded-[2rem] pl-5 sm:pl-7 pr-4 sm:pr-6 py-2.5 transition-all duration-300 bg-white dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-800 ${
            isScrolled 
              ? "shadow-xl border-b-slate-300 dark:border-b-slate-700" 
              : "shadow-md"
          }`}
        >
          {/* Left Side: Logo (Fixed) + Nav (Scrollable) */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-1 min-w-0 mr-2">
            {/* Pure Typographic Logo: Sleek & Seamless Brand Wordmark */}
            <Link 
              href="/dashboard" 
              className="flex items-center group focus:outline-none shrink-0 transition-transform hover:scale-[1.02] active:translate-y-0.5 py-0.5 cursor-pointer"
            >
              <span className="font-black text-2xl tracking-tighter text-slate-800 dark:text-white select-none">
                KPSS<span className="text-[#1cb0f6]">2</span><span className="text-[#58cc02]">X</span>
              </span>
            </Link>

            {/* 3D Navigation Links */}
            <nav className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 overflow-x-auto no-scrollbar py-0.5 min-w-0">
              {NAV_LINKS.map((link) => {
                const isActive = link.href === "/dashboard" || link.href === "/deneme" || link.href === "/simulator" || link.href === "/liderlik" 
                  ? pathname === link.href 
                  : pathname?.startsWith(link.href.split('/')[1] ? `/${link.href.split('/')[1]}` : link.href);
                
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-black transition-all cursor-pointer whitespace-nowrap shrink-0 active:translate-y-0.5 select-none ${
                      isActive 
                        ? "bg-white dark:bg-slate-800 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-[#1cb0f6] shadow-xs" 
                        : "bg-transparent border-2 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1cb0f6] dark:hover:text-[#1cb0f6]"
                    }`}
                  >
                    <AppleEmoji emoji={link.emoji} size={18} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side: 3D Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle 3D Button */}
            <button 
              type="button"
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 flex items-center justify-center text-slate-700 dark:text-white shadow-2xs hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] active:translate-y-0.5 transition-all cursor-pointer"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Tema Değiştir"
            >
              <AppleEmoji emoji={theme === 'dark' ? '☀️' : '🌙'} size={18} />
            </button>
            
            {/* Notification Bell 3D Button */}
            <button 
              type="button"
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] active:translate-y-0.5 transition-all relative cursor-pointer"
              title="Bildirimler"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ff4b4b] rounded-full border-2 border-white dark:border-slate-800 shadow-2xs animate-pulse" />
            </button>
            
            <div className="h-6 w-0.5 bg-slate-200 dark:border-slate-700 dark:bg-slate-700 mx-1 hidden sm:block rounded-full" />
            
            {/* User Profile Avatar 3D Button & Dropdown */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-xl border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-800 bg-white dark:bg-slate-800 shadow-2xs overflow-hidden flex items-center justify-center hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] hover:scale-105 active:translate-y-0.5 transition-all cursor-pointer"
              >
                {user?.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#1cb0f6] text-white flex items-center justify-center font-black text-sm">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 pointer-events-auto" 
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border-2 border-b-[6px] border-slate-200 dark:border-slate-800 overflow-hidden z-50 pointer-events-auto p-2.5 space-y-1.5"
                  >
                    {/* User Header */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border-2 border-b-2 border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1cb0f6] text-white flex items-center justify-center font-black text-sm border-2 border-b-4 border-[#1899d6] shrink-0 shadow-2xs">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-slate-800 dark:text-white truncate">
                          {user?.displayName || "Kullanıcı"}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1 pt-0.5">
                      <button 
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsProfileSettingsOpen(true);
                        }}
                        className="w-full text-left px-3 py-2.5 text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1cb0f6] dark:hover:text-[#38bdf8] rounded-xl transition-all flex items-center gap-2.5 active:translate-y-0.5 cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#1cb0f6]/15 text-[#1cb0f6] flex items-center justify-center shrink-0 border border-[#1cb0f6]/30">
                          <Settings className="w-3.5 h-3.5" />
                        </div>
                        <span>Profil Ayarları</span>
                      </button>
                      
                      <button 
                        type="button"
                        onClick={() => { setIsProfileOpen(false); signOut(); }}
                        className="w-full text-left px-3 py-2.5 text-xs font-black text-[#ff4b4b] hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-2.5 active:translate-y-0.5 cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-500/15 text-[#ff4b4b] flex items-center justify-center shrink-0 border border-red-500/30">
                          <LogOut className="w-3.5 h-3.5" />
                        </div>
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/80 border-2 border-b-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-white shadow-2xs active:translate-y-0.5 transition-all cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 bg-white dark:bg-slate-800 rounded-3xl border-2 border-b-4 border-slate-200 dark:border-slate-700 p-4 shadow-xl md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${
                      isActive
                        ? "bg-slate-100 dark:bg-slate-900 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-[#1cb0f6]"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <AppleEmoji emoji={link.emoji} size={20} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileSettingsModal 
        isOpen={isProfileSettingsOpen} 
        onClose={() => setIsProfileSettingsOpen(false)} 
      />
    </>
  );
}
