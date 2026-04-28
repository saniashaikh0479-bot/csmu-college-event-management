import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ConfirmDialog from '../components/ConfirmDialog';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    const response = await api.getEventById(parseInt(id));
    if (response.success) {
      setEvent(response.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.updateEvent(parseInt(id), event);
      if (response.success) {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      const response = await api.deleteEvent(parseInt(id));
      if (response.success) {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 ml-60 p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Edit Event</h1>
            <p className="text-gray-600 text-sm mt-1">Update event details</p>
          </div>

          <Card className="max-w-3xl">
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900">Event Information</h2>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Event Name"
                    value={event.name}
                    onChange={(e) => setEvent({ ...event, name: e.target.value })}
                    required
                  />

                  <Select
                    label="Event Type"
                    value={event.type}
                    onChange={(e) => setEvent({ ...event, type: e.target.value })}
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
                    value={event.date}
                    onChange={(e) => setEvent({ ...event, date: e.target.value })}
                    required
                  />

                  <Input
                    label="Venue"
                    value={event.venue}
                    onChange={(e) => setEvent({ ...event, venue: e.target.value })}
                    required
                  />

                  <Input
                    label="Team Size"
                    type="number"
                    value={event.teamSize}
                    onChange={(e) => setEvent({ ...event, teamSize: parseInt(e.target.value) })}
                    required
                  />

                  <Input
                    label="Maximum Teams"
                    type="number"
                    value={event.maxTeams}
                    onChange={(e) => setEvent({ ...event, maxTeams: parseInt(e.target.value) })}
                    required
                  />

                  <Input
                    label="Registration Deadline"
                    type="date"
                    value={event.deadline}
                    onChange={(e) => setEvent({ ...event, deadline: e.target.value })}
                    required
                  />

                  <Input
                    label="Contact Email"
                    type="email"
                    value={event.contact}
                    onChange={(e) => setEvent({ ...event, contact: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rules & Guidelines
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors min-h-[100px]"
                    value={event.rules}
                    onChange={(e) => setEvent({ ...event, rules: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-300">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleDelete}
                  >
                    Delete Event
                  </Button>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate('/admin-dashboard')}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </form>
            </Card.Body>
          </Card>
        </main>
      </div>
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone and will also delete all associated registrations."
        confirmText="Delete Event"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default EditEvent;
