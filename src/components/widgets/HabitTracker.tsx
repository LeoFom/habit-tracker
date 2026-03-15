'use client';

import React, { useState } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { HabitFrequency } from '@/lib/types';
import { HABIT_ICONS } from '@/lib/constants';
import { Plus, Check, Flame, Trash2 } from 'lucide-react';

export default function HabitTracker() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { addHabit, toggleHabit, removeHabit, getStreak, getHabitsByFrequency } = useHabits();

  const allTabs: { key: HabitFrequency; label: string }[] = [
    { key: 'daily', label: t('daily') },
    { key: 'weekly', label: t('weekly') },
    { key: 'monthly', label: t('monthly') },
    { key: 'yearly', label: t('yearly') },
  ];
  const tabs = allTabs.filter(tab => settings.visibleTabs[tab.key]);

  const [activeTab, setActiveTab] = useState<HabitFrequency>(tabs[0]?.key || 'daily');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('🎯');

  const today = new Date().toISOString().split('T')[0];

  const now = new Date();

// Вчера
  const yesterdayDate = new Date();
  yesterdayDate.setDate(now.getDate() - 1);
  // const yesterday = yesterdayDate.toISOString().split('T')[0];

// Завтра
  const tomorrowDate = new Date();
  tomorrowDate.setDate(now.getDate() + 1);
  // const tomorrow = tomorrowDate.toISOString().split('T')[0];

  const filteredHabits = getHabitsByFrequency(activeTab);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addHabit(newName.trim(), activeTab, newIcon);
    setNewName('');
    setShowAdd(false);
  };

  // if (loading) return (
  //   <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] p-5 transition-all hover:shadow-[var(--shadow-md)]">
  //     Завантаження...
  //   </div>
  // );

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] p-5 transition-all hover:shadow-[var(--shadow-md)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <span className="text-lg">🎯</span>
          {t('habits')}
        </div>
        <button
          className="inline-flex items-center justify-center gap-1 bg-[var(--color-primary)] text-white px-3 py-1 rounded-[var(--radius-full)] text-xs font-medium hover:bg-[var(--color-primary-dark)] transition-all active:scale-95"
          onClick={() => setShowAdd(!showAdd)}
        >
          <Plus size={14} /> {t('addHabit')}
        </button>
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="flex gap-1 bg-[var(--color-bg)] p-1 rounded-[var(--radius-full)] mb-4">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`flex-1 py-1.5 px-3 rounded-[var(--radius-full)] text-[13px] font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]'
                  : 'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Add Habit Form */}
      {showAdd && (
        <div className="flex flex-col gap-3 p-3 bg-[var(--color-bg)] rounded-[var(--radius-md)] mb-4 animate-[slideUp_0.2s_ease]">
          <div className="flex gap-2">
            <button
              className="w-10 h-10 flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-xl hover:bg-[var(--color-surface-hover)]"
              onClick={() => {
                const idx = HABIT_ICONS.indexOf(newIcon);
                setNewIcon(HABIT_ICONS[(idx + 1) % HABIT_ICONS.length]);
              }}
            >
              {newIcon}
            </button>
            <input
              className="flex-1 px-3.5 py-2 border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)] text-sm text-[var(--color-text-primary)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_rgba(232,93,74,0.1)] transition-all"
              placeholder={t('habitName')}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button className="text-[13px] font-medium text-[var(--color-text-secondary)] px-3 py-1 hover:text-[var(--color-text-primary)]" onClick={() => setShowAdd(false)}>{t('cancel')}</button>
            <button className="bg-[var(--color-primary)] text-white text-[13px] font-medium px-4 py-1 rounded-[var(--radius-full)] hover:bg-[var(--color-primary-dark)]" onClick={handleAdd}>{t('save')}</button>
          </div>
        </div>
      )}

      {/* Habit List */}
      {filteredHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-[var(--color-text-muted)] text-center gap-3">
          <div className="text-4xl opacity-50">📝</div>
          <div className="text-sm max-w-[200px]">{t('habitPlaceholder')}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {filteredHabits.map(habit => {
            const isCompleted = habit?.completed_dates?.includes(today);
            const streak = getStreak(habit);
            return (
              <div
                key={habit.id}
                className="group flex items-center justify-between p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg)] transition-all cursor-pointer"
              >
                <div
                  className="flex items-center gap-3 flex-1 min-w-0"
                  onClick={() => toggleHabit(habit.id, today)}
                >
                  {/* Custom Checkbox */}
                  <div className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    isCompleted
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                      : 'border-[var(--color-border)]'
                  }`}>
                    {isCompleted && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-lg">{habit.icon}</span>
                  <span className={`text-sm font-medium truncate transition-all ${
                    isCompleted ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)]'
                  }`}>
                    {habit.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {streak > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-full)] bg-[var(--color-primary-bg)] text-[var(--color-primary)] text-[11px] font-bold uppercase">
                      <Flame size={12} fill="currentColor" /> {streak} {t('days')}
                    </span>
                  )}
                  <button
                    className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => removeHabit(habit.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
