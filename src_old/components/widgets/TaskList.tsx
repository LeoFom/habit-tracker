'use client';

import React, { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { PRIORITY_CONFIG } from '@/lib/constants';
import TaskModal from './TaskModal';
import { Plus, Check, Calendar } from 'lucide-react';
import { Task } from '@/lib/types';

export default function TaskList() {
  const { t } = useTranslation();
  const { tasks, addTask, updateTask, removeTask, toggleTask, getSortedTasks } = useTasks();
  const [modalTask, setModalTask] = useState<Task | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const sortedTasks = getSortedTasks();
  const completedCount = tasks.filter(t => t.completed).length;

  // Базовые стили из твоей системы
  const btnPrimarySm = "inline-flex items-center justify-center gap-1 bg-[var(--color-primary)] text-white px-3 py-1 rounded-[var(--radius-full)] text-xs font-medium hover:bg-[var(--color-primary-dark)] transition-all active:scale-95";

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] p-5 transition-all hover:shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <span>✅</span>
          {t('tasks')}
          {tasks.length > 0 && (
            <span className="ml-2 px-[10px] py-[2px] bg-[#F0FDF4] text-[#22C55E] rounded-[var(--radius-full)] text-[12px] font-medium">
              {completedCount}/{tasks.length}
            </span>
          )}
        </div>
        <button className={btnPrimarySm} onClick={() => setShowNewModal(true)}>
          <Plus size={14} /> {t('addTask')}
        </button>
      </div>

      {/* Task list */}
      {sortedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-[var(--color-text-muted)] text-center gap-3">
          <div className="text-4xl opacity-50">📋</div>
          <div className="text-sm max-w-[240px]">{t('taskPlaceholder')}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {sortedTasks.map(task => {
            const pConfig = PRIORITY_CONFIG[task.priority];
            return (
              <div
                key={task.id}
                className="group flex items-center justify-between p-2 md:p-3 rounded-[var(--radius-md)] hover:bg-[var(--color-bg)] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                      task.completed ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-border)]'
                    }`}
                    onClick={e => { e.stopPropagation(); toggleTask(task.id); }}
                  >
                    {task.completed && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>

                  {/* Priority dot */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: pConfig.color }}
                  />

                  {/* Title & tags */}
                  <div className="flex-1 min-w-0" onClick={() => setModalTask(task)}>
                    <div className={`text-sm font-medium truncate transition-all ${
                      task.completed ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)]'
                    }`}>
                      {task.title}
                    </div>
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {task.tags.map(tag => (
                          <span key={tag} className="px-[6px] py-[1px] bg-[#EFF6FF] text-[#3B82F6] rounded-[var(--radius-full)] text-[10px] font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Due date */}
                {task.dueDate && (
                  <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)] whitespace-nowrap ml-4">
                    <Calendar size={12} />
                    {new Date(task.dueDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showNewModal && (
        <TaskModal
          task={null}
          isNew
          onSave={addTask}
          onClose={() => setShowNewModal(false)}
        />
      )}

      {modalTask && (
        <TaskModal
          task={modalTask}
          onSave={addTask}
          onUpdate={updateTask}
          onDelete={removeTask}
          onClose={() => setModalTask(null)}
        />
      )}
    </div>
  );
}