'use client';

import { useHabits } from '@/hooks/useHabits';
import { useTasks } from '@/hooks/useTasks';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/lib/i18n/useTranslation';
import React, { useMemo } from 'react';
import { format, subDays, startOfToday } from 'date-fns';
import {CalendarIcon} from "lucide-react";

const LEVEL_COLORS = {
  0: 'bg-[var(--color-bg)] border border-[var(--color-border-light)]',
  1: 'bg-emerald-500/20 dark:bg-emerald-500/10',
  2: 'bg-emerald-500/40 dark:bg-emerald-500/30',
  3: 'bg-emerald-500/70 dark:bg-emerald-500/60',
  4: 'bg-emerald-500 dark:bg-emerald-500',
};

export default function ContributionCalendar() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { habits } = useHabits();
  const { tasks } = useTasks();

  const calendarData = useMemo(() => {
    const activityMap = new Map<string, number>();

    // 1. Індексуємо звички
    habits.forEach(habit => {
      habit.completed_dates?.forEach(date => {
        activityMap.set(date, (activityMap.get(date) || 0) + 1);
      });
    });

    // 2. Індексуємо таски
    tasks.forEach(task => {
      if (task.completed && task.createdAt) {
        const date = task.createdAt.split('T')[0];
        activityMap.set(date, (activityMap.get(date) || 0) + 1);
      }
    });

    // 3. Генеруємо дні (від сьогодні на 364 дні назад)
    const today = startOfToday();
    const days = [];
    for (let i = 364; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = activityMap.get(dateStr) || 0;

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 10) level = 4;
      else if (count >= 5) level = 3;
      else if (count >= 3) level = 2;
      else if (count >= 1) level = 1;

      days.push({ date: dateStr, count, level, dayOfWeek: date.getDay() });
    }
    return days;
  }, [habits, tasks]);

  if (!settings.showCalendar) return null;

  // Групуємо по тижнях (кожен тиждень — це стовпчик)
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < calendarData.length; i += 7) {
      result.push(calendarData.slice(i, i + 7));
    }
    return result;
  }, [calendarData]);

  return (
    <section className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-sm col-span-full">
      <header className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
          <CalendarIcon size={18} />
        </div>
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          {t('activityCalendar')}
        </h3>
      </header>

      <div className="relative group">
        <div className="overflow-x-auto pb-2 custom-scrollbar overflow-y-hidden">
          <div className="inline-flex flex-col gap-2 min-w-max">

            {/* Рядок з назвами місяців */}
            <MonthLabels weeks={weeks} />

            <div className="flex gap-3">
              {/* Підписи днів тижня */}
              <div className="grid grid-rows-7 gap-[3px] pt-[2px]">
                {['', t('tue'), '', t('thu'), '', t('sat'), ''].map((day, i) => (
                  <span key={i} className="text-[9px] text-[var(--color-text-muted)] h-[10px] flex items-center">
                    {day}
                  </span>
                ))}
              </div>

              {/* Сама сітка */}
              <div className="grid grid-flow-col gap-[3px]">
                {weeks.map((week, wIndex) => (
                  <div key={wIndex} className="grid grid-rows-7 gap-[3px]">
                    {week.map((day) => (
                      <ActivityCell key={day.date} day={day} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CalendarLegend t={t} />
    </section>
  );
}

// --- ПІД-КОМПОНЕНТИ ДЛЯ ЧИСТОТИ ---

function ActivityCell({ day }: { day: any }) {
  return (
    <div
      className={`w-[10px] h-[10px] rounded-[2px] transition-all duration-300 hover:ring-2 hover:ring-[var(--color-primary)] hover:z-10 cursor-pointer ${LEVEL_COLORS[day.level as keyof typeof LEVEL_COLORS]}`}
      data-date={day.date}
      data-count={day.count}
    />
  );
}

function MonthLabels({ weeks }: { weeks: any[] }) {
  const labels = useMemo(() => {
    const result: { label: string; index: number }[] = [];
    weeks.forEach((week, i) => {
      const date = new Date(week[0].date);
      const month = date.toLocaleDateString('uk-UA', { month: 'short' });
      if (result.length === 0 || result[result.length - 1].label !== month) {
        result.push({ label: month, index: i });
      }
    });
    return result;
  }, [weeks]);

  return (
    <div className="relative h-4 ml-8">
      {labels.map((m, i) => (
        <span
          key={i}
          className="absolute text-[10px] text-[var(--color-text-muted)] font-medium capitalize"
          style={{ left: `${m.index * 13}px` }}
        >
          {m.label}
        </span>
      ))}
    </div>
  );
}

function CalendarLegend({ t }: any) {
  return (
    <footer className="flex items-center justify-end gap-2 mt-4">
      <span className="text-[10px] text-[var(--color-text-muted)]">{t('less')}</span>
      <div className="flex gap-[3px]">
        {[0, 1, 2, 3, 4].map(l => (
          <div key={l} className={`w-[10px] h-[10px] rounded-[2px] ${LEVEL_COLORS[l as keyof typeof LEVEL_COLORS]}`} />
        ))}
      </div>
      <span className="text-[10px] text-[var(--color-text-muted)]">{t('more')}</span>
    </footer>
  );
}
