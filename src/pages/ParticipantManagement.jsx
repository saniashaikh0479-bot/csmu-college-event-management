import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Users, Search, Download } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import PageBackground from '../components/PageBackground';

const ParticipantManagement = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    setLoading(true);
    const [eventRes, regsRes] = await Promise.all([
      api.getEventById(parseInt(eventId)),
      api.getRegistrations(parseInt(eventId))
    ]);
    if (eventRes.success) {
      setEvent(eventRes.data);
    }
    if (regsRes.success) {
      setParticipants(regsRes.data);
    }
    setLoading(false);
  };

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.captainName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !filterDept || p.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const departments = [...new Set(participants.map(p => p.department))];

  const handleExport = () => {
    const csvContent = "Team Name,Captain,Department,Contact,Status\n" +
      participants.map(p => `${p.teamName},${p.captainName},${p.department},${p.contact},${p.attended ? 'Attended' : 'Not Attended'}`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `participants_${event?.name.replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading participants...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Event not found.</p>
      </div>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 p-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin-dashboard')}
            className="mb-4"
          >
            Back to Dashboard
          </Button>

          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Participant Management</h1>
            <p className="text-gray-600 text-sm mt-1">{event.name}</p>
          </div>

          <Card className="mb-4">
            <div className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search participants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-48">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <Button variant="secondary" onClick={handleExport}>
                  Export
                </Button>
              </div>
            </div>
          </Card>

          <div className="bg-white border border-gray-300">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Team Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Captain</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Contact</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Members</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-600">
                      No participants found.
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((participant) => (
                    <tr key={participant.id} className="border-b border-gray-300 hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{participant.teamName}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{participant.captainName}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{participant.department}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{participant.contact}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{Array.isArray(participant.members) ? participant.members.length : (JSON.parse(participant.members || '[]').length)}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs font-medium border ${participant.attended ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-50 text-gray-700 border-gray-300'}`}>
                          {participant.attended ? 'Attended' : 'Not Attended'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/attendance/${eventId}`)}
                        >
                          Mark Attendance
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </PageBackground>
  );
};

export default ParticipantManagement;
