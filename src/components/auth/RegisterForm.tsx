'use client';

import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onSubmit: (data: any) => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSubmit(formData); // Вызываем родительскую функцию
    setLoading(false);
  };

  // const validatePassword = (password: string) => {
  //   if (password.length < 8) return "Password must be at least 8 characters";
  //   if (!/\d/.test(password)) return "Password must contain at least one number";
  //   return null;
  // };

  // const handleRegister = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //
  //   if (!formData.name || !formData.email || !formData.password) {
  //     showToast('Please fill in all fields', 'error');
  //     return;
  //   }
  //
  //   const passwordError = validatePassword(formData.password);
  //   if (passwordError) {
  //     showToast(passwordError, 'error');
  //     return;
  //   }
  //
  //   setLoading(true);
  //   try {
  //     // 1. Create user
  //     const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
  //
  //     // 2. Update profile with name
  //     await updateProfile(userCredential.user, {
  //       displayName: formData.name
  //     });
  //
  //     showToast('Account created successfully!', 'success');
  //     onSuccess();
  //   } catch (error: any) {
  //     console.error(error);
  //     let message = 'Failed to create account';
  //     if (error.code === 'auth/email-already-in-use') message = 'Email is already in use';
  //     if (error.code === 'auth/invalid-email') message = 'Invalid email address';
  //     if (error.code === 'auth/weak-password') message = 'Password is too weak';
  //     showToast(message, 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="input-group">
        <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: 'block' }}>Full Name</label>
        <div style={{ position: 'relative' }}>
          <UserIcon size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full pl-10 pr-3 py-[10px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[16px] outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all"
          />
        </div>
      </div>

      <div className="input-group flex flex-col gap-1.5">
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
            name="email" // <--- ДОБАВЬТЕ ЭТО
            className="w-full pl-10 pr-3 py-[10px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[16px] outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="input-group">
        <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: 'block' }}>Password</label>
        <div style={{ position: 'relative' }}>
          <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 8 chars, 1 number"
            className="w-full pl-10 pr-3 py-[10px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[16px] outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '10px',
          marginTop: 8
        }}
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
      </button>
    </form>
  );
}
