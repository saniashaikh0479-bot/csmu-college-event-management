const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Simulate API calls with delays (for consistency with mockApi)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle API responses consistently
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const api = {
  // Auth
  loginAdmin: async (username, password) => {
    await delay(500);
    try {
      const response = await fetch(`${API_BASE}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Failed to connect to server. Please try again.' };
    }
  },

  loginStudent: async (email, password) => {
    await delay(500);
    try {
      const response = await fetch(`${API_BASE}/auth/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Failed to connect to server. Please try again.' };
    }
  },

  // Events
  getEvents: async () => {
    await delay(300);
    try {
      const response = await fetch(`${API_BASE}/events`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get events error:', error);
      return { success: false, error: 'Failed to load events. Please try again.' };
    }
  },

  getEventById: async (eventId) => {
    await delay(200);
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get event error:', error);
      return { success: false, error: 'Failed to load event details. Please try again.' };
    }
  },

  createEvent: async (eventData) => {
    await delay(400);
    try {
      const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Create event error:', error);
      return { success: false, error: 'Failed to create event. Please try again.' };
    }
  },

  updateEvent: async (eventId, eventData) => {
    await delay(400);
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Update event error:', error);
      return { success: false, error: 'Failed to update event. Please try again.' };
    }
  },

  deleteEvent: async (eventId) => {
    await delay(300);
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}`, {
        method: 'DELETE'
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Delete event error:', error);
      return { success: false, error: 'Failed to delete event. Please try again.' };
    }
  },

  cancelEvent: async (eventId, reason = '') => {
    await delay(300);
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Cancel event error:', error);
      return { success: false, error: 'Failed to cancel event. Please try again.' };
    }
  },

  // Registrations
  getRegistrations: async (eventId) => {
    await delay(300);
    try {
      const response = await fetch(`${API_BASE}/registrations?eventId=${eventId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get registrations error:', error);
      return { success: false, error: 'Failed to load registrations. Please try again.' };
    }
  },

  getRegistrationsByStudent: async (studentId) => {
    await delay(300);
    try {
      const response = await fetch(`${API_BASE}/registrations/student/${studentId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get student registrations error:', error);
      return { success: false, error: 'Failed to load registrations. Please try again.' };
    }
  },

  createRegistration: async (registrationData) => {
    await delay(400);
    try {
      const response = await fetch(`${API_BASE}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Create registration error:', error);
      return { success: false, error: 'Failed to register for event. Please try again.' };
    }
  },

  updateAttendance: async (registrationId, attended) => {
    await delay(300);
    try {
      const response = await fetch(`${API_BASE}/registrations/${registrationId}/attendance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attended })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Update attendance error:', error);
      return { success: false, error: 'Failed to update attendance. Please try again.' };
    }
  },

  // Certificates
  generateCertificate: async (certificateData) => {
    await delay(500);
    try {
      const response = await fetch(`${API_BASE}/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificateData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Generate certificate error:', error);
      return { success: false, error: 'Failed to generate certificate. Please try again.' };
    }
  },

  getCertificates: async (studentId) => {
    await delay(300);
    try {
      const response = await fetch(`${API_BASE}/certificates/student/${studentId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get certificates error:', error);
      return { success: false, error: 'Failed to load certificates. Please try again.' };
    }
  }
};
