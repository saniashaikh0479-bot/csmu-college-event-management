// Mock API service with localStorage persistence

const STORAGE_KEYS = {
  EVENTS: 'college_events_events',
  REGISTRATIONS: 'college_events_registrations',
  CERTIFICATES: 'college_events_certificates'
};

// Initial mock data
const initialEvents = [
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

const initialRegistrations = [
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

const initialCertificates = [
  {
    id: 1,
    eventId: 1,
    studentId: 'STU001',
    type: 'participation',
    issuedAt: '2025-05-16T00:00:00Z'
  }
];

// Load from localStorage or use initial data
let mockEvents = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS)) || initialEvents;
let mockRegistrations = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) || initialRegistrations;
let mockCertificates = JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTIFICATES)) || initialCertificates;

// Save to localStorage
const saveEvents = () => localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(mockEvents));
const saveRegistrations = () => localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(mockRegistrations));
const saveCertificates = () => localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(mockCertificates));

const mockAdmins = [
  { id: 1, username: 'principal', password: 'admin123', name: 'Principal', role: 'principal' }
];

const mockStudents = [
  { id: 'STU001', email: 'rahul@college.edu', password: 'student123', name: 'Rahul Sharma', department: 'Computer Science', role: 'student' },
  { id: 'STU002', email: 'priya@college.edu', password: 'student123', name: 'Priya Gupta', department: 'Electronics', role: 'student' }
];

// Simulate API calls with delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Auth
  loginAdmin: async (username, password) => {
    await delay(500);
    const admin = mockAdmins.find(a => a.username === username && a.password === password);
    if (admin) {
      const { password: _, ...adminWithoutPassword } = admin;
      return { success: true, user: adminWithoutPassword };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  loginStudent: async (email, password) => {
    await delay(500);
    const student = mockStudents.find(s => s.email === email && s.password === password);
    if (student) {
      const { password: _, ...studentWithoutPassword } = student;
      return { success: true, user: studentWithoutPassword };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  // Events
  getEvents: async () => {
    await delay(300);
    return { success: true, data: mockEvents };
  },

  getEventById: async (eventId) => {
    await delay(200);
    const event = mockEvents.find(e => e.id === eventId);
    if (event) {
      return { success: true, data: event };
    }
    return { success: false, error: 'Event not found' };
  },

  createEvent: async (eventData) => {
    await delay(400);
    const newEvent = { ...eventData, id: Date.now(), createdAt: new Date().toISOString(), registeredTeams: 0 };
    mockEvents.push(newEvent);
    saveEvents();
    return { success: true, data: newEvent };
  },

  updateEvent: async (eventId, eventData) => {
    await delay(400);
    const index = mockEvents.findIndex(e => e.id === eventId);
    if (index !== -1) {
      mockEvents[index] = { ...mockEvents[index], ...eventData };
      saveEvents();
      return { success: true, data: mockEvents[index] };
    }
    return { success: false, error: 'Event not found' };
  },

  deleteEvent: async (eventId) => {
    await delay(300);
    const index = mockEvents.findIndex(e => e.id === eventId);
    if (index !== -1) {
      mockEvents.splice(index, 1);
      saveEvents();
      return { success: true };
    }
    return { success: false, error: 'Event not found' };
  },

  // Registrations
  getRegistrations: async (eventId) => {
    await delay(300);
    const eventRegistrations = mockRegistrations.filter(r => r.eventId === eventId);
    return { success: true, data: eventRegistrations };
  },

  getRegistrationsByStudent: async (studentId) => {
    await delay(300);
    const studentRegistrations = mockRegistrations.filter(r => r.studentId === studentId);
    return { success: true, data: studentRegistrations };
  },

  createRegistration: async (registrationData) => {
    await delay(400);
    const { eventId, studentId } = registrationData;
    
    // Check for duplicate registration
    const existingRegistration = mockRegistrations.find(
      r => r.eventId === eventId && r.studentId === studentId
    );
    
    if (existingRegistration) {
      return { success: false, error: 'You are already registered for this event' };
    }
    
    const newRegistration = { 
      ...registrationData, 
      id: Date.now(), 
      registeredAt: new Date().toISOString(), 
      attended: false 
    };
    mockRegistrations.push(newRegistration);
    saveRegistrations();
    
    // Update event registered count
    const eventIndex = mockEvents.findIndex(e => e.id === newRegistration.eventId);
    if (eventIndex !== -1) {
      mockEvents[eventIndex].registeredTeams++;
      saveEvents();
    }
    
    return { success: true, data: newRegistration };
  },

  updateAttendance: async (registrationId, attended) => {
    await delay(300);
    const index = mockRegistrations.findIndex(r => r.id === registrationId);
    if (index !== -1) {
      mockRegistrations[index].attended = attended;
      saveRegistrations();
      return { success: true, data: mockRegistrations[index] };
    }
    return { success: false, error: 'Registration not found' };
  },

  // Certificates
  generateCertificate: async (certificateData) => {
    await delay(500);
    const newCertificate = { ...certificateData, id: Date.now(), issuedAt: new Date().toISOString() };
    mockCertificates.push(newCertificate);
    saveCertificates();
    return { success: true, data: newCertificate };
  },

  getCertificates: async (studentId) => {
    await delay(300);
    const studentCertificates = mockCertificates.filter(c => c.studentId === studentId);
    return { success: true, data: studentCertificates };
  },

  // Reset data (for testing)
  resetData: () => {
    mockEvents = initialEvents;
    mockRegistrations = initialRegistrations;
    mockCertificates = initialCertificates;
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
  }
};
