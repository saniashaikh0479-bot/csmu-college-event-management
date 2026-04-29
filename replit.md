# College Event Management System

A full-stack web application for managing inter-college events, team registrations, attendance tracking, and certificate generation.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS (built to `/dist`)
- **Backend**: Express.js (Node.js), runs on port 5000
- **Data storage**: In-memory (no external database — data resets on server restart)

## Workflow

- **Start application**: `npm run start:prod`
  - Builds the React frontend, installs backend deps, then serves everything from port 5000
  - Uses cross-env for cross-platform compatibility (Windows/Linux/macOS)

## Deployment

- Target: **autoscale**
- Build: `npm run build:prod`
- Run: `node backend/server.js`
- Environment variable required: `NODE_ENV=production`

## Key Directories

- `src/` — React frontend source
- `src/services/api.js` — All API calls to the backend
- `src/contexts/` — Auth, Event, Toast contexts
- `src/pages/` — All page components
- `backend/server.js` — Express API server (all routes, in-memory data)
- `public/` — Static assets

## Credentials (default accounts)

- Admin: username `principal`, password `admin123`
- Student: email `rahul@college.edu` or `priya@college.edu`, password `student123`

## Features

- Admin: create/manage/cancel events, track registrations, QR attendance, winner updates, certificate generation
- Student: browse & register for events, view registrations, download certificates, profile management
- Rate limiting, XSS sanitization, pagination on all list endpoints
- Health check: `GET /api/health`

## Known Limitations

- Data is in-memory only — restarts clear all data created after startup
- Authentication uses plaintext passwords (suitable for internal/demo use only)
