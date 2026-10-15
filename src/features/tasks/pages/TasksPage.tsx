import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, deleteTask, updateTask } from '../api/taskApi';
import { Task, TaskStatus } from '../types';
import { useAuth } from '../../auth/context/AuthContext';
import { TaskModal } from '../components/TaskModal';
import { Plus, Search, Trash2, Edit2, LogOut, ShieldAlert } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', { page, perPage, search, status }],
    queryFn: () => getTasks({ page, perPage, search, status }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => updateTask(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setTaskToEdit(null);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Task Workspace</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm text-slate-500">{user?.name} ({user?.email})</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${
              user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {user?.role}
            </span>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-red-600 transition"
        >
          <LogOut size={16} /> Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Actions & Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search title..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>

        {/* Task Cards / Table */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500">Loading tasks...</div>
        ) : isError ? (
          <div className="py-20 text-center text-red-500 flex items-center justify-center gap-2">
            <ShieldAlert size={20} /> Failed to retrieve tasks.
          </div>
        ) : data?.data.length === 0 ? (
          <div className="bg-white border rounded-lg p-12 text-center text-slate-500">
            No tasks found matching your criteria.
          </div>
        ) : (
          <div className="grid gap-3">
            {data?.data.map((task) => (
              <div key={task.id} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-slate-900">{task.title}</h3>
                    <select
                      value={task.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: task.id, status: e.target.value as TaskStatus })}
                      className={`text-xs font-semibold px-2 py-1 rounded border border-transparent focus:outline-none focus:ring-1 ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : task.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  {task.description && (
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{task.description}</p>
                  )}
                  <div className="text-xs text-slate-400 mt-2">
                    Owner: <span className="text-slate-600 font-medium">{task.user.name}</span> • Created: {new Date(task.created_date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition"
                    title="Edit Task"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this task?')) deleteMutation.mutate(task.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition"
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Server-Side Pagination Controls */}
        {data?.meta && data.meta.last_page > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Rows per page:</span>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                className="border rounded px-2 py-1 bg-white text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>Showing {data.meta.from ?? 0} to {data.meta.to ?? 0} of {data.meta.total}</span>
            </div>

            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-sm border rounded bg-white disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm font-medium">{page} / {data.meta.last_page}</span>
              <button
                disabled={page >= data.meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-sm border rounded bg-white disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <TaskModal
          task={taskToEdit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};