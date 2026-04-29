import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Award, Download } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import PageBackground from '../components/PageBackground';
import jsPDF from 'jspdf';

const MyCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    
    const certsRes = await api.getCertificates(user.id);
    
    if (certsRes.success) {
      setCertificates(certsRes.data);
    }
    setLoading(false);
  };

  const handleDownload = (certificate) => {
    const eventName = certificate.eventName || 'Unknown Event';
    const eventDate = certificate.eventDate || '';
    const eventVenue = certificate.eventVenue || '';

    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.setLineWidth(2);
    pdf.setDrawColor(59, 130, 246);
    pdf.rect(10, 10, width - 20, height - 20);
    pdf.setLineWidth(1);
    pdf.setDrawColor(147, 197, 253);
    pdf.rect(15, 15, width - 30, height - 30);

    pdf.setFontSize(32);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Certificate of Achievement', width / 2, 40, { align: 'center' });

    pdf.setFontSize(20);
    pdf.setTextColor(30, 41, 59);
    pdf.text('For participation in', width / 2, 60, { align: 'center' });

    pdf.setFontSize(28);
    pdf.setTextColor(59, 130, 246);
    pdf.text(eventName, width / 2, 80, { align: 'center' });

    pdf.setFontSize(18);
    pdf.setTextColor(71, 85, 105);
    pdf.text('This certificate is proudly awarded to', width / 2, 110, { align: 'center' });

    pdf.setFontSize(36);
    pdf.setTextColor(30, 41, 59);
    pdf.text(user?.name || 'Participant', width / 2, 135, { align: 'center' });

    pdf.setFontSize(14);
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Department: ${user?.department || 'N/A'}`, width / 2, 160, { align: 'center' });
    pdf.text(`Held on ${eventDate} at ${eventVenue}`, width / 2, 175, { align: 'center' });

    const typeLabel = certificate.type === 'winner' ? 'Winner' : certificate.type === 'runner-up' ? 'Runner-Up' : 'Participation';
    pdf.setFontSize(16);
    pdf.setTextColor(59, 130, 246);
    pdf.text(`Award: ${typeLabel}`, width / 2, 195, { align: 'center' });

    pdf.setFontSize(12);
    pdf.setTextColor(148, 163, 184);
    pdf.text('Chhatrapati Shivaji Maharaj University — Event Management System', width / 2, height - 25, { align: 'center' });

    pdf.save(`${user?.name?.replace(/\s+/g, '_') || 'certificate'}_${eventName.replace(/\s+/g, '_')}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading certificates...</p>
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
                    return (
                      <tr key={cert.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{cert.eventName || 'Unknown Event'}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 capitalize">{cert.eventType || ''}</td>
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
    </PageBackground>
  );
};

export default MyCertificates;
