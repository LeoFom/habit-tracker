'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, ReminderFrequency } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { X, Trash2, Bell, Tag } from 'lucide-react';

interface TaskModalProps {
  task: Task | null;
  isNew?: boolean;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const PRIORITIES: TaskPriority[] = ['urgent', 'high', 'medium', 'low'];

export default function TaskModal({ task, isNew, onSave, onUpdate, onDelete, onClose }: TaskModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [tags, setTags] = useState(task?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [reminderDate, setReminderDate] = useState(task?.reminderDate || '');
  // const [reminderFrequency, setReminderFrequency] = useState<ReminderFrequency | string>(task?.reminderFrequency || 'once');
  // const [reminderFrequency, setReminderFrequency] = useState('once');
  const [reminderFrequency, setReminderFrequency] =
    useState<ReminderFrequency | undefined>(
      task?.reminderFrequency
    );
  const handleSave = () => {
    if (!title.trim()) return;
    const data = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      tags,
      dueDate: dueDate || undefined,
      reminderDate: reminderDate || undefined,
      reminderFrequency,
    };

    if (isNew) onSave(data);
    else if (task && onUpdate) onUpdate(task.id, data);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Общие стили инпутов и меток
  const labelStyle = "block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5";
  const inputStyle = "w-full px-3.5 py-2.5 border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)] text-sm text-[var(--color-text-primary)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_rgba(232,93,74,0.1)] transition-all placeholder:text-[var(--color-text-muted)]";

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease]"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] w-full max-w-[520px] max-h-[90vh] overflow-y-auto p-7 animate-[slideUp_0.3s_ease]">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            {isNew ? t('addTask') : t('edit')}
          </h3>
          <button className="p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] rounded-full transition-colors" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className={labelStyle}>{t('taskTitle')}</label>
          <input
            className={inputStyle}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={t('taskTitle')}
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className={labelStyle}>{t('taskDescription')}</label>
          <textarea
            className={`${inputStyle} min-h-[80px] resize-vertical`}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={t('taskDescription')}
          />
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className={labelStyle}>{t('priority')}</label>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                className={`px-4 py-1.5 rounded-[var(--radius-full)] text-[12px] font-medium transition-all ${
                  priority === p
                    ? 'text-white shadow-sm'
                    : 'bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
                }`}
                onClick={() => setPriority(p)}
              >
                {t(p)}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className={labelStyle}>
            <Tag size={12} className="inline mr-1 mb-0.5" />{t('tags')}
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--color-primary-bg)] text-[var(--color-primary)] rounded-[var(--radius-full)] text-[12px] font-medium cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setTags(tags.filter(t => t !== tag))}
              >
                {tag} <X size={10} />
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className={`${inputStyle} flex-1`}
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder={t('addTag')}
            />
            <button
              className="px-4 py-2 bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-xs font-medium hover:bg-[var(--color-surface-hover)] transition-all"
              onClick={addTag}
            >
              {t('addTag')}
            </button>
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-6">
          <label className={labelStyle}>{t('dueDate')}</label>
          <input
            className={inputStyle}
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>

        {/* Reminder Box */}
        <div className="mb-8 p-4 bg-[var(--color-bg)] rounded-[var(--radius-md)] border border-[var(--color-border-light)]">
          <label className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text-primary)] mb-4">
            <Bell size={14} className="text-[var(--color-primary)]" /> {t('reminder')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>{t('reminderDate')}</label>
              <input
                className={inputStyle}
                type="date"
                value={reminderDate}
                onChange={e => setReminderDate(e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>{t('reminderFrequency')}</label>
              <select
                className={`${inputStyle} appearance-none bg-[url('data:image/svg+xml;...')] bg-no-repeat bg-[right_12px_center] pr-9`}
                value={reminderFrequency}
                onChange={(e) =>
                  setReminderFrequency(e.target.value as ReminderFrequency)
                }
              >
                <option value="once">{t('once')}</option>
                <option value="daily">{t('everyDay')}</option>
                <option value="weekly">{t('everyWeek')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            {!isNew && task && onDelete && (
              <button
                className="flex items-center gap-1.5 px-3 py-2 text-[var(--color-danger)] text-sm font-medium hover:bg-red-50 rounded-[var(--radius-md)] transition-colors"
                onClick={() => { onDelete(task.id); onClose(); }}
              >
                <Trash2 size={16} /> {t('delete')}
              </button>
            )}
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              className="px-5 py-2 text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-text-primary)] transition-colors text-sm"
              onClick={onClose}
            >
              {t('cancel')}
            </button>
            <button
              className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-full)] font-medium hover:bg-[var(--color-primary-dark)] shadow-sm hover:shadow-md transition-all active:scale-95 text-sm"
              onClick={handleSave}
            >
              {t('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}