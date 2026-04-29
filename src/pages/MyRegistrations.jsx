import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Users, QrCode, X, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import PageBackground from '../components/PageBackground';
import { getTypeColor } from '../utils/colors';
import { QRCodeSVG } from 'qrcode.react';
import ConfirmDialog from '../components/ConfirmDialog';

const MyRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState({ open: false, registration: null });
  const [cancelDialog, setCancelDialog] = useState({ open: false, registration: null });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    const regsRes = await api.getRegistrationsByStudent(user.id);

    if (regsRes.success) {
      setRegistrations(regsRes.data);
    }
    setLoading(false);
  };

  const handleCancelRegistration = async () => {
    if (!cancelDialog.registration) return;

    const response = await api.cancelRegistration(cancelDialog.registration.id);
    if (response.success) {
      setRegistrations(registrations.filter(r => r.id !== cancelDialog.registration.id));
      setCancelDialog({ open: false, registration: null });
    } else {
      alert(response.error || 'Failed to cancel registration');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading registrations..." />
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
            <h1 className="text-2xl font-semibold text-gray-900">My Registrations</h1>
            <p className="text-gray-600 text-sm mt-1">Events you have registered for</p>
          </div>

          {registrations.length === 0 ? (
            <Card>
              <div className="p-8 text-center text-gray-600">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>You haven't registered for any events yet.</p>
                <Link to="/events" className="mt-3 inline-block">
                  <Button variant="primary" size="sm">Browse Events</Button>
                </Link>
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
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Team Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Department</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Attendance</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">QR Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Cancel</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => {
                    return (
                      <tr key={reg.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{reg.eventName || 'Unknown Event'}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 text-xs font-medium border ${getTypeColor(reg.eventType)}`}>
                            {reg.eventType}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">{reg.eventDate}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{reg.teamName}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{reg.department}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 text-xs font-medium border ${reg.attended ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-50 text-gray-700 border-gray-300'}`}>
                            {reg.attended ? 'Attended' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQrModal({ open: true, registration: reg })}
                          >
                            <QrCode className="w-4 h-4 mr-1" />
                            View QR
                          </Button>
                        </td>
                        <td className="px-4 py-2">
                          <Link to={`/event/${reg.eventId}`}>
                            <Button variant="outline" size="sm">View Event</Button>
                          </Link>
                        </td>
                        <td className="px-4 py-2">
                          {!reg.attended && new Date(reg.eventDate) > new Date() && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setCancelDialog({ open: true, registration: reg })}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {qrModal.open && qrModal.registration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Attendance QR Code</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQrModal({ open: false, registration: null })}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{qrModal.registration.eventName}</p>
              <p className="text-sm text-gray-600 mb-4">Team: {qrModal.registration.teamName}</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 border border-gray-300 rounded">
              <QRCodeSVG value={`REG-${qrModal.registration.id}`} size={200} />
              <p className="text-xs text-gray-600 mt-3 text-center">Show this QR code at the event venue for attendance</p>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, registration: null })}
        onConfirm={handleCancelRegistration}
        title="Cancel Registration"
        message="Are you sure you want to cancel your registration for this event? This action cannot be undone."
        confirmText="Cancel Registration"
        cancelText="Keep Registration"
        variant="danger"
      />
    </PageBackground>
  );
};

export default MyRegistrations;
