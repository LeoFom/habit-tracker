'use client';

import { useMemo } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { useTasks } from '@/hooks/useTasks';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { PRIORITY_CONFIG } from '@/lib/constants';
import { TaskPriority } from '@/lib/types';
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

  if (!hasData) {
    return (
      <div className="card widget-double">
        <div className="card-header">
          <div className="card-title">
            <span>📊</span>
            {t('progress')}
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📈</div>
          <div className="empty-state-text">
            Додайте звички та задачі, щоб побачити ваш прогрес!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card widget-double">
      <div className="card-header">
        <div className="card-title">
          <span>📊</span>
          {t('progress')}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
        {/* Bar Chart — Weekly habits */}
        <div>
          <h4 style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
            {t('weeklyProgress')}
          </h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
              <XAxis dataKey="name" fontSize={11} stroke="var(--color-text-muted)" />
              <YAxis fontSize={11} stroke="var(--color-text-muted)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="completed" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — Tasks by priority */}
        <div>
          <h4 style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
            {t('tasksByPriority')}
          </h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={priorityData.filter(d => d.value > 0)}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
                fontSize={11}
              >
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart — Productivity trend */}
        <div>
          <h4 style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
            {t('productivityTrend')}
          </h4>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
              <XAxis dataKey="name" fontSize={10} stroke="var(--color-text-muted)" interval={2} />
              <YAxis fontSize={11} stroke="var(--color-text-muted)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="productivity"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
