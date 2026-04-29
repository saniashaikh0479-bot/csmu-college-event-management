import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { User, Mail, Phone, MapPin, LogOut, Edit, Building } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PageBackground from '../components/PageBackground';
import Modal from '../components/Modal';

const StudentProfile = () => {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    phone: ''
  });

  const handleSave = () => {
    // In real app, update user profile via API
    setEditMode(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <PageBackground>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your account settings</p>
          </div>

          <div className="max-w-4xl">
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              </Card.Header>
              <Card.Body>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-primary-100 border border-primary-300 flex items-center justify-center">
                      <User className="w-10 h-10 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                      <p className="text-gray-600">{user?.role}</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => setEditMode(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-4 p-3 bg-gray-50 border border-gray-300">
                    <div className="w-10 h-10 bg-gray-200 border border-gray-300 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase">Email</p>
                      <p className="font-medium text-gray-900">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-3 bg-gray-50 border border-gray-300">
                    <div className="w-10 h-10 bg-gray-200 border border-gray-300 flex items-center justify-center">
                      <Building className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase">Department</p>
                      <p className="font-medium text-gray-900">{user?.department}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-3 bg-gray-50 border border-gray-300">
                    <div className="w-10 h-10 bg-gray-200 border border-gray-300 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase">Student ID</p>
                      <p className="font-medium text-gray-900">{user?.id}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-3 bg-gray-50 border border-gray-300">
                    <div className="w-10 h-10 bg-gray-200 border border-gray-300 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase">Phone</p>
                      <p className="font-medium text-gray-900">Not provided</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="mt-4">
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-2">
                  <Button variant="secondary" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    View My Certificates
                  </Button>
                  <Button variant="danger" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>

          <Modal
            isOpen={editMode}
            onClose={() => setEditMode(false)}
            title="Edit Profile"
            size="lg"
          >
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-300">
                <Button variant="secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </PageBackground>
  );
};

export default StudentProfile;
