'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { PRIORITY_CONFIG } from '@/lib/constants';
import { Task } from '@/lib/types';
import { Plus, Check, Calendar } from 'lucide-react';
import TaskModal from './TaskModal';

export default function TaskList() {
  const { t } = useTranslation();
  const { tasks, addTask, updateTask, removeTask, toggleTask, getSortedTasks } = useTasks();
  const [modalTask, setModalTask] = useState<Task | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const sortedTasks = getSortedTasks();
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span>✅</span>
          {t('tasks')}
          {tasks.length > 0 && (
            <span className="badge badge-success" style={{ marginLeft: 8 }}>
              {completedCount}/{tasks.length}
            </span>
          )}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowNewModal(true)}>
          <Plus size={14} /> {t('addTask')}
        </button>
      </div>

      {/* Task list */}
      {sortedTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-text">{t('taskPlaceholder')}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sortedTasks.map(task => {
            const pConfig = PRIORITY_CONFIG[task.priority];
            return (
              <div
                key={task.id}
                className="checkbox-wrapper"
                style={{ justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  {/* Checkbox */}
                  <div
                    className={`checkbox ${task.completed ? 'checked' : ''}`}
                    onClick={e => { e.stopPropagation(); toggleTask(task.id); }}
                  >
                    {task.completed && <Check size={14} color="white" strokeWidth={3} />}
                  </div>

                  {/* Priority dot */}
                  <div className="priority-dot" style={{ background: pConfig.color }} />

                  {/* Title & tags */}
                  <div
                    onClick={() => setModalTask(task)}
                    style={{ flex: 1 }}
                  >
                    <div style={{
                      fontWeight: 500, fontSize: 14,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                    }}>
                      {task.title}
                    </div>
                    {task.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                        {task.tags.map(tag => (
                          <span key={tag} className="badge badge-info" style={{ fontSize: 10, padding: '1px 6px' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Due date */}
                {task.dueDate && (
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap'
                  }}>
                    <Calendar size={12} />
                    {new Date(task.dueDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Task Modal */}
      {showNewModal && (
        <TaskModal
          task={null}
          isNew
          onSave={addTask}
          onClose={() => setShowNewModal(false)}
        />
      )}

      {/* Edit Task Modal */}
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
