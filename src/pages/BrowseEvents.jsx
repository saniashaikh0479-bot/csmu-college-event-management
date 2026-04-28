import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTypeColor } from '../utils/colors';

const BrowseEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const eventsRes = await api.getEvents();
    if (eventsRes.success) {
      setEvents(eventsRes.data);
    }
    if (user) {
      const regsRes = await api.getRegistrationsByStudent(user.id);
      if (regsRes.success) {
        setRegistrations(regsRes.data);
      }
    }
    setLoading(false);
  };


  const isRegistered = (eventId) => {
    return registrations.some(reg => reg.eventId === eventId);
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableEvents = filteredEvents.filter(event => event.registeredTeams < event.maxTeams);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner message="Loading events..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 ml-56 p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Browse Events</h1>
            <p className="text-gray-600 text-sm mt-1">Discover and register for upcoming events</p>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Search events by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {availableEvents.length === 0 ? (
            <Card>
              <div className="p-8 text-center text-gray-600">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No events available at the moment.</p>
              </div>
            </Card>
          ) : (
            <div className="bg-white border border-gray-300">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Event Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Venue</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Slots Left</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Deadline</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availableEvents.map((event) => (
                    <tr key={event.id} className="border-b border-gray-300 hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{event.name}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs font-medium border ${getTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{event.date}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{event.venue}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{event.maxTeams - event.registeredTeams}/{event.maxTeams}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{event.deadline}</td>
                      <td className="px-4 py-2">
                        {isRegistered(event.id) ? (
                          <span className="px-2 py-1 text-xs font-medium border bg-green-50 text-green-700 border-green-300">Registered</span>
                        ) : (
                          <Link to={`/register/${event.id}`}>
                            <Button variant="primary" size="sm">Register</Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrowseEvents;
