"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { User, Session } from '@supabase/supabase-js';
import {getSupabaseBrowserClient} from "@/lib/supabase/browser-client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  // Измени void на UserCredential
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (fullName: string) => Promise<void>; // Новый метод
  resetPassword: (email: string) => Promise<void>;    // Новый метод
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      // 1. Ждем сам клиент
      const supabase = await getSupabaseBrowserClient();

      // 2. Получаем текущую сессию
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);

      // 3. Подписываемся на обновления
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    };

    initialize();
  }, []);

  const signInWithGoogle = async () => {
    const supabase = await getSupabaseBrowserClient(); // Ждем клиент здесь
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: { prompt: 'select_account', access_type: 'offline' },
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const logout = async () => {
    const supabase = await getSupabaseBrowserClient(); // И здесь
    await supabase.auth.signOut();
  };

  const updateProfile = async (fullName: string) => {
    const supabase = await getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const supabase = await getSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, logout, updateProfile, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}