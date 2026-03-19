'use client';

import { useHabits } from '@/hooks/useHabits';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/lib/i18n/useTranslation';
import React, { useMemo } from 'react';
import {format, subDays, startOfToday, startOfWeek, addDays, endOfWeek} from 'date-fns';
import {CalendarIcon} from "lucide-react";
import {useTasksInternal} from "@/hooks/useTasksInternal";

type CalendarDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  dayOfWeek: number;
  isFuture: boolean;
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
    const activityMap = new Map<string, number>();

    // --- индексация ---
    habits.forEach(habit => {
      habit.completed_dates?.forEach(date => {
        activityMap.set(date, (activityMap.get(date) || 0) + 1);
      });
    });

    tasks.forEach(task => {
      if (task.completed && task.createdAt) {
        const date = task.createdAt.split('T')[0];
        activityMap.set(date, (activityMap.get(date) || 0) + 1);
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
        const count = activityMap.get(dateStr) || 0;

        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (count >= 10) level = 4;
        else if (count >= 5) level = 3;
        else if (count >= 3) level = 2;
        else if (count >= 1) level = 1;

        const isFuture = current > today;

        week.push({
          date: dateStr,
          count,
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

      <div className="relative group">
        <div className="overflow-x-auto pb-2 custom-scrollbar overflow-y-hidden">
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
                    {week.map((day) => (
                      <ActivityCell key={day.date} day={day} isToday={day.date === todayStr} />
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

function ActivityCell({ day, isToday }: ActivityCellProps) {
  return (
    <div
      className={`
        w-[20px] h-[20px] md:w-[21px] md:h-[21px]
        rounded-[2px]
        transition-all duration-200
        
        ${day.isFuture
        ? 'bg-[var(--color-bg)]/40 border border-[var(--color-border-light)] pointer-events-none'
        : LEVEL_COLORS[day.level]
      }

        ${!isToday ? 'hover:ring-2 hover:ring-[var(--color-primary)]' : ''}
        ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
        hover:ring-2 hover:ring-[var(--color-primary)] hover:z-10
      `}
      title={
        day.isFuture
          ? ''
          : `${format(new Date(day.date), 'MMM d, yyyy')} — ${day.count} activities`
      }
      // title={
      //   day.isFuture
      //     ? 'Future'
      //     : `${day.date} — ${day.count} activities`
      // }
    />
  );
}

function MonthLabels({ weeks }: MonthLabelsProps) {
  const labels = useMemo(() => {
    const result: { label: string; index: number }[] = [];

    weeks.forEach((week, weekIndex) => {
      week.forEach((day: CalendarDay) => {
        const date = new Date(day.date);

        // 🔥 ключ: первый день месяца
        if (date.getDate() === 1) {
          result.push({
            label: date.toLocaleDateString('uk-UA', { month: 'short' }),
            index: weekIndex,
          });
        }
      });
    });

    return result;
  }, [weeks]);

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
