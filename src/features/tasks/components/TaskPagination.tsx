import React from 'react';
import { Select } from '../../../components/Select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TaskListResponse } from '../types';
import { PER_PAGE_OPTIONS } from '../constants';

interface Props {
  meta: TaskListResponse['meta'];
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

const navButton =
  'p-1.5 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition';

export const TaskPagination: React.FC<Props> = ({ meta, perPage, onPageChange, onPerPageChange }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <Select<number>
          value={perPage}
          onChange={onPerPageChange}
          ariaLabel="Rows per page"
          options={PER_PAGE_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
          wrapperClassName="w-16"
          className="border border-slate-300 rounded-md px-2 py-1 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <span>
        {meta.from ?? 0}–{meta.to ?? 0} of {meta.total}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <button
        disabled={meta.current_page <= 1}
        onClick={() => onPageChange(meta.current_page - 1)}
        className={navButton}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="px-2 font-medium text-slate-700 dark:text-slate-200">
        Page {meta.current_page} of {Math.max(meta.last_page, 1)}
      </span>
      <button
        disabled={meta.current_page >= meta.last_page}
        onClick={() => onPageChange(meta.current_page + 1)}
        className={navButton}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
);
