'use client';

import { useState } from 'react';
import { Task, TaskPriority, ReminderFrequency } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { PRIORITY_CONFIG } from '@/lib/constants';
import { X, Trash2, Bell, Tag } from 'lucide-react';

interface TaskModalProps {
  task: Task | null;
  isNew?: boolean;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export default function TaskModal({ task, isNew, onSave, onUpdate, onDelete, onClose }: TaskModalProps) {
  const { t } = useTranslation();

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [reminderDate, setReminderDate] = useState(task?.reminderDate || '');
  const [reminderFrequency, setReminderFrequency] = useState<ReminderFrequency>(task?.reminderFrequency || 'once');

  const handleSave = () => {
    if (!title.trim()) return;
    if (isNew) {
      onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        tags,
        dueDate: dueDate || undefined,
        reminderDate: reminderDate || undefined,
        reminderFrequency,
      });
    } else if (task && onUpdate) {
      onUpdate(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        tags,
        dueDate: dueDate || undefined,
        reminderDate: reminderDate || undefined,
        reminderFrequency,
      });
    }
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <span className="modal-title">{isNew ? t('addTask') : t('edit')}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 16 }}>
          <label className="label">{t('taskTitle')}</label>
          <input
            className="input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={t('taskTitle')}
            autoFocus
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label className="label">{t('taskDescription')}</label>
          <textarea
            className="input"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={t('taskDescription')}
          />
        </div>

        {/* Priority */}
        <div style={{ marginBottom: 16 }}>
          <label className="label">{t('priority')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map(p => (
              <button
                key={p}
                className={`btn btn-sm ${priority === p ? '' : 'btn-secondary'}`}
                style={priority === p ? {
                  background: PRIORITY_CONFIG[p].color,
                  color: 'white',
                } : {}}
                onClick={() => setPriority(p)}
              >
                {t(p as 'urgent' | 'high' | 'medium' | 'low')}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 16 }}>
          <label className="label"><Tag size={12} style={{ display: 'inline', marginRight: 4 }} />{t('tags')}</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {tags.map(tag => (
              <span key={tag} className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)}>
                {tag} <X size={10} />
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder={t('addTag')}
              style={{ flex: 1 }}
            />
            <button className="btn btn-secondary btn-sm" onClick={addTag}>{t('addTag')}</button>
          </div>
        </div>

        {/* Due Date */}
        <div style={{ marginBottom: 16 }}>
          <label className="label">{t('dueDate')}</label>
          <input
            className="input"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>

        {/* Reminder — date + frequency configured in modal */}
        <div style={{
          marginBottom: 20, padding: 16,
          background: 'var(--color-bg)', borderRadius: 'var(--radius-md)'
        }}>
          <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Bell size={14} /> {t('reminder')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">{t('reminderDate')}</label>
              <input
                className="input"
                type="date"
                value={reminderDate}
                onChange={e => setReminderDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t('reminderFrequency')}</label>
              <select
                className="input select"
                value={reminderFrequency}
                onChange={e => setReminderFrequency(e.target.value as ReminderFrequency)}
              >
                <option value="once">{t('once')}</option>
                <option value="daily">{t('everyDay')}</option>
                <option value="weekly">{t('everyWeek')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
          <div>
            {!isNew && task && onDelete && (
              <button
                className="btn btn-ghost"
                style={{ color: 'var(--color-danger)' }}
                onClick={() => { onDelete(task.id); onClose(); }}
              >
                <Trash2 size={16} /> {t('delete')}
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onClose}>{t('cancel')}</button>
            <button className="btn btn-primary" onClick={handleSave}>{t('save')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
