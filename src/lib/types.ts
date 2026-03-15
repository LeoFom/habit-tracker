// ============================================================
// HabitTracker — Core TypeScript Types
// ============================================================

// --- Habit Types ---

export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Habit {
  id: string;
  name: string;
  icon?: string;
  frequency: HabitFrequency;
  /** ISO date strings when habit was completed, e.g. ["2026-02-17"] */
  completed_dates: string[];
  createdAt: string;
  color?: string;
}

// --- Task Types ---

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export type ReminderFrequency = 'once' | 'daily' | 'weekly';

export interface Task {
  id: string;
  title: string;
  // description?: string;
  description: string | null;
  priority: TaskPriority;
  tags: string[];
  due_date: string | null;
  reminder_at: string | null;
  reminderDate?: string;
  reminderFrequency?: ReminderFrequency;
  completed: boolean;
  createdAt: string;
  // TODO: Future improvement — add subtasks support (nested tasks)
  // subtasks?: Task[];
}

export type CreateTaskDTO = {
  title: string;
  description: string | null;
  priority: TaskPriority;
  tags: string[];
  due_date: string | null;
  reminder_at: string | null;
  reminder_frequency: ReminderFrequency;
};

// --- Settings Types ---

export type Language = 'uk' | 'en';
export type AIMode = 'general' | 'personalized';

export interface TabVisibility {
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
  yearly: boolean;
}

export interface Settings {
  visibleTabs: TabVisibility;
  showCalendar: boolean;
  aiMode: AIMode;
  language: Language;
}

// --- AI Recommendation Types ---

export interface AIRecommendation {
  id: string;
  text: string;
  category: 'productivity' | 'health' | 'focus' | 'motivation';
  icon?: string;
}

// --- Chart Data Types ---

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface WeeklyHabitData {
  day: string;
  completed: number;
  total: number;
}

// --- Contribution Calendar Types ---

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export type AuthView = 'login' | 'register' | 'profile' | '';
