'use client';

import { useContext} from 'react';
import {TasksContext} from "@/app/providers/TasksProvider";

// export function useTasks() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const { user } = useAuth()
//   const [loading, setLoading] = useState(true);
//   const controllerRef = useRef<AbortController | null>(null);
//
//   // 1. Функція завантаження (той самий fetchTasks)
//   const fetchTasks = useCallback(async () => {
//     if (!user) return;
//
//     if (controllerRef.current) {
//       controllerRef.current.abort();
//     }
//
//     controllerRef.current = new AbortController();
//
//     try {
//       setLoading(true);
//
//       const res = await fetch('/api/supabase/tasks', {
//         signal: controllerRef.current.signal
//       });
//
//       if (!res.ok) throw new Error();
//
//       const data = await res.json();
//
//       setTasks(Array.isArray(data) ? data : []);
//
//     } catch (err: any) {
//       if (err.name !== "AbortError") {
//         setTasks([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);
//
//   // Завантажуємо при старті
//   useEffect(() => {
//     if (!user) {
//       setTasks([]);
//       return;
//     }
//
//     fetchTasks();
//
//     return () => {
//       controllerRef.current?.abort();
//     };
//
//   }, [user]);
//
//   // 2. Додавання (POST)
//   const addTask = useCallback(async (task: any) => {
//     const res = await fetch('/api/supabase/tasks', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(task),
//     });
//
//     if (!res.ok) return res;
//
//     const newTask = await res.json();
//
//     setTasks(prev => [newTask, ...prev]);
//
//     return res;
//   }, []);
//
//   // 3. Видалення (DELETE)
//   const removeTask = useCallback(async (id: string) => {
//     const res = await fetch(`/api/supabase/tasks/${id}`, {
//       method: 'DELETE'
//     });
//
//     if (!res.ok) return;
//
//     setTasks(prev => prev.filter(t => t.id !== id));
//   }, []);
//
//
//   // const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
//   //   const newTask: Task = {
//   //     ...task,
//   //     id: crypto.randomUUID(),
//   //     completed: false,
//   //     createdAt: new Date().toISOString(),
//   //   };
//   //   persist([...tasks, newTask]);
//   // }, [tasks, persist]);
//
//   const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
//     try {
//       const res = await fetch(`/api/supabase/tasks/${id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updates),
//       });
//
//       if (!res.ok) throw new Error();
//
//       const updatedTask = await res.json();
//
//       setTasks(prev =>
//         prev.map(t => t.id === id ? updatedTask : t)
//       );
//
//       return updatedTask;
//
//     } catch (err) {
//       console.error(err);
//       return null;
//     }
//   }, []);
//
//   // const removeTask = useCallback((id: string) => {
//   //   persist(tasks.filter(t => t.id !== id));
//   // }, [tasks, persist]);
//
//   const toggleTask = useCallback(async (id: string) => {
//
//     const task = tasks.find(t => t.id === id);
//     if (!task) return;
//
//     const newCompleted = !task.completed;
//
//     // optimistic update
//     setTasks(prev =>
//       prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t)
//     );
//
//     const res = await fetch(`/api/supabase/tasks/${id}`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ completed: newCompleted }),
//     });
//
//     if (!res.ok) return;
//
//     const updatedTask = await res.json();
//
//     setTasks(prev =>
//       prev.map(t => t.id === id ? updatedTask : t)
//     );
//
//   }, [tasks]);
//
//   const sortedTasks = useMemo(() => {
//
//     if (!Array.isArray(tasks)) return [];
//
//     let filtered = tasks;
//
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//
//       filtered = tasks.filter(t =>
//         t.title.toLowerCase().includes(q)
//       );
//     }
//
//     return [...filtered].sort((a, b) => {
//       if (a.completed !== b.completed) return a.completed ? 1 : -1;
//       return 0;
//     });
//
//   }, [tasks, searchQuery]);
//   // const getSortedTasks = useCallback(() => {
//   //   return [...tasks].sort((a, b) => {
//   //     // Incomplete first
//   //     if (a.completed !== b.completed) return a.completed ? 1 : -1;
//   //     // Then by priority
//   //     return PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
//   //   });
//   // }, [tasks]);
//
//   const completedCount = useMemo(() => {
//     return tasks.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);
//   }, [tasks]);
//
//   // const getSortedTasksOLD = useCallback(() => {
//   //   // Якщо tasks не масив (на випадок помилок), повертаємо порожній список
//   //   if (!Array.isArray(tasks)) return [];
//   //
//   //   return [...tasks].sort((a, b) => {
//   //     // Спочатку незавершені
//   //     if (a.completed !== b.completed) return a.completed ? 1 : -1;
//   //
//   //
//   //     return 0;
//   //   });
//   // }, [tasks]);
//
//   const getTasksByPriority = useCallback((priority: TaskPriority) => {
//     if (!Array.isArray(tasks)) return [];
//     return tasks.filter(t => t.priority === priority);
//   }, [tasks]);
//
//   // const getSortedTasks = useCallback(() => {
//   //   if (!Array.isArray(tasks)) return [];
//   //
//   //   let filtered = [...tasks];
//   //
//   //   // Если есть поисковый запрос от AI — фильтруем
//   //   if (searchQuery) {
//   //     filtered = filtered.filter(t =>
//   //       t.title.toLowerCase().includes(searchQuery.toLowerCase())
//   //     );
//   //   }
//   //
//   //   return filtered.sort((a, b) => {
//   //     if (a.completed !== b.completed) return a.completed ? 1 : -1;
//   //     return 0;
//   //   });
//   // }, [tasks, searchQuery]);
//
//
//   return useMemo(() => ({
//     tasks,
//     loading,
//     addTask,
//     fetchTasks,
//     sortedTasks,
//     removeTask,
//     updateTask,
//     toggleTask,
//     getTasksByPriority,
//     completedCount,
//     searchQuery,
//     setSearchQuery,
//   }), [
//     tasks,
//     loading,
//     addTask,
//     fetchTasks,
//     sortedTasks,
//     removeTask,
//     updateTask,
//     toggleTask,
//     getTasksByPriority,
//     completedCount,
//     searchQuery
//   ]);
// }


export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitsProvider");
  }
  return context;
}