import React from 'react';
import { ShieldAlert } from 'lucide-react';
import type { Task } from '../../tasks/types';
import { STATUS_OPTIONS, STATUS_STYLES } from '../../tasks/constants';
import type { StatusCounts } from '../types';
import { StatusBar, StatusLegend } from './StatusBar';

const card = 'bg-white border border-slate-200 rounded-xl dark:bg-slate-900 dark:border-slate-800';

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`${card} ${className}`}>{children}</div>
);

export const StatTile: React.FC<{ label: string; value: number | string; sub?: string }> = ({ label, value, sub }) => (
  <div className={`${card} p-4`}>
    <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    <div className="mt-1 text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">{value}</div>
    {sub && <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">{sub}</div>}
  </div>
);

export const DashboardHeading: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div>
    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
  </div>
);

export const DashboardError: React.FC = () => (
  <div className="py-20 text-center text-red-500 flex items-center justify-center gap-2">
    <ShieldAlert size={20} /> Failed to load dashboard.
  </div>
);

export const StatusOverview: React.FC<{ counts: StatusCounts; total: number }> = ({ counts, total }) => {
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <div className={`${card} p-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tasks by status</h3>
        <StatusLegend />
      </div>
      {total > 0 ? (
        <StatusBar counts={counts} scale={total} label="All tasks" height={14} />
      ) : (
        <p className="py-2 text-sm text-slate-400 dark:text-slate-500">No tasks yet.</p>
      )}
      <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
        {STATUS_OPTIONS.map((o) => (
          <div key={o.value}>
            <div className="text-slate-500 dark:text-slate-400 text-xs">{o.label}</div>
            <div className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {counts[o.value]} <span className="font-normal text-slate-400">· {pct(counts[o.value])}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RecentTasks: React.FC<{ title: string; tasks: Task[]; showOwner: boolean }> = ({ title, tasks, showOwner }) => (
  <div className={card}>
    <h3 className="p-4 border-b border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
    {tasks.length === 0 ? (
      <p className="p-4 text-sm text-slate-400 dark:text-slate-500">No tasks yet.</p>
    ) : (
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{t.title}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {showOwner && <>{t.user.name} • </>}
                {new Date(t.created_at).toLocaleString()}
              </div>
            </div>
            <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md ${STATUS_STYLES[t.status]}`}>
              {STATUS_OPTIONS.find((o) => o.value === t.status)?.label}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);
