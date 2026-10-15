import React from 'react';
import { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../../theme/ThemeToggle';
import { inputClass } from '../../tasks/constants';
import { FormField } from '../../../components/FormField';
import { useForm } from '../../../hooks/useForm';
import { fieldClass, validateEmail, validateRequired } from '../../../utils/validation';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { errors, field, handleSubmit, formError, submitting } = useForm(
    { email: '', password: '' },
    (v) => ({
      email: validateEmail(v.email),
      password: validateRequired(v.password, 'Password'),
    }),
  );

  const onSubmit = handleSubmit(
    async (v) => {
      await login({ email: v.email.trim(), password: v.password });
      navigate('/tasks');
    },
    (err) =>
      isAxiosError(err) && err.response?.status === 401
        ? 'Invalid email or password.'
        : 'Could not sign in. Please try again.',
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative">
      <ThemeToggle className="absolute top-4 right-4" />
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Sign in</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Enter your credentials to access tasks</p>

        {formError && <div role="alert" className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30">{formError}</div>}

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <FormField label="Email" htmlFor="email" error={errors.email}>
            <input type="email" autoComplete="email" {...field('email')} className={fieldClass(inputClass, errors.email)} placeholder="user1@example.com" />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password}>
            <input type="password" autoComplete="current-password" {...field('password')} className={fieldClass(inputClass, errors.password)} placeholder="••••••••" />
          </FormField>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-6">
          Need an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
