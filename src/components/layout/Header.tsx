"use client";

import React, {useEffect, useState} from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/context/AuthContext";
import {
  Settings,
  Search,
  Plus,
  LogIn,
  LogOut,
  User as UserIcon, Menu, X, Globe,
} from "lucide-react";
import SettingsModal from "@/components/layout/SettingsModal";
import AuthModal from "@/components/auth/AuthModal";
import {AuthView} from "@/lib/types";
import {useHabitsInternal} from "@/hooks/useHabitsInternal";
import {useTasksInternal} from "@/hooks/useTasksInternal";

export default function Header() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const { user, logout } = useAuth();

  const [showSettings, setShowSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInitialView, setInitialView] = useState<AuthView>('');

  const tasksCtx = useTasksInternal();
  const habitsCtx = useHabitsInternal();
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

  // uid - "b7t3ENENYHWHB9ImoDw41KiyeXU2"
  // const handleAICommandOLD = async (userInput: string) => {
  //   try {
  //     const res = await fetch("/api/ai/parse-task", {
  //       method: "POST",
  //       body: JSON.stringify({ text: userInput })
  //     });
  //
  //     const { type, data, error } = await res.json();
  //
  //     console.log(" handleAICommand -> data",data)
  //     // console.log(" handleAICommand -> error",error)
  //     // Вспомогательная функция для поиска ID по названию
  //     const findTaskIdByTitle = (title: string) => {
  //       return tasks.find(t =>
  //         t.title.toLowerCase().includes(title.toLowerCase())
  //       )?.id;
  //     };
  //
  //     switch (type) {
  //       case "create_task":
  //         await addTask({
  //           title: data.title,
  //           due_date: data.dueDate ?? null,
  //           priority: "medium", // дефолт
  //           completed: false
  //         });
  //         setSearchQuery(""); // Сбрасываем поиск при создании
  //         break;
  //
  //       case "search_task":
  //         setSearchQuery(data.searchQuery || data.title);
  //         break;
  //
  //       case "delete_task":
  //         const idToDelete = findTaskIdByTitle(data.originalTitle || data.title);
  //         if (idToDelete) {
  //           await removeTask(idToDelete);
  //         } else {
  //           console.warn("Задача для удаления не найдена");
  //         }
  //         break;
  //
  //       case "update_task":
  //         const idToUpdate = findTaskIdByTitle(data.originalTitle);
  //         if (idToUpdate) {
  //           // Отправляем в базу только измененные поля
  //           const updates: any = {};
  //           if (data.title) updates.title = data.title;
  //           if (data.dueDate) updates.dueDate = data.dueDate;
  //           if (data.reminder) updates.reminder = data.reminder;
  //
  //           await updateTask(idToUpdate, updates);
  //         }
  //         break;
  //     }
  //   } catch (error) {
  //     console.error("AI Error:", error);
  //   }
  // };

  const handleAICommand = async (
    userInput: string,
    { tasks, addTask, updateTask, removeTask, setSearchQuery }: ReturnType<typeof useTasksInternal>,
    { habits, addHabit, updateHabit, removeHabit, toggleHabit }: ReturnType<typeof useHabitsInternal>
  ) => {
    try {
      const res = await fetch("/api/ai/parse-task", {
        method: "POST",
        body: JSON.stringify({ text: userInput })
      });

      const { type, data } = await res.json();

      // === TASKS HANDLING ===
      const findTaskIdByTitle = (title: string) =>
        tasks.find(t => t.title.toLowerCase().includes(title.toLowerCase()))?.id;

      switch (type) {
        case "create_task":
          await addTask({
            title: data.title!,
            description: data.description ?? null,
            due_date: data.due_date ?? null,
            priority: data.priority ?? "medium",
            tags: data.tags ?? [],
            completed: false,
          });
          setSearchQuery("");
          break;

        case "update_task":
          const idToUpdate = findTaskIdByTitle(data.originalTitle!);
          if (idToUpdate) {
            const updates: any = {};
            if (data.title) updates.title = data.title;
            if (data.description) updates.description = data.description;
            if (data.due_date) updates.due_date = data.due_date;
            if (data.reminder_at) updates.reminder_at = data.reminder_at;
            if (data.priority) updates.priority = data.priority;
            if (data.tags) updates.tags = data.tags;
            await updateTask(idToUpdate, updates);
          }
          break;

        case "delete_task":
          const idToDelete = findTaskIdByTitle(data.originalTitle!);
          if (idToDelete) await removeTask(idToDelete);
          break;

        case "search_task":
          setSearchQuery(data.searchQuery ?? data.title ?? "");
          break;

        // === HABITS HANDLING ===
        case "create_habit":
          await addHabit(
            data.name!,
            data.frequency ?? "daily",
            data.icon ?? "🎯",
            data.color ?? undefined
          );
          break;

        case "update_habit":
          const habitToUpdate = habits.find(h => h.name === data.originalName);
          if (habitToUpdate) {
            await updateHabit(habitToUpdate.id, {
              name: data.name,
              frequency: data.frequency,
              icon: data.icon,
              color: data.color
            });
          }
          break;

        case "delete_habit":
          const habitToDelete = habits.find(h => h.name === data.originalName);
          if (habitToDelete) await removeHabit(habitToDelete.id);
          break;

        case "toggle_habit":
          const habitToToggle = habits.find(h => h.name === data.name);
          if (habitToToggle && data.date) {
            await toggleHabit(habitToToggle.id, data.date);
          }
          break;

        default:
          console.warn("Unknown AI type:", type);
      }

    } catch (error) {
      console.error("AI Error:", error);
    }
  };

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
              onKeyDown={(e)=>{
                if (e.key === "Enter") {
                  handleAICommand(e.currentTarget.value, tasksCtx, habitsCtx);
                }
              }}
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
            <div className={'flex gap-[14px]'}>
              <button
                onClick={() => {
                  setInitialView('profile')
                  setShowAuthModal(true)
                }}
                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-[var(--color-bg)]
                border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
              >
                {false ? (
                  <img src={'/'} alt="User" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-primary)]">
                    <UserIcon size={18} />
                  </div>
                )}
                <span className="hidden md:block text-sm font-semibold text-[var(--color-text-primary)]">
                  {user?.user_metadata?.full_name || 'Профіль'}
                </span>
              </button>
              <button
                className={`${btnIcon} text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200`}
                onClick={() => logout()}
                title="Вийти"
              >
                <LogOut size={18} />
              </button>
            </div>

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

      {/*{showSettings && <ProfileModal />}*/}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <AuthModal viewValue={isInitialView} isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
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

// Я хочу тебя проверить, запиши задачу, на завтра, чтобы я полил цветы, но использовал гарячую воду, и напоминане на 8 утра