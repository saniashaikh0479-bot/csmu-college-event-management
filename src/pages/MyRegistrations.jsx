import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTypeColor } from '../utils/colors';

const MyRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    
    const [regsRes, eventsRes] = await Promise.all([
      api.getRegistrationsByStudent(user.id),
      api.getEvents()
    ]);
    
    if (regsRes.success) {
      setRegistrations(regsRes.data);
    }
    if (eventsRes.success) {
      setEvents(eventsRes.data);
    }
    setLoading(false);
  };


  const getEventForReg = (eventId) => {
    return events.find(e => e.id === eventId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading registrations..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 ml-60 p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">My Registrations</h1>
            <p className="text-gray-600 text-sm mt-1">Events you have registered for</p>
          </div>

          {registrations.length === 0 ? (
            <Card>
              <div className="p-8 text-center text-gray-600">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>You haven't registered for any events yet.</p>
                <Link to="/events" className="mt-3 inline-block">
                  <Button variant="primary" size="sm">Browse Events</Button>
                </Link>
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
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Department</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Attendance</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => {
                    const event = getEventForReg(reg.eventId);
                    if (!event) return null;
                    return (
                      <tr key={reg.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{event.name}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 text-xs font-medium border ${getTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">{event.date}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{reg.teamName}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{reg.department}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 text-xs font-medium border ${reg.attended ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-50 text-gray-700 border-gray-300'}`}>
                            {reg.attended ? 'Attended' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <Link to={`/event/${event.id}`}>
                            <Button variant="outline" size="sm">View Event</Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyRegistrations;
