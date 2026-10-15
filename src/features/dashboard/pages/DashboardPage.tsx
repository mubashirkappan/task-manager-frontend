import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert } from 'lucide-react';
import { getDashboardStats } from '../api/dashboardApi';
import { StatusBar, StatusLegend } from '../components/StatusBar';
import { STATUS_OPTIONS } from '../../tasks/constants';
import { Spinner } from '../../../components/Spinner';
import { useMinimumLoading } from '../../../hooks/useMinimumLoading';

const card = 'bg-white border border-slate-200 rounded-xl dark:bg-slate-900 dark:border-slate-800';

const StatTile: React.FC<{ label: string; value: number | string; sub?: string }> = ({ label, value, sub }) => (
  <div className={`${card} p-4`}>
    <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    <div className="mt-1 text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">{value}</div>
    {sub && <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">{sub}</div>}
  </div>
);

export const DashboardPage: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getDashboardStats,
  });
  const showLoader = useMinimumLoading(isLoading);

  if (showLoader) return <Spinner label="Loading dashboard..." />;

  if (isError || !data) {
    return (
      <div className="py-20 text-center text-red-500 flex items-center justify-center gap-2">
        <ShieldAlert size={20} /> Failed to load dashboard.
      </div>
    );
  }

  const { total_users, total_tasks, by_status, users } = data;
  const pct = (n: number) => (total_tasks ? Math.round((n / total_tasks) * 100) : 0);
  const busiest = Math.max(0, ...users.map((u) => u.tasks_count));
  const activeUsers = users.filter((u) => u.tasks_count > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Admin dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Users and task activity across the workspace.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Total users" value={total_users} sub={`${activeUsers} with tasks`} />
        <StatTile label="Total tasks" value={total_tasks} sub={`${total_users ? (total_tasks / total_users).toFixed(1) : 0} per user`} />
        <StatTile label="Completed" value={by_status.completed} sub={`${pct(by_status.completed)}% of all tasks`} />
        <StatTile label="Open" value={by_status.pending + by_status.in_progress} sub={`${by_status.in_progress} in progress`} />
      </div>

      <div className={`${card} p-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tasks by status</h3>
          <StatusLegend />
        </div>
        <StatusBar counts={by_status} scale={total_tasks} label="All tasks" height={14} />
        <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
          {STATUS_OPTIONS.map((o) => (
            <div key={o.value}>
              <div className="text-slate-500 dark:text-slate-400 text-xs">{o.label}</div>
              <div className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {by_status[o.value]} <span className="font-normal text-slate-400">· {pct(by_status[o.value])}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={card}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tasks per user</h3>
          <StatusLegend />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500 dark:text-slate-400">
                <th className="px-4 py-2 font-semibold">User</th>
                <th className="px-4 py-2 font-semibold text-right">Tasks</th>
                <th className="px-4 py-2 font-semibold w-1/3 min-w-40">Breakdown</th>
                {STATUS_OPTIONS.map((o) => (
                  <th key={o.value} className="px-4 py-2 font-semibold text-right whitespace-nowrap">{o.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-slate-100">{u.name}</span>
                      {u.role === 'admin' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                          admin
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{u.email}</div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-slate-900 dark:text-slate-100">{u.tasks_count}</td>
                  <td className="px-4 py-2.5">
                    {u.tasks_count > 0 ? (
                      <StatusBar counts={u.by_status} scale={busiest} label={u.name} />
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">No tasks</span>
                    )}
                  </td>
                  {STATUS_OPTIONS.map((o) => (
                    <td key={o.value} className="px-4 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-300">
                      {u.by_status[o.value]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
