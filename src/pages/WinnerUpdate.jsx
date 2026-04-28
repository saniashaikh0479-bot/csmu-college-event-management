import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Trophy, Medal, Award, ArrowLeft, Save } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const WinnerUpdate = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    winner: '',
    runnerUp: '',
    specialAward: '',
    specialAwardRecipient: ''
  });

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    setLoading(true);
    const response = await api.getEventById(parseInt(eventId));
    if (response.success) {
      setEvent(response.data);
      setFormData({
        winner: response.data.winner || '',
        runnerUp: response.data.runnerUp || '',
        specialAward: response.data.specialAward || '',
        specialAwardRecipient: response.data.specialAwardRecipient || ''
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.updateEvent(parseInt(eventId), {
        ...formData,
        status: 'completed'
      });
      if (response.success) {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Error updating winners:', error);
    }
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 ml-56 p-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin-dashboard')}
            className="mb-4"
          >
            Back to Dashboard
          </Button>

          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Update Winners</h1>
            <p className="text-gray-600 text-sm mt-1">{event.name}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card>
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-50 border border-yellow-300 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Winner</h3>
                    <p className="text-sm text-gray-600">1st Place</p>
                  </div>
                </div>
                <Input
                  placeholder="Enter winning team name"
                  value={formData.winner}
                  onChange={(e) => setFormData({ ...formData, winner: e.target.value })}
                />
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-50 border border-gray-300 flex items-center justify-center">
                    <Medal className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Runner-Up</h3>
                    <p className="text-sm text-gray-600">2nd Place</p>
                  </div>
                </div>
                <Input
                  placeholder="Enter runner-up team name"
                  value={formData.runnerUp}
                  onChange={(e) => setFormData({ ...formData, runnerUp: e.target.value })}
                />
              </div>
            </Card>
          </div>

          <Card className="mb-6">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-50 border border-purple-300 flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Special Award</h3>
                  <p className="text-sm text-gray-600">Optional recognition</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Award Name"
                  placeholder="e.g., Best Performance, Spirit Award"
                  value={formData.specialAward}
                  onChange={(e) => setFormData({ ...formData, specialAward: e.target.value })}
                />
                <Input
                  label="Recipient"
                  placeholder="Team or individual name"
                  value={formData.specialAwardRecipient}
                  onChange={(e) => setFormData({ ...formData, specialAwardRecipient: e.target.value })}
                />
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 border border-gray-300">
                  <p className="text-gray-600 text-xs">Date</p>
                  <p className="font-medium text-gray-900 text-sm">{event.date}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-300">
                  <p className="text-gray-600 text-xs">Venue</p>
                  <p className="font-medium text-gray-900 text-sm">{event.venue}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-300">
                  <p className="text-gray-600 text-xs">Total Teams</p>
                  <p className="font-medium text-gray-900 text-sm">{event.registeredTeams}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-300">
                  <p className="text-gray-600 text-xs">Status</p>
                  <p className="font-medium text-gray-900 text-sm capitalize">{event.status}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} size="lg">
              <Save className="w-5 h-5 mr-2" />
              Save & Complete Event
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WinnerUpdate;
