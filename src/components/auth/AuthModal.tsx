'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'register'>(initialView);

  if (!isOpen) return null;

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
            {view === 'login' ? 'Welcome Back' : 'Create Account'}
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
              borderBottom: view === 'login' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: view === 'login' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: view === 'login' ? 600 : 500,
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
              borderBottom: view === 'register' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: view === 'register' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: view === 'register' ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        {view === 'login' ? (
          <LoginForm onSuccess={() => onClose()} />
        ) : (
          <RegisterForm onSuccess={() => onClose()} />
        )}
      </div>
    </div>
  );
}
