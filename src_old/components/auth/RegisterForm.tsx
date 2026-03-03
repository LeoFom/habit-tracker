'use client';

import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface RegisterFormProps {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/\d/.test(password)) return "Password must contain at least one number";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      showToast(passwordError, 'error');
      return;
    }

    setLoading(true);
    try {
      // 1. Create user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // 2. Update profile with name
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      showToast('Account created successfully!', 'success');
      onSuccess();
    } catch (error: any) {
      console.error(error);
      let message = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') message = 'Email is already in use';
      if (error.code === 'auth/invalid-email') message = 'Invalid email address';
      if (error.code === 'auth/weak-password') message = 'Password is too weak';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>
      </div>

      <div className="input-group">
        <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: 'block' }}>Email</label>
        <div style={{ position: 'relative' }}>
          <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-primary)',
            }}
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
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-primary)',
            }}
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
