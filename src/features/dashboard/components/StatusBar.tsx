import React, { useState } from 'react';
import type { TaskStatus } from '../../tasks/types';
import { STATUS_OPTIONS } from '../../tasks/constants';
import type { StatusCounts } from '../types';

const SERIES_COLOR: Record<TaskStatus, string> = {
  pending: 'var(--series-pending)',
  in_progress: 'var(--series-in-progress)',
  completed: 'var(--series-completed)',
};

interface Props {
  counts: StatusCounts;
  /** The value that fills 100% of the track (e.g. the busiest user's total). */
  scale: number;
  label: string;
  height?: number;
}

/** Horizontal stacked bar of task counts per status, with a hover tooltip per segment. */
export const StatusBar: React.FC<Props> = ({ counts, scale, label, height = 10 }) => {
  const [hover, setHover] = useState<{ status: TaskStatus; x: number } | null>(null);
  const total = STATUS_OPTIONS.reduce((sum, o) => sum + counts[o.value], 0);
  const segments = STATUS_OPTIONS.filter((o) => counts[o.value] > 0);
  const hovered = hover && STATUS_OPTIONS.find((o) => o.value === hover.status);

  return (
    <div
      className="relative py-2"
      role="img"
      aria-label={`${label}: ${STATUS_OPTIONS.map((o) => `${counts[o.value]} ${o.label.toLowerCase()}`).join(', ')}`}
      onMouseLeave={() => setHover(null)}
    >
      <div className="flex gap-0.5" style={{ width: scale > 0 ? `${(total / scale) * 100}%` : 0, height }}>
        {segments.map((o, i) => (
          <div
            key={o.value}
            onMouseMove={(e) => {
              const box = e.currentTarget.parentElement!.parentElement!.getBoundingClientRect();
              setHover({ status: o.value, x: e.clientX - box.left });
            }}
            className={`h-full transition-opacity ${hover && hover.status !== o.value ? 'opacity-40' : ''} ${
              i === 0 ? 'rounded-l' : ''
            } ${i === segments.length - 1 ? 'rounded-r' : ''}`}
            style={{ flexGrow: counts[o.value], flexBasis: 0, background: SERIES_COLOR[o.value] }}
          />
        ))}
      </div>

      {hover && hovered && (
        <div
          className="absolute bottom-full mb-1 -translate-x-1/2 pointer-events-none z-10 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900"
          style={{ left: hover.x }}
        >
          <div className="font-medium text-slate-900 dark:text-slate-100">{label}</div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="inline-block size-2 rounded-sm" style={{ background: SERIES_COLOR[hover.status] }} />
            {hovered.label}: <span className="font-semibold tabular-nums">{counts[hover.status]}</span>
            <span className="text-slate-400">({Math.round((counts[hover.status] / total) * 100)}%)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const StatusLegend: React.FC = () => (
  <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
    {STATUS_OPTIONS.map((o) => (
      <li key={o.value} className="flex items-center gap-1.5">
        <span className="inline-block size-2.5 rounded-sm" style={{ background: SERIES_COLOR[o.value] }} />
        {o.label}
      </li>
    ))}
  </ul>
);
