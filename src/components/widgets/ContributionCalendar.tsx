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

  return (
    <div className="card widget-full">
      <div className="card-header">
        <div className="card-title">
          <span>📅</span>
          {t('activityCalendar')}
        </div>
      </div>

      {/* Month labels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
        marginBottom: 4,
        paddingLeft: 28,
      }}>
        {monthLabels.map((m, i) => (
          <div
            key={i}
            style={{
              gridColumn: m.col + 1,
              fontSize: 10,
              color: 'var(--color-text-muted)',
            }}
          >
            {m.label}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {/* Day labels */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: 3, paddingRight: 4, justifyContent: 'space-around'
        }}>
          {[t('mon'), '', t('wed'), '', t('fri'), '', ''].map((d, i) => (
            <div key={i} style={{ fontSize: 9, color: 'var(--color-text-muted)', height: 10, lineHeight: '10px' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
          gridAutoRows: '1fr',
          gap: 3,
          flex: 1,
        }}>
          {weeks.map((week, wi) =>
            week.map((day, di) => (
              <div
                key={`${wi}-${di}`}
                className={`contribution-cell level-${day.level}`}
                title={`${day.date}: ${day.count} activities`}
                style={{
                  gridColumn: wi + 1,
                  gridRow: di + 1,
                  minHeight: 10,
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        justifyContent: 'flex-end', marginTop: 12,
        fontSize: 10, color: 'var(--color-text-muted)'
      }}>
        <span>{t('lessActive')}</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div
            key={level}
            className={`contribution-cell level-${level}`}
            style={{ width: 10, height: 10, borderRadius: 2 }}
          />
        ))}
        <span>{t('moreActive')}</span>
      </div>
    </div>
  );
}
