'use client';

import React, { useState} from 'react';
import { X } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import {useToast} from "@/context/ToastContext";
import {EditProfileForm} from "@/components/auth/EditProfileForm";
import {AuthView} from "@/lib/types";


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
  viewValue: AuthView;
}

export default function AuthModal({ isOpen, onClose, viewValue = '', initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const { showToast } = useToast(); // Предположим, он есть в контексте

  if (!isOpen) return null;

  const mergedViewValue = viewValue ?? view

  const handleAuth = async (formData: { email: string; password: string; name?: string }, mode: 'login' | 'register') => {
    const supabase = await getSupabaseBrowserClient();

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { full_name: formData.name } // Передаем имя в metadata
          }
        });
        // console.log("register - data",data)
        if (error) throw error;
        showToast('Check your inbox to confirm!', 'success');
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        // console.log("login - data", data)

        if (error) throw error;
        showToast('Signed in successfully', 'success');
      }
      onClose(); // Закрываем модалку при успехе
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {
        mergedViewValue === 'profile' ?
          <EditProfileForm/>
          :
        <div
          style={{
            background: 'var(--color-surface)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '400px',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              {mergedViewValue === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-muted)',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: 24, borderBottom: '1px solid var(--color-border-light)' }}>
            <button
              onClick={() => setView('login')}
              style={{
                flex: 1,
                padding: '12px',
                background: 'none',
                border: 'none',
                borderBottom: mergedViewValue === 'login' ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: mergedViewValue === 'login' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: mergedViewValue === 'login' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Log In
            </button>
            <button
              onClick={() => setView('register')}
              style={{
                flex: 1,
                padding: '12px',
                background: 'none',
                border: 'none',
                borderBottom: mergedViewValue === 'register' ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: mergedViewValue === 'register' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: mergedViewValue === 'register' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Content */}
          <div className="modal-content">
            {mergedViewValue === 'login' ? (
              <LoginForm
                onSuccess={onClose}
                onSubmit={(data) => handleAuth(data, 'login')}
              />
            ) : (
              <RegisterForm
                onSubmit={(data) => handleAuth(data, 'register')}
              />
            )}
          </div>
        </div>
      }

    </div>
  );
}
