import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ListTodo, LogOut } from 'lucide-react';
import { useAuth } from '../features/auth/context/AuthContext';
import { ThemeToggle } from '../features/theme/ThemeToggle';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive
      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
  }`;

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <header className="bg-white/90 backdrop-blur border-b border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Task Workspace</h1>
            <div className="flex items-center gap-2 mt-0.5 min-w-0">
              <span className="text-sm text-slate-500 dark:text-slate-400 truncate">{user?.name} ({user?.email})</span>
              <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${
                isAdmin
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink to="/tasks" className={navClass} title="Tasks">
              <ListTodo size={16} /> <span className="hidden sm:inline">Tasks</span>
            </NavLink>
            <NavLink to="/dashboard" className={navClass} title="Dashboard">
              <LayoutDashboard size={16} /> <span className="hidden sm:inline">Dashboard</span>
            </NavLink>
            <ThemeToggle />
            <button
              onClick={() => logout()}
              title="Logout"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-slate-800 transition"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
};
