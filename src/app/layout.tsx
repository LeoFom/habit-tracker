import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/hooks/useSettings";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SettingsProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
