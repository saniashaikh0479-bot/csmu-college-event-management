# College Event Management System

A full-stack web application for managing inter-college events, team registrations, attendance tracking, and certificate generation.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS (built to `/dist`)
- **Backend**: Express.js (Node.js), runs on port 5000
- **Data storage**: In-memory (no external database)

## Workflow

- **Start application**: `npm run build:prod && cd backend && NODE_ENV=production node server.js`
  - Builds the React frontend, installs backend deps, then serves everything from port 5000

## Key Directories

- `src/` — React frontend source
- `backend/server.js` — Express API server (all routes)
- `public/` — Static assets

## Credentials (demo data)

- Admin: username `principal`, password `admin123`
- Student: email `rahul@college.edu` or `priya@college.edu`, password `student123`

## Features

- Admin: create/manage events, track registrations, QR attendance, certificates
- Student: browse & register for events, download certificates
- Rate limiting, XSS sanitization, pagination on all list endpoints
