import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id, user]);

  const loadData = async () => {
    setLoading(true);
    const eventRes = await api.getEventById(parseInt(id));
    if (eventRes.success) {
      setEvent(eventRes.data);
      if (user) {
        const regsRes = await api.getRegistrationsByStudent(user.id);
        if (regsRes.success) {
          const userReg = regsRes.data.find(reg => reg.eventId === parseInt(id));
          setRegistration(userReg);
        }
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Event not found.</p>
      </div>
    );
  }

  const getTypeColor = (type) => {
    const colors = {
      sports: 'bg-green-50 text-green-700 border-green-300',
      cultural: 'bg-purple-50 text-purple-700 border-purple-300',
      technical: 'bg-blue-50 text-blue-700 border-blue-300',
      workshop: 'bg-yellow-50 text-yellow-700 border-yellow-300'
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 ml-56 p-4">
          <Button
            variant="ghost"
            onClick={() => navigate(isAdmin() ? '/admin-dashboard' : '/student-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="max-w-4xl">
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold text-gray-900">{event.name}</h2>
              </Card.Header>
              <Card.Body>
                <div className="mb-4 p-3 bg-gray-50 border border-gray-300">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 text-sm font-medium border ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    <span className="text-sm text-gray-600">Event ID: {event.id}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 bg-gray-50 border border-gray-300">
                    <p className="text-gray-600 text-xs uppercase">Date</p>
                    <p className="font-medium text-gray-900 text-sm">{event.date}</p>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-300">
                    <p className="text-gray-600 text-xs uppercase">Venue</p>
                    <p className="font-medium text-gray-900 text-sm">{event.venue}</p>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-300">
                    <p className="text-gray-600 text-xs uppercase">Team Size</p>
                    <p className="font-medium text-gray-900 text-sm">{event.teamSize} members</p>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-300">
                    <p className="text-gray-600 text-xs uppercase">Deadline</p>
                    <p className="font-medium text-gray-900 text-sm">{event.deadline}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Registration Status</h3>
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300">
                    <div>
                      <p className="text-gray-600 text-sm">Registered Teams</p>
                      <p className="text-xl font-bold text-gray-900">{event.registeredTeams}/{event.maxTeams}</p>
                    </div>
                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded h-2">
                        <div
                          className="bg-primary-600 h-2 rounded"
                          style={{ width: `${(event.registeredTeams / event.maxTeams) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Rules & Guidelines</h3>
                  <div className="p-3 bg-blue-50 border border-blue-300 text-sm text-gray-700">
                    {event.rules}
                  </div>
                </div>

                {registration && (
                  <div className="mb-6 p-3 bg-green-50 border border-green-300">
                    <h3 className="font-semibold text-green-800 mb-2 text-sm">Your Registration</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-600">Team Name:</span>
                        <span className="ml-2 font-medium text-green-900">{registration.teamName}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Captain:</span>
                        <span className="ml-2 font-medium text-green-900">{registration.captainName}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Department:</span>
                        <span className="ml-2 font-medium text-green-900">{registration.department}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Status:</span>
                        <span className="ml-2 font-medium text-green-900">{registration.attended ? 'Attended' : 'Not Attended'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-300">
                  {!isAdmin() && !registration && event.registeredTeams < event.maxTeams && (
                    <Button onClick={() => navigate(`/register/${event.id}`)}>
                      Register Now
                    </Button>
                  )}
                  {isAdmin() && (
                    <>
                      <Button variant="secondary" onClick={() => navigate(`/participants/${event.id}`)}>
                        View Participants
                      </Button>
                      <Button variant="secondary" onClick={() => navigate(`/attendance/${event.id}`)}>
                        Attendance
                      </Button>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventDetails;
