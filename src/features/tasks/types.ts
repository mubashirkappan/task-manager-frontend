export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string; // UUID
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TaskListResponse {
  data: Task[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface TaskFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}