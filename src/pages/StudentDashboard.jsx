import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Award, Search } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTypeColor } from '../utils/colors';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    
    const [eventsRes, regsRes, certsRes] = await Promise.all([
      api.getEvents(),
      api.getRegistrationsByStudent(user.id),
      api.getCertificates(user.id)
    ]);
    
    if (eventsRes.success) {
      setEvents(eventsRes.data);
    }
    if (regsRes.success) {
      setRegistrations(regsRes.data);
    }
    if (certsRes.success) {
      setCertificates(certsRes.data);
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
  const myEvents = filteredEvents.filter(event => isRegistered(event.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner message="Loading dashboard..." />
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
            <h1 className="text-2xl font-semibold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Welcome back, {user?.name}!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs uppercase">Available Events</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{availableEvents.length}</p>
                  </div>
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs uppercase">My Registrations</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{registrations.length}</p>
                  </div>
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs uppercase">Certificates</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{certificates.length}</p>
                  </div>
                  <Award className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </Card>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">My Registrations</h2>
            {myEvents.length === 0 ? (
              <Card>
                <div className="p-4 text-center text-gray-600 text-sm">
                  <p>You haven't registered for any events yet.</p>
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
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Team Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myEvents.map((event) => {
                      const registration = registrations.find(reg => reg.eventId === event.id);
                      return (
                        <tr key={event.id} className="border-b border-gray-300 hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">{event.name}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 text-xs font-medium border ${getTypeColor(event.type)}`}>
                              {event.type}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">{event.date}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{registration?.teamName}</td>
                          <td className="px-4 py-2 text-sm text-green-700">Registered</td>
                          <td className="px-4 py-2">
                            <Link to={`/event/${event.id}`}>
                              <Button variant="outline" size="sm">View Details</Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Available Events</h2>
            {availableEvents.length === 0 ? (
              <Card>
                <div className="p-4 text-center text-gray-600 text-sm">
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
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Slots Available</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Deadline</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
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
                          <Link to={`/register/${event.id}`}>
                            <Button variant="primary" size="sm">Register</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
