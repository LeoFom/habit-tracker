'use client';

import { useState } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { HabitFrequency } from '@/lib/types';
import { HABIT_ICONS } from '@/lib/constants';
import { Plus, Check, Flame, Trash2 } from 'lucide-react';

export default function HabitTracker() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { habits, addHabit, toggleHabit, removeHabit, getHabitsByFrequency, getStreak } = useHabits();

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
  const filteredHabits = getHabitsByFrequency(activeTab);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addHabit(newName.trim(), activeTab, newIcon);
    setNewName('');
    setShowAdd(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span>🎯</span>
          {t('habits')}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={14} /> {t('addHabit')}
        </button>
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="tabs" style={{ marginBottom: 16 }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Add Habit Form */}
      {showAdd && (
        <div style={{
          display: 'flex', gap: 8, marginBottom: 16,
          padding: 12, background: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)', alignItems: 'center'
        }}>
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-icon btn-secondary"
              style={{ fontSize: 20 }}
              onClick={() => {
                const idx = HABIT_ICONS.indexOf(newIcon);
                setNewIcon(HABIT_ICONS[(idx + 1) % HABIT_ICONS.length]);
              }}
            >
              {newIcon}
            </button>
          </div>
          <input
            className="input"
            placeholder={t('habitName')}
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>{t('save')}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>{t('cancel')}</button>
        </div>
      )}

      {/* Habit List */}
      {filteredHabits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-text">{t('habitPlaceholder')}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filteredHabits.map(habit => {
            const isCompleted = habit.completedDates.includes(today);
            const streak = getStreak(habit);
            return (
              <div key={habit.id} className="checkbox-wrapper" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}
                     onClick={() => toggleHabit(habit.id, today)}>
                  <div className={`checkbox ${isCompleted ? 'checked' : ''}`}>
                    {isCompleted && <Check size={14} color="white" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: 18 }}>{habit.icon}</span>
                  <span style={{
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    color: isCompleted ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                    fontWeight: 500, fontSize: 14
                  }}>
                    {habit.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {streak > 0 && (
                    <span className="badge badge-primary" style={{ gap: 4 }}>
                      <Flame size={12} /> {streak} {t('days')}
                    </span>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={() => removeHabit(habit.id)}
                    style={{ color: 'var(--color-text-muted)', padding: 4 }}>
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
