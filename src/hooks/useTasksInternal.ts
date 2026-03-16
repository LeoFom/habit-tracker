'use client';

import { Task, TaskPriority} from '@/lib/types';
import {useState, useEffect, useCallback, useMemo} from "react";
import { useAuth } from "@/context/AuthContext";

export function useTasksInternal() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // =========================
  // FETCH TASKS
  // =========================

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    setLoading(prev => {
      if (prev) return prev; // защита от повторного запроса
      return true;
    });

    try {
      const res = await fetch("/api/supabase/tasks");

      if (!res.ok) throw new Error();

      const data = await res.json();

      setTasks(Array.isArray(data) ? data : []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchTasks();
  }, [user, fetchTasks]);

  // =========================
  // ADD TASK
  // =========================

  const addTask = useCallback(async (task: Partial<Task>) => {

    const res = await fetch("/api/supabase/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!res.ok) return res;

    const newTask = await res.json();

    setTasks(prev => [newTask, ...prev]);

    return res;

  }, []);

  // =========================
  // REMOVE TASK
  // =========================

  const removeTask = useCallback(async (id: string) => {

    const res = await fetch(`/api/supabase/tasks/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) return;

    setTasks(prev => prev.filter(t => t.id !== id));

  }, []);

  // =========================
  // UPDATE TASK
  // =========================

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {

      const res = await fetch(`/api/supabase/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error();

      const updatedTask = await res.json();

      setTasks(prev =>
        prev.map(t => (t.id === id ? updatedTask : t))
      );

      return updatedTask;

    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  // =========================
  // TOGGLE TASK
  // =========================

  // const toggleTask = useCallback(async (id: string) => {
  //
  //   const task = tasks.find(t => t.id === id);
  //   if (!task) return;
  //
  //   const newCompleted = !task.completed;
  //
  //   // optimistic update
  //   setTasks(prev =>
  //     prev.map(t =>
  //       t.id === id ? { ...t, completed: newCompleted } : t
  //     )
  //   );
  //
  //   const res = await fetch(`/api/supabase/tasks/${id}`, {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ completed: newCompleted }),
  //   });
  //
  //   if (!res.ok) return;
  //
  //   const updatedTask = await res.json();
  //
  //   setTasks(prev =>
  //     prev.map(t => (t.id === id ? updatedTask : t))
  //   );
  //
  // }, [tasks]);

  const toggleTask = useCallback(async (id: string) => {
    let originalTask: Task | undefined;

    const now = new Date();
    const completedAtValue = now.toISOString(); // Формат: 2026-03-16T14:31:24.123Z

    // 1. Оптимистичное обновление
    setTasks((prev) => {
      return prev.map((t) => {
        if (t.id === id) {
          originalTask = { ...t }; // Сохраняем копию для отката
          return { ...t, completed: !t.completed, completed_at: t.completed ? completedAtValue : null };
        }
        return t;
      });
    });

    try {
      const newStatus = !originalTask?.completed;

      const res = await fetch(`/api/supabase/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newStatus, completed_at: newStatus ? completedAtValue : null }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      const updatedTask = await res.json();

      // 2. Синхронизация с сервером (необязательно, если доверяем оптимистичному обновлению)
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
    } catch (error) {
      // 3. ОТКАТ (Rollback) в случае ошибки
      console.error("Update failed, rolling back:", error);
      if (originalTask) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? originalTask! : t))
        );
      }
      // Здесь можно добавить уведомление (toast) для пользователя
    }
  }, []); // Убрали tasks из зависимостей!

  // =========================
  // FILTER + SORT
  // =========================

  const sortedTasks = useMemo(() => {

    if (!Array.isArray(tasks)) return [];

    let filtered = tasks;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      filtered = tasks.filter(t =>
        t.title.toLowerCase().includes(q)
      );
    }

    return [...filtered].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return 0;
    });

  }, [tasks, searchQuery]);

  // =========================
  // COMPLETED COUNT
  // =========================

  const completedCount = useMemo(() => {
    return tasks.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);
  }, [tasks]);

  // =========================
  // PRIORITY FILTER
  // =========================

  const getTasksByPriority = useCallback(
    (priority: TaskPriority) => {
      if (!Array.isArray(tasks)) return [];
      return tasks.filter(t => t.priority === priority);
    },
    [tasks]
  );

  return useMemo(() => ({
    tasks,
    loading,
    fetchTasks,
    addTask,
    removeTask,
    updateTask,
    toggleTask,
    sortedTasks,
    completedCount,
    getTasksByPriority,
    searchQuery,
    setSearchQuery,
  }), [
    tasks,
    loading,
    fetchTasks,
    addTask,
    removeTask,
    updateTask,
    toggleTask,
    sortedTasks,
    completedCount,
    getTasksByPriority,
    searchQuery
  ]);
}