import React from 'react';

interface Props {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<Props> = ({ label, htmlFor, error, hint, children }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${htmlFor}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
    ) : hint ? (
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
    ) : null}
  </div>
);

