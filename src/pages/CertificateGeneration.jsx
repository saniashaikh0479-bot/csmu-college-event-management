import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Award, Download, Check, FileText, Trash2, Ban } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import PageBackground from '../components/PageBackground';

const CertificateGeneration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [certificateType, setCertificateType] = useState('participation');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);

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

    // Load existing certificates for this event
    const allCerts = [];
    for (const participant of regsRes.data || []) {
      const certsRes = await api.getCertificates(participant.studentId);
      if (certsRes.success) {
        const eventCerts = certsRes.data.filter(c => c.eventId === parseInt(eventId));
        allCerts.push(...eventCerts);
      }
    }
    setCertificates(allCerts);

    setLoading(false);
  };

  const toggleParticipant = (participantId) => {
    setSelectedParticipants(prev =>
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const selectAll = () => {
    setSelectedParticipants(participants.map(p => p.id));
  };

  const deselectAll = () => {
    setSelectedParticipants([]);
  };

  const generateCertificate = async (participant) => {
    setGenerating(true);

    // Save certificate to database only
    const response = await api.generateCertificate({
      eventId: parseInt(eventId),
      studentId: participant.studentId,
      type: certificateType
    });

    if (response.success) {
      // Refresh participants to show certificate status
      loadData();
    } else {
      alert(response.error || 'Failed to generate certificate');
    }

    setGenerating(false);
  };

  const generateBulkCertificates = async () => {
    setGenerating(true);
    const selected = participants.filter(p => selectedParticipants.includes(p.id));

    for (const participant of selected) {
      await generateCertificate(participant);
    }

    setGenerating(false);
  };

  const handleDeleteCertificate = async (certificateId) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    const response = await api.deleteCertificate(certificateId);
    if (response.success) {
      setCertificates(certificates.filter(c => c.id !== certificateId));
    } else {
      alert(response.error || 'Failed to delete certificate');
    }
  };

  const handleRevokeCertificate = async (certificateId) => {
    const reason = prompt('Enter reason for revocation:');
    if (!reason) return;

    const response = await api.revokeCertificate(certificateId, reason);
    if (response.success) {
      loadData();
    } else {
      alert(response.error || 'Failed to revoke certificate');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading event details...</p>
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
            <h1 className="text-2xl font-semibold text-gray-900">Certificate Generation</h1>
            <p className="text-gray-600 text-sm mt-1">{event.name}</p>
          </div>

          <Card className="mb-4">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certificate Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                    value={certificateType}
                    onChange={(e) => setCertificateType(e.target.value)}
                  >
                    <option value="participation">Participation Certificate</option>
                    <option value="winner">Winner Certificate</option>
                    <option value="runner-up">Runner-Up Certificate</option>
                  </select>
                </div>
                <div className="flex items-end space-x-4">
                  <Button onClick={selectAll} variant="secondary" className="flex-1">
                    Select All
                  </Button>
                  <Button onClick={deselectAll} variant="secondary" className="flex-1">
                    Deselect All
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="mb-4">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Participants ({selectedParticipants.length} selected)
                </h3>
                {selectedParticipants.length > 0 && (
                  <Button onClick={generateBulkCertificates} disabled={generating}>
                    <Download className="w-4 h-4 mr-2" />
                    Generate Certificates
                  </Button>
                )}
              </div>
              
              <div className="bg-white border border-gray-300">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase w-12">Select</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Team Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Captain</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Department</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant) => (
                      <tr key={participant.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedParticipants.includes(participant.id)}
                            onChange={() => toggleParticipant(participant.id)}
                            className="w-4 h-4 border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{participant.teamName}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{participant.captainName}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{participant.department}</td>
                        <td className="px-4 py-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              generateCertificate(participant);
                            }}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Generate
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {certificates.length > 0 && (
            <Card className="mb-4">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Issued Certificates ({certificates.length})</h3>
                <div className="bg-white border border-gray-300">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-300">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Student ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Issued Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((cert) => (
                        <tr key={cert.id} className="border-b border-gray-300 hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">{cert.studentId}</td>
                          <td className="px-4 py-2">
                            <span className="px-2 py-1 text-xs font-medium border bg-green-50 text-green-700 border-green-300 capitalize">
                              {cert.type}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 text-xs font-medium border capitalize ${
                              cert.status === 'revoked'
                                ? 'bg-red-50 text-red-700 border-red-300'
                                : 'bg-green-50 text-green-700 border-green-300'
                            }`}>
                              {cert.status || 'active'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {new Date(cert.issuedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex space-x-2">
                              {cert.status !== 'revoked' && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleRevokeCertificate(cert.id)}
                                >
                                  <Ban className="w-4 h-4 mr-1" />
                                  Revoke
                                </Button>
                              )}
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteCertificate(cert.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          )}

          {generating && (
            <Card>
              <div className="p-8 text-center">
                <Award className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600">Generating certificates...</p>
              </div>
            </Card>
          )}
        </main>
      </div>
    </PageBackground>
  );
};

export default CertificateGeneration;
