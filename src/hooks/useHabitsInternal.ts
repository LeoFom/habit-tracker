'use client';

import { Habit, HabitFrequency } from '@/lib/types';
import {useState, useEffect, useCallback, useMemo} from "react";
import { useAuth } from "@/context/AuthContext";

export function useHabitsInternal() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // =========================
  // FETCH HABITS
  // =========================

  const fetchHabits = useCallback(async () => {
    if (!user) return;

    setLoading(prev => {
      if (prev) return prev; // защита от повторного запроса
      return true;
    });

    try {
      const res = await fetch("/api/supabase/hobbies");

      if (!res.ok) throw new Error();

      const data = await res.json();

      setHabits(Array.isArray(data) ? data : []);
    } catch {
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      return;
    }

    fetchHabits();
  }, [user]);

  // =========================
  // TOGGLE HABIT
  // =========================

  const toggleHabit = useCallback(async (id: string, dateStr: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newDates = habit.completed_dates.includes(dateStr)
      ? habit.completed_dates.filter(d => d !== dateStr)
      : [...habit.completed_dates, dateStr];

    // optimistic update
    setHabits(prev =>
      prev.map(h => h.id === id ? { ...h, completed_dates: newDates } : h)
    );

    const res = await fetch(`/api/supabase/hobbies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed_dates: newDates }),
    });

    if (!res.ok) return;

    const updatedHabit = await res.json();

    setHabits(prev =>
      prev.map(h => h.id === id ? updatedHabit : h)
    );
  }, [habits]);

  // =========================
  // ADD HABIT
  // =========================

  const addHabit = useCallback(async (
    name: string,
    frequency: HabitFrequency,
    icon: string = "🎯",
    color?: string
  ) => {

    const res = await fetch("/api/supabase/hobbies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        frequency,
        icon,
        color,
        completed_dates: [],
      }),
    });

    if (!res.ok) return res;

    const newHabit = await res.json();

    setHabits(prev => [newHabit, ...prev]);

    return res;
  }, []);

  // =========================
  // REMOVE HABIT
  // =========================

  const removeHabit = useCallback(async (id: string) => {

    const res = await fetch(`/api/supabase/hobbies/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) return;

    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  // =========================
  // STREAK
  // =========================

  const getStreak = useCallback((habit: Habit): number => {
    const dates = habit.completed_dates;
    if (!dates?.length) return 0;

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const dateStr = d.toISOString().split("T")[0];

      if (dates.includes(dateStr)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, []);

  // =========================
  // FILTER
  // =========================

  const habitsByFrequency = useMemo(() => {
    const map: Record<string, Habit[]> = {};

    for (const habit of habits) {
      if (!map[habit.frequency]) {
        map[habit.frequency] = [];
      }

      map[habit.frequency].push(habit);
    }

    return map;
  }, [habits]);

  const getHabitsByFrequency = useCallback(
    (frequency: HabitFrequency) => {
      return habitsByFrequency[frequency] || [];
    },
    [habitsByFrequency]
  );

  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    const res = await fetch(`/api/supabase/hobbies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) return;

    const updatedHabit = await res.json();
    setHabits(prev => prev.map(h => h.id === id ? updatedHabit : h));
    return updatedHabit;
  }, []);

  return useMemo(() => ({
    habits,
    loading,
    // fetchHabits,
    toggleHabit,
    addHabit,
    removeHabit,
    getStreak,
    getHabitsByFrequency,
    updateHabit,
  }), [
    habits,
    loading,
    // fetchHabits,
    toggleHabit,
    addHabit,
    removeHabit,
    getStreak,
    getHabitsByFrequency,
    updateHabit,
  ]);
}