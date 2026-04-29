import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Award, Search } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import PageBackground from '../components/PageBackground';
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

  const availableEvents = filteredEvents.filter(event => event.registeredTeams < event.maxTeams && !isRegistered(event.id) && event.status === 'active');
  const myEvents = filteredEvents.filter(event => isRegistered(event.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Welcome back, {user?.name}!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Available Events</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{availableEvents.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">My Registrations</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{registrations.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Certificates</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{certificates.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
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
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Team Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myEvents.map((event) => {
                      const registration = registrations.find(reg => reg.eventId === event.id);
                      return (
                        <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{event.name}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getTypeColor(event.type)}`}>
                              {event.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{event.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{registration?.teamName}</td>
                          <td className="px-4 py-3"><span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Registered</span></td>
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
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Venue</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Slots Available</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Deadline</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableEvents.map((event) => (
                      <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{event.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{event.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{event.venue}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{event.maxTeams - event.registeredTeams}/{event.maxTeams}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{event.deadline}</td>
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
    </PageBackground>
  );
};

export default StudentDashboard;
