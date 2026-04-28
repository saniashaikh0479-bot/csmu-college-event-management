import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Calendar, Users, TrendingUp, Clock, Plus, XCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTypeColor } from '../utils/colors';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0, upcomingEvents: 0, activeEvents: 0 });
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [eventsRes, regsRes] = await Promise.all([
      api.getEvents(),
      api.getRegistrations()
    ]);
    
    if (eventsRes.success) {
      setEvents(eventsRes.data);
    }
    if (regsRes.success) {
      setRegistrations(regsRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const upcoming = events.filter(e => new Date(e.date) > new Date()).length;
    const active = events.filter(e => e.status === 'active').length;
    setStats({
      totalEvents: events.length,
      totalRegistrations: registrations.length,
      upcomingEvents: upcoming,
      activeEvents: active
    });
  }, [events, registrations]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 ml-60 p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Administrator Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Manage events and track registrations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEvents}</p>
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
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Registrations</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRegistrations}</p>
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
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Upcoming Events</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.upcomingEvents}</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Active Events</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeEvents}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
            <Link to="/create-event">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Venue</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Registration</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Deadline</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{event.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{event.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{event.venue}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{event.registeredTeams}/{event.maxTeams}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{event.deadline}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Link to={`/participants/${event.id}`}>
                          <Button variant="outline" size="sm">Participants</Button>
                        </Link>
                        <Link to={`/attendance/${event.id}`}>
                          <Button variant="outline" size="sm">Attendance</Button>
                        </Link>
                        <Link to={`/edit-event/${event.id}`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        {event.status !== 'cancelled' && (
                          <Button 
                            variant="danger" 
                            size="sm" 
                            disabled={cancellingId === event.id}
                            onClick={async () => {
                              if (window.confirm(`Cancel event "${event.name}"? This will notify registered students.`)) {
                                setCancellingId(event.id);
                                const res = await api.cancelEvent(event.id);
                                if (res.success) {
                                  loadData();
                                }
                                setCancellingId(null);
                              }
                            }}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        )}
                        {event.status === 'cancelled' && (
                          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200">Cancelled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
