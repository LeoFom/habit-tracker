'use client';

import { useContext} from 'react';
import {HabitsContext} from "@/app/providers/HabitsProvider";
//
// export function useHabits() {
//   const [habits, setHabits] = useState<Habit[]>([]);
//   const [loading, setLoading] = useState(false);
//   const { user } = useAuth(); // Беремо юзера з контексту
//   const controller = new AbortController();
//
//   // Завантаження звичок з БД
//   const fetchHabits = useCallback(async () => {
//     if (!user || loading) return;
//
//     try {
//       console.log("fetchHabits - try")
//       setLoading(true);
//       const res = await fetch('/api/supabase/hobbies', {
//         signal: controller.signal
//       });
//
//       const data = await res.json();
//       setHabits(Array.isArray(data) ? data : []);
//
//     } catch {
//       setHabits([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [user, loading]);
//
//   useEffect(() => {
//     // 4. Важливо: якщо юзер виходить, цей ефект спрацює знову
//     if (user) {
//       fetchHabits();
//     } else {
//       setHabits([]); // 5. МИТТЄВО очищуємо стейт при logout
//     }
//   }, [user, fetchHabits]);
//
//   // Оновлення статусу (Toggle)
//   const toggleHabit = async (id: string, dateStr: string) => {
//     const habit = habits.find(h => h.id === id);
//     if (!habit) return;
//
//     // Логіка додавання/видалення дати з масиву
//     const newDates = habit.completed_dates.includes(dateStr)
//       ? habit.completed_dates.filter(d => d !== dateStr)
//       : [...habit.completed_dates, dateStr];
//
//     // Оптимістичне оновлення (миттєво в UI)
//     setHabits(prev => prev.map(h => h.id === id ? { ...h, completed_dates: newDates } : h));
//
//     // Запит до БД
//     const res = await fetch(`/api/supabase/hobbies/${id}`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ completed_dates: newDates }),
//     });
//
//     if (!res.ok) return;
//
//     const updatedHabit = await res.json();
//
//     setHabits(prev =>
//       prev.map(t => t.id === id ? updatedHabit : t)
//     );
//   };
//
//   const addHabit = async (name: string, frequency: HabitFrequency, icon: string = '🎯', color?: string) => {
//     const res = await fetch('/api/supabase/hobbies', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, frequency, icon, color, completed_dates: [] }),
//     });
//     console.log(" (addHabit) -> res",res)
//
//     if (!res.ok) return res;
//     //     !!!!!!!!!!!!!!!!!!
//     // if (res.ok) fetchHabits();
//     //     !!!!!!!!!!!!!!!!!!
//
//     const newTask = await res.json();
//
//     setHabits(prev => [newTask, ...prev]);
//
//     return res;
//   };
//
//   const removeHabit = async (id: string) => {
//     const res = await fetch(`/api/supabase/hobbies/${id}`, { method: 'DELETE' });
//     // if (res.ok) fetchHabits();
//
//     if (!res.ok) return;
//
//     setHabits(prev => prev.filter(t => t.id !== id));
//   };
//
//   // Streak logic (залишаємо, але тепер вона працює з completed_dates)
//   const getStreak = (habit: Habit): number => {
//     const dates = habit.completed_dates;
//     if (!dates?.length) return 0;
//
//     const streak = 0;
//     const today = new Date();
//     // Логіка перевірки послідовності...
//     return streak;
//   };
//
//   const getHabitsByFrequency = useCallback((frequency: HabitFrequency) => {
//     return habits.filter(h => h.frequency === frequency);
//   }, [habits]);
//
//   return { habits, loading, addHabit, toggleHabit, fetchHabits, removeHabit, getStreak, getHabitsByFrequency };
// }

export function useHabits() {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitsProvider");
  }
  return context;
}