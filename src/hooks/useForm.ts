import { useState } from 'react';
import type React from 'react';
import { compactErrors, serverFieldErrors, type FieldErrors } from '../utils/validation';

/**
 * Small form helper: client-side validation shown once a field is blurred or the form
 * is submitted, plus Laravel 422 errors mapped back onto the fields they belong to.
 */
export function useForm<K extends string>(
  initial: Record<K, string>,
  validate: (values: Record<K, string>) => FieldErrors<K>,
) {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState<Partial<Record<K, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors<K>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const clientErrors = compactErrors(validate(values));
  const errors: FieldErrors<K> = {};
  for (const key of Object.keys(values) as K[]) {
    const shown = (submitted || touched[key]) && clientErrors[key];
    errors[key] = shown || serverErrors[key];
  }

  const field = (name: K) => ({
    id: name,
    name,
    value: values[name],
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setValues((v) => ({ ...v, [name]: value }));
      setServerErrors((s) => ({ ...s, [name]: undefined }));
      setFormError('');
    },
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
  });

  const setValue = (name: K, value: string) => setValues((v) => ({ ...v, [name]: value }));

  /** Wraps a submit handler: blocks on client errors, maps 422s, shows `fallback` otherwise. */
  const handleSubmit =
    (onValid: (values: Record<K, string>) => Promise<void>, fallback: (err: unknown) => string) =>
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      setFormError('');
      if (Object.keys(clientErrors).length > 0) return;

      setSubmitting(true);
      try {
        await onValid(values);
      } catch (err) {
        const mapped = serverFieldErrors<K>(err);
        if (mapped) setServerErrors(mapped);
        else setFormError(fallback(err));
      } finally {
        setSubmitting(false);
      }
    };

  return { values, errors, field, setValue, handleSubmit, formError, submitting };
}
