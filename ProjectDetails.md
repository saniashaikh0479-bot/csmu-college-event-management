# College Event Management System - Project Details

## Project Overview

This is a **mini web application** for managing college events. It helps college administrators organize events (like sports tournaments, cultural programs, technical workshops) and allows students to register for these events, track their attendance, and download certificates.

Think of it as a **digital event management system** that replaces paper-based registration and manual certificate generation.

---

## How the System Works (Simple Explanation)

### The Big Picture

The system has two main parts:
1. **Frontend** - What users see and interact with (the website)
2. **Backend** - The brain that processes data and stores information (the server)

```
User (Student/Admin) 
    ↓
Frontend (Website Interface)
    ↓
Backend (Server with Database)
    ↓
Database (Stores all information)
```

### How They Talk to Each Other

- **Frontend** sends requests to the backend (like "show me all events" or "register this student")
- **Backend** processes the request, talks to the database, and sends back the answer
- They communicate using **HTTP requests** (the same way your browser talks to any website)

---

## Frontend - The User Interface

### What We Used

**React** - This is a JavaScript library for building user interfaces. It helps us create interactive pages that update without reloading the whole website.

**Vite** - A tool that makes React development faster. It helps us run the website while we're building it.

**React Router** - This handles navigation. It lets users move between different pages (like from login to dashboard) without the page reloading.

**Tailwind CSS** - A styling framework that makes it easy to design beautiful pages without writing lots of custom CSS.

**Lucide React** - A library of icons (like user icons, menu icons, etc.) that we use throughout the website.

### Frontend Structure

The frontend code is in the `src/` folder:

```
src/
├── components/     # Reusable building blocks
├── contexts/       # Global state management
├── pages/          # Different pages of the website
├── App.jsx         # Main application file
└── main.jsx        # Entry point
```

### Key Components (Building Blocks)

These are like LEGO pieces that we use to build pages:

1. **Button** - A reusable button component that can look different (primary, secondary, outline)
2. **Card** - A container that holds content with a nice border and shadow
3. **Input** - Text input fields for forms
4. **Modal** - A popup dialog window
5. **Navbar** - The top navigation bar with user info and logout
6. **Sidebar** - The side menu for navigation
7. **LoadingSpinner** - Shows a loading animation when data is being fetched

### Pages (What Users See)

**Public Pages:**
- **LandingPage** - The homepage that everyone sees first
- **AdminLogin** - Login page for administrators
- **StudentLogin** - Login page for students
- **StudentRegister** - Registration page for new students
- **BrowseEvents** - Page where students can see all available events

**Admin Pages (Protected - only admins can access):**
- **AdminDashboard** - Main admin dashboard with statistics
- **CreateEvent** - Form to create new events
- **EditEvent** - Form to edit existing events
- **ParticipantManagement** - View all participants for an event
- **QRAttendance** - Mark attendance using QR codes
- **WinnerUpdate** - Update event winners
- **CertificateGeneration** - Generate certificates for participants
- **UserManagement** - Manage users (only for super admin)

**Student Pages (Protected - only students can access):**
- **StudentDashboard** - Main student dashboard
- **EventRegistration** - Form to register for an event
- **MyRegistrations** - View all registrations
- **MyCertificates** - View and download certificates
- **StudentProfile** - View and edit profile
- **Notifications** - View notifications

### Context API (State Management)

React Context is like a global storage that any component can access:

1. **AuthContext** - Stores who is logged in (user info, login/logout functions)
2. **EventContext** - Stores events and registrations data
3. **ToastContext** - Shows popup messages (success, error notifications)

### How Routing Works

We use React Router to handle navigation. The `App.jsx` file defines all the routes:

```jsx
<Route path="/" element={<LandingPage />} />
<Route path="/admin-login" element={<AdminLogin />} />
<Route path="/student-dashboard" element={<StudentDashboard />} />
```

Protected routes check if the user is logged in before showing the page.

---

## Backend - The Server

### What We Used

**Node.js** - A JavaScript runtime that lets us run JavaScript on the server (not just in the browser).

**Express** - A web framework for Node.js. It makes it easy to create a server and handle HTTP requests.

**SQLite (better-sqlite3)** - A database that stores all our data in a single file. It's simple and doesn't require a separate database server.

**CORS** - Allows the frontend (running on one port) to talk to the backend (running on another port).

**express-rate-limit** - Protects the server from too many requests (prevents abuse).

### Backend Structure

The backend is in the `backend/` folder:

```
backend/
├── server.js       # Main server file with all API routes
├── package.json    # Backend dependencies
└── events.db       # SQLite database file
```

### How the Server Works

The `server.js` file does several things:

1. **Sets up Express server** - Creates the web server
2. **Connects to SQLite database** - Opens the database file
3. **Creates database tables** - Sets up the structure for storing data
4. **Defines API routes** - Creates endpoints that the frontend can call
5. **Handles requests** - Processes incoming requests and sends responses

### Database Tables

The database has these tables:

1. **users** - Stores all users (admins, students, coordinators)
   - Fields: id, username, password, name, role, department, email

2. **events** - Stores all events
   - Fields: id, name, date, venue, team_size, max_teams, registered_teams, deadline, rules, contact, type, status

3. **registrations** - Stores student registrations for events
   - Fields: id, event_id, student_id, team_name, captain_name, members, department, contact, attended

4. **certificates** - Stores issued certificates
   - Fields: id, event_id, student_id, type, issued_at

5. **notifications** - Stores user notifications
   - Fields: id, user_id, type, title, message, read, created_at

### API Endpoints (How Frontend Talks to Backend)

The backend provides these API endpoints:

**Authentication:**
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/register` - Student registration

**Events:**
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

**Registrations:**
- `GET /api/registrations?eventId=:id` - Get registrations for an event
- `GET /api/registrations/student/:studentId` - Get a student's registrations
- `POST /api/registrations` - Create a new registration
- `PUT /api/registrations/:id/attendance` - Update attendance status

**Certificates:**
- `GET /api/certificates/student/:studentId` - Get student's certificates
- `POST /api/certificates` - Generate a certificate

**Users:**
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create a new user (admin only)
- `PUT /api/users/:id` - Update a user (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)

**Notifications:**
- `GET /api/notifications/:userId` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

### Security Features

1. **Input Sanitization** - All user inputs are cleaned to prevent harmful code injection
2. **Rate Limiting** - Limits how many requests can be made in a time period (prevents abuse)
3. **Validation** - All data is validated before being stored
4. **CORS Configuration** - Controls which domains can access the API

---

## Complete Workflow - How Everything Works Together

### 1. User Registration Flow

**Student registers:**
1. Student goes to registration page
2. Fills in username, password, name, department, email
3. Frontend sends POST request to `/api/auth/register`
4. Backend validates the data
5. Backend stores the new user in the database
6. Backend sends success response
7. Frontend shows success message and redirects to login

### 2. Login Flow

**Admin logs in:**
1. Admin goes to login page
2. Enters username and password
3. Frontend sends POST request to `/api/auth/admin/login`
4. Backend checks if username and password match
5. Backend sends user data back
6. Frontend stores user info in localStorage (using AuthContext)
7. Frontend redirects to admin dashboard

**Student logs in:**
1. Student goes to login page
2. Enters email and password
3. Frontend sends POST request to `/api/auth/student/login`
4. Backend checks if email and password match
5. Backend sends user data back
6. Frontend stores user info in localStorage
7. Frontend redirects to student dashboard

### 3. Event Creation Flow (Admin)

1. Admin logs in and goes to dashboard
2. Clicks "Create Event"
3. Fills in event details (name, date, venue, team size, rules, etc.)
4. Frontend sends POST request to `/api/events`
5. Backend validates the event data
6. Backend stores the event in the database
7. Backend sends back the created event with ID
8. Frontend shows success message and redirects to dashboard

### 4. Event Registration Flow (Student)

1. Student logs in and browses events
2. Clicks on an event to see details
3. Clicks "Register" button
4. Fills in registration form (team name, captain, members, etc.)
5. Frontend sends POST request to `/api/registrations`
6. Backend validates the registration
7. Backend checks if event has space (max_teams limit)
8. Backend stores the registration
9. Backend updates the event's registered_teams count
10. Frontend shows success message

### 5. Attendance Marking Flow (Admin)

1. Admin selects an event
2. Goes to "QR Attendance" page
3. Scans QR code (simulated - in real version, would use camera)
4. Backend finds the registration by QR code
5. Admin confirms attendance
6. Frontend sends PUT request to `/api/registrations/:id/attendance`
7. Backend updates the attendance status in database
8. Frontend shows updated attendance list

### 6. Certificate Generation Flow (Admin)

1. Admin selects an event
2. Goes to "Certificate Generation" page
3. Selects which participants to generate certificates for
4. Frontend uses jsPDF library to create PDF certificate
5. Frontend sends POST request to `/api/certificates` to record the certificate
6. Backend stores the certificate record in database
7. Frontend downloads the PDF file

### 7. Certificate Download Flow (Student)

1. Student logs in
2. Goes to "My Certificates" page
3. Frontend sends GET request to `/api/certificates/student/:studentId`
4. Backend queries database for student's certificates
5. Backend sends back certificate list
6. Student clicks "Download" on a certificate
7. Frontend generates PDF using jsPDF and downloads it

---

## Unique Features of This Project

### 1. Role-Based Access Control

The system has three user roles:
- **Admin** - Full access to manage events, users, certificates
- **Coordinator** - Can manage events but not users
- **Student** - Can only register for events and view their data

### 2. QR Code Attendance

The system includes a QR code scanning feature for marking attendance. Currently, it's simulated (for demonstration), but the infrastructure is there to integrate with real QR code scanning using the `html5-qrcode` library.

### 3. Dynamic Certificate Generation

Certificates are generated on the fly using the `jsPDF` library. This means:
- No need to manually create certificates
- Certificates can be customized with student names, event details
- Bulk generation for multiple participants

### 4. Real-time Registration Tracking

The system tracks:
- How many teams have registered for each event
- Maximum team limits
- Registration deadlines
- Attendance status

### 5. Professional Legacy UI Design

The interface uses a professional, college-appropriate design:
- Navy/gray color scheme
- Clean, bordered components
- Table-based layouts for data
- Consistent styling throughout

### 6. SQLite Database

Uses SQLite which is:
- Simple (single file database)
- No separate database server needed
- Easy to backup and migrate
- Perfect for small to medium applications

### 7. Lazy Loading

The frontend uses React's lazy loading to improve performance:
- Pages are loaded only when needed
- Reduces initial load time
- Better user experience

### 8. Context API for State Management

Uses React Context API instead of complex state management libraries:
- Simpler than Redux
- Built into React
- Perfect for this scale of application

---

## Technologies Used - Summary

### Frontend Technologies

| Technology | Purpose | Why We Used It |
|------------|---------|----------------|
| React 19.2.5 | UI Framework | Most popular, component-based, easy to learn |
| React Router 7.14.2 | Navigation | Handles page routing without reload |
| Tailwind CSS 3.4.19 | Styling | Fast development, consistent design |
| Lucide React 1.11.0 | Icons | Beautiful, modern icons |
| html5-qrcode 2.3.8 | QR Scanning | For attendance feature |
| qrcode.react 4.2.0 | QR Generation | For generating QR codes |
| jsPDF 4.2.1 | PDF Generation | For certificate generation |
| Vite 8.0.10 | Build Tool | Fast development server |

### Backend Technologies

| Technology | Purpose | Why We Used It |
|------------|---------|----------------|
| Node.js | Runtime | JavaScript on server, same language as frontend |
| Express 4.18.2 | Web Framework | Simple, popular, lots of features |
| better-sqlite3 12.9.0 | Database | Simple, file-based, no setup needed |
| CORS 2.8.5 | Cross-Origin | Allows frontend to talk to backend |
| body-parser 1.20.2 | Request Parsing | Handles JSON data in requests |
| express-rate-limit 7.1.5 | Security | Prevents API abuse |

---

## Project Structure Explained

```
csmu-college-event-management/
├── backend/                    # Server-side code
│   ├── server.js              # Main server file (927 lines)
│   ├── package.json           # Backend dependencies
│   ├── events.db              # SQLite database file
│   └── node_modules/          # Installed backend packages
│
├── src/                        # Frontend source code
│   ├── components/            # Reusable UI components
│   │   ├── Button.jsx         # Button component
│   │   ├── Card.jsx           # Card component
│   │   ├── Input.jsx          # Input field component
│   │   ├── Modal.jsx          # Modal dialog
│   │   ├── Navbar.jsx         # Top navigation bar
│   │   ├── Sidebar.jsx        # Side navigation menu
│   │   └── ... (other components)
│   │
│   ├── contexts/              # Global state management
│   │   ├── AuthContext.jsx    # Authentication state
│   │   ├── EventContext.jsx   # Event data state
│   │   └── ToastContext.jsx   # Notification state
│   │
│   ├── pages/                 # Page components
│   │   ├── LandingPage.jsx    # Homepage
│   │   ├── AdminLogin.jsx     # Admin login
│   │   ├── StudentLogin.jsx   # Student login
│   │   ├── AdminDashboard.jsx # Admin main page
│   │   ├── StudentDashboard.jsx # Student main page
│   │   ├── CreateEvent.jsx    # Create event form
│   │   ├── EventRegistration.jsx # Registration form
│   │   ├── CertificateGeneration.jsx # Certificate page
│   │   └── ... (other pages)
│   │
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
│
├── public/                     # Static assets
│   ├── favicon.svg
│   └── icons.svg
│
├── package.json               # Frontend dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
└── index.html                 # HTML entry point
```

---

## How to Run the Project

### Prerequisites

- Node.js installed (version 18 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies

From the project root folder:
```bash
npm install
```

This installs all frontend dependencies.

Then install backend dependencies:
```bash
cd backend
npm install
cd ..
```

### Step 2: Start the Backend

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

### Step 3: Start the Frontend

In a new terminal (from project root):
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Step 4: Access the Application

Open your browser and go to `http://localhost:5173`

### Demo Credentials

**Super Admin:**
- Username: `admin`
- Password: `admin`

**Admin/Coordinator accounts are created by super admin through User Management**

**Student accounts can be created through the registration page**

---

## Database Schema (Simple View)

### Users Table
Stores all user accounts
- Each user has a unique ID
- Roles: admin, coordinator, student
- Passwords are stored (in production, should be hashed)

### Events Table
Stores all events
- Each event has a unique ID
- Tracks how many teams have registered
- Has status: active, cancelled, completed

### Registrations Table
Stores who registered for what
- Links users to events
- Stores team information
- Tracks attendance (yes/no)

### Certificates Table
Stores issued certificates
- Links students to events
- Records certificate type (participation, winner)
- Records when it was issued

### Notifications Table
Stores notifications for users
- Links to users
- Has read/unread status

---

## Key Features Explained

### 1. Authentication System

**What it does:** Ensures only authorized users can access certain pages

**How it works:**
- When user logs in, server checks credentials
- If correct, server sends user data back
- Frontend stores this in browser's localStorage
- Every protected page checks if user is logged in
- If not, redirects to login page

**Why it's important:** Prevents unauthorized access to sensitive data

### 2. Event Management

**What it does:** Allows admins to create, edit, and delete events

**How it works:**
- Admin fills in event form
- Frontend sends data to backend
- Backend validates and stores in database
- Event appears in the list
- Students can now see and register for it

**Why it's important:** Central place to manage all college events

### 3. Registration System

**What it does:** Allows students to register for events

**How it works:**
- Student browses events
- Clicks register button
- Fills in team details
- System checks if event has space
- If yes, saves registration
- Updates event's registered count

**Why it's important:** Automates the registration process

### 4. Attendance Tracking

**What it does:** Tracks which students attended which events

**How it works:**
- Admin uses QR code scanner
- Scans student's QR code
- System finds their registration
- Admin marks them as present
- Status saved in database

**Why it's important:** Keeps accurate attendance records

### 5. Certificate Generation

**What it does:** Creates PDF certificates for participants

**How it works:**
- Admin selects event and participants
- System uses jsPDF to create PDF
- Includes student name, event name, date
- PDF is downloaded
- Record saved in database

**Why it's important:** Automates certificate creation, saves time

---

## What Makes This Project Unique

### 1. Complete End-to-End Solution

Unlike many mini projects that only do one thing, this project:
- Has both frontend and backend
- Has a real database
- Has authentication
- Has multiple user roles
- Has multiple features working together

### 2. Real-World Applicability

This isn't just a demo - it could actually be used:
- For college event management
- For workshop registration
- For competition tracking
- For certificate distribution

### 3. Modern Tech Stack

Uses current, popular technologies:
- React (most popular UI library)
- Node.js/Express (most popular backend)
- SQLite (simple but powerful database)
- Tailwind CSS (modern styling approach)

### 4. Security Considerations

Includes security features:
- Input sanitization (prevents attacks)
- Rate limiting (prevents abuse)
- Role-based access (prevents unauthorized access)
- Validation (ensures data quality)

### 5. User Experience

Designed for good UX:
- Clean, professional interface
- Clear navigation
- Responsive design (works on mobile)
- Loading states
- Error handling
- Success messages

---

## Future Improvements (If We Had More Time)

1. **Real QR Code Scanning** - Integrate camera for actual QR scanning
2. **Email Notifications** - Send emails for registration confirmations
3. **Password Hashing** - Store hashed passwords instead of plain text
4. **File Uploads** - Allow uploading event images/banners
5. **Advanced Search** - Better search and filter options
6. **Reports** - Generate reports on registrations, attendance
7. **Calendar View** - Show events in a calendar format
8. **Mobile App** - Create a React Native mobile version

---

## Conclusion

This College Event Management System is a **complete, functional web application** that demonstrates:

- **Full-stack development** (frontend + backend)
- **Database integration** (SQLite)
- **Authentication and authorization** (login, roles)
- **CRUD operations** (Create, Read, Update, Delete)
- **Modern web development practices** (React, Node.js, etc.)
- **Real-world problem solving** (event management)

The project is **well-structured**, **easy to understand**, and **demonstrates practical skills** in web development. It's suitable as a mini project for college as it shows understanding of both frontend and backend development, database management, and system design.

---

## Quick Reference

### Frontend: React + Vite + Tailwind CSS
- **Entry Point:** `src/main.jsx`
- **Main App:** `src/App.jsx`
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **State:** React Context API

### Backend: Node.js + Express + SQLite
- **Entry Point:** `backend/server.js`
- **Database:** SQLite (events.db)
- **API:** RESTful endpoints
- **Security:** Rate limiting, input sanitization

### Database: SQLite
- **Location:** `backend/events.db`
- **Tables:** users, events, registrations, certificates, notifications
- **Access:** better-sqlite3 library

### Key Files to Understand
- `src/App.jsx` - How routing works
- `src/contexts/AuthContext.jsx` - How authentication works
- `backend/server.js` - How the backend works
- `src/pages/AdminDashboard.jsx` - Example of admin page
- `src/pages/StudentDashboard.jsx` - Example of student page

---

**End of Project Documentation**
