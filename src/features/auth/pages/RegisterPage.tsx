import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../../theme/ThemeToggle';
import { inputClass } from '../../tasks/constants';
import { FormField } from '../../../components/FormField';
import { useForm } from '../../../hooks/useForm';
import { fieldClass, validateEmail } from '../../../utils/validation';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { errors, field, handleSubmit, formError, submitting } = useForm(
    { name: '', email: '', password: '', password_confirmation: '' },
    (v) => {
      const name = v.name.trim();
      return {
        name: !name
          ? 'Name is required.'
          : name.length < 2 || name.length > 100
            ? 'Name must be between 2 and 100 characters.'
            : undefined,
        email: validateEmail(v.email),
        password: !v.password
          ? 'Password is required.'
          : v.password.length < 6
            ? 'Password must be at least 6 characters.'
            : undefined,
        password_confirmation: !v.password_confirmation
          ? 'Please confirm your password.'
          : v.password_confirmation !== v.password
            ? 'Passwords do not match.'
            : undefined,
      };
    },
  );

  const onSubmit = handleSubmit(
    async (v) => {
      await register({ name: v.name.trim(), email: v.email.trim(), password: v.password });
      navigate('/tasks');
    },
    () => 'Registration failed. Please try again.',
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative">
      <ThemeToggle className="absolute top-4 right-4" />
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Create account</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Sign up to start managing your tasks</p>

        {formError && <div role="alert" className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30">{formError}</div>}

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <FormField label="Name" htmlFor="name" error={errors.name}>
            <input type="text" autoComplete="name" {...field('name')} className={fieldClass(inputClass, errors.name)} placeholder="Jane Doe" />
          </FormField>

          <FormField label="Email" htmlFor="email" error={errors.email}>
            <input type="email" autoComplete="email" {...field('email')} className={fieldClass(inputClass, errors.email)} placeholder="jane@example.com" />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password} hint="At least 6 characters">
            <input type="password" autoComplete="new-password" {...field('password')} className={fieldClass(inputClass, errors.password)} placeholder="••••••••" />
          </FormField>

          <FormField label="Confirm password" htmlFor="password_confirmation" error={errors.password_confirmation}>
            <input type="password" autoComplete="new-password" {...field('password_confirmation')} className={fieldClass(inputClass, errors.password_confirmation)} placeholder="••••••••" />
          </FormField>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
