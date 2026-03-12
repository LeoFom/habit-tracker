'use client';



import { useState } from "react";
import {useAuth} from "@/context/AuthContext";

export function ProfileModal() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleUpdate = async () => {
    setStatus("loading");
    try {
      await updateProfile(name);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      alert("Ошибка при обновлении");
      setStatus("idle");
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
      <label className="text-sm font-medium">Ваше имя</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md outline-none focus:border-[var(--color-primary)]"
      />
      <button
        onClick={handleUpdate}
        disabled={status === "loading"}
        className="bg-[var(--color-primary)] text-white py-2 rounded-md font-bold disabled:opacity-50"
      >
        {status === "loading" ? "Сохранение..." : status === "success" ? "Готово!" : "Обновить имя"}
      </button>
    </div>
  );
}