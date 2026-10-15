import type { TaskStatus } from '../tasks/types';
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

export interface DashboardStats {
  total_users: number;
  total_tasks: number;
  by_status: StatusCounts;
  users: UserTaskStats[];
}
