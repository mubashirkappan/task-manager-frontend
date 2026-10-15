import type { TaskStatus } from './types';

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export const STATUS_STYLES: Record<TaskStatus, string> = {
  pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300',
};

export const PER_PAGE_OPTIONS = [5, 10, 20, 50];

export const inputClass =
  'w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500';
