import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { getTasks, deleteTask, updateTask } from '../api/taskApi';
import type { Task, TaskStatus } from '../types';
import { useAuth } from '../../auth/context/AuthContext';
import { Spinner } from '../../../components/Spinner';
import { useMinimumLoading } from '../../../hooks/useMinimumLoading';
import { TaskModal } from '../components/TaskModal';
import { TaskFilters } from '../components/TaskFilters';
import { TaskCard } from '../components/TaskCard';
import { TaskPagination } from '../components/TaskPagination';
import { Plus, ShieldAlert } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Debounce the search box so we don't hit the API on every keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data, isLoading, isError, isFetching } = useQuery({
    // Keyed by user so one account can never be served another account's cached list.
    queryKey: ['tasks', user?.id, { page, perPage, search, status }],
    queryFn: () => getTasks({ page, per_page: perPage, search, status }),
    placeholderData: keepPreviousData,
  });

  const invalidateTasks = () => queryClient.invalidateQueries({ queryKey: ['tasks'] });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      // Deleting the only task on a page would leave us on an empty page – step back one.
      if (data?.data.length === 1 && page > 1) setPage(page - 1);
      invalidateTasks();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => updateTask(id, { status }),
    onSuccess: invalidateTasks,
  });

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setTaskToEdit(null);
    setModalOpen(true);
  };

  const handleSaved = (_task: Task, isNew: boolean) => {
    if (isNew) {
      // New tasks are returned newest-first, so jump to an unfiltered page 1 to show them.
      setSearchInput('');
      setSearch('');
      setStatus('');
      setPage(1);
    }
    invalidateTasks();
  };

  const tasks = data?.data ?? [];
  const showLoader = useMinimumLoading(isLoading);

  return (
    <>
      <section>
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-6">
          <TaskFilters
            search={searchInput}
            status={status}
            onSearchChange={setSearchInput}
            onStatusChange={(value) => { setStatus(value); setPage(1); }}
          />
          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm shrink-0"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>

        {user?.role === 'admin' && (
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            You are an admin, so tasks from all users are listed.
          </p>
        )}

        {showLoader ? (
          <Spinner label="Loading tasks..." />
        ) : isError ? (
          <div className="py-20 text-center text-red-500 flex items-center justify-center gap-2">
            <ShieldAlert size={20} /> Failed to retrieve tasks.
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
            {search || status ? 'No tasks match your filters.' : 'No tasks yet. Create your first one!'}
          </div>
        ) : (
          <div className={`grid gap-3 transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                showOwner={user?.role === 'admin'}
                onEdit={handleEdit}
                onDelete={(t) => { if (confirm('Delete this task?')) deleteMutation.mutate(t.id); }}
                onStatusChange={(t, s) => updateStatusMutation.mutate({ id: t.id, status: s })}
              />
            ))}
          </div>
        )}

        {data?.meta && data.meta.total > 0 && (
          <TaskPagination
            meta={data.meta}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
          />
        )}
      </section>

      {modalOpen && (
        <TaskModal
          task={taskToEdit}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
};
