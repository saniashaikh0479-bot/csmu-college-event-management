# College Event Management System — CSMU

A full-stack web application for managing inter-college events, team registrations, attendance tracking, and certificate generation for Chhatrapati Shivaji Maharaj University.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS (dev server on port 5000)
- **Backend**: Express.js (Node.js), runs on port 3001 in dev, port 5000 in production
- **Database**: SQLite via `better-sqlite3` (`backend/events.db`) — data persists across restarts

## Workflow (Development)

- **Start application**: `npm run start`
  - Auto-installs backend deps, starts Vite (port 5000) + Express backend (port 3001)
  - Vite proxies `/api` → `http://localhost:3001`

## Deployment (Production)

- Build: `npm run build:prod` (installs all deps + builds React to `dist/`)
- Run: `node backend/server.js`
- Backend auto-detects `dist/` folder and serves frontend statically

## Key Files

- `vite.config.js` — port 5000, `allowedHosts: true`, proxy `/api` → port 3001
- `package.json` — backend script forces `PORT=3001`, start script auto-installs backend deps
- `src/services/api.js` — all API calls use `/api` base path
- `src/contexts/AuthContext.jsx` — `isAdmin()` checks `role === 'admin'`
- `backend/server.js` — Express + SQLite, migrations, all routes
- `backend/events.db` — SQLite database (auto-created on first run)

## Default Admin Account

- Username: `admin`, Password: `admin` (created automatically on first run)

## Features

### Admin
- Create / manage / cancel events
- Track registrations, QR attendance, winner updates, certificate generation
- **User management**: create/edit/delete admin, teacher, coordinator & student accounts
  - Role: Admin/Student; Designation for admins: Event Coordinator, Teacher, Department Head, Principal, Administrator
  - Can reset user passwords from the edit modal
- Rate limiting, XSS sanitization, pagination

### Student
- **Self-registration** at `/student-register` (no admin needed)
- Browse & register for events, view registrations, download certificates, profile management

## Port Config (Critical for Replit)

- Vite dev server MUST stay on port 5000 (`allowedHosts: true`)
- Backend MUST stay on port 3001 in dev (`cross-env PORT=3001`)
- After GitHub pulls: verify these ports haven't been reset by the pulled code
