'use client';

import { useMemo } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { useTasks } from '@/hooks/useTasks';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function ContributionCalendar() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { habits } = useHabits();
  const { tasks } = useTasks();

  const calendarData = useMemo(() => {
    const data: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Count activity: habits completed + tasks completed on this date
      const habitCount = habits.filter(h => h.completedDates.includes(dateStr)).length;
      const taskCount = tasks.filter(t =>
        t.completed && t.createdAt.startsWith(dateStr)
      ).length;
      const count = habitCount + taskCount;

      // Calculate level (0-4) based on activity
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 6) level = 4;
      else if (count >= 4) level = 3;
      else if (count >= 2) level = 2;
      else if (count >= 1) level = 1;

      data.push({ date: dateStr, count, level });
    }
    return data;
  }, [habits, tasks]);

  if (!settings.showCalendar) return null;

  // Group data by weeks (columns)
  const weeks: typeof calendarData[] = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }

  const months = [t('jan'), t('feb'), t('mar'), t('apr'), t('may'), t('jun'),
                   t('jul'), t('aug'), t('sep'), t('oct'), t('nov'), t('dec')];

  // Calculate month labels based on data
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIdx) => {
    const firstDay = new Date(week[0].date);
    const month = firstDay.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ label: months[month], col: weekIdx });
      lastMonth = month;
    }
  });

  const getLevelClass = (level: number) => {
    switch (level) {
      case 1: return 'bg-[var(--color-primary)] opacity-30';
      case 2: return 'bg-[var(--color-primary)] opacity-50';
      case 3: return 'bg-[var(--color-primary)] opacity-80';
      case 4: return 'bg-[var(--color-primary)]';
      default: return 'bg-[var(--color-bg)] border border-[var(--color-border-light)]';
    }
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] p-5 transition-all hover:shadow-[var(--shadow-md)] col-span-full">
      <div className="flex items-center justify-between mb-6">
        <div className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <span>📅</span>
          {t('activityCalendar')}
        </div>
      </div>

      {/* Scrollable container */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="inline-block md:min-w-full">

          {/* Month labels */}
          <div
            className="grid mb-1 pl-7"
            style={{
              gridTemplateColumns: `repeat(${weeks.length}, minmax(12px, 1fr))`,
              width: `${weeks.length * 14}px`
            }}
          >
            {monthLabels.map((m, i) => (
              <div
                key={i}
                className="text-[10px] text-[var(--color-text-muted)] whitespace-nowrap"
                style={{ gridColumn: m.col + 1 }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="flex gap-2" style={{ width: `${weeks.length * 14 + 28}px` }}>
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] pr-1.5 justify-around flex-shrink-0">
              {[t('mon'), '', t('wed'), '', t('fri'), '', ''].map((d, i) => (
                <div key={i} className="text-[9px] text-[var(--color-text-muted)] h-[10px] leading-[10px]">
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div
              className="grid gap-[3px] flex-1"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, 10px)`,
                gridTemplateRows: `repeat(7, 10px)`
              }}
            >
              {weeks.map((week, wi) =>
                week.map((day, di) => (
                  <div
                    key={`${wi}-${di}`}
                    title={`${day.date}: ${day.count} activities`}
                    className={`w-[10px] h-[10px] rounded-[2px] transition-colors hover:ring-1 hover:ring-[var(--color-primary)] cursor-pointer ${getLevelClass(day.level)}`}
                    style={{
                      gridColumn: wi + 1,
                      gridRow: di + 1,
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-4 text-[10px] text-[var(--color-text-muted)]">
        <span>{t('lessActive')}</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div
            key={level}
            className={`w-[10px] h-[10px] rounded-[2px] ${getLevelClass(level)}`}
          />
        ))}
        <span>{t('moreActive')}</span>
      </div>
    </div>
  );
}
