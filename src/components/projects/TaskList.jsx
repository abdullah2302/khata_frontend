import { useState } from 'react';
import { addTask, updateTask, deleteTask } from '../../api/projectApi';
import { useToast } from '../../context/ToastContext';
import { errorMessage } from '../../utils/format';
import { IconButton } from '../ui/Button';

// Checklist for a project. Every API call returns the new task list, passed to onChange.
export default function TaskList({ projectId, tasks, onChange }) {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const run = async (fn) => {
    try { onChange(await fn()); } catch (e) { toast.error(errorMessage(e)); }
  };
  const add = async (e) => {
    e.preventDefault();
    const text = title.trim();
    if (!text) return;
    setTitle('');
    await run(() => addTask(projectId, text));
  };

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl font-semibold tracking-tight">Tasks</h2>
        {tasks.length > 0 && <span className="text-sm text-muted">{done} of {tasks.length} done ({pct}%)</span>}
      </div>

      {tasks.length > 0 && (
        <div className="mb-3 h-2 overflow-hidden rounded-full bg-desk" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Task progress">
          <div className="h-full rounded-full bg-emerald-600 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      )}

      <div className="border-t-2 border-ink">
        {tasks.length === 0 && <p className="py-5 text-muted">No tasks yet. Break the project into small steps.</p>}
        {tasks.map((t) => (
          <div key={t._id} className="flex animate-pop items-center gap-3 border-b border-rule py-2.5">
            <button
              role="checkbox"
              aria-checked={t.done}
              aria-label={`Mark "${t.title}" ${t.done ? 'not done' : 'done'}`}
              onClick={() => run(() => updateTask(projectId, t._id, { done: !t.done }))}
              className={`grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-2 transition-colors ${
                t.done ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-rule bg-white hover:border-ink'
              }`}
            >
              {t.done && <i className="fa-solid fa-check text-xs" />}
            </button>
            <span className={`min-w-0 flex-1 break-words transition-colors ${t.done ? 'text-muted line-through' : ''}`}>{t.title}</span>
            <IconButton icon="fa-trash" title="Delete task" danger onClick={() => run(() => deleteTask(projectId, t._id))} />
          </div>
        ))}
      </div>

      <form onSubmit={add} className="mt-3 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="Add a task and press Enter"
          aria-label="New task"
          className="min-w-0 flex-1 rounded-md border border-rule bg-white px-3 py-2.5 focus:border-ink focus:outline-none focus:ring-2 focus:ring-gold/60"
        />
        <button className="cursor-pointer rounded-md bg-ink px-4 font-semibold text-white transition-all hover:bg-ink-2 active:scale-[0.98]" aria-label="Add task">
          <i className="fa-solid fa-plus" />
        </button>
      </form>
    </section>
  );
}
