import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Users, Calendar, MapPin, Clock } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import PageBackground from '../components/PageBackground';

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();
  const [event, setEvent] = useState(null);
  const [isSports, setIsSports] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    members: '',
    department: '',
    contact: '',
    performanceType: '',
    songName: ''
  });

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    const response = await api.getEventById(parseInt(eventId));
    if (response.success) {
      setEvent(response.data);
      setIsSports(response.data.type === 'sports');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }

    if (!formData.captainName.trim()) {
      newErrors.captainName = 'Captain name is required';
    }

    if (!formData.members.trim()) {
      newErrors.members = 'Team members are required';
    } else {
      const memberList = formData.members.split(',').map(m => m.trim()).filter(m => m);
      if (memberList.length === 0) {
        newErrors.members = 'At least one team member is required';
      }
      if (event && memberList.length > event.teamSize) {
        newErrors.members = `Team cannot exceed ${event.teamSize} members`;
      }
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact.replace(/\s/g, ''))) {
      newErrors.contact = 'Please enter a valid 10-digit contact number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const memberList = formData.members.split(',').map(m => m.trim()).filter(m => m);
      
      const registrationData = {
        eventId: parseInt(eventId),
        studentId: user.id,
        teamName: formData.teamName,
        captainName: formData.captainName,
        members: memberList,
        department: formData.department,
        contact: formData.contact,
        performanceType: formData.performanceType,
        songName: formData.songName
      };

      const response = await api.createRegistration(registrationData);
      if (response.success) {
        success('Registration successful!');
        navigate('/student-dashboard');
      } else {
        error(response.error || 'Failed to register for event');
        setErrors({ submit: response.error || 'Failed to register for event' });
      }
    } catch (err) {
      console.error('Error registering:', err);
      error('An error occurred while registering');
      setErrors({ submit: 'An error occurred while registering' });
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading event details...</p>
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
            <h1 className="text-2xl font-semibold text-gray-900">Register for Event</h1>
            <p className="text-gray-600 text-sm mt-1">{event.name}</p>
          </div>

          <Card className="max-w-3xl">
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
            </Card.Header>
            <Card.Body>
              {errors.submit && (
                <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-2 text-sm">
                  {errors.submit}
                </div>
              )}
              <div className="mb-4 p-3 bg-gray-50 border border-gray-300">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Event Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 font-medium text-gray-900">{event.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Venue:</span>
                    <span className="ml-2 font-medium text-gray-900">{event.venue}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Team Size:</span>
                    <span className="ml-2 font-medium text-gray-900">{event.teamSize} members</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Deadline:</span>
                    <span className="ml-2 font-medium text-gray-900">{event.deadline}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Team Name"
                  placeholder="Enter team name"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  error={errors.teamName}
                  required
                />

                <Input
                  label="Captain Name"
                  placeholder="Enter captain name"
                  value={formData.captainName}
                  onChange={(e) => setFormData({ ...formData, captainName: e.target.value })}
                  error={errors.captainName}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Members (comma-separated)
                  </label>
                  <textarea
                    className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors min-h-[80px] ${errors.members ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Member 1, Member 2, Member 3, ..."
                    value={formData.members}
                    onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                    required
                  />
                  {errors.members && <p className="mt-1 text-sm text-red-600">{errors.members}</p>}
                  {!errors.members && <p className="mt-1 text-sm text-gray-500">Separate members with commas (max {event.teamSize} members)</p>}
                </div>

                <Input
                  label="Department"
                  placeholder="Enter department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  error={errors.department}
                  required
                />

                <Input
                  label="Contact Number"
                  type="tel"
                  placeholder="Enter contact number"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  error={errors.contact}
                  helperText="10-digit mobile number"
                  required
                />

                {!isSports && (
                  <>
                    <Input
                      label="Performance Type"
                      placeholder="e.g., Group Dance, Solo Song, Drama"
                      value={formData.performanceType}
                      onChange={(e) => setFormData({ ...formData, performanceType: e.target.value })}
                    />

                    <Input
                      label="Song/Performance Name"
                      placeholder="Enter song or performance name"
                      value={formData.songName}
                      onChange={(e) => setFormData({ ...formData, songName: e.target.value })}
                    />
                  </>
                )}

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-300">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/student-dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Submit Registration'}
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </main>
      </div>
    </PageBackground>
  );
};

export default EventRegistration;
