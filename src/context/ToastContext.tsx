'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          zIndex: 100,
          pointerEvents: 'none', // Allow clicks to pass through container
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              minWidth: 300,
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              borderLeft: `4px solid ${
                toast.type === 'success' ? '#22c55e' : 
                toast.type === 'error' ? '#ef4444' : 
                '#3b82f6'
              }`,
              animation: 'slideIn 0.3s ease-out forwards',
            }}
          >
            {toast.type === 'success' && <CheckCircle size={20} color="#22c55e" />}
            {toast.type === 'error' && <AlertCircle size={20} color="#ef4444" />}
            {toast.type === 'info' && <Info size={20} color="#3b82f6" />}
            
            <div style={{ flex: 1, fontSize: '0.95rem', lineHeight: 1.5 }}>
              {toast.message}
            </div>
            
            <button 
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-text-muted)' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
