const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Initialize SQLite database
const dbPath = path.join(__dirname, 'events.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// In production (Replit), allow same-origin requests since frontend is served by backend
const corsOptions = process.env.NODE_ENV === 'production' 
  ? { origin: true, credentials: true }
  : { origin: CORS_ORIGIN, credentials: true };

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: { success: false, error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Initialize database schema
function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'student')),
      department TEXT,
      email TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      venue TEXT NOT NULL,
      team_size INTEGER NOT NULL,
      max_teams INTEGER NOT NULL,
      registered_teams INTEGER DEFAULT 0,
      deadline TEXT NOT NULL,
      rules TEXT NOT NULL,
      contact TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'cancelled')),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      cancelled_at DATETIME,
      cancellation_reason TEXT,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Registrations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      team_name TEXT NOT NULL,
      captain_name TEXT NOT NULL,
      members TEXT NOT NULL,
      department TEXT NOT NULL,
      contact TEXT NOT NULL,
      attended INTEGER DEFAULT 0,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id)
    )
  `);

  // Certificates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id)
    )
  `);

  // Create super admin if not exists
  const superAdmin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
  if (!superAdmin) {
    db.prepare('INSERT INTO users (username, password, name, role, department, email) VALUES (?, ?, ?, ?, ?, ?)')
      .run('admin', 'admin', 'Super Admin', 'admin', 'Administration', 'admin@college.edu');
    console.log('[DB] Super admin account created (username: admin, password: admin)');
  }
}

// Initialize database on startup
initializeDatabase();

// Run migrations for any schema additions
function runMigrations() {
  try {
    db.exec(`ALTER TABLE users ADD COLUMN designation TEXT`);
  } catch (e) {
    // Column already exists — safe to ignore
  }
}
runMigrations();

// Middleware
app.use(limiter);
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Sanitization helper function to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }[char]));
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (Array.isArray(obj[key])) {
        sanitized[key] = obj[key].map(item => typeof item === 'string' ? sanitizeInput(item) : item);
      } else if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeInput(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
  }
  return sanitized;
};

// Validation helper functions
const validateEvent = (eventData) => {
  const errors = [];
  
  if (!eventData.name || eventData.name.trim() === '') {
    errors.push('Event name is required');
  }
  
  if (!eventData.date) {
    errors.push('Event date is required');
  }
  
  if (!eventData.venue || eventData.venue.trim() === '') {
    errors.push('Venue is required');
  }
  
  if (!eventData.teamSize || parseInt(eventData.teamSize) < 1) {
    errors.push('Team size must be at least 1');
  }
  
  if (!eventData.maxTeams || parseInt(eventData.maxTeams) < 1) {
    errors.push('Maximum teams must be at least 1');
  }
  
  if (parseInt(eventData.teamSize) > parseInt(eventData.maxTeams)) {
    errors.push('Team size cannot exceed maximum teams');
  }
  
  if (!eventData.deadline) {
    errors.push('Registration deadline is required');
  }
  
  if (eventData.date && eventData.deadline && new Date(eventData.deadline) > new Date(eventData.date)) {
    errors.push('Deadline must be before event date');
  }
  
  if (!eventData.contact || eventData.contact.trim() === '') {
    errors.push('Contact email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eventData.contact)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!eventData.rules || eventData.rules.trim() === '') {
    errors.push('Rules and guidelines are required');
  }
  
  return errors;
};

const validateRegistration = (registrationData) => {
  const errors = [];
  
  if (!registrationData.eventId) {
    errors.push('Event ID is required');
  }
  
  if (!registrationData.studentId) {
    errors.push('Student ID is required');
  }
  
  if (!registrationData.teamName || registrationData.teamName.trim() === '') {
    errors.push('Team name is required');
  }
  
  if (!registrationData.captainName || registrationData.captainName.trim() === '') {
    errors.push('Captain name is required');
  }
  
  if (!registrationData.members || registrationData.members.length === 0) {
    errors.push('At least one team member is required');
  }
  
  if (!registrationData.department || registrationData.department.trim() === '') {
    errors.push('Department is required');
  }
  
  if (!registrationData.contact || registrationData.contact.trim() === '') {
    errors.push('Contact number is required');
  } else if (!/^\d{10}$/.test(registrationData.contact.replace(/\s/g, ''))) {
    errors.push('Please enter a valid 10-digit contact number');
  }
  
  return errors;
};

// Pagination helper function
const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = array.slice(startIndex, endIndex);
  return {
    data,
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit)
    }
  };
};


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ AUTH ROUTES ============

app.post('/api/auth/admin/login', authLimiter, (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND role = ?').get(username, 'admin');
  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.json({ success: false, error: 'Invalid credentials' });
  }
});

app.post('/api/auth/student/login', authLimiter, (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND role = ?').get(username, 'student');
  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.json({ success: false, error: 'Invalid credentials' });
  }
});

// ============ EVENT ROUTES ============

app.get('/api/events', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  const events = db.prepare('SELECT * FROM events ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset);
  const total = db.prepare('SELECT COUNT(*) as count FROM events').get().count;
  
  res.json({ 
    success: true, 
    data: events.map(e => ({
      ...e,
      teamSize: e.team_size,
      maxTeams: e.max_teams,
      registeredTeams: e.registered_teams,
      createdAt: e.created_at,
      cancelledAt: e.cancelled_at,
      cancellationReason: e.cancellation_reason
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

app.get('/api/events/:id', (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (event) {
    res.json({ success: true, data: {
      ...event,
      teamSize: event.team_size,
      maxTeams: event.max_teams,
      registeredTeams: event.registered_teams,
      createdAt: event.created_at,
      cancelledAt: event.cancelled_at,
      cancellationReason: event.cancellation_reason
    }});
  } else {
    res.json({ success: false, error: 'Event not found' });
  }
});

app.post('/api/events', (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const validationErrors = validateEvent(sanitizedBody);
  if (validationErrors.length > 0) {
    return res.json({ success: false, error: validationErrors.join(', ') });
  }
  
  const result = db.prepare(`
    INSERT INTO events (name, date, venue, team_size, max_teams, registered_teams, deadline, rules, contact, type, status, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    sanitizedBody.name,
    sanitizedBody.date,
    sanitizedBody.venue,
    sanitizedBody.teamSize,
    sanitizedBody.maxTeams,
    0,
    sanitizedBody.deadline,
    sanitizedBody.rules,
    sanitizedBody.contact,
    sanitizedBody.type,
    'active',
    req.body.createdBy || null
  );
  
  const newEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
  res.json({ success: true, data: {
    ...newEvent,
    teamSize: newEvent.team_size,
    maxTeams: newEvent.max_teams,
    registeredTeams: newEvent.registered_teams,
    createdAt: newEvent.created_at
  }});
});

app.put('/api/events/:id', (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.json({ success: false, error: 'Event not found' });
  }
  
  db.prepare(`
    UPDATE events SET name = ?, date = ?, venue = ?, team_size = ?, max_teams = ?, 
    deadline = ?, rules = ?, contact = ?, type = ? WHERE id = ?
  `).run(
    sanitizedBody.name,
    sanitizedBody.date,
    sanitizedBody.venue,
    sanitizedBody.teamSize,
    sanitizedBody.maxTeams,
    sanitizedBody.deadline,
    sanitizedBody.rules,
    sanitizedBody.contact,
    sanitizedBody.type,
    req.params.id
  );
  
  const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: {
    ...updated,
    teamSize: updated.team_size,
    maxTeams: updated.max_teams,
    registeredTeams: updated.registered_teams,
    createdAt: updated.created_at
  }});
});

app.delete('/api/events/:id', (req, res) => {
  const result = db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  if (result.changes > 0) {
    res.json({ success: true });
  } else {
    res.json({ success: false, error: 'Event not found' });
  }
});

app.put('/api/events/:id/cancel', (req, res) => {
  const { reason } = req.body;
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.json({ success: false, error: 'Event not found' });
  }
  
  db.prepare(`
    UPDATE events SET status = 'cancelled', cancellation_reason = ?, cancelled_at = ? WHERE id = ?
  `).run(reason || '', new Date().toISOString(), req.params.id);
  
  const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  console.log(`[EVENT] Cancelled event #${updated.id}: ${updated.name}`);
  res.json({ success: true, data: {
    ...updated,
    teamSize: updated.team_size,
    maxTeams: updated.max_teams,
    registeredTeams: updated.registered_teams,
    createdAt: updated.created_at,
    cancelledAt: updated.cancelled_at,
    cancellationReason: updated.cancellation_reason
  }});
});

// ============ REGISTRATION ROUTES ============

app.get('/api/registrations', (req, res) => {
  const { eventId } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  let query = 'SELECT r.*, e.name as event_name, u.name as student_name FROM registrations r JOIN events e ON r.event_id = e.id JOIN users u ON r.student_id = u.id';
  let params = [];
  
  if (eventId) {
    query += ' WHERE r.event_id = ?';
    params.push(eventId);
  }
  
  query += ' ORDER BY r.registered_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  const registrations = db.prepare(query).all(...params);
  
  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM registrations';
  let countParams = [];
  if (eventId) {
    countQuery += ' WHERE event_id = ?';
    countParams.push(eventId);
  }
  const total = db.prepare(countQuery).get(...countParams)?.count || 0;
  
  res.json({ 
    success: true,
    data: registrations.map(r => ({
      ...r,
      eventId: r.event_id,
      studentId: r.student_id,
      teamName: r.team_name,
      captainName: r.captain_name,
      registeredAt: r.registered_at,
      eventName: r.event_name,
      studentName: r.student_name
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

app.get('/api/registrations/student/:studentId', (req, res) => {
  const registrations = db.prepare(`
    SELECT r.*, e.name as event_name, e.date as event_date, e.venue as event_venue, e.type as event_type
    FROM registrations r 
    JOIN events e ON r.event_id = e.id 
    WHERE r.student_id = ?
    ORDER BY r.registered_at DESC
  `).all(req.params.studentId);
  
  res.json({ success: true, data: registrations.map(r => ({
    ...r,
    eventId: r.event_id,
    studentId: r.student_id,
    teamName: r.team_name,
    captainName: r.captain_name,
    registeredAt: r.registered_at,
    eventName: r.event_name,
    eventDate: r.event_date,
    eventVenue: r.event_venue,
    eventType: r.event_type
  })) });
});

app.post('/api/registrations', (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const validationErrors = validateRegistration(sanitizedBody);
  if (validationErrors.length > 0) {
    return res.json({ success: false, error: validationErrors.join(', ') });
  }
  
  const { eventId, studentId } = sanitizedBody;
  
  // Check for duplicate registration
  const existing = db.prepare('SELECT * FROM registrations WHERE event_id = ? AND student_id = ?').get(eventId, studentId);
  if (existing) {
    return res.json({ success: false, error: 'You are already registered for this event' });
  }
  
  // Check if event exists and has capacity
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
  if (!event) {
    return res.json({ success: false, error: 'Event not found' });
  }
  
  if (event.registered_teams >= event.max_teams) {
    return res.json({ success: false, error: 'Event is fully booked' });
  }
  
  const result = db.prepare(`
    INSERT INTO registrations (event_id, student_id, team_name, captain_name, members, department, contact)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    eventId,
    studentId,
    sanitizedBody.teamName,
    sanitizedBody.captainName,
    JSON.stringify(sanitizedBody.members),
    sanitizedBody.department,
    sanitizedBody.contact
  );
  
  // Update event registered count
  db.prepare('UPDATE events SET registered_teams = registered_teams + 1 WHERE id = ?').run(eventId);
  
  const newRegistration = db.prepare('SELECT * FROM registrations WHERE id = ?').get(result.lastInsertRowid);
  res.json({ success: true, data: {
    ...newRegistration,
    eventId: newRegistration.event_id,
    studentId: newRegistration.student_id,
    teamName: newRegistration.team_name,
    captainName: newRegistration.captain_name,
    members: JSON.parse(newRegistration.members),
    registeredAt: newRegistration.registered_at
  }});
});

app.put('/api/registrations/:id/attendance', (req, res) => {
  const { attended } = req.body;
  const existing = db.prepare('SELECT * FROM registrations WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.json({ success: false, error: 'Registration not found' });
  }
  
  db.prepare('UPDATE registrations SET attended = ? WHERE id = ?').run(attended ? 1 : 0, req.params.id);
  
  const updated = db.prepare('SELECT * FROM registrations WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: {
    ...updated,
    eventId: updated.event_id,
    studentId: updated.student_id,
    teamName: updated.team_name,
    captainName: updated.captain_name,
    members: JSON.parse(updated.members),
    registeredAt: updated.registered_at
  }});
});

// ============ USER MANAGEMENT ROUTES ============

// Get all users (admin only)
app.get('/api/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset);
  const total = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  
  res.json({ 
    success: true, 
    data: users.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    }),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// Get users by role
app.get('/api/users/role/:role', (req, res) => {
  const users = db.prepare('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC').all(req.params.role);
  res.json({ success: true, data: users.map(u => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  }) });
});

// Student self-registration (public)
app.post('/api/auth/register', authLimiter, (req, res) => {
  const { username, password, name, department, email } = req.body;

  if (!username || !password || !name) {
    return res.json({ success: false, error: 'Username, password, and name are required' });
  }
  if (username.length < 3) {
    return res.json({ success: false, error: 'Username must be at least 3 characters' });
  }
  if (password.length < 6) {
    return res.json({ success: false, error: 'Password must be at least 6 characters' });
  }

  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.json({ success: false, error: 'Username already taken. Please choose another.' });
  }

  if (email) {
    const existingEmail = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingEmail) {
      return res.json({ success: false, error: 'Email already registered' });
    }
  }

  const result = db.prepare(`
    INSERT INTO users (username, password, name, role, department, email)
    VALUES (?, ?, ?, 'student', ?, ?)
  `).run(username, password, name, department || null, email || null);

  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ success: true, data: userWithoutPassword });
});

// Create new user (admin only)
app.post('/api/users', (req, res) => {
  const { username, password, name, role, department, email, designation } = req.body;
  
  // Validation
  if (!username || !password || !name || !role) {
    return res.json({ success: false, error: 'Username, password, name, and role are required' });
  }
  
  if (!['admin', 'student'].includes(role)) {
    return res.json({ success: false, error: 'Role must be either admin or student' });
  }
  
  // Check for duplicate username
  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.json({ success: false, error: 'Username already exists' });
  }
  
  // Check for duplicate email if provided
  if (email) {
    const existingEmail = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingEmail) {
      return res.json({ success: false, error: 'Email already exists' });
    }
  }
  
  const result = db.prepare(`
    INSERT INTO users (username, password, name, role, department, email, designation)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(username, password, name, role, department || null, email || null, designation || null);
  
  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ success: true, data: userWithoutPassword });
});

// Update user (admin only)
app.put('/api/users/:id', (req, res) => {
  const { name, department, email, role, designation, password } = req.body;
  
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.json({ success: false, error: 'User not found' });
  }

  // Prevent changing super admin's role
  if (parseInt(req.params.id) === 1 && role && role !== 'admin') {
    return res.json({ success: false, error: 'Cannot change super admin role' });
  }

  if (role && !['admin', 'student'].includes(role)) {
    return res.json({ success: false, error: 'Role must be either admin or student' });
  }
  
  // Check for duplicate email if updating
  if (email && email !== existing.email) {
    const existingEmail = db.prepare('SELECT * FROM users WHERE email = ? AND id != ?').get(email, req.params.id);
    if (existingEmail) {
      return res.json({ success: false, error: 'Email already exists' });
    }
  }
  
  db.prepare(`
    UPDATE users SET name = ?, department = ?, email = ?, role = ?, designation = ?, password = ? WHERE id = ?
  `).run(
    name || existing.name,
    department !== undefined ? department : existing.department,
    email !== undefined ? email : existing.email,
    role || existing.role,
    designation !== undefined ? designation : existing.designation,
    password && password.trim() ? password : existing.password,
    req.params.id
  );
  
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  const { password: _, ...userWithoutPassword } = updated;
  res.json({ success: true, data: userWithoutPassword });
});

// Delete user (admin only)
app.delete('/api/users/:id', (req, res) => {
  // Prevent deleting super admin (id 1)
  if (parseInt(req.params.id) === 1) {
    return res.json({ success: false, error: 'Cannot delete super admin account' });
  }
  
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  if (result.changes > 0) {
    res.json({ success: true });
  } else {
    res.json({ success: false, error: 'User not found' });
  }
});

// ============ CERTIFICATE ROUTES ============

app.get('/api/certificates/student/:studentId', (req, res) => {
  const certificates = db.prepare(`
    SELECT c.*, e.name as event_name, e.date as event_date
    FROM certificates c 
    JOIN events e ON c.event_id = e.id 
    WHERE c.student_id = ?
    ORDER BY c.issued_at DESC
  `).all(req.params.studentId);
  
  res.json({ success: true, data: certificates.map(c => ({
    ...c,
    eventId: c.event_id,
    studentId: c.student_id,
    eventName: c.event_name,
    eventDate: c.event_date,
    issuedAt: c.issued_at
  })) });
});

app.post('/api/certificates', (req, res) => {
  const result = db.prepare(`
    INSERT INTO certificates (event_id, student_id, type)
    VALUES (?, ?, ?)
  `).run(req.body.eventId, req.body.studentId, req.body.type);
  
  const newCertificate = db.prepare('SELECT * FROM certificates WHERE id = ?').get(result.lastInsertRowid);
  res.json({ success: true, data: {
    ...newCertificate,
    eventId: newCertificate.event_id,
    studentId: newCertificate.student_id,
    issuedAt: newCertificate.issued_at
  }});
});

// Serve static frontend when dist folder exists (production build)
const fs = require('fs');
const distPath = path.join(__dirname, '../dist');

if (fs.existsSync(distPath)) {
  // Serve static assets with caching
  app.use(express.static(distPath, {
    index: false,
    maxAge: '1d'
  }));
  // Serve index.html with no-cache so the SPA always gets the latest shell
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
});
