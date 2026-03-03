"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "../components/layout/Header";
// import {
//   doc,
//   setDoc,
//   getDoc,
//   getDocs,
//   serverTimestamp,
//   collection,
// } from "firebase/firestore";
// import { db } from "@/lib/firebase";
import { getAllUsers } from "../services/getAllUsers";
import { supabase } from "../lib/supabase/client";

// Dynamic imports to avoid SSR issues with browser-only APIs
const TimeQuote = dynamic(() => import("../components/widgets/TimeQuote"), {
  ssr: false,
});
const HabitTracker = dynamic(
  () => import("../components/widgets/HabitTracker"),
  { ssr: false },
);
const TaskList = dynamic(() => import("../components/widgets/TaskList"), {
  ssr: false,
});
const AIRecommendations = dynamic(
  () => import("../components/widgets/AIRecommendations"),
  { ssr: false },
);
const ProgressCharts = dynamic(
  () => import("../components/widgets/ProgressCharts"),
  { ssr: false },
);
const ContributionCalendar = dynamic(
  () => import("../components/widgets/ContributionCalendar"),
  { ssr: false },
);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("test")
        .select("*");

      setData(data || []);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("___ supabase ___ data",data)
  }, [data]);
  useEffect(() => {
    // Вызываем функцию при первом рендере
    const fetchData = async () => {
      try {
        const data = await getAllUsers().then((users) => {
          console.log(" ? Полученные пользователи:", users);
          return users;
        });
        setUsers(data); // Кладём данные в состояние
      } catch (error) {
        console.error("Ошибка:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("Пользователи из базы:", users);
  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Header />

      <div className="dashboard-grid">
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
    </main>
  );
}
