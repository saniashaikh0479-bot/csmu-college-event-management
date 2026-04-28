import { createContext, useContext, useState } from 'react';

const EventContext = createContext(null);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const addEvent = (event) => {
    const newEvent = { ...event, id: Date.now(), createdAt: new Date().toISOString() };
    setEvents([...events, newEvent]);
    return newEvent;
  };

  const updateEvent = (eventId, updatedData) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, ...updatedData } : event
    ));
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const getEventById = (eventId) => {
    return events.find(event => event.id === eventId);
  };

  const addRegistration = (registration) => {
    const newRegistration = { ...registration, id: Date.now(), registeredAt: new Date().toISOString() };
    setRegistrations([...registrations, newRegistration]);
    return newRegistration;
  };

  const getRegistrationsByEvent = (eventId) => {
    return registrations.filter(reg => reg.eventId === eventId);
  };

  const getRegistrationsByStudent = (studentId) => {
    return registrations.filter(reg => reg.studentId === studentId);
  };

  const updateAttendance = (registrationId, attended) => {
    setRegistrations(registrations.map(reg =>
      reg.id === registrationId ? { ...reg, attended } : reg
    ));
  };

  return (
    <EventContext.Provider value={{
      events,
      registrations,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventById,
      addRegistration,
      getRegistrationsByEvent,
      getRegistrationsByStudent,
      updateAttendance,
      setEvents,
      setRegistrations
    }}>
      {children}
    </EventContext.Provider>
  );
};
