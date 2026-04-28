import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Award, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';

const MyCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    
    const [certsRes, eventsRes] = await Promise.all([
      api.getCertificates(user.id),
      api.getEvents()
    ]);
    
    if (certsRes.success) {
      setCertificates(certsRes.data);
    }
    if (eventsRes.success) {
      setEvents(eventsRes.data);
    }
    setLoading(false);
  };

  const getEventForCert = (eventId) => {
    return events.find(e => e.id === eventId);
  };

  const handleDownload = (certificate) => {
    // Mock download - in real app would generate PDF
    alert(`Downloading certificate for event ID: ${certificate.eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading certificates...</p>
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
            <h1 className="text-2xl font-semibold text-gray-900">My Certificates</h1>
            <p className="text-gray-600 text-sm mt-1">View and download your participation certificates</p>
          </div>

          {certificates.length === 0 ? (
            <Card>
              <div className="p-8 text-center text-gray-600">
                <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No certificates available yet.</p>
                <p className="text-sm mt-2">Certificates will be generated after event completion by the administrator.</p>
              </div>
            </Card>
          ) : (
            <div className="bg-white border border-gray-300">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Event Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Certificate Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Issued Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => {
                    const event = getEventForCert(cert.eventId);
                    if (!event) return null;
                    return (
                      <tr key={cert.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{event.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 capitalize">{event.type}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium border bg-green-50 text-green-700 border-green-300 capitalize">
                            {cert.type}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {new Date(cert.issuedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <Button variant="primary" size="sm" onClick={() => handleDownload(cert)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
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
    </div>
  );
};

export default MyCertificates;
