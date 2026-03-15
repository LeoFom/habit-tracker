import type { Metadata } from "next";
import "@/app/globals.css";
import {ClientProviders} from "@/app/providers/ClientProviders";
import {HabitsProvider} from "@/app/providers/HabitsProvider";
import {TasksProvider} from "@/app/providers/TasksProvider";

export const metadata: Metadata = {
  title: "HabitTracker — Dashboard продуктивності",
  description: "Трекер звичок та dashboard продуктивності. Відстежуйте звички, керуйте задачами, отримуйте AI-рекомендації та візуалізуйте прогрес.",
  keywords: ["habit tracker", "productivity", "dashboard", "трекер звичок", "продуктивність"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/*<QueryProvider>*/}
          <ClientProviders>
            <HabitsProvider>
              <TasksProvider>
                {children}
              </TasksProvider>
            </HabitsProvider>
          </ClientProviders>
        {/*</QueryProvider>*/}
      </body>
    </html>
  );
}
