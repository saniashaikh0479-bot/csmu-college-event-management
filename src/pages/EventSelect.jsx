import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import PageBackground from '../components/PageBackground';

const EventSelect = ({ title, description, actionLabel, actionPath }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const response = await api.getEvents();
    if (response.success) {
      setEvents(response.data);
    }
    setLoading(false);
  };

  const getTypeColor = (type) => {
    const colors = {
      sports: 'bg-green-50 text-green-700 border-green-300',
      cultural: 'bg-purple-50 text-purple-700 border-purple-300',
      technical: 'bg-blue-50 text-blue-700 border-blue-300',
      workshop: 'bg-yellow-50 text-yellow-700 border-yellow-300'
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="text-gray-600 text-sm mt-1">{description}</p>
          </div>

          {events.length === 0 ? (
            <Card>
              <div className="p-8 text-center text-gray-600">
                <p>No events available. Create an event first.</p>
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
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
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
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs font-medium border ${event.status === 'active' ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-50 text-gray-700 border-gray-300'}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <Link to={`${actionPath}/${event.id}`}>
                          <Button variant="primary" size="sm">{actionLabel}</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </PageBackground>
  );
};

export default EventSelect;
