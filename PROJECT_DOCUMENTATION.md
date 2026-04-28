# College Event Management System - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [Installation & Setup](#installation--setup)
7. [Configuration](#configuration)
8. [API Documentation](#api-documentation)
9. [Database Schema](#database-schema)
10. [User Roles & Permissions](#user-roles--permissions)
11. [Component Architecture](#component-architecture)
12. [State Management](#state-management)
13. [Styling & Design System](#styling--design-system)
14. [Implemented Features](#implemented-features)
15. [Future Enhancements](#future-enhancements)
16. [Testing](#testing)
17. [Deployment](#deployment)
18. [Troubleshooting](#troubleshooting)
19. [Contributing](#contributing)

---

## Project Overview

The College Event Management System is a full-stack web application designed to streamline the management of college events, including sports tournaments, cultural competitions, technical events, and workshops. The system provides separate interfaces for administrators and students, enabling efficient event creation, registration, attendance tracking, and certificate generation.

### Key Objectives
- Simplify event management for college administrators
- Provide easy event discovery and registration for students
- Automate attendance tracking using QR code technology
- Generate professional certificates for participants
- Maintain a centralized database of events and participants

### Current Status
- **Version:** 0.0.0
- **Development Status:** Active Development
- **Last Updated:** April 2026
- **License:** Private

---

## Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.5 | UI Framework |
| React Router DOM | 7.14.2 | Client-side routing |
| Tailwind CSS | 3.4.19 | Utility-first CSS framework |
| Lucide React | 1.11.0 | Icon library |
| html5-qrcode | 2.3.8 | QR code scanning |
| qrcode.react | 4.2.0 | QR code generation |
| jsPDF | 4.2.1 | PDF generation for certificates |
| Vite | 8.0.10 | Build tool and dev server |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | Runtime environment |
| Express | 4.18.2 | Web framework |
| CORS | 2.8.5 | Cross-origin resource sharing |
| body-parser | 1.20.2 | Request body parsing |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 10.2.1 | Code linting |
| PostCSS | 8.5.12 | CSS processing |
| Autoprefixer | 10.5.0 | CSS vendor prefixing |
| Concurrently | 8.2.2 | Run multiple commands |
| Nodemon | 3.0.1 | Auto-restart server |

---

## Architecture

### System Architecture

The application follows a classic client-server architecture with a RESTful API design:

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (React)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Admin UI   │  │  Student UI  │  │  Public UI   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Server (Express)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Routes  │  │ Event Routes │  │  Cert Routes │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────┐
│                    In-Memory Data Store                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Events    │  │Registrations │  │ Certificates │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Authentication Flow:**
   - User submits credentials → API validates → JWT-like session stored in localStorage → Protected routes check auth state

2. **Event Registration Flow:**
   - Student browses events → Selects event → Fills registration form → API creates registration → Event registration count updated

3. **Attendance Flow:**
   - Admin selects event → QR scanner activates → Simulated scan → Admin confirms attendance → Registration status updated

4. **Certificate Generation Flow:**
   - Admin selects event → Chooses participants → jsPDF generates certificate → PDF downloaded → Certificate record created

---

## Project Structure

```
Project/
├── backend/                          # Backend server
│   ├── node_modules/                # Backend dependencies
│   ├── package.json                 # Backend package configuration
│   ├── package-lock.json            # Backend dependency lock file
│   └── server.js                    # Express server with API routes
├── public/                          # Static assets
│   ├── favicon.svg                  # Website favicon
│   └── icons.svg                    # Icon resources
├── src/                             # Frontend source code
│   ├── assets/                      # Asset files
│   │   └── react.svg                # React logo
│   ├── components/                  # Reusable UI components
│   │   ├── Button.jsx               # Button component
│   │   ├── Card.jsx                 # Card component
│   │   ├── Input.jsx                # Input field component
│   │   ├── Modal.jsx                # Modal dialog component
│   │   ├── Navbar.jsx               # Navigation bar
│   │   ├── Select.jsx               # Select dropdown component
│   │   └── Sidebar.jsx              # Sidebar navigation
│   ├── contexts/                    # React Context providers
│   │   ├── AuthContext.jsx          # Authentication state management
│   │   └── EventContext.jsx         # Event data management
│   ├── pages/                       # Page components
│   │   ├── AdminDashboard.jsx       # Admin main dashboard
│   │   ├── AdminLogin.jsx           # Admin login page
│   │   ├── BrowseEvents.jsx         # Public event browsing
│   │   ├── CertificateGeneration.jsx # Certificate generation
│   │   ├── CreateEvent.jsx          # Event creation form
│   │   ├── EditEvent.jsx            # Event editing form
│   │   ├── EventDetails.jsx         # Event detail view
│   │   ├── EventRegistration.jsx    # Event registration form
│   │   ├── EventSelect.jsx          # Event selection page
│   │   ├── LandingPage.jsx          # Public landing page
│   │   ├── MyCertificates.jsx       # Student certificates view
│   │   ├── MyRegistrations.jsx      # Student registrations view
│   │   ├── Notifications.jsx        # Notifications page
│   │   ├── ParticipantManagement.jsx # Participant management
│   │   ├── QRAttendance.jsx         # QR code attendance
│   │   ├── StudentDashboard.jsx     # Student main dashboard
│   │   ├── StudentLogin.jsx         # Student login page
│   │   ├── StudentProfile.jsx       # Student profile
│   │   └── WinnerUpdate.jsx         # Winner update form
│   ├── services/                    # API service layer
│   │   ├── api.js                   # Real API calls
│   │   └── mockApi.js               # Mock API with localStorage
│   ├── utils/                       # Utility functions (empty)
│   ├── App.jsx                      # Main app component with routing
│   ├── index.css                    # Global styles
│   └── main.jsx                     # Application entry point
├── .gitignore                       # Git ignore rules
├── README.md                        # Basic project documentation
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML entry point
├── node_modules/                    # Frontend dependencies
├── package.json                     # Frontend package configuration
├── package-lock.json                # Frontend dependency lock file
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
└── vite.config.js                   # Vite build configuration
```

---

## Features

### Admin Features

1. **Dashboard Overview**
   - View total events, registrations, upcoming events, and active events
   - Quick access to event management actions
   - Recent events table with quick actions

2. **Event Management**
   - Create new events with detailed information
   - Edit existing event details
   - Delete events
   - View event statistics

3. **Participant Management**
   - View all registered participants for an event
   - View participant details (team name, captain, department)
   - Filter and search participants

4. **Attendance Tracking**
   - QR code scanning interface (simulated)
   - Mark attendance as present/absent
   - View attendance statistics
   - Manual attendance override

5. **Winner Management**
   - Update event winners
   - Record winner positions (1st, 2nd, 3rd)
   - Store winner details

6. **Certificate Generation**
   - Generate participation certificates
   - Generate winner certificates
   - Bulk certificate generation
   - Custom certificate types
   - PDF download functionality

7. **Notifications**
   - Send notifications to students
   - View notification history

### Student Features

1. **Dashboard**
   - View available events
   - View personal registrations
   - View earned certificates
   - Search and filter events

2. **Event Browsing**
   - Browse all available events
   - View event details
   - Filter by event type
   - Check registration availability

3. **Event Registration**
   - Register for events
   - Team registration with member details
   - Cultural event specific fields (performance type, song name)
   - Registration confirmation

4. **My Registrations**
   - View all registered events
   - Check registration status
   - View attendance status
   - Access event details

5. **My Certificates**
   - View earned certificates
   - Download certificates
   - Certificate details

6. **Profile Management**
   - View personal information
   - Update profile details

7. **Notifications**
   - Receive event notifications
   - View notification history

---

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

   The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Install frontend dependencies (from project root):**
   ```bash
   npm install
   ```

2. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (or another port specified by Vite)

### Running Both Servers Simultaneously

Use the provided script to run both frontend and backend:

```bash
npm run start
```

This uses `concurrently` to run both servers in parallel.

### Production Build

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

---

## Configuration

### Environment Variables

Currently, the application uses hardcoded configuration. For production, consider adding:

```env
# Backend (.env)
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://localhost:5173

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:5000/api
```

### Tailwind CSS Configuration

Located in `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}
```

### Vite Configuration

Located in `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Admin Login
- **Endpoint:** `POST /api/auth/admin/login`
- **Request Body:**
  ```json
  {
    "username": "sports_admin",
    "password": "admin123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "username": "sports_admin",
      "name": "Sports Coordinator",
      "role": "admin"
    }
  }
  ```

#### Student Login
- **Endpoint:** `POST /api/auth/student/login`
- **Request Body:**
  ```json
  {
    "email": "rahul@college.edu",
    "password": "student123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": "STU001",
      "email": "rahul@college.edu",
      "name": "Rahul Sharma",
      "department": "Computer Science",
      "role": "student"
    }
  }
  ```

### Event Endpoints

#### Get All Events
- **Endpoint:** `GET /api/events`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Inter-College Cricket Tournament",
        "date": "2025-05-15",
        "venue": "College Ground",
        "teamSize": 11,
        "maxTeams": 8,
        "registeredTeams": 6,
        "deadline": "2025-05-10",
        "rules": "Each team must have 11 players...",
        "contact": "sports_admin@college.edu",
        "type": "sports",
        "status": "active",
        "createdAt": "2025-04-20T10:00:00Z"
      }
    ]
  }
  ```

#### Get Event by ID
- **Endpoint:** `GET /api/events/:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Inter-College Cricket Tournament",
      ...
    }
  }
  ```

#### Create Event
- **Endpoint:** `POST /api/events`
- **Request Body:**
  ```json
  {
    "name": "New Event",
    "date": "2025-06-15",
    "venue": "Main Hall",
    "teamSize": 5,
    "maxTeams": 10,
    "deadline": "2025-06-10",
    "rules": "Event rules here",
    "contact": "admin@college.edu",
    "type": "cultural",
    "status": "active"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": 1714567890123,
      "name": "New Event",
      "createdAt": "2025-05-01T10:00:00Z",
      "registeredTeams": 0,
      ...
    }
  }
  ```

#### Update Event
- **Endpoint:** `PUT /api/events/:id`
- **Request Body:** Same as create event
- **Response:** Updated event object

#### Delete Event
- **Endpoint:** `DELETE /api/events/:id`
- **Response:**
  ```json
  {
    "success": true
  }
  ```

### Registration Endpoints

#### Get Registrations for Event
- **Endpoint:** `GET /api/registrations?eventId=:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "eventId": 1,
        "studentId": "STU001",
        "teamName": "Thunderbolts",
        "captainName": "Rahul Sharma",
        "members": ["Rahul Sharma", "Amit Patel", ...],
        "department": "Computer Science",
        "contact": "9876543210",
        "attended": false,
        "registeredAt": "2025-04-28T10:30:00Z"
      }
    ]
  }
  ```

#### Get Student Registrations
- **Endpoint:** `GET /api/registrations/student/:studentId`
- **Response:** Array of student's registrations

#### Create Registration
- **Endpoint:** `POST /api/registrations`
- **Request Body:**
  ```json
  {
    "eventId": 1,
    "studentId": "STU001",
    "teamName": "Thunderbolts",
    "captainName": "Rahul Sharma",
    "members": ["Rahul Sharma", "Amit Patel", ...],
    "department": "Computer Science",
    "contact": "9876543210",
    "performanceType": "Group Dance",
    "songName": "Nagada Sang Dhol"
  }
  ```
- **Response:** Created registration object

#### Update Attendance
- **Endpoint:** `PUT /api/registrations/:id/attendance`
- **Request Body:**
  ```json
  {
    "attended": true
  }
  ```
- **Response:** Updated registration object

### Certificate Endpoints

#### Get Student Certificates
- **Endpoint:** `GET /api/certificates/student/:studentId`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "eventId": 1,
        "studentId": "STU001",
        "type": "participation",
        "issuedAt": "2025-05-16T00:00:00Z"
      }
    ]
  }
  ```

#### Generate Certificate
- **Endpoint:** `POST /api/certificates`
- **Request Body:**
  ```json
  {
    "eventId": 1,
    "studentId": "STU001",
    "type": "participation"
  }
  ```
- **Response:** Created certificate object

---

## Database Schema

### Current Data Storage

The application currently uses **in-memory data storage** in the backend. Data is lost when the server restarts. For production, a proper database should be implemented.

### Proposed Database Schema (for future implementation)

#### Events Table
```sql
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  venue VARCHAR(255) NOT NULL,
  team_size INT NOT NULL,
  max_teams INT NOT NULL,
  registered_teams INT DEFAULT 0,
  deadline DATE NOT NULL,
  rules TEXT,
  contact VARCHAR(255),
  type ENUM('sports', 'cultural', 'technical', 'workshop') NOT NULL,
  status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(20) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  role ENUM('admin', 'student') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Registrations Table
```sql
CREATE TABLE registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  student_id VARCHAR(20) NOT NULL,
  team_name VARCHAR(255) NOT NULL,
  captain_name VARCHAR(255) NOT NULL,
  members JSON,
  department VARCHAR(100),
  contact VARCHAR(20),
  performance_type VARCHAR(100),
  song_name VARCHAR(255),
  attended BOOLEAN DEFAULT FALSE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Certificates Table
```sql
CREATE TABLE certificates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  student_id VARCHAR(20) NOT NULL,
  type ENUM('participation', 'winner', 'runner-up') NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Winners Table
```sql
CREATE TABLE winners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  registration_id INT NOT NULL,
  position ENUM('1', '2', '3') NOT NULL,
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
);
```

#### Notifications Table
```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(20),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## User Roles & Permissions

### Admin Role

**Permissions:**
- Create, edit, and delete events
- View all event registrations
- Manage event participants
- Mark attendance via QR code
- Update event winners
- Generate certificates
- Send notifications
- View system statistics

**Access Levels:**
- Full access to all admin features
- Can access all event data
- Can modify any registration

### Student Role

**Permissions:**
- View available events
- Register for events (subject to availability)
- View own registrations
- View own certificates
- Update personal profile
- View notifications

**Access Levels:**
- Limited to own data
- Cannot modify event details
- Cannot view other students' data

---

## Component Architecture

### Component Hierarchy

```
App
├── AuthProvider
│   └── AuthContext
├── EventProvider
│   └── EventContext
└── BrowserRouter
    └── Routes
        ├── LandingPage
        ├── AdminLogin
        ├── StudentLogin
        ├── ProtectedRoute (Admin)
        │   ├── AdminDashboard
        │   │   ├── Navbar
        │   │   ├── Sidebar
        │   │   ├── Card
        │   │   └── Button
        │   ├── CreateEvent
        │   ├── EditEvent
        │   ├── ParticipantManagement
        │   ├── QRAttendance
        │   ├── WinnerUpdate
        │   └── CertificateGeneration
        └── ProtectedRoute (Student)
            ├── StudentDashboard
            │   ├── Navbar
            │   ├── Sidebar
            │   ├── Card
            │   ├── Input
            │   └── Button
            ├── BrowseEvents
            ├── EventRegistration
            ├── MyRegistrations
            ├── MyCertificates
            ├── StudentProfile
            └── Notifications
```

### Reusable Components

#### Button Component
- Variants: primary, secondary, outline, ghost
- Sizes: sm, md, lg
- Supports icon integration

#### Card Component
- Container for content grouping
- Header and body sections
- Consistent styling

#### Input Component
- Text input fields
- Label support
- Validation states

#### Modal Component
- Dialog overlay
- Close functionality
- Custom content

#### Navbar Component
- Navigation header
- User info display
- Logout functionality
- Notification bell

#### Sidebar Component
- Role-based navigation
- Active state highlighting
- Responsive design

---

## State Management

### AuthContext

**Purpose:** Manage authentication state across the application

**State:**
- `user`: Current user object
- `loading`: Loading state
- `login()`: Login function
- `logout()`: Logout function
- `isAdmin()`: Admin role check
- `isStudent()`: Student role check

**Persistence:** User data stored in localStorage

### EventContext

**Purpose:** Manage event-related state

**State:**
- `events`: Array of events
- `registrations`: Array of registrations
- `addEvent()`: Add new event
- `updateEvent()`: Update existing event
- `deleteEvent()`: Delete event
- `getEventById()`: Get event by ID
- `addRegistration()`: Add new registration
- `getRegistrationsByEvent()`: Get registrations for event
- `getRegistrationsByStudent()`: Get student's registrations
- `updateAttendance()`: Update attendance status

**Note:** Currently, most state is managed at the component level using useState. EventContext is available but not fully utilized.

---

## Styling & Design System

### Design Philosophy

The application uses a **professional legacy UI design** with:
- Navy/gray color palette
- Bordered components
- Table-based layouts
- Minimal rounded corners
- College branding throughout

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary 900 | #1e3a8a | Navbar, sidebar active |
| Primary 700 | #1d4ed8 | Sidebar active hover |
| Primary 600 | #2563eb | Primary buttons |
| Primary 500 | #3b82f6 | Links, accents |
| Gray 100 | #f3f4f6 | Background |
| Gray 300 | #d1d5db | Borders |
| Gray 700 | #374151 | Text primary |
| Gray 600 | #4b5563 | Text secondary |
| Green 600 | #16a34a | Success states |
| Red 600 | #dc2626 | Error states |

### Typography

- **Font Family:** System sans-serif
- **Font Sizes:**
  - xs: 0.75rem (12px)
  - sm: 0.875rem (14px)
  - base: 1rem (16px)
  - lg: 1.125rem (18px)
  - xl: 1.25rem (20px)
  - 2xl: 1.5rem (24px)

### Spacing

- Consistent spacing using Tailwind's spacing scale
- Padding: 2, 3, 4 (0.5rem, 0.75rem, 1rem)
- Margins: 2, 3, 4, 6
- Gap: 2, 3, 4

### Component Styling

**Buttons:**
- Primary: Blue background, white text
- Secondary: Gray background, dark text
- Outline: Border only, colored text
- Ghost: Transparent background, colored text

**Cards:**
- White background
- Gray border
- Rounded corners (minimal)
- Shadow (subtle)

**Tables:**
- Gray header background
- Border between rows
- Hover effect on rows
- Left-aligned text

---

## Implemented Features

### Fully Implemented

1. ✅ **Authentication System**
   - Admin login with username/password
   - Student login with email/password
   - Session persistence via localStorage
   - Protected routes for authenticated users
   - Role-based access control

2. ✅ **Event Management**
   - Create events with all details
   - Edit existing events
   - Delete events
   - View event list with filtering
   - Event type categorization (sports, cultural, technical, workshop)

3. ✅ **Event Registration**
   - Student registration for events
   - Team registration with member details
   - Dynamic form fields based on event type
   - Registration validation
   - Registration count tracking

4. ✅ **Participant Management**
   - View all participants for an event
   - Participant details display
   - Department information
   - Contact information

5. ✅ **Attendance Tracking**
   - QR code scanning interface (simulated)
   - Mark attendance as present/absent
   - Attendance statistics
   - Manual attendance override
   - Real-time attendance updates

6. ✅ **Certificate Generation**
   - PDF certificate generation using jsPDF
   - Professional certificate design
   - Bulk certificate generation
   - Multiple certificate types (participation, winner, runner-up)
   - Certificate download functionality

7. ✅ **Dashboards**
   - Admin dashboard with statistics
   - Student dashboard with personal data
   - Quick access to common actions
   - Event overview tables

8. ✅ **Navigation**
   - Role-based sidebar navigation
   - Top navbar with user info
   - Breadcrumb navigation
   - Protected route handling

9. ✅ **Responsive Design**
   - Mobile-friendly layouts
   - Responsive tables
   - Flexible grid systems
   - Touch-friendly buttons

10. ✅ **Data Persistence**
    - Backend in-memory storage
    - Frontend localStorage for mock API
    - Session persistence for auth

### Partially Implemented

1. ⚠️ **QR Code Scanning**
   - Interface implemented
   - Scanning simulated (not real camera integration)
   - html5-qrcode library included but not fully utilized

2. ⚠️ **Notifications**
   - UI implemented
   - No real notification system
   - No email/push notifications

3. ⚠️ **Winner Management**
   - Basic form implemented
   - No winner display on certificates
   - No winner announcement features

---

## Recent Improvements (April 2026)

### Security Enhancements
- **API Rate Limiting:** Implemented using express-rate-limit with 100 requests per 15 minutes for general endpoints and 5 requests per 15 minutes for authentication endpoints
- **CORS Configuration:** Properly configured with environment variable support for allowed origins
- **Environment Variables:** Added .env configuration for both frontend and backend with .env.example files

### User Experience Improvements
- **Toast Notification System:** Implemented ToastContext with success, error, warning, and info notifications
- **Loading Spinners:** Created LoadingSpinner component and integrated across all dashboard pages
- **Confirmation Modals:** Added ConfirmDialog component for destructive actions (delete events, mark attendance)
- **Form Validation:** Enhanced validation in CreateEvent and EventRegistration with:
  - Email format validation
  - Phone number format validation (10-digit)
  - Date range validation (deadline before event date)
  - Team size vs max teams consistency
  - Team member count validation

### Code Quality Improvements
- **Code Deduplication:** Extracted getTypeColor function to src/utils/colors.js
- **Consistent Error Handling:** Implemented try-catch blocks in all API service functions with user-friendly error messages
- **Accessibility:** Added ARIA labels to Button, Input, Navbar, and Sidebar components

### New Components
- **LoadingSpinner:** Reusable loading spinner component with size variants
- **ConfirmDialog:** Reusable confirmation dialog for destructive actions
- **ToastContext:** Context provider for toast notifications
- **colors.js:** Utility file for color-related functions

---

## Future Enhancements

### High Priority

1. **Database Integration**
   - Replace in-memory storage with PostgreSQL/MongoDB
   - Implement proper data models
   - Add database migrations
   - Implement data relationships

2. **Real QR Code Scanning**
   - Integrate actual camera access
   - Use html5-qrcode library fully
   - Add QR code generation for participants
   - Implement offline scanning capability

3. **Authentication Enhancement**
   - Add JWT token-based authentication
   - Implement password hashing
   - Add password reset functionality
   - Implement OAuth (Google, Microsoft)

4. **Email Notifications**
   - Send registration confirmations
   - Event reminders
   - Certificate delivery
   - Attendance notifications

5. **File Upload**
   - Event banner images
   - Document uploads
   - Profile pictures
   - Certificate templates

### Medium Priority

6. **Advanced Reporting**
   - Event analytics dashboard
   - Participation statistics
   - Department-wise reports
   - Export to Excel/PDF

7. **Calendar View**
   - Monthly event calendar
   - Event scheduling
   - Conflict detection
   - Recurring events

8. **Rating & Feedback**
   - Event rating system
   - Participant feedback
   - Admin response system
   - Feedback analytics

9. **Payment Integration**
   - Paid event registration
   - Payment gateway integration
   - Refund management
   - Payment history

10. **Mobile App**
    - React Native or Flutter app
    - Push notifications
    - Offline mode
    - QR scanning optimization

### Low Priority

11. **Social Features**
    - Event sharing
    - Social media integration
    - Team formation tools
    - Discussion forums

12. **Multi-language Support**
    - i18n implementation
    - Language selection
    - Translated content

13. **Advanced Permissions**
    - Granular admin roles
    - Department-specific access
    - Audit logs
    - Permission management

14. **Data Export**
    - CSV export for registrations
    - PDF export for reports
    - Backup/restore functionality
    - Data migration tools

15. **API Documentation**
    - Swagger/OpenAPI integration
    - API testing interface
    - Rate limiting
    - API versioning

---

## Testing

### Current Testing Status

**No automated tests are currently implemented.**

### Recommended Testing Strategy

1. **Unit Testing**
   - Component testing with React Testing Library
   - Service layer testing
   - Utility function testing
   - Context testing

2. **Integration Testing**
   - API endpoint testing
   - Database integration testing
   - Authentication flow testing
   - Form submission testing

3. **End-to-End Testing**
   - User flow testing with Playwright/Cypress
   - Cross-browser testing
   - Mobile responsive testing
   - Performance testing

### Recommended Testing Tools

- **Jest:** Unit testing framework
- **React Testing Library:** Component testing
- **Supertest:** API testing
- **Playwright:** E2E testing
- **MSW:** API mocking for tests

### Test Coverage Goals

- Components: 80%+
- Services: 90%+
- API endpoints: 100%
- Critical user flows: 100%

---

## Deployment

### Development Deployment

Currently, the application runs locally:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Production Deployment Recommendations

#### Frontend Deployment

**Options:**
1. **Vercel** - Recommended for React apps
2. **Netlify** - Easy deployment with CI/CD
3. **AWS S3 + CloudFront** - Scalable option
4. **Docker** - Containerized deployment

**Steps for Vercel:**
1. Connect GitHub repository
2. Configure build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables
5. Deploy

#### Backend Deployment

**Options:**
1. **Heroku** - Easy Node.js deployment
2. **Railway** - Modern deployment platform
3. **AWS EC2** - Full control
4. **DigitalOcean** - Cost-effective VPS
5. **Docker** - Containerized deployment

**Steps for Heroku:**
1. Create Heroku app
2. Add PostgreSQL add-on
4. Set environment variables
5. Deploy via Git
6. Scale as needed

#### Database Deployment

**Options:**
1. **PostgreSQL** - Recommended for relational data
2. **MongoDB** - NoSQL alternative
3. **AWS RDS** - Managed database
4. **DigitalOcean Managed Database** - Cost-effective

### Environment Variables for Production

```env
# Backend
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://your-domain.com

# Frontend
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### CI/CD Pipeline

**Recommended: GitHub Actions**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy
        run: # Deployment commands
```

---

## Troubleshooting

### Common Issues

#### Backend won't start

**Problem:** Port 5000 already in use

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change port in server.js
const PORT = process.env.PORT || 5001;
```

#### Frontend build fails

**Problem:** Dependency conflicts

**Solution:**
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install

# Or use specific Node version
nvm use 18
```

#### CORS errors

**Problem:** Frontend can't connect to backend

**Solution:**
- Ensure backend is running
- Check CORS configuration in server.js
- Verify API_BASE_URL in api.js

#### localStorage not persisting

**Problem:** Data lost on refresh

**Solution:**
- Check browser settings
- Ensure localStorage is enabled
- Check for private/incognito mode

#### QR scanning not working

**Problem:** Camera not accessible

**Solution:**
- Ensure HTTPS (required for camera access)
- Check browser permissions
- Use localhost for development
- Verify html5-qrcode library

### Debug Mode

Enable debug logging:

```javascript
// In api.js
const DEBUG = true;

if (DEBUG) {
  console.log('API Call:', endpoint, data);
}
```

### Performance Issues

**Problem:** Slow page loads

**Solutions:**
- Enable code splitting
- Lazy load components
- Optimize images
- Use React.memo for expensive components
- Implement pagination for large lists

---

## Contributing

### Code Style

- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive variable names
- Add comments for complex logic
- Keep functions small and focused

### Git Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to remote: `git push origin feature/feature-name`
4. Create pull request
5. Get code review
6. Merge to main

### Commit Message Format

```
type(scope): subject

body

footer
```

**Types:**
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance

**Example:**
```
feat(auth): add password reset functionality

- Add password reset endpoint
- Implement email sending
- Add reset form UI

Closes #123
```

### Pull Request Guidelines

- Describe changes in PR description
- Link related issues
- Add screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

---

## Appendix

### Demo Credentials

#### Principal (Super Admin)
- **Username:** `principal`
- **Password:** `admin123`
- **Access:** Full access to all features and event types

#### Student Accounts
- **Email:** `rahul@college.edu`
- **Password:** `student123`
- **Department:** Computer Science

- **Email:** `priya@college.edu`
- **Password:** `student123`
- **Department:** Electronics

### API Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported

### License

This project is private and proprietary. All rights reserved.

### Contact

For questions or support, contact the development team.

---

**Document Version:** 1.0  
**Last Updated:** April 27, 2026  
**Maintained By:** Development Team
