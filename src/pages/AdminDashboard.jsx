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
            <h1 className="text-2xl font-semibold text-gray-900">Administrator Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Manage events and track registrations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs uppercase">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEvents}</p>
                  </div>
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs uppercase">Total Registrations</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRegistrations}</p>
                  </div>
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs uppercase">Upcoming Events</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.upcomingEvents}</p>
                  </div>
                  <Clock className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs uppercase">Active Events</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeEvents}</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-500" />
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

          <div className="bg-white border border-gray-300">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Event Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Venue</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Registration</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Deadline</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{event.name}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs font-medium border ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">{event.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{event.venue}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{event.registeredTeams}/{event.maxTeams}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{event.deadline}</td>
                    <td className="px-4 py-2">
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
                          <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-700 border border-red-300">Cancelled</span>
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
