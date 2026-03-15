"use client";

import React from "react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";

// Dynamic imports to avoid SSR issues with browser-only APIs
const TimeQuote = dynamic(() => import("@/components/widgets/TimeQuote"), {
  ssr: true,
});
const HabitTracker = dynamic(
  () => import("@/components/widgets/HabitTracker"),
  { ssr: true },
);
const TaskList = dynamic(() => import("@/components/widgets/TaskList"), {
  ssr: true,
});
const AIRecommendations = dynamic(
  () => import("@/components/widgets/AIRecommendations"),
  { ssr: true },
);
const ProgressCharts = dynamic(
  () => import("@/components/widgets/ProgressCharts"),
  { ssr: true },
);
const ContributionCalendar = dynamic(
  () => import("@/components/widgets/ContributionCalendar"),
  { ssr: false },
);

export default function Home() {
  // const [loading, setLoading] = useState(true);
  // const [users, setUsers] = useState<any[]>([]);

  // useEffect(() => {
  //   // Вызываем функцию при первом рендере
  //   const fetchData = async () => {
  //     try {
  //       const data = await getAllUsers().then((users) => {
  //         // console.log(" ? Полученные пользователи:", users);
  //         return users;
  //       });
  //       setUsers(data); // Кладём данные в состояние
  //     } catch (error) {
  //       console.error("Ошибка:", error);
  //     }
  //     finally {
  //       setLoading(false);
  //     }
  //   };
  //
  //   fetchData();
  // }, []);

  // console.log("Пользователи из базы:", users);
  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Header />

      <div
        className="
          grid grid-cols-1
          gap-[var(--space-md)]
          p-[var(--space-md)]
          pl-[calc(var(--space-md)+var(--safe-left))]
          pr-[calc(var(--space-md)+var(--safe-right))]
          max-w-[1400px]
          mx-auto

          md:grid-cols-2
          md:p-[24px]
          md:gap-[20px]

          xl:grid-cols-3
        "
      >
        {/* Row 1: Time + Quote (full width) */}
        <TimeQuote />

        {/* Row 2: Habit Tracker + Task List */}
        <HabitTracker />
        <TaskList />
        <AIRecommendations />

        {/* Row 3: Progress Charts (double width) */}
        <ProgressCharts />

        {/* Row 4: Contribution Calendar (full width) */}
        <ContributionCalendar />
      </div>
      <footer>
        Version: {process.env.APP_VERSION}
      </footer>
    </main>
  );
}
