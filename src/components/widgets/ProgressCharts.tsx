'use client';

import React, { useMemo } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { useTasks } from '@/hooks/useTasks';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { PRIORITY_CONFIG } from '@/lib/constants';
import { TaskPriority } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, Legend
} from 'recharts';
import { Flame, Target, TrendingUp } from 'lucide-react';


export default function ProgressCharts() {
  const { t } = useTranslation();
  const { habits } = useHabits();
  const { tasks, getTasksByPriority } = useTasks();

  // Генерація масиву дат один раз
  const last14Days = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
  }, []);

  // Оптимізовані дані для графіків
  const stats = useMemo(() => {
    const dailyCompletionMap: Record<string, number> = {};

    // Попередній прорахунок для O(n) замість O(n^2)
    habits.forEach(habit => {
      habit.completed_dates?.forEach(date => {
        dailyCompletionMap[date] = (dailyCompletionMap[date] || 0) + 1;
      });
    });

    const weekly = last14Days.slice(-7).map(dateStr => {
      const date = new Date(dateStr);
      return {
        date: dateStr,
        name: date.toLocaleDateString('uk-UA', { weekday: 'short' }),
        completed: dailyCompletionMap[dateStr] || 0,
        total: habits.length
      };
    });

    const trend = last14Days.map(dateStr => ({
      name: new Date(dateStr).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }),
      productivity: dailyCompletionMap[dateStr] || 0
    }));

    return { weekly, trend };
  }, [habits, last14Days]);

  const priorityData = useMemo(() => {
    return (Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map(p => ({
      name: t(p),
      value: getTasksByPriority(p).length,
      color: PRIORITY_CONFIG[p].color,
    })).filter(item => item.value > 0);
  }, [tasks, getTasksByPriority, t]);

  if (habits.length === 0 && tasks.length === 0) {
    return (
      <div className="w-full col-span-full">
        <EmptyState t={t} />
      </div>
      );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] p-6 transition-all hover:shadow-[var(--shadow-md)] col-span-1 md:col-span-3">
      <header className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <TrendingUp size={20} className="text-[var(--color-primary)]" />
          {t('analyticsDashboard')}
        </h3>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Weekly Activity */}
        <ChartContainer title={t('weeklyActivity')} icon={<Target size={14}/>}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weekly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} tick={{fill: 'var(--color-text-muted)'}} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="completed"
                name={t('completedHabits')}
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Task Priorities */}
        <ChartContainer title={t('taskDistribution')} icon={<Flame size={14}/>}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Long-term Trend */}
        <ChartContainer title={t('14DayTrend')} icon={<TrendingUp size={14}/>}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.trend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} interval={2} tick={{fill: 'var(--color-text-muted)'}} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="stepAfter" // Професійний вигляд для дискретних даних (звички)
                dataKey="productivity"
                name={t('score')}
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}

// Допоміжні під-компоненти для чистоти коду
function ChartContainer({ title, children, icon }: { title: string, children: React.ReactNode, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[240px]">
      <div className="flex items-center gap-2 mb-4 justify-center">
        <span className="text-[var(--color-primary)] opacity-70">{icon}</span>
        <h4 className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
          {title}
        </h4>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

function EmptyState({ t }: any) {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-12 border border-dashed border-[var(--color-border)] text-center">
      <div className="text-4xl mb-4">📈</div>
      <p className="text-[var(--color-text-secondary)] text-sm">{t('noDataToAnalyze')}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-[var(--radius-md)] shadow-xl outline-none">
        <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase mb-1">{label}</p>
        <p className="text-sm font-semibold text-[var(--color-primary)]">
          {payload[0].name}: <span className="text-[var(--color-text-primary)]">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};
