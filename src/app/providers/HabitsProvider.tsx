"use client";

import {createContext} from "react";
// import {useHabits} from "@/hooks/useHabits";
import {useHabitsInternal} from "@/hooks/useHabitsInternal";
import {Habit, HabitFrequency} from "@/lib/types";

interface HabitsContextType {
  habits: Habit[];
  loading: boolean;
  // fetchHabits: () => Promise<void>;
  toggleHabit: (id: string, dateStr: string) => Promise<void>;
  addHabit: (name: string, frequency: HabitFrequency, icon?: string, color?: string) => Promise<Response | void>;
  removeHabit: (id: string) => Promise<void>;
  getStreak: (habit: Habit) => number;
  getHabitsByFrequency: (frequency: HabitFrequency) => Habit[];
}

export const HabitsContext = createContext<HabitsContextType | null>(null);

export function HabitsProvider({ children }: any) {
  const habitsState = useHabitsInternal();

  return (
    <HabitsContext.Provider value={habitsState}>
      {children}
    </HabitsContext.Provider>
  );
}