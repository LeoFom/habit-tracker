'use client';

import { useState, useEffect, useCallback } from 'react';
import { Habit, HabitFrequency } from '@/lib/types';
import {useAuth} from "@/context/AuthContext";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Беремо юзера з контексту

  // Завантаження звичок з БД
  const fetchHabits = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch('/api/supabase/hobbies');
      const data = await res.json();
      if (Array.isArray(data)) setHabits(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  // Оновлення статусу (Toggle)
  const toggleHabit = async (id: string, dateStr: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    // Логіка додавання/видалення дати з масиву
    const newDates = habit.completed_dates.includes(dateStr)
      ? habit.completed_dates.filter(d => d !== dateStr)
      : [...habit.completed_dates, dateStr];

    // Оптимістичне оновлення (миттєво в UI)
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed_dates: newDates } : h));

    // Запит до БД
    await fetch(`/api/supabase/hobbies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed_dates: newDates }),
    });
  };

  const addHabit = async (name: string, frequency: HabitFrequency, icon: string = '🎯', color?: string) => {

    console.log(" (addHabit) -> name",name)
    console.log(" (addHabit) -> frequency",frequency)
    console.log(" (addHabit) -> icon",icon)
    console.log(" (addHabit) -> color",color)

    const res = await fetch('/api/supabase/hobbies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, frequency, icon, color, completed_dates: [] }),
    });
    console.log(" (addHabit) -> res",res)
    if (res.ok) fetchHabits();
  };

  const removeHabit = async (id: string) => {
    // Тобі треба буде створити DELETE метод в api/tasks/[id]/route.ts
    // Або просто викликати supabase client напряму тут (якщо RLS дозволяє)
    const res = await fetch(`/api/supabase/hobbies/${id}`, { method: 'DELETE' });
    if (res.ok) fetchHabits();
  };

  // Streak logic (залишаємо, але тепер вона працює з completed_dates)
  const getStreak = (habit: Habit): number => {
    const dates = habit.completed_dates;
    if (!dates?.length) return 0;

    const streak = 0;
    const today = new Date();
    // Логіка перевірки послідовності...
    return streak;
  };

  const getHabitsByFrequency = useCallback((frequency: HabitFrequency) => {
    return habits.filter(h => h.frequency === frequency);
  }, [habits]);

  return { habits, loading, addHabit, toggleHabit, fetchHabits, removeHabit, getStreak, getHabitsByFrequency };
}
