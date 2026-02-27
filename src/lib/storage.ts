'use client';

// ============================================================
// localStorage abstraction layer
// When backend is added, replace these functions with API calls
// ============================================================

const KEYS = {
  HABITS: 'habittracker_habits',
  TASKS: 'habittracker_tasks',
  SETTINGS: 'habittracker_settings',
} as const;

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// --- Habits ---
import { Habit } from './types';

export function getHabits(): Habit[] {
  return getItem<Habit[]>(KEYS.HABITS, []);
}

export function saveHabits(habits: Habit[]): void {
  setItem(KEYS.HABITS, habits);
}

// --- Tasks ---
import { Task } from './types';

export function getTasks(): Task[] {
  return getItem<Task[]>(KEYS.TASKS, []);
}

export function saveTasks(tasks: Task[]): void {
  setItem(KEYS.TASKS, tasks);
}

// --- Settings ---
import { Settings } from './types';
import { DEFAULT_SETTINGS } from './constants';

export function getSettings(): Settings {
  return getItem<Settings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings: Settings): void {
  setItem(KEYS.SETTINGS, settings);
}
