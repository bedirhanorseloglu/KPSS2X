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
          className={`pointer-events-auto flex items-center justify-between w-full max-w-[90rem] mx-auto rounded-2xl md:rounded-[2rem] pl-5 sm:pl-7 pr-4 sm:pr-6 py-2.5 transition-all duration-300 ${
            isScrolled 
              ? "bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-md border-2 border-b-4 border-slate-200 dark:border-slate-700" 
              : "bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xs border-2 border-b-4 border-slate-200/80 dark:border-slate-700/80"
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

            {/* 3D Navigation Links - Scrollable on tight viewports */}
            <nav className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
              {NAV_LINKS.map((link) => {
                const isActive = link.href === "/dashboard" || link.href === "/deneme" || link.href === "/simulator" || link.href === "/liderlik" 
                  ? pathname === link.href 
                  : pathname?.startsWith(link.href.split('/')[1] ? `/${link.href.split('/')[1]}` : link.href);
                
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 xl:px-4 py-1.5 sm:py-2 rounded-xl text-xs xl:text-sm font-black transition-all cursor-pointer whitespace-nowrap shrink-0 active:translate-y-0.5 ${
                      isActive 
                        ? "bg-white dark:bg-slate-900 border-2 border-b-4 border-[#1cb0f6] border-b-[#1899d6] text-[#1cb0f6] shadow-sm" 
                        : "bg-transparent border-2 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 hover:text-[#1cb0f6] dark:hover:text-[#1cb0f6]"
                    }`}
                  >
                    <AppleEmoji emoji={link.emoji} size={18} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side: Actions & Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            <button 
              type="button"
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/80 border-2 border-b-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-white shadow-2xs hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] active:translate-y-0.5 transition-all cursor-pointer"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Tema Değiştir"
            >
              <AppleEmoji emoji={theme === 'dark' ? '☀️' : '🌙'} size={18} />
            </button>
            
            {/* Notification Bell */}
            <button 
              type="button"
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/80 border-2 border-b-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] active:translate-y-0.5 transition-all relative cursor-pointer"
              title="Bildirimler"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ff4b4b] rounded-full border-2 border-white dark:border-slate-800" />
            </button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
            
            {/* User Profile Avatar & Dropdown */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-xl border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs overflow-hidden flex items-center justify-center hover:scale-105 active:translate-y-0.5 transition-all cursor-pointer"
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
                    className="absolute right-0 top-full mt-3 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-b-4 border-slate-200 dark:border-slate-700 overflow-hidden z-50 pointer-events-auto p-2"
                  >
                    <div className="p-3 border-b-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 rounded-xl mb-1">
                      <p className="text-sm font-black text-slate-800 dark:text-white truncate">{user?.displayName || "Kullanıcı"}</p>
                      <p className="text-xs font-semibold text-slate-400 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <button 
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsProfileSettingsOpen(true);
                        }}
                        className="w-full text-left px-3.5 py-2.5 text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-3 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-[#1cb0f6]" />
                        <span>Profil Ayarları</span>
                      </button>
                      
                      <button 
                        type="button"
                        onClick={() => { setIsProfileOpen(false); signOut(); }}
                        className="w-full text-left px-3.5 py-2.5 text-xs font-black text-[#ff4b4b] hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-3 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
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
