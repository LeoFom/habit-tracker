'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { MOTIVATIONAL_QUOTES } from '@/lib/constants';
import { Calendar, ArrowRight } from 'lucide-react';

export default function TimeQuote() {
  const { t } = useTranslation();
  const [time, setTime] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

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

  return (
    <div className="widget-full" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Left — Date & quick action */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 28px' }}>
        <div style={{
          width: 56, height: 56,
          borderRadius: 'var(--radius-full)',
          border: '2px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)'
        }}>
          {dayNum}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{dayOfWeek},</div>
          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{month}</div>
        </div>
        <button className="btn btn-primary" style={{ marginLeft: 'auto', gap: 8 }}>
          {t('showMyTasks')}
          <ArrowRight size={16} />
        </button>
        <button className="btn btn-icon btn-secondary">
          <Calendar size={18} />
        </button>
      </div>

      {/* Right — Time + Quote */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 28px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
            {t('greeting')} 👋
          </div>
          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
            &ldquo;{quote.text}&rdquo;
            <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>— {quote.author}</span>
          </div>
        </div>
        <div style={{
          fontSize: 28, fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--color-primary)',
          whiteSpace: 'nowrap'
        }}>
          {time.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
