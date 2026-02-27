"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Mail, Lock, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { signInWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const saveUser = async (userId: string, data: any) => {
    // 1. Создаем ссылку на документ: (база, коллекция, id)
    const userRef = doc(db, "users", userId);

    // 2. Записываем. { merge: true } защищает от затирания других полей
    await setDoc(userRef, data, { merge: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      showToast("Successfully logged in!", "success");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      let message = "Failed to login";
      if (error.code === "auth/invalid-credential")
        message = "Invalid email or password";
      if (error.code === "auth/user-not-found") message = "User not found";
      if (error.code === "auth/wrong-password") message = "Invalid password";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
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
        onSubmit={handleEmailLogin}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div className="input-group">
          <label
            style={{
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 6,
              display: "block",
            }}
          >
            Email
          </label>
          <div style={{ position: "relative" }}>
            <Mail
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-muted)",
              }}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>
        </div>

        <div className="input-group">
          <label
            style={{
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 6,
              display: "block",
            }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            <Lock
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-muted)",
              }}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                color: "var(--color-text-primary)",
              }}
            />
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
