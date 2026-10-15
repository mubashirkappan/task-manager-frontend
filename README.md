# Task Workspace — Frontend

React + TypeScript single-page app for the Task Management API. It handles login and registration with JWTs, a task list with search, status filter and pagination, and a dashboard: an admin sees the whole workspace, a regular user sees only their own tasks. Light and dark themes are included.

Built with **React 19**, **Vite 8**, **TypeScript**, **Tailwind CSS v4**, **TanStack Query**, **React Router** and **Axios**.

---

## Project setup

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | `^20.19.0` or `>=22.12.0` (required by Vite 8) |
| npm | 10+ (bundled with Node) |
| Backend API | The Laravel app in `../backend`, running and reachable |

### 1. Start the backend first

The frontend is only a client. Every page needs the API. From the `backend` folder (see its README for full details):

```bash
cd ../backend
docker compose up -d --build
docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan jwt:secret
docker compose exec app php artisan migrate --seed
```

The API is then available at `http://localhost:8000/api`.

> **CORS:** the backend only accepts requests from the origin in its `FRONTEND_URL` env var (default `http://localhost:5173`). If you run the frontend on a different host or port, update `FRONTEND_URL` in `backend/.env` to match.

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Then adjust the values if needed (see below).

---

## Environment variables

Vite only exposes variables prefixed with `VITE_` to the browser. They are read **when the dev server or build starts**. Restart `npm run dev` or rebuild after changing them.

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | No | `http://localhost:8000/api` | Base URL of the Laravel API. **No trailing slash.** All requests are made relative to it, e.g. `${VITE_API_BASE_URL}/login`, `/tasks`, `/dashboard/admin`. |

Example `.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api
```

> `.env` is git-ignored. Commit changes to `.env.example` instead. Never put secrets in `VITE_*` variables, because they are bundled into the public JavaScript.

---

## Running the frontend

### Development

```bash
npm run dev
```

Open **http://localhost:5173**. Hot module reload is enabled.

### Production build

```bash
npm run build     # type-checks (tsc -b) and builds into dist/
npm run preview   # serves dist/ locally at http://localhost:4173 to verify the build
```

`dist/` is a static site that can be deployed to any static host. Because the app uses client-side routing, configure the host to serve `index.html` for unknown paths (SPA fallback). Otherwise reloading `/tasks` returns a 404.

### Lint

```bash
npm run lint
```

### Demo accounts

After `php artisan migrate --seed` on the backend, you can sign in with:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `password123` |
| User | `user1@example.com` | `password123` |
| User | `user2@example.com` | `password123` |

Admins see every user's tasks and the workspace dashboard (`/dashboard/admin` API). Users see only their own tasks and a personal dashboard (`/dashboard/user` API).

---

## Project structure

```
src/
├── api/client.ts               # Axios instance, auth header, auto token refresh on 401
├── components/                 # Shared UI: Select, Spinner, FormField
├── hooks/                      # useForm (validation), useMinimumLoading
├── layouts/AppLayout.tsx       # Header + navigation for signed-in pages
├── routes/ProtectedRoute.tsx   # Redirects to /login when not authenticated
├── utils/validation.ts         # Field validators, Laravel 422 → field errors
└── features/
    ├── auth/                   # AuthContext, Login and Register pages, token storage
    ├── tasks/                  # Task list, filters, card, modal, pagination, API
    ├── dashboard/              # Admin and user dashboards, API
    └── theme/                  # Light/dark theme provider and toggle
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| Blank white page | Open DevTools → Console. Usually a stale dev server after dependency changes: stop it and run `npm run dev` again. |
| "Network Error" / CORS error in the console | Backend not running, or `FRONTEND_URL` in `backend/.env` doesn't match the frontend's URL. |
| Requests go to the wrong URL | Check `VITE_API_BASE_URL` (no trailing slash) and restart the dev server. |
| Styles missing | Run `npm install` so `@tailwindcss/vite` is installed. It's registered in `vite.config.ts`. |
