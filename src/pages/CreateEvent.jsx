import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PageBackground from '../components/PageBackground';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    venue: '',
    teamSize: '',
    maxTeams: '',
    deadline: '',
    type: 'sports',
    rules: '',
    contact: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    }

    if (!formData.teamSize || parseInt(formData.teamSize) < 1) {
      newErrors.teamSize = 'Team size must be at least 1';
    }

    if (!formData.maxTeams || parseInt(formData.maxTeams) < 1) {
      newErrors.maxTeams = 'Maximum teams must be at least 1';
    }

    if (parseInt(formData.teamSize) > parseInt(formData.maxTeams)) {
      newErrors.teamSize = 'Team size cannot exceed maximum teams';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Registration deadline is required';
    }

    if (formData.date && formData.deadline && new Date(formData.deadline) > new Date(formData.date)) {
      newErrors.deadline = 'Deadline must be before event date';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact)) {
      newErrors.contact = 'Please enter a valid email address';
    }

    if (!formData.rules.trim()) {
      newErrors.rules = 'Rules and guidelines are required';
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
      const eventData = {
        ...formData,
        teamSize: parseInt(formData.teamSize),
        maxTeams: parseInt(formData.maxTeams),
        registeredTeams: 0,
        status: 'active'
      };
      
      const response = await api.createEvent(eventData);
      if (response.success) {
        success('Event created successfully!');
        navigate('/admin-dashboard');
      } else {
        error(response.error || 'Failed to create event');
        setErrors({ submit: response.error || 'Failed to create event' });
      }
    } catch (err) {
      console.error('Error creating event:', err);
      error('An error occurred while creating the event');
      setErrors({ submit: 'An error occurred while creating the event' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageBackground>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Create New Event</h1>
            <p className="text-gray-600 text-sm mt-1">Fill in the details to create a new event</p>
          </div>

          <Card className="max-w-3xl">
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900">Event Information</h2>
            </Card.Header>
            <Card.Body>
              {errors.submit && (
                <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-2 text-sm">
                  {errors.submit}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Event Name"
                    placeholder="Enter event name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    required
                  />

                  <Select
                    label="Event Type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="sports">Sports</option>
                    <option value="cultural">Cultural</option>
                    <option value="technical">Technical</option>
                    <option value="workshop">Workshop</option>
                  </Select>

                  <Input
                    label="Event Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    error={errors.date}
                    required
                  />

                  <Input
                    label="Venue"
                    placeholder="Enter venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    error={errors.venue}
                    required
                  />

                  <Input
                    label="Team Size"
                    type="number"
                    placeholder="Number of members per team"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    error={errors.teamSize}
                    helperText="Minimum 1 member per team"
                    required
                  />

                  <Input
                    label="Maximum Teams"
                    type="number"
                    placeholder="Maximum number of teams"
                    value={formData.maxTeams}
                    onChange={(e) => setFormData({ ...formData, maxTeams: e.target.value })}
                    error={errors.maxTeams}
                    helperText="Maximum number of teams that can register"
                    required
                  />

                  <Input
                    label="Registration Deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    error={errors.deadline}
                    helperText="Must be before event date"
                    required
                  />

                  <Input
                    label="Contact Email"
                    type="email"
                    placeholder="contact@college.edu"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    error={errors.contact}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rules & Guidelines
                  </label>
                  <textarea
                    className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors min-h-[100px] ${errors.rules ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Enter event rules and guidelines"
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    required
                  />
                  {errors.rules && <p className="mt-1 text-sm text-red-600">{errors.rules}</p>}
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-300">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/admin-dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Event'}
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

export default CreateEvent;
