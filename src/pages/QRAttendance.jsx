import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { QrCode, CheckCircle, XCircle, ArrowLeft, RefreshCw, Camera } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ConfirmDialog from '../components/ConfirmDialog';
import PageBackground from '../components/PageBackground';

const QRAttendance = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [lastScanned, setLastScanned] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAttendance, setPendingAttendance] = useState(null);

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

  const handleScan = () => {
    // Simulate QR code scanning
    const mockCodes = participants.map(p => ({ code: `REG-${p.id}`, ...p }));
    const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
    setScannedCode(randomCode.code);
    setLastScanned(randomCode);
    setScanning(false);
  };

  const handleMarkAttendance = async (registrationId, attended) => {
    setPendingAttendance({ registrationId, attended });
    setShowConfirmDialog(true);
  };

  const confirmAttendance = async () => {
    if (!pendingAttendance) return;
    
    const { registrationId, attended } = pendingAttendance;
    const response = await api.updateAttendance(registrationId, attended);
    if (response.success) {
      setParticipants(participants.map(p =>
        p.id === registrationId ? { ...p, attended } : p
      ));
    }
    setLastScanned(null);
    setScannedCode('');
    setShowConfirmDialog(false);
    setPendingAttendance(null);
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
            <h1 className="text-2xl font-semibold text-gray-900">QR Code Attendance</h1>
            <p className="text-gray-600 text-sm mt-1">{event.name}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code</h3>
                
                {!scanning ? (
                  <div className="text-center">
                    <div className="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto mb-4">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                    <Button onClick={() => setScanning(true)} size="lg">
                      <Camera className="w-5 h-5 mr-2" />
                      Start Scanning
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-48 h-48 bg-primary-50 border-2 border-primary-300 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Camera className="w-16 h-16 text-primary-400" />
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">Position QR code in frame...</p>
                    <Button onClick={handleScan} variant="secondary">
                      Simulate Scan
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setScanning(false)}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-300 text-center">
                    <p className="text-3xl font-bold text-green-600">{participants.filter(p => p.attended).length}</p>
                    <p className="text-green-800 text-sm">Attended</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-300 text-center">
                    <p className="text-3xl font-bold text-gray-600">{participants.filter(p => !p.attended).length}</p>
                    <p className="text-gray-800 text-sm">Not Attended</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600 text-sm">Total Registered: {participants.length}</p>
                  <div className="w-full bg-gray-200 rounded h-2 mt-2">
                    <div
                      className="bg-green-600 h-2 transition-all"
                      style={{ width: `${participants.length > 0 ? (participants.filter(p => p.attended).length / participants.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {lastScanned && (
            <Card className="mb-6 border-2 border-primary-300">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scanned Participant</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Team Name</p>
                    <p className="font-medium text-gray-900">{lastScanned.teamName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Captain</p>
                    <p className="font-medium text-gray-900">{lastScanned.captainName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Department</p>
                    <p className="font-medium text-gray-900">{lastScanned.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Current Status</p>
                    <p className={`font-medium ${lastScanned.attended ? 'text-green-600' : 'text-gray-600'}`}>
                      {lastScanned.attended ? 'Attended' : 'Not Attended'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button
                    variant="primary"
                    onClick={() => handleMarkAttendance(lastScanned.id, true)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Present
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleMarkAttendance(lastScanned.id, false)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Mark Absent
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setLastScanned(null);
                      setScannedCode('');
                    }}
                  >
                    Skip
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Participants</h3>
              <div className="bg-white border border-gray-300">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Team Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Captain</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Department</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant) => (
                      <tr key={participant.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{participant.teamName}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{participant.captainName}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{participant.department}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 text-xs font-medium border ${participant.attended ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-50 text-gray-700 border-gray-300'}`}>
                            {participant.attended ? 'Present' : 'Absent'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setLastScanned(participant);
                              setScannedCode(`REG-${participant.id}`);
                            }}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </main>
      </div>
      
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setPendingAttendance(null);
        }}
        onConfirm={confirmAttendance}
        title="Confirm Attendance"
        message={pendingAttendance?.attended 
          ? "Are you sure you want to mark this participant as present?" 
          : "Are you sure you want to mark this participant as absent?"}
        confirmText="Confirm"
        cancelText="Cancel"
        variant={pendingAttendance?.attended ? "primary" : "danger"}
      />
    </PageBackground>
  );
};

export default QRAttendance;
