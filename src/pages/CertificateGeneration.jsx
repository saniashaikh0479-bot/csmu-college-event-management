import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Award, Download, ArrowLeft, FileText, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import jsPDF from 'jspdf';

const CertificateGeneration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [certificateType, setCertificateType] = useState('participation');
  const [generating, setGenerating] = useState(false);
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
    
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    // Certificate border
    pdf.setLineWidth(2);
    pdf.setDrawColor(59, 130, 246);
    pdf.rect(10, 10, width - 20, height - 20);
    
    pdf.setLineWidth(1);
    pdf.setDrawColor(147, 197, 253);
    pdf.rect(15, 15, width - 30, height - 30);

    // Header
    pdf.setFontSize(32);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Certificate of Achievement', width / 2, 40, { align: 'center' });

    // Event name
    pdf.setFontSize(20);
    pdf.setTextColor(30, 41, 59);
    pdf.text(`For participation in`, width / 2, 60, { align: 'center' });
    
    pdf.setFontSize(28);
    pdf.setTextColor(59, 130, 246);
    pdf.text(event?.name || 'Event Name', width / 2, 80, { align: 'center' });

    // Awarded to
    pdf.setFontSize(18);
    pdf.setTextColor(71, 85, 105);
    pdf.text('This certificate is proudly awarded to', width / 2, 110, { align: 'center' });

    // Recipient name
    pdf.setFontSize(36);
    pdf.setTextColor(30, 41, 59);
    pdf.text(participant.teamName || participant.captainName, width / 2, 135, { align: 'center' });

    // Details
    pdf.setFontSize(14);
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Captain: ${participant.captainName}`, width / 2, 160, { align: 'center' });
    pdf.text(`Department: ${participant.department}`, width / 2, 175, { align: 'center' });

    // Date and venue
    pdf.setFontSize(14);
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Held on ${event?.date} at ${event?.venue}`, width / 2, 200, { align: 'center' });

    // Footer
    pdf.setFontSize(12);
    pdf.setTextColor(148, 163, 184);
    pdf.text('College Event Management System', width / 2, height - 25, { align: 'center' });

    pdf.save(`${participant.teamName.replace(/\s+/g, '_')}_certificate.pdf`);
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
    </div>
  );
};

export default CertificateGeneration;
