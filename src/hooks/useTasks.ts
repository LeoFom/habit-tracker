'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskPriority } from '@/lib/types';
import {useAuth} from "@/context/AuthContext";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Функція завантаження (той самий fetchTasks)
  const fetchTasks = useCallback(async () => {
    // 2. Якщо юзера немає, навіть не робимо запит
    if (!user) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/supabase/tasks');
      const data = await res.json();

      // ПЕРЕВІРКА: якщо data не масив (наприклад, об'єкт помилки), ставимо порожній масив
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error("API returned not an array:", data);
        setTasks([]);
      }
    } catch (error) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Завантажуємо при старті
  useEffect(() => {
    // 4. Важливо: якщо юзер виходить, цей ефект спрацює знову
    if (user) {
      fetchTasks();
    } else {
      setTasks([]); // 5. МИТТЄВО очищуємо стейт при logout
    }
  }, [user, fetchTasks]);

  // 2. Додавання (POST)
  const addTask = async (task: any) => {
    const res = await fetch('/api/supabase/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    if (res?.ok){
      await fetchTasks();
      return res
    }
    else {
      return res
    }
  };

  // 3. Видалення (DELETE)
  const removeTask = async (id: string) => {
    // Тобі треба буде створити DELETE метод в api/tasks/[id]/route.ts
    // Або просто викликати supabase client напряму тут (якщо RLS дозволяє)
    await fetch(`/api/supabase/tasks/${id}`, { method: 'DELETE' });
    await fetchTasks();
  };


  // const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
  //   const newTask: Task = {
  //     ...task,
  //     id: crypto.randomUUID(),
  //     completed: false,
  //     createdAt: new Date().toISOString(),
  //   };
  //   persist([...tasks, newTask]);
  // }, [tasks, persist]);

  const updateTask = async (id: string, updates: Partial<Task>) => {
    console.log("!!!! updateTask -> updates",updates)

    try {
      const res = await fetch(`/api/supabase/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Failed to update task');

      const updatedTask = await res.json();

      // Обновляем список задач, чтобы UI сразу подтянулся
      await fetchTasks();

      return updatedTask;
    } catch (err) {
      console.error("Update error:", err);
      return null;
    }
  };

  // const removeTask = useCallback((id: string) => {
  //   persist(tasks.filter(t => t.id !== id));
  // }, [tasks, persist]);

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    await fetch(`/api/supabase/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: !task.completed }),
    });
    await fetchTasks();
  };

  // const getSortedTasks = useCallback(() => {
  //   return [...tasks].sort((a, b) => {
  //     // Incomplete first
  //     if (a.completed !== b.completed) return a.completed ? 1 : -1;
  //     // Then by priority
  //     return PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
  //   });
  // }, [tasks]);

  const getCompletedCount = useCallback(() => {
    return tasks.filter(t => t.completed).length;
  }, [tasks]);

  const getSortedTasks = useCallback(() => {
    // Якщо tasks не масив (на випадок помилок), повертаємо порожній список
    if (!Array.isArray(tasks)) return [];

    return [...tasks].sort((a, b) => {
      // Спочатку незавершені
      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      // Потім за пріоритетом (якщо у вас є PRIORITY_CONFIG)
      // const orderA = PRIORITY_CONFIG[a.priority]?.order || 0;
      // const orderB = PRIORITY_CONFIG[b.priority]?.order || 0;
      // return orderA - orderB;

      return 0;
    });
  }, [tasks]);

  const getTasksByPriority = useCallback((priority: TaskPriority) => {
    if (!Array.isArray(tasks)) return [];
    return tasks.filter(t => t.priority === priority);
  }, [tasks]);

  return {
    tasks,
    loading,
    addTask,
    fetchTasks,
    getSortedTasks,
    removeTask,
    mounted,
    updateTask,
    toggleTask,
    getTasksByPriority,
    getCompletedCount,
  };
}
