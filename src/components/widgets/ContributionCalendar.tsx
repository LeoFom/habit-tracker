'use client';

import { useHabits } from '@/hooks/useHabits';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/lib/i18n/useTranslation';
import React, { useMemo } from 'react';
import {format, subDays, startOfToday, startOfWeek, addDays, endOfWeek} from 'date-fns';
import {CalendarIcon} from "lucide-react";
import {useTasksInternal} from "@/hooks/useTasksInternal";
import {TranslationKeys} from "@/lib/i18n/uk";

type CalendarDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  dayOfWeek: number;
  isFuture: boolean;
  items: string[];
};

type CalendarWeek = CalendarDay[];

const LEVEL_COLORS: Record<CalendarDay['level'], string> = {
  0: 'bg-[var(--color-bg)] border border-[var(--color-border-light)]',
  1: 'bg-emerald-500/20 dark:bg-emerald-500/10',
  2: 'bg-emerald-500/40 dark:bg-emerald-500/30',
  3: 'bg-emerald-500/70 dark:bg-emerald-500/60',
  4: 'bg-emerald-500 dark:bg-emerald-500',
};

type ActivityCellProps = {
  day: CalendarDay;
  isToday: boolean;
};

type MonthLabelsProps = {
  weeks: CalendarWeek[];
};

export default function ContributionCalendar() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { habits } = useHabits();
  const { tasks } = useTasksInternal();

  const WEEK_DAYS = [
    t('mon'),
    t('tue'),
    t('wed'),
    t('thu'),
    t('fri'),
    t('sat'),
    t('sun'),
  ];

  const todayStr = format(startOfToday(), 'yyyy-MM-dd');

  const calendarData = useMemo<CalendarWeek[]>(() => {
    // const activityMap = new Map<string, number>();
    const activityMap = new Map<string, { count: number; items: string[] }>();

    // --- индексация ---
    habits.forEach(habit => {
      habit.completed_dates?.forEach(date => {
        const prev = activityMap.get(date) || { count: 0, items: [] };
        activityMap.set(date, {
          count: prev.count + 1,
          items: [...prev.items, habit.name || 'habit'] // или habit.title
        });
      });
    });

    tasks.forEach(task => {
      if (task.completed && task.createdAt) {
        const date = task.createdAt.split('T')[0];
        const prev = activityMap.get(date) || { count: 0, items: [] };
        activityMap.set(date, {
          count: prev.count + 1,
          items: [...prev.items, task.title || 'task']
        });
      }
    });

    const today = startOfToday();

    // ✅ старт — понедельник ~1 год назад
    const startDate = startOfWeek(subDays(today, 364), { weekStartsOn: 1 });

    // ✅ конец — воскресенье текущей недели
    const endDate = endOfWeek(today, { weekStartsOn: 1 });
    const endDateStr = format(endDate, 'yyyy-MM-dd');

    const weeks: CalendarWeek[] = [];

    let current = startDate;

    while (format(current, 'yyyy-MM-dd') <= endDateStr) {
      const week: CalendarWeek = [];

      for (let d = 0; d < 7; d++) {
        const dateStr = format(current, 'yyyy-MM-dd');
        const data = activityMap.get(dateStr) || { count: 0, items: [] };
        const count = data.count;

        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (count >= 10) level = 4;
        else if (count >= 5) level = 3;
        else if (count >= 3) level = 2;
        else if (count >= 1) level = 1;

        const isFuture = current > today;

        week.push({
          date: dateStr,
          count: data.count,
          items: data.items, // Передаем массив названий
          level,
          dayOfWeek: d,
          isFuture,
        });

        current = addDays(current, 1);
      }

      weeks.push(week);
    }

    return weeks;
  }, [habits, tasks]);

  if (!settings.showCalendar) return null;

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

      <div className="relative">
        <div className="pb-2 custom-scrollbar">
          <div className="inline-flex flex-col gap-2 min-w-max">

            {/* Рядок з назвами місяців */}
            <MonthLabels weeks={calendarData} />

            <div className="flex gap-3">
              {/* Підписи днів тижня */}
              <div className="grid grid-rows-7 gap-[3px]">
                {WEEK_DAYS.map((day, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-[var(--color-text-muted)] h-[20px] flex items-center"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Сама сітка */}
              <div className="grid grid-flow-col gap-[3px]">
                {calendarData.map((week, wIndex) => (
                  <div key={wIndex} className="grid grid-rows-7 gap-[3px]">
                    {week.map((day, index) => (
                      <ActivityCell key={day.date} index={index} day={day} isToday={day.date === todayStr} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CalendarLegend />
    </section>
  );
}

function ActivityCell({ day, isToday }: { day: any; index: number; isToday: boolean }) {
  if (day.isFuture) {
    return (
      <div className="w-[20px] h-[20px] rounded-[2px] bg-[var(--color-bg)]/40 border border-[var(--color-border-light)]" />
    );
  }

  return (
    <div className="relative group">
      {/* Сама ячейка */}
      <div
        className={`
          w-[20px] h-[20px] md:w-[21px] md:h-[21px]
          rounded-[2px] transition-all duration-200 cursor-pointer
          ${LEVEL_COLORS[day.level as keyof typeof LEVEL_COLORS]}
          ${isToday ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-[var(--color-primary)]'}
        `}
      />

      {/* Всплывающее окно (Tooltip) */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
        <div className="bg-gray-900 text-white text-[11px] rounded-md py-2 px-3 shadow-xl min-w-[150px] pointer-events-none">
          <div className="font-bold mb-1 border-b border-white/10 pb-1">
            {format(new Date(day.date), 'MMM d, yyyy')}
          </div>

          {day.items.length > 0 ? (
            <ul className="space-y-1 mt-1">
              {day.items.map((item: string, i: number) => (
                <li key={i} className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                  <span className="truncate max-w-[180px]">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400">{"No activity"}</div>
          )}

          {/* Треугольник внизу */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  );
}

function MonthLabels({ weeks }: MonthLabelsProps) {
  const { t } = useTranslation();

  const labels = useMemo(() => {
    const result: { label: string; index: number }[] = [];

    // Массив ключей, соответствующих вашим данным в локализации
    const monthKeys: TranslationKeys[] = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ];

    weeks.forEach((week, weekIndex) => {
      week.forEach((day: CalendarDay) => {
        const date = new Date(day.date);

        // Если это первое число месяца
        if (date.getDate() === 1) {
          const monthIndex = date.getMonth(); // Получаем 0-11
          const key = monthKeys[monthIndex];   // Получаем 'jan', 'feb' и т.д.

          result.push({
            label: t(key), // Переводим ключ
            index: weekIndex,
          });
        }
      });
    });

    return result;
  }, [weeks, t]);

  return (
    <div className="grid grid-flow-col gap-[3px] ml-[26px]">
      {weeks.map((_, i) => {
        const label = labels.find(l => l.index === i);

        return (
          <div key={i} className="text-[10px] text-[var(--color-text-muted)] h-4">
            {label?.label}
          </div>
        );
      })}
    </div>
  );
}

function CalendarLegend() {
  const { t } = useTranslation();

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
