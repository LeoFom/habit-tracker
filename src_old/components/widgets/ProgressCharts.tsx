'use client';

import { useMemo } from 'react';
import { useHabits } from '../../hooks/useHabits';
import { useTasks } from '../../hooks/useTasks';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { PRIORITY_CONFIG } from '../../lib/constants';
import { TaskPriority } from '../../lib/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';

export default function ProgressCharts() {
  const { t } = useTranslation();
  const { habits } = useHabits();
  const { tasks, getTasksByPriority } = useTasks();

  // --- Bar chart: habits completed per day (last 7 days) ---
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('uk-UA', { weekday: 'short' });
      const completed = habits.filter(h => h.completedDates.includes(dateStr)).length;
      days.push({ name: dayName, completed, total: habits.length });
    }
    return days;
  }, [habits]);

  // --- Pie chart: tasks by priority ---
  const priorityData = useMemo(() => {
    return (Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map(p => ({
      name: t(p as 'urgent' | 'high' | 'medium' | 'low'),
      value: getTasksByPriority(p).length,
      color: PRIORITY_CONFIG[p].color,
    }));
  }, [tasks, getTasksByPriority, t]);

  // --- Line chart: productivity trend (last 14 days) ---
  const trendData = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const habitsCompleted = habits.filter(h => h.completedDates.includes(dateStr)).length;
      const dayLabel = date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
      days.push({ name: dayLabel, productivity: habitsCompleted });
    }
    return days;
  }, [habits]);

  const hasData = habits.length > 0 || tasks.length > 0;

  const cardClass = "bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] p-5 transition-all hover:shadow-[var(--shadow-md)] col-span-1 md:col-span-2";

  if (!hasData) {
    return (
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <span>📊</span>
            {t('progress')}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-[var(--color-text-muted)] text-center gap-3">
          <div className="text-5xl opacity-30">📈</div>
          <p className="text-sm max-w-[240px]">
            Додайте звички та задачі, щоб побачити ваш прогрес!
          </p>
        </div>
      </div>
    );
  }

  const customTooltipStyle = {
    contentStyle: {
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      fontSize: '12px',
      boxShadow: 'var(--shadow-md)'
    },
    itemStyle: { color: 'var(--color-text-primary)' }
  };

  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between mb-6">
        <div className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <span>📊</span>
          {t('progress')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Bar Chart — Weekly habits */}
        <div className="flex flex-col">
          <h4 className="text-[13px] font-semibold text-[var(--color-text-secondary)] mb-4 text-center uppercase tracking-tight">
            {t('weeklyProgress')}
          </h4>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
                <XAxis dataKey="name" fontSize={11} stroke="var(--color-text-muted)" axisLine={false} tickLine={false} />
                <YAxis fontSize={11} stroke="var(--color-text-muted)" width={25} axisLine={false} tickLine={false} />
                <Tooltip {...customTooltipStyle} />
                <Bar dataKey="completed" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart — Tasks by priority */}
        <div className="flex flex-col">
          <h4 className="text-[13px] font-semibold text-[var(--color-text-secondary)] mb-4 text-center uppercase tracking-tight">
            {t('tasksByPriority')}
          </h4>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart — Productivity trend */}
        <div className="flex flex-col">
          <h4 className="text-[13px] font-semibold text-[var(--color-text-secondary)] mb-4 text-center uppercase tracking-tight">
            {t('productivityTrend')}
          </h4>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
                <XAxis dataKey="name" fontSize={10} stroke="var(--color-text-muted)" interval={2} axisLine={false} tickLine={false} />
                <YAxis fontSize={11} stroke="var(--color-text-muted)" width={25} axisLine={false} tickLine={false} />
                <Tooltip {...customTooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 3, stroke: '#fff' }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
