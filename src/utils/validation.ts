import { isAxiosError } from 'axios';

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): string | undefined => {
  const value = email.trim();
  if (!value) return 'Email is required.';
  if (value.length > 100) return 'Email must be at most 100 characters.';
  if (!EMAIL_RE.test(value)) return 'Enter a valid email address.';
};

export const validateRequired = (value: string, label: string): string | undefined =>
  value.trim() ? undefined : `${label} is required.`;

/** Drops undefined entries so `Object.keys(errors).length` means "has errors". */
export const compactErrors = <K extends string>(errors: FieldErrors<K>): FieldErrors<K> =>
  Object.fromEntries(Object.entries(errors).filter(([, v]) => v)) as FieldErrors<K>;

/** Maps a Laravel 422 response (`{ errors: { field: [msg] } }`) onto field errors. */
export const serverFieldErrors = <K extends string>(err: unknown): FieldErrors<K> | null => {
  if (!isAxiosError(err) || err.response?.status !== 422) return null;
  const errors = err.response.data?.errors as Record<string, string[]> | undefined;
  if (!errors) return null;
  return Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v[0]])) as FieldErrors<K>;
};

/** Input classes that switch to a red border when the field has an error. */
export const fieldClass = (base: string, error?: string) =>
  error ? `${base} border-red-500 focus:ring-red-500 dark:border-red-500` : base;
