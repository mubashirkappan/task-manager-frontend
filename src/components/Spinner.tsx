import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner: React.FC<{ label?: string; fullScreen?: boolean }> = ({ label = 'Loading...', fullScreen = false }) => (
  <div
    role="status"
    aria-live="polite"
    className={`flex flex-col items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400 ${
      fullScreen ? 'min-h-screen bg-slate-50 dark:bg-slate-950' : 'py-20'
    }`}
  >
    <Loader2 size={28} className="animate-spin text-blue-600 dark:text-blue-400" />
    <span>{label}</span>
  </div>
);
