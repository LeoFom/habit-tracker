"use client"

import React, { useState, useEffect } from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/context/AuthContext";
import {
  Settings,
  Search,
  Plus,
  LogIn,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Globe,
} from "lucide-react";
import SettingsModal from "./SettingsModal";
import AuthModal from "../auth/AuthModal";

function Header2() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const { user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const closeMobileMenu = () => setShowMobileMenu(false);

  // Общие стили кнопок (аналоги .btn из твоего global.css)
  const btnBase = "inline-flex items-center justify-center gap-[6px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95";
  const btnPrimary = `${btnBase} bg-[var(--color-primary)] text-white px-4 py-2 rounded-[var(--radius-full)] text-sm hover:bg-[var(--color-primary-dark)] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(232,93,74,0.3)]`;
  const btnSecondary = `${btnBase} bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)] px-4 py-2 rounded-[var(--radius-full)] hover:bg-[var(--color-surface-hover)]`;
  const btnGhost = `${btnBase} bg-transparent text-[var(--color-text-secondary)] px-[10px] py-[6px] rounded-[var(--radius-full)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]`;
  const btnIcon = `${btnBase} p-2 rounded-[var(--radius-md)] bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]`;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[var(--color-surface)] border-b border-[var(--color-border-light)] px-4 md:px-6 h-16 flex items-center justify-between">

        {/* Left — Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] flex items-center justify-center font-bold text-lg">
            HT
          </div>
          <div>
            <div className="text-base font-semibold text-[var(--color-text-primary)] leading-tight">
              {t("appName")}
            </div>
            <div className="text-[11px] text-[var(--color-text-secondary)] leading-tight">
              {t("appSubtitle")}
            </div>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* User info */}
          {user ? (
            <div className="flex items-center gap-2 px-2 py-1 rounded-[var(--radius-full)] bg-[var(--color-bg)]">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text-secondary)]">
                  <UserIcon size={16} />
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium pr-1">
                {user.displayName || user.email?.split("@")[0]}
              </span>
            </div>
          ) : (
            <button
              className={btnPrimary}
              onClick={() => setShowAuthModal(true)}
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}

          {/* Language toggle (Desktop) */}
          <button
            className={`${btnGhost} hidden md:inline-flex font-semibold text-xs`}
            onClick={() =>
              updateSettings({
                language: settings.language === "uk" ? "en" : "uk",
              })
            }
          >
            {settings.language === "uk" ? "🇺🇦 UA" : "🇬🇧 EN"}
          </button>

          {/* Add button (Desktop) */}
          <button className={`${btnIcon} hidden md:inline-flex`}>
            <Plus size={18} />
          </button>

          {/* Search (Desktop Large) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-secondary)] text-sm cursor-pointer hover:border-[var(--color-primary)] transition-colors min-w-[180px]">
            <Search size={14} className="text-[var(--color-text-muted)]" />
            <span>{t("searchPlaceholder")}</span>
          </div>

          {/* Settings (Desktop) */}
          <button
            className={`${btnIcon} hidden md:inline-flex`}
            onClick={() => setShowSettings(true)}
          >
            <Settings size={18} />
          </button>

          {/* Mobile hamburger menu button */}
          <button
            className={`${btnIcon} md:hidden`}
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {showMobileMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-50 animate-[fadeIn_0.2s_ease]"
            onClick={closeMobileMenu}
          />
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-[280px] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] z-[51] p-6 flex flex-col gap-2 animate-[slideUp_0.3s_ease]">
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-lg">Меню</span>
              <button
                className={`${btnGhost} !p-2`}
                onClick={closeMobileMenu}
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Items */}
            {[
              { icon: <Search size={18} />, label: t("searchPlaceholder") },
              { icon: <Plus size={18} />, label: "Додати" },
            ].map((item, idx) => (
              <button key={idx} className="flex items-center gap-3 w-full p-3 rounded-[var(--radius-md)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] transition-colors text-sm font-medium">
                {item.icon}
                {item.label}
              </button>
            ))}

            {/* Language */}
            <button
              className="flex items-center gap-3 w-full p-3 rounded-[var(--radius-md)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] transition-colors text-sm font-medium text-left"
              onClick={() => {
                updateSettings({ language: settings.language === "uk" ? "en" : "uk" });
                closeMobileMenu();
              }}
            >
              <Globe size={18} />
              <span className="flex-1">
                {settings.language === "uk" ? "🇺🇦 UA → 🇬🇧 EN" : "🇬🇧 EN → 🇺🇦 UA"}
              </span>
            </button>

            {/* Settings */}
            <button
              className="flex items-center gap-3 w-full p-3 rounded-[var(--radius-md)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] transition-colors text-sm font-medium"
              onClick={() => {
                closeMobileMenu();
                setShowSettings(true);
              }}
            >
              <Settings size={18} />
              {t("settingsTitle")}
            </button>

            {/* Logout */}
            {user && (
              <button
                className="flex items-center gap-3 w-full p-3 rounded-[var(--radius-md)] text-[var(--color-danger)] hover:bg-red-50 transition-colors text-sm font-medium mt-auto"
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
              >
                <LogOut size={18} />
                Вийти
              </button>
            )}
          </div>
        </>
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}




export default function Header() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const { user, logout } = useAuth();

  const [showSettings, setShowSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Слідкуємо за скролом для стилізації шапки
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Блокуємо скрол фону при відкритому меню
  useEffect(() => {
    if (showMobileMenu) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [showMobileMenu]);

  // СТИЛІ КНОПОК
  const btnBase = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const btnPrimary = `${btnBase} bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-[var(--radius-md)] text-sm hover:brightness-110 shadow-sm hover:shadow-md`;
  const btnIcon = `${btnBase} p-2.5 rounded-[var(--radius-md)] bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-primary)]`;
  const btnGhost = `${btnBase} bg-transparent text-[var(--color-text-secondary)] px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]`;

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b ${
        isScrolled
          ? "bg-[var(--color-surface)]/80 backdrop-blur-md border-[var(--color-border-light)] shadow-sm"
          : "bg-[var(--color-surface)] border-transparent"
      }`}>

        {/* --- LEFT: Logo --- */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-[var(--color-primary)]/20">
            HT
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-[var(--color-text-primary)] leading-none uppercase tracking-tight">
              {t("appName")}
            </h1>
            <p className="text-[10px] text-[var(--color-text-secondary)] font-medium mt-1">
              {t("appSubtitle")}
            </p>
          </div>
        </div>

        {/* --- CENTER: Search (Desktop) --- */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all"
            />
          </div>
        </div>

        {/* --- RIGHT: Actions --- */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* User Profile / Login */}
          <button
            className={`${btnGhost} hidden md:inline-flex font-semibold text-xs`}
            onClick={() =>
              updateSettings({
                language: settings.language === "uk" ? "en" : "uk",
              })
            }
          >
            {settings.language === "uk" ? "🇺🇦 UA" : "🇬🇧 EN"}
          </button>
          {user ? (
            <button className="flex items-center gap-2 p-1 pr-3 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-primary)]">
                  <UserIcon size={18} />
                </div>
              )}
              <span className="hidden md:block text-sm font-semibold text-[var(--color-text-primary)]">
                {user.displayName || 'Профіль'}
              </span>
            </button>
          ) : (
            <button className={btnPrimary} onClick={() => setShowAuthModal(true)}>
              <LogIn size={18} />
              <span className="hidden sm:inline">{t('login')}</span>
            </button>
          )}

          {/* Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-2 border-l border-[var(--color-border)] ml-2 pl-4">
            <button className={btnIcon} title="Додати">
              <Plus size={20} />
            </button>
            <button
              className={btnIcon}
              onClick={() => setShowSettings(true)}
              title="Налаштування"
            >
              <Settings size={20} />
            </button>
          </div>

          {/* Hamburger (Mobile) */}
          <button
            className="md:hidden p-2 text-[var(--color-text-primary)]"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${showMobileMenu ? "visible" : "invisible"}`}>
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${showMobileMenu ? "opacity-100" : "opacity-0"}`}
          onClick={() => setShowMobileMenu(false)}
        />

        {/* Sidebar */}
        <aside className={`absolute top-0 right-0 h-full w-[300px] bg-[var(--color-surface)] shadow-2xl transition-transform duration-300 ease-out flex flex-col p-6 ${showMobileMenu ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold">Меню</span>
            <button onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-[var(--color-bg)] rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <MobileLink icon={<Search size={20}/>} label={t("searchPlaceholder")} />
            <MobileLink icon={<Plus size={20}/>} label="Створити нове" />
            <div className="h-[1px] bg-[var(--color-border-light)] my-2" />

            <button
              className="flex items-center gap-4 w-full p-4 rounded-xl text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-bg)] transition-colors text-left"
              onClick={() => {
                updateSettings({ language: settings.language === "uk" ? "en" : "uk" });
                setShowMobileMenu(false);
              }}
            >
              <Globe size={20} className="text-[var(--color-primary)]" />
              <span>{settings.language === "uk" ? "Українська (Змінити)" : "English (Change)"}</span>
            </button>

            <button
              className="flex items-center gap-4 w-full p-4 rounded-xl text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-bg)] transition-colors"
              onClick={() => { setShowSettings(true); setShowMobileMenu(false); }}
            >
              <Settings size={20} className="text-[var(--color-text-secondary)]" />
              {t("settingsTitle")}
            </button>
          </div>

          {user && (
            <button
              className="mt-auto flex items-center gap-4 p-4 w-full text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
              onClick={() => { logout(); setShowMobileMenu(false); }}
            >
              <LogOut size={20} />
              Вийти з системи
            </button>
          )}
        </aside>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

// Маленький допоміжний компонент (в межах того ж файлу)
function MobileLink({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-4 w-full p-4 rounded-xl text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-bg)] transition-all active:bg-[var(--color-surface-hover)]">
      <span className="text-[var(--color-primary)]">{icon}</span>
      {label}
    </button>
  );
}