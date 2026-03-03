'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { GENERAL_AI_RECOMMENDATIONS } from '@/lib/constants';
import { AIRecommendation } from '@/lib/types';
import { Sparkles, RefreshCw } from 'lucide-react';
import {useQuery} from "@tanstack/react-query";

// TODO: When Gemini API is connected, replace getRecommendations with actual API call
// import { GoogleGenerativeAI } from '@google/generative-ai';
// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

async function getRecommendations(mode: 'general' | 'personalized'): Promise<AIRecommendation[]> {
  // Placeholder: return built-in recommendations
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
  const [loading, setLoading] = useState(false);

  // const loadRecommendations = async () => {
  //   setLoading(true);
  //   const recs = await getRecommendations(settings.aiMode);
  //   const shuffled = [...recs].sort(() => 0.5 - Math.random()).slice(0, 3);
  //   setRecommendations(shuffled);
  //   setLoading(false);
  // };

  const {
    data: recommendations = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['recommendations', settings.aiMode],
    queryFn: async () => {
      const recs = await getRecommendations(settings.aiMode);

      return [...recs]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    },
  });
  // useEffect(() => {
  //   loadRecommendations();
  // }, [settings.aiMode]);

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] p-5 transition-all hover:shadow-[var(--shadow-md)] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--color-primary)]" />
          {t('aiRecommendations')}
        </div>
        <button
          className="p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] rounded-full transition-all active:scale-90"
          onClick={()=>refetch()}
        >
          <RefreshCw
            size={14}
            className={
              isFetching ? 'animate-spin text-[var(--color-primary)]' : ''
            }
          />
        </button>
      </div>

      {/* Mode badge */}
      <div className="mb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-full)] bg-[var(--color-primary-bg)] text-[var(--color-primary)] text-[11px] font-bold uppercase tracking-wider">
          {settings.aiMode === 'general' ? t('aiGeneral') : t('aiPersonalized')}
        </span>
      </div>

      {/* Recommendation list */}
      <div className="flex flex-col gap-2.5 flex-1">
        {recommendations.map(rec => (
          <div
            key={rec?.id}
            className="p-3 bg-[var(--color-bg)] rounded-[var(--radius-md)] flex gap-3 items-start hover:bg-[var(--color-surface-hover)] transition-colors border border-transparent hover:border-[var(--color-border-light)]"
          >
            <span className="text-2xl flex-shrink-0 leading-none">{rec?.icon}</span>
            <p className="m-0 text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
              {rec.text}
            </p>
          </div>
        ))}
      </div>

      {/* Gemini attribution */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border-light)] text-[11px] text-[var(--color-text-muted)] flex items-center gap-1.5">
        <Sparkles size={12} className="opacity-70" />
        {t('poweredByGemini')}
      </div>
    </div>
  );
}