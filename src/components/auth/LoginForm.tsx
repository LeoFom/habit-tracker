"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {Mail, Lock, Loader2, EyeOff, Eye} from "lucide-react";

interface LoginFormProps {
  onSuccess: () => void;
  onSubmit: (data: any) => void ;
}

export default function LoginForm({ onSuccess, onSubmit }: LoginFormProps) {
  const { signInWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // const saveUser = async (userId: string, data: any) => {
  //   // 1. Создаем ссылку на документ: (база, коллекция, id)
  //   const userRef = doc(db, "users", userId);
  //
  //   // 2. Записываем. { merge: true } защищает от затирания других полей
  //   await setDoc(userRef, data, { merge: true });
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSubmit(formData); // Вызываем родительскую функцию
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      showToast("Successfully logged in with Google!", "success");
      onSuccess();
    } catch (error: any) {
      console.error("Google Auth Error:", error);

      // Если пользователь просто закрыл окно, не пугаем его красной ошибкой
      if (error.code === "auth/popup-closed-by-user") {
        showToast("Login cancelled", "info");
      } else {
        showToast("Failed to login with Google", "error");
      }
    } finally {
      setLoading(false); // Теперь кнопка разблокируется в любом случае
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[13px] font-medium text-[var(--color-text-secondary)]">
            Email
          </label>
          <div className="relative group">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors"
            />
            <input
              id="email"
              type="email"
              className="w-full pl-10 pr-3 py-[10px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[16px] outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="input-group">
          <label
            htmlFor="password-input"
            style={{
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 6,
              display: "block",
              color: "var(--color-text-secondary)",
            }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            {/* Іконка зліва */}
            <Lock
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-muted)",
                pointerEvents: "none", // Важливо
              }}
            />

            <input
              id="password-input"
              type={showPassword ? "text" : "password"} // Зміна типу
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "10px 40px 10px 36px", // Додав відступ справа для кнопки
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                color: "var(--color-text-primary)",
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />

            {/* Кнопка перемикання справа */}
            <button
              type="button" // Щоб не сабмітив форму
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text-muted)",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "10px",
            marginTop: 8,
          }}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Log In"}
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            height: 1,
            flex: 1,
            background: "var(--color-border-light)",
          }}
        />
        <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
          OR
        </span>
        <div
          style={{
            height: 1,
            flex: 1,
            background: "var(--color-border-light)",
          }}
        />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="btn btn-secondary"
        disabled={loading}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          width: "100%",
          padding: "10px",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </button>
    </div>
  );
}
