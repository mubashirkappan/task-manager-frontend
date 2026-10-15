import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserDashboard } from '../api/dashboardApi';
import { DashboardError, DashboardHeading, RecentTasks, StatTile, StatusOverview } from './DashboardParts';
import { Spinner } from '../../../components/Spinner';
import { useMinimumLoading } from '../../../hooks/useMinimumLoading';

export const UserDashboardView: React.FC = () => {
  const { data, isLoading, isError } = useQuery({ queryKey: ['dashboard', 'user'], queryFn: getUserDashboard });
  const showLoader = useMinimumLoading(isLoading);

  if (showLoader) return <Spinner label="Loading dashboard..." />;
  if (isError || !data) return <DashboardError />;

  const { total_tasks, status_breakdown, recent_tasks } = data;
  const pct = (n: number) => (total_tasks ? Math.round((n / total_tasks) * 100) : 0);

  return (
    <div className="space-y-6">
      <DashboardHeading title="My dashboard" subtitle="An overview of your own tasks." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Total tasks" value={total_tasks} />
        <StatTile label="Pending" value={status_breakdown.pending} sub={`${pct(status_breakdown.pending)}% of your tasks`} />
        <StatTile label="In progress" value={status_breakdown.in_progress} sub={`${pct(status_breakdown.in_progress)}% of your tasks`} />
        <StatTile label="Completed" value={status_breakdown.completed} sub={`${pct(status_breakdown.completed)}% of your tasks`} />
      </div>

      <StatusOverview counts={status_breakdown} total={total_tasks} />

      <RecentTasks title="Recent tasks" tasks={recent_tasks} showOwner={false} />
    </div>
  );
};
