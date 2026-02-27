'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskPriority } from '@/lib/types';
import { getTasks, saveTasks } from '@/lib/storage';
import { PRIORITY_CONFIG } from '@/lib/constants';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTasks(getTasks());
    setMounted(true);
  }, []);

  const persist = useCallback((next: Task[]) => {
    setTasks(next);
    saveTasks(next);
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    persist([...tasks, newTask]);
  }, [tasks, persist]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    persist(tasks.map(t => (t.id === id ? { ...t, ...updates } : t)));
  }, [tasks, persist]);

  const removeTask = useCallback((id: string) => {
    persist(tasks.filter(t => t.id !== id));
  }, [tasks, persist]);

  const toggleTask = useCallback((id: string) => {
    persist(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, [tasks, persist]);

  const getTasksByPriority = useCallback((priority: TaskPriority) => {
    return tasks.filter(t => t.priority === priority);
  }, [tasks]);

  const getSortedTasks = useCallback(() => {
    return [...tasks].sort((a, b) => {
      // Incomplete first
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // Then by priority
      return PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
    });
  }, [tasks]);

  const getCompletedCount = useCallback(() => {
    return tasks.filter(t => t.completed).length;
  }, [tasks]);

  return {
    tasks,
    mounted,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    getTasksByPriority,
    getSortedTasks,
    getCompletedCount,
  };
}
