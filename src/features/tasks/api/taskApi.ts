import apiClient from '../../../api/client';
import type { Task, TaskListResponse, TaskFilterParams } from '../types';

export const getTasks = async (params: TaskFilterParams): Promise<TaskListResponse> => {
  const { data } = await apiClient.get<TaskListResponse>('/tasks', { params });
  return data;
};

export const createTask = async (payload: { title: string; description?: string; status?: string }): Promise<Task> => {
  const { data } = await apiClient.post<{ data: Task }>('/tasks', payload);
  return data.data;
};

export const updateTask = async (id: string, payload: Partial<{ title: string; description: string; status: string }>): Promise<Task> => {
  const { data } = await apiClient.put<{ data: Task }>(`/tasks/${id}`, payload);
  return data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};