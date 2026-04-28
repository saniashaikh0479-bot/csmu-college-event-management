const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

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

// In-memory data storage (same as mockApi initial data)
let events = [
  {
    id: 1,
    name: 'Inter-College Cricket Tournament',
    date: '2025-05-15',
    venue: 'College Ground',
    teamSize: 11,
    maxTeams: 8,
    registeredTeams: 6,
    deadline: '2025-05-10',
    rules: 'Each team must have 11 players. Matches will be played in T20 format.',
    contact: 'sports_admin@college.edu',
    type: 'sports',
    status: 'active',
    createdAt: '2025-04-20T10:00:00Z'
  },
  {
    id: 2,
    name: 'Dance Competition',
    date: '2025-05-20',
    venue: 'Auditorium',
    teamSize: 5,
    maxTeams: 12,
    registeredTeams: 8,
    deadline: '2025-05-15',
    rules: 'Groups of 3-5 members. Performance time: 5-7 minutes.',
    contact: 'cultural@college.edu',
    type: 'cultural',
    status: 'active',
    createdAt: '2025-04-22T14:00:00Z'
  },
  {
    id: 3,
    name: 'Tech Hackathon',
    date: '2025-06-01',
    venue: 'Computer Lab',
    teamSize: 4,
    maxTeams: 20,
    registeredTeams: 15,
    deadline: '2025-05-25',
    rules: 'Teams of 2-4 members. 24-hour coding challenge.',
    contact: 'tech@college.edu',
    type: 'technical',
    status: 'active',
    createdAt: '2025-04-25T09:00:00Z'
  },
  {
    id: 4,
    name: 'Workshop on AI',
    date: '2025-05-18',
    venue: 'Seminar Hall A',
    teamSize: 1,
    maxTeams: 50,
    registeredTeams: 35,
    deadline: '2025-05-15',
    rules: 'Individual registration only. Certificate provided.',
    contact: 'academic@college.edu',
    type: 'workshop',
    status: 'active',
    createdAt: '2025-04-26T11:00:00Z'
  }
];

let registrations = [
  {
    id: 1,
    eventId: 1,
    studentId: 'STU001',
    teamName: 'Thunderbolts',
    captainName: 'Rahul Sharma',
    members: ['Rahul Sharma', 'Amit Patel', 'Vikram Singh', 'Suresh Kumar', 'Rajesh Verma', 'Deepak Yadav', 'Sunil Mehta', 'Anil Joshi', 'Prakash Reddy', 'Mahesh Desai', 'Karan Thakur'],
    department: 'Computer Science',
    contact: '9876543210',
    attended: false,
    registeredAt: '2025-04-28T10:30:00Z'
  },
  {
    id: 2,
    eventId: 2,
    studentId: 'STU002',
    teamName: 'Rhythm Makers',
    captainName: 'Priya Gupta',
    members: ['Priya Gupta', 'Neha Singh', 'Anita Verma', 'Kavita Rao', 'Pooja Sharma'],
    department: 'Electronics',
    contact: '9876543211',
    performanceType: 'Group Dance',
    songName: 'Nagada Sang Dhol',
    attended: false,
    registeredAt: '2025-04-28T11:00:00Z'
  }
];

let certificates = [
  {
    id: 1,
    eventId: 1,
    studentId: 'STU001',
    type: 'participation',
    issuedAt: '2025-05-16T00:00:00Z'
  }
];

const admins = [
  { id: 1, username: 'principal', password: 'admin123', name: 'Principal', role: 'admin' }
];

const students = [
  { id: 'STU001', email: 'rahul@college.edu', password: 'student123', name: 'Rahul Sharma', department: 'Computer Science', role: 'student' },
  { id: 'STU002', email: 'priya@college.edu', password: 'student123', name: 'Priya Gupta', department: 'Electronics', role: 'student' }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ AUTH ROUTES ============

app.post('/api/auth/admin/login', authLimiter, (req, res) => {
  const { username, password } = req.body;
  const admin = admins.find(a => a.username === username && a.password === password);
  if (admin) {
    const { password: _, ...adminWithoutPassword } = admin;
    res.json({ success: true, user: adminWithoutPassword });
  } else {
    res.json({ success: false, error: 'Invalid credentials' });
  }
});

app.post('/api/auth/student/login', authLimiter, (req, res) => {
  const { email, password } = req.body;
  const student = students.find(s => s.email === email && s.password === password);
  if (student) {
    const { password: _, ...studentWithoutPassword } = student;
    res.json({ success: true, user: studentWithoutPassword });
  } else {
    res.json({ success: false, error: 'Invalid credentials' });
  }
});

// ============ EVENT ROUTES ============

app.get('/api/events', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = paginate(events, page, limit);
  res.json({ success: true, ...result });
});

app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (event) {
    res.json({ success: true, data: event });
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
  
  const newEvent = { ...sanitizedBody, id: Date.now(), createdAt: new Date().toISOString(), registeredTeams: 0 };
  events.push(newEvent);
  res.json({ success: true, data: newEvent });
});

app.put('/api/events/:id', (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const index = events.findIndex(e => e.id === parseInt(req.params.id));
  if (index !== -1) {
    events[index] = { ...events[index], ...sanitizedBody };
    res.json({ success: true, data: events[index] });
  } else {
    res.json({ success: false, error: 'Event not found' });
  }
});

app.delete('/api/events/:id', (req, res) => {
  const index = events.findIndex(e => e.id === parseInt(req.params.id));
  if (index !== -1) {
    events.splice(index, 1);
    res.json({ success: true });
  } else {
    res.json({ success: false, error: 'Event not found' });
  }
});

app.put('/api/events/:id/cancel', (req, res) => {
  const { reason } = req.body;
  const index = events.findIndex(e => e.id === parseInt(req.params.id));
  if (index !== -1) {
    events[index].status = 'cancelled';
    events[index].cancellationReason = reason || '';
    events[index].cancelledAt = new Date().toISOString();
    console.log(`[EVENT] Cancelled event #${events[index].id}: ${events[index].name}`);
    res.json({ success: true, data: events[index] });
  } else {
    res.json({ success: false, error: 'Event not found' });
  }
});

// ============ REGISTRATION ROUTES ============

app.get('/api/registrations', (req, res) => {
  const { eventId } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  let filteredRegistrations = registrations;
  if (eventId) {
    filteredRegistrations = registrations.filter(r => r.eventId === parseInt(eventId));
  }
  
  const result = paginate(filteredRegistrations, page, limit);
  res.json({ success: true, ...result });
});

app.get('/api/registrations/student/:studentId', (req, res) => {
  const studentRegistrations = registrations.filter(r => r.studentId === req.params.studentId);
  res.json({ success: true, data: studentRegistrations });
});

app.post('/api/registrations', (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const validationErrors = validateRegistration(sanitizedBody);
  if (validationErrors.length > 0) {
    return res.json({ success: false, error: validationErrors.join(', ') });
  }
  
  const { eventId, studentId } = sanitizedBody;
  
  // Check for duplicate registration
  const existingRegistration = registrations.find(
    r => r.eventId === eventId && r.studentId === studentId
  );
  
  if (existingRegistration) {
    return res.json({ success: false, error: 'You are already registered for this event' });
  }
  
  const newRegistration = { ...sanitizedBody, id: Date.now(), registeredAt: new Date().toISOString(), attended: false };
  registrations.push(newRegistration);
  
  // Update event registered count
  const eventIndex = events.findIndex(e => e.id === newRegistration.eventId);
  if (eventIndex !== -1) {
    events[eventIndex].registeredTeams++;
  }
  
  res.json({ success: true, data: newRegistration });
});

app.put('/api/registrations/:id/attendance', (req, res) => {
  const { attended } = req.body;
  const index = registrations.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) {
    registrations[index].attended = attended;
    res.json({ success: true, data: registrations[index] });
  } else {
    res.json({ success: false, error: 'Registration not found' });
  }
});

// ============ CERTIFICATE ROUTES ============

app.get('/api/certificates/student/:studentId', (req, res) => {
  const studentCertificates = certificates.filter(c => c.studentId === req.params.studentId);
  res.json({ success: true, data: studentCertificates });
});

app.post('/api/certificates', (req, res) => {
  const newCertificate = { ...req.body, id: Date.now(), issuedAt: new Date().toISOString() };
  certificates.push(newCertificate);
  res.json({ success: true, data: newCertificate });
});

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist', 'index.html'));
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
});
