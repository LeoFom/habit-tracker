'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { GENERAL_AI_RECOMMENDATIONS } from '@/lib/constants';
import { AIRecommendation } from '@/lib/types';
import { Sparkles, RefreshCw } from 'lucide-react';

// TODO: When Gemini API is connected, replace getRecommendations with actual API call
// import { GoogleGenerativeAI } from '@google/generative-ai';
// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

async function getRecommendations(mode: 'general' | 'personalized'): Promise<AIRecommendation[]> {
  // Placeholder: return built-in recommendations
  // When Gemini is connected, this function will:
  // 1. Collect user's habit/task data
  // 2. Send to Gemini API with prompt for personalized advice
  // 3. Parse and return recommendations
  if (mode === 'personalized') {
    // TODO: Use Gemini API for personalized recommendations
    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    // const prompt = `Based on user data: ${JSON.stringify(userData)}, provide productivity tips...`;
    // const result = await model.generateContent(prompt);
    return GENERAL_AI_RECOMMENDATIONS.slice(0, 3);
  }
  return GENERAL_AI_RECOMMENDATIONS;
}

export default function AIRecommendations() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecommendations = async () => {
    setLoading(true);
    const recs = await getRecommendations(settings.aiMode);
    // Show random 3
    const shuffled = [...recs].sort(() => 0.5 - Math.random()).slice(0, 3);
    setRecommendations(shuffled);
    setLoading(false);
  };

  useEffect(() => {
    loadRecommendations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.aiMode]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Sparkles size={18} color="var(--color-primary)" />
          {t('aiRecommendations')}
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={loadRecommendations}
          style={{ transition: 'transform 0.3s' }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {/* Mode badge */}
      <div style={{ marginBottom: 12 }}>
        <span className="badge badge-primary" style={{ fontSize: 11 }}>
          {settings.aiMode === 'general' ? t('aiGeneral') : t('aiPersonalized')}
        </span>
      </div>

      {/* Recommendation cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recommendations.map(rec => (
          <div
            key={rec.id}
            style={{
              padding: '12px 16px',
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              transition: 'background 0.2s',
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{rec.icon}</span>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {rec.text}
            </p>
          </div>
        ))}
      </div>

      {/* Gemini attribution */}
      <div style={{
        marginTop: 16, paddingTop: 12,
        borderTop: '1px solid var(--color-border-light)',
        fontSize: 11, color: 'var(--color-text-muted)',
        display: 'flex', alignItems: 'center', gap: 6
      }}>
        <Sparkles size={12} />
        {t('poweredByGemini')}
      </div>
    </div>
  );
}
