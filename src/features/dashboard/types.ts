import type { Task, TaskStatus } from '../tasks/types';
import type { UserRole } from '../auth/types';

export type StatusCounts = Record<TaskStatus, number>;

export interface UserTaskStats {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tasks_count: number;
  by_status: StatusCounts;
}

/** GET /dashboard/admin */
export interface AdminDashboard {
  users_summary: { total: number; regular_users: number; admins: number };
  tasks_summary: StatusCounts & { total: number };
  users: UserTaskStats[];
  recent_activity: Task[];
}

/** GET /dashboard/user */
export interface UserDashboard {
  total_tasks: number;
  status_breakdown: StatusCounts;
  recent_tasks: Task[];
}
