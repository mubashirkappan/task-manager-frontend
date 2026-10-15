import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminDashboard } from '../api/dashboardApi';
import { StatusBar, StatusLegend } from './StatusBar';
import { Card, DashboardError, DashboardHeading, RecentTasks, StatTile, StatusOverview } from './DashboardParts';
import { STATUS_OPTIONS } from '../../tasks/constants';
import { Spinner } from '../../../components/Spinner';
import { useMinimumLoading } from '../../../hooks/useMinimumLoading';

export const AdminDashboardView: React.FC = () => {
  const { data, isLoading, isError } = useQuery({ queryKey: ['dashboard', 'admin'], queryFn: getAdminDashboard });
  const showLoader = useMinimumLoading(isLoading);

  if (showLoader) return <Spinner label="Loading dashboard..." />;
  if (isError || !data) return <DashboardError />;

  const { users_summary, tasks_summary, users, recent_activity } = data;
  const { total, ...byStatus } = tasks_summary;
  const busiest = Math.max(0, ...users.map((u) => u.tasks_count));

  return (
    <div className="space-y-6">
      <DashboardHeading title="Admin dashboard" subtitle="Users and task activity across the workspace." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="Total users"
          value={users_summary.total}
          sub={`${users_summary.regular_users} users · ${users_summary.admins} admins`}
        />
        <StatTile label="Total tasks" value={total} sub={`${users_summary.total ? (total / users_summary.total).toFixed(1) : 0} per user`} />
        <StatTile label="Completed" value={byStatus.completed} sub={`${total ? Math.round((byStatus.completed / total) * 100) : 0}% of all tasks`} />
        <StatTile label="Open" value={byStatus.pending + byStatus.in_progress} sub={`${byStatus.in_progress} in progress`} />
      </div>

      <StatusOverview counts={byStatus} total={total} />

      <Card>
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
      </Card>

      <RecentTasks title="Recent activity" tasks={recent_activity} showOwner />
    </div>
  );
};
