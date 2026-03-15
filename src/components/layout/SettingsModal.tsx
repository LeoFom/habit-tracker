'use client';

import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { TabVisibility, AIMode, Language } from '@/lib/types';
import { X, Eye, Calendar, Sparkles, Globe } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();

  const toggleTab = (key: keyof TabVisibility) => {
    updateSettings({
      visibleTabs: { ...settings.visibleTabs, [key]: !settings.visibleTabs[key] },
    });
  };

  const tabOptions: { key: keyof TabVisibility; label: string }[] = [
    { key: 'daily', label: t('daily') },
    { key: 'weekly', label: t('weekly') },
    { key: 'monthly', label: t('monthly') },
    // { key: 'yearly', label: t('yearly') },
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{t('settingsTitle')}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* --- Tab Visibility --- */}
        <div className="settings-section">
          <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Eye size={14} /> {t('tabVisibility')}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tabOptions.map(opt => (
              <div key={opt.key} className="settings-row">
                <span style={{ fontSize: 14, fontWeight: 500 }}>{opt.label}</span>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.visibleTabs[opt.key]}
                    onChange={() => toggleTab(opt.key)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* --- Show Calendar --- */}
        <div className="settings-section">
          <div className="settings-row">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
              <Calendar size={16} /> {t('showCalendar')}
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.showCalendar}
                onChange={() => updateSettings({ showCalendar: !settings.showCalendar })}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        {/* --- AI Mode --- */}
        <div className="settings-section">
          <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Sparkles size={14} /> {t('aiMode')}
          </label>
          <div className="settings-buttons">
            {(['general', 'personalized'] as AIMode[]).map(mode => (
              <button
                key={mode}
                className={`btn ${settings.aiMode === mode ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => updateSettings({ aiMode: mode })}
              >
                {mode === 'general' ? t('aiGeneral') : t('aiPersonalized')}
              </button>
            ))}
          </div>
        </div>

        {/* --- Language --- */}
        <div style={{ marginBottom: 8 }}>
          <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Globe size={14} /> {t('language')}
          </label>
          <div className="settings-buttons">
            {([
              { key: 'uk' as Language, label: t('ukrainian'), flag: '🇺🇦' },
              { key: 'en' as Language, label: t('english'), flag: '🇬🇧' },
            ]).map(lang => (
              <button
                key={lang.key}
                className={`btn ${settings.language === lang.key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => updateSettings({ language: lang.key })}
                style={{ gap: 8 }}
              >
                <span>{lang.flag}</span> {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
