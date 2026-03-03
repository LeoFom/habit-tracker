"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth } from "../lib/firebase"; // Ensure this path is correct based on your file structure
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
  UserCredential,
  onAuthStateChanged,
} from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // Измени void на UserCredential
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // Добавляем custom parameters, если нужно, например выбор аккаунта каждый раз
    provider.setCustomParameters({ prompt: "select_account" });

    // Возвращаем результат выполнения
    return signInWithPopup(auth, provider);
  };

  const logout = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
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
