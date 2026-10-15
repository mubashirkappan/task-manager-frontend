import React from 'react';
import { Select } from '../../../components/Select';
import { Search, X } from 'lucide-react';
import { STATUS_OPTIONS, inputClass } from '../constants';

interface Props {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const TaskFilters: React.FC<Props> = ({ search, status, onSearchChange, onStatusChange }) => {
  const hasFilters = search !== '' || status !== '';

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-1">
      <div className="relative flex-1 sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        <input
          type="search"
          placeholder="Search title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${inputClass} pl-9`}
        />
      </div>

      <Select
        value={status}
        onChange={onStatusChange}
        ariaLabel="Filter by status"
        options={[{ value: '', label: 'All statuses' }, ...STATUS_OPTIONS]}
        className={inputClass}
        wrapperClassName="w-full sm:w-44"
      />

      {hasFilters && (
        <button
          type="button"
          onClick={() => { onSearchChange(''); onStatusChange(''); }}
          className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition"
        >
          <X size={14} /> Clear
        </button>
      )}
    </div>
  );
};
