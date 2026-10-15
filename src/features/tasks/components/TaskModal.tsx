import React from 'react';
import { Select } from '../../../components/Select';
import { createTask, updateTask } from '../api/taskApi';
import type { Task, TaskStatus } from '../types';
import { X } from 'lucide-react';
import { STATUS_OPTIONS, inputClass } from '../constants';
import { FormField } from '../../../components/FormField';
import { useForm } from '../../../hooks/useForm';
import { fieldClass } from '../../../utils/validation';

interface Props {
  task: Task | null;
  onClose: () => void;
  onSaved: (task: Task, isNew: boolean) => void;
}

const TITLE_MAX = 255;
const DESCRIPTION_MAX = 2000;

export const TaskModal: React.FC<Props> = ({ task, onClose, onSaved }) => {
  const { values, errors, field, setValue, handleSubmit, formError, submitting } = useForm(
    { title: task?.title ?? '', description: task?.description ?? '', status: task?.status ?? 'pending' },
    (v) => {
      const title = v.title.trim();
      return {
        title: !title
          ? 'Title is required.'
          : title.length < 3
            ? 'Title must be at least 3 characters.'
            : title.length > TITLE_MAX
              ? `Title must be at most ${TITLE_MAX} characters.`
              : undefined,
        description:
          v.description.length > DESCRIPTION_MAX ? `Description must be at most ${DESCRIPTION_MAX} characters.` : undefined,
      };
    },
  );

  const onSubmit = handleSubmit(
    async (v) => {
      const payload = { title: v.title.trim(), description: v.description.trim(), status: v.status };
      const saved = task ? await updateTask(task.id, payload) : await createTask(payload);
      onSaved(saved, !task);
      onClose();
    },
    () => 'Could not save the task. Please try again.',
  );

  return (
    <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>

        {formError && (
          <div role="alert" className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <FormField label="Title" htmlFor="title" error={errors.title}>
            <input
              type="text"
              autoFocus
              maxLength={TITLE_MAX}
              {...field('title')}
              className={fieldClass(inputClass, errors.title)}
              placeholder="e.g. Design API resource schema"
            />
          </FormField>

          <FormField
            label="Description"
            htmlFor="description"
            error={errors.description}
            hint={`${values.description.length}/${DESCRIPTION_MAX} characters`}
          >
            <textarea
              rows={3}
              {...field('description')}
              className={fieldClass(inputClass, errors.description)}
              placeholder="Optional details..."
            />
          </FormField>

          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Status</span>
            <Select<TaskStatus>
              value={values.status as TaskStatus}
              onChange={(s) => setValue('status', s)}
              ariaLabel="Status"
              options={STATUS_OPTIONS}
              className={inputClass}
              wrapperClassName="w-full"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};