'use client';

import { useSettings } from '@/hooks/useSettings';
import uk, { TranslationKeys } from '@/lib/i18n/uk';
import en from '@/lib/i18n/en';

const dictionaries = { uk, en } as const;

export function useTranslation() {
  const { settings } = useSettings();
  const lang = settings.language;
  const dict = dictionaries[lang];

  const t = (key: TranslationKeys): string => {
    return dict[key] || uk[key] || key;
  };

  return { t, lang };
}
