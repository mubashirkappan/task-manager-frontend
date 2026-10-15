import React from 'react';
import { Select } from '../../../components/Select';
import { Edit2, Trash2 } from 'lucide-react';
import type { Task, TaskStatus } from '../types';
import { STATUS_OPTIONS, STATUS_STYLES } from '../constants';

interface Props {
  task: Task;
  showOwner: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

export const TaskCard: React.FC<Props> = ({ task, showOwner, onEdit, onDelete, onStatusChange }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-slate-300 transition dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700">
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 break-words">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="text-xs text-slate-400 dark:text-slate-500 mt-2">
        {showOwner && (
          <>
            Owner: <span className="text-slate-600 dark:text-slate-300 font-medium">{task.user.name}</span> •{' '}
          </>
        )}
        Created {new Date(task.created_at).toLocaleDateString()}
      </div>
    </div>

    <div className="flex items-center gap-2 justify-between sm:justify-end">
      <Select<TaskStatus>
        value={task.status}
        onChange={(status) => onStatusChange(task, status)}
        ariaLabel="Task status"
        options={STATUS_OPTIONS}
        wrapperClassName="w-32"
        className={`text-xs font-semibold px-2.5 py-1.5 rounded-md ${STATUS_STYLES[task.status]}`}
      />

      <div className="flex items-center">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition"
          title="Edit task"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-2 rounded-md text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-red-400 transition"
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);
