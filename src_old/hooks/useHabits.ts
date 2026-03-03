'use client';

import { useState, useEffect, useCallback } from 'react';
import { Habit, HabitFrequency } from '../lib/types';
import { getHabits, saveHabits } from '../lib/storage';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHabits(getHabits());
    setMounted(true);
  }, []);

  const persist = useCallback((next: Habit[]) => {
    setHabits(next);
    saveHabits(next);
  }, []);

  const addHabit = useCallback((name: string, frequency: string, icon?: string, color?: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      icon: icon || '🎯',
      frequency,
      completedDates: [],
      createdAt: new Date().toISOString(),
      color,
    };
    persist([...habits, newHabit]);
  }, [habits, persist]);

  const toggleHabit = useCallback((id: string, date: string) => {
    persist(
      habits.map(h => {
        if (h.id !== id) return h;
        const completed = h.completedDates.includes(date)
          ? h.completedDates.filter(d => d !== date)
          : [...h.completedDates, date];
        return { ...h, completedDates: completed };
      })
    );
  }, [habits, persist]);

  const removeHabit = useCallback((id: string) => {
    persist(habits.filter(h => h.id !== id));
  }, [habits, persist]);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    persist(habits.map(h => (h.id === id ? { ...h, ...updates } : h)));
  }, [habits, persist]);

  const getHabitsByFrequency = useCallback((frequency: string) => {
    return habits.filter(h => h.frequency === frequency);
  }, [habits]);

  const getStreak = useCallback((habit: Habit): number => {
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (habit.completedDates.includes(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }, []);

  return {
    habits,
    mounted,
    addHabit,
    toggleHabit,
    removeHabit,
    updateHabit,
    getHabitsByFrequency,
    getStreak,
  };
}
