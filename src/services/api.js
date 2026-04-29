const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const api = {
  registerStudent: async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Failed to register. Please try again.' };
    }
  },

  loginAdmin: async (username, password) => {
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

  loginStudent: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/student/login`, {
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

  getEvents: async () => {
    try {
      const response = await fetch(`${API_BASE}/events`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get events error:', error);
      return { success: false, error: 'Failed to load events. Please try again.' };
    }
  },

  getEventById: async (eventId) => {
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get event error:', error);
      return { success: false, error: 'Failed to load event details. Please try again.' };
    }
  },

  createEvent: async (eventData) => {
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

  archiveEvent: async (eventId) => {
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}/archive`, {
        method: 'PUT'
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Archive event error:', error);
      return { success: false, error: 'Failed to archive event. Please try again.' };
    }
  },

  getRegistrations: async (eventId) => {
    try {
      const url = eventId !== undefined
        ? `${API_BASE}/registrations?eventId=${eventId}`
        : `${API_BASE}/registrations`;
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get registrations error:', error);
      return { success: false, error: 'Failed to load registrations. Please try again.' };
    }
  },

  getRegistrationsByStudent: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE}/registrations/student/${studentId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get student registrations error:', error);
      return { success: false, error: 'Failed to load registrations. Please try again.' };
    }
  },

  createRegistration: async (registrationData) => {
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

  cancelRegistration: async (registrationId) => {
    try {
      const response = await fetch(`${API_BASE}/registrations/${registrationId}`, {
        method: 'DELETE'
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Cancel registration error:', error);
      return { success: false, error: 'Failed to cancel registration. Please try again.' };
    }
  },

  generateCertificate: async (certificateData) => {
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
    try {
      const response = await fetch(`${API_BASE}/certificates/student/${studentId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get certificates error:', error);
      return { success: false, error: 'Failed to load certificates. Please try again.' };
    }
  },

  deleteCertificate: async (certificateId) => {
    try {
      const response = await fetch(`${API_BASE}/certificates/${certificateId}`, {
        method: 'DELETE'
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Delete certificate error:', error);
      return { success: false, error: 'Failed to delete certificate. Please try again.' };
    }
  },

  revokeCertificate: async (certificateId, reason) => {
    try {
      const response = await fetch(`${API_BASE}/certificates/${certificateId}/revoke`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Revoke certificate error:', error);
      return { success: false, error: 'Failed to revoke certificate. Please try again.' };
    }
  },

  // Notification endpoints
  getNotifications: async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/${userId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get notifications error:', error);
      return { success: false, error: 'Failed to load notifications. Please try again.' };
    }
  },

  markNotificationRead: async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Mark notification read error:', error);
      return { success: false, error: 'Failed to update notification. Please try again.' };
    }
  },

  markAllNotificationsRead: async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/${userId}/read-all`, {
        method: 'PUT'
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Mark all notifications read error:', error);
      return { success: false, error: 'Failed to update notifications. Please try again.' };
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Delete notification error:', error);
      return { success: false, error: 'Failed to delete notification. Please try again.' };
    }
  },

  // User management endpoints
  getUsers: async () => {
    try {
      const response = await fetch(`${API_BASE}/users`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get users error:', error);
      return { success: false, error: 'Failed to load users. Please try again.' };
    }
  },

  getUsersByRole: async (role) => {
    try {
      const response = await fetch(`${API_BASE}/users/role/${role}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get users by role error:', error);
      return { success: false, error: 'Failed to load users. Please try again.' };
    }
  },

  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false, error: 'Failed to create user. Please try again.' };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Failed to update user. Please try again.' };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE'
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Delete user error:', error);
      return { success: false, error: 'Failed to delete user. Please try again.' };
    }
  }
};
