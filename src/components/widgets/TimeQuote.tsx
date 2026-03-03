'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { MOTIVATIONAL_QUOTES } from '@/lib/constants';
import { Calendar, ArrowRight } from 'lucide-react';

export default function TimeQuote() {
  const { t } = useTranslation();
  const [time, setTime] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

  const [tasks, setTasks] = useState([]); // Стан для даних з бази
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  }, []);

  const quote = MOTIVATIONAL_QUOTES[quoteIndex];

  const dayOfWeek = time.toLocaleDateString('uk-UA', { weekday: 'long' });
  const dayNum = time.getDate();
  const month = time.toLocaleDateString('uk-UA', { month: 'long' });

  const handleFetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/supabase/test'); // Шлях до вашого GET файлу
      if (!response.ok) throw new Error('Помилка завантаження');

      const data = await response.json();
      setTasks(data);
      console.log('Дані отримано:', data);
    } catch (err: any | {message: string}) {
      console.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    const newUser = {
      age: 25,
      name: "Олександр",
      email: "alex@example.com"
    };

    try {
      const response = await fetch('/api/supabase/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Дані успішно додано!");
        console.log("Response:", result);
      } else {
        console.error("Помилка:", result.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const btnBase = "inline-flex items-center justify-center gap-[6px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50";
  const btnPrimary = `${btnBase} bg-[var(--color-primary)] text-white px-4 py-2 rounded-[var(--radius-full)] text-[12px] md:text-sm hover:bg-[var(--color-primary-dark)] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(232,93,74,0.3)]`;
  const btnSecondary = `${btnBase} bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)] px-4 py-2 rounded-[var(--radius-full)] hover:bg-[var(--color-surface-hover)]`;
  const btnIcon = `${btnBase} p-2 rounded-[var(--radius-md)] bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]`;

  return (
    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      {/* Left — Date & quick action */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] p-5 transition-all hover:shadow-[var(--shadow-md)] flex items-center gap-4">
        <div className="w-10 h-10 md:w-14 md:h-14 bg-[var(--color-primary-bg)] text-[var(--color-primary)] rounded-[8px] md:rounded-[var(--radius-lg)] flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {dayNum}
        </div>
        <div className="flex-1">
          <div className="text-[12px] md:text-sm text-[var(--color-text-secondary)] capitalize leading-tight">{dayOfWeek},</div>
          <div className="text-[14px] md:text-xl font-bold text-[var(--color-text-primary)] capitalize leading-tight">{month}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={btnPrimary}
            onClick={() => { /* handleCreateTask */ }}
            disabled={loading}
          >
            {loading ? '...' : t('showMyTasks')}
            <ArrowRight size={16} />
          </button>
          <button className={btnIcon}>
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {/* Right — Time + Quote */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] p-5 transition-all hover:shadow-[var(--shadow-md)] flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[var(--color-primary)] mb-1 uppercase tracking-wider">
            {t('greeting')} 👋
          </div>
          <div className="text-[var(--color-text-primary)] text-sm md:text-base italic leading-relaxed truncate-2-lines">
            &ldquo;{quote.text}&rdquo;
            <span className="text-[var(--color-text-muted)] not-italic ml-2">— {quote.author}</span>
          </div>
        </div>
        <div className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] tabular-nums flex-shrink-0">
          {time.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
