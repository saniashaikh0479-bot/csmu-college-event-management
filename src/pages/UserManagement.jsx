import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { UserPlus, Edit2, Trash2, Shield, GraduationCap, Users } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import PageBackground from '../components/PageBackground';

const DESIGNATION_OPTIONS = [
  { value: '', label: '— None —' },
  { value: 'Event Coordinator', label: 'Event Coordinator' },
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Department Head', label: 'Department Head' },
  { value: 'Principal', label: 'Principal' },
  { value: 'Administrator', label: 'Administrator' }
];

const emptyForm = {
  username: '',
  password: '',
  name: '',
  role: 'student',
  designation: '',
  department: '',
  email: ''
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const response = await api.getUsers();
    if (response.success) {
      setUsers(response.data);
    }
    setLoading(false);
  };

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setFormData(prev => {
      const updated = { ...prev, [field]: val };
      if (field === 'role' && val === 'student') {
        updated.designation = '';
      }
      if (field === 'role' && val === 'coordinator') {
        updated.designation = 'Event Coordinator';
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let response;
    if (editingUser) {
      const updatePayload = {
        name: formData.name,
        department: formData.department,
        email: formData.email,
        role: formData.role,
        designation: (formData.role === 'admin' || formData.role === 'coordinator') ? formData.designation : ''
      };
      if (formData.password && formData.password.trim()) {
        updatePayload.password = formData.password;
      }
      response = await api.updateUser(editingUser.id, updatePayload);
    } else {
      response = await api.createUser({
        ...formData,
        designation: (formData.role === 'admin' || formData.role === 'coordinator') ? formData.designation : ''
      });
    }

    if (response.success) {
      setShowModal(false);
      setEditingUser(null);
      setFormData(emptyForm);
      loadUsers();
    } else {
      setError(response.error || 'Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      name: user.name,
      role: user.role,
      designation: user.designation || '',
      department: user.department || '',
      email: user.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (userId, username) => {
    if (window.confirm(`Delete user "${username}"? This action cannot be undone.`)) {
      const response = await api.deleteUser(userId);
      if (response.success) {
        loadUsers();
      } else {
        alert(response.error || 'Failed to delete user');
      }
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData(emptyForm);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setError('');
  };

  const filteredUsers = filter === 'all'
    ? users
    : users.filter(u => u.role === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading users..." />
      </div>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="text-gray-600 text-sm mt-1">Create and manage admin, teacher, coordinator and student accounts</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All Users
              </Button>
              <Button
                variant={filter === 'admin' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('admin')}
              >
                <Shield className="w-4 h-4 mr-1" />
                Admins
              </Button>
              <Button
                variant={filter === 'coordinator' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('coordinator')}
              >
                <Users className="w-4 h-4 mr-1" />
                Coordinators
              </Button>
              <Button
                variant={filter === 'student' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('student')}
              >
                <GraduationCap className="w-4 h-4 mr-1" />
                Students
              </Button>
            </div>
            <Button variant="primary" onClick={openCreateModal}>
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Role / Designation</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full w-fit ${
                            user.role === 'admin'
                              ? 'bg-saffron-50 text-saffron-700 border border-saffron-200'
                              : user.role === 'coordinator'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-primary-50 text-primary-700 border border-primary-200'
                          }`}>
                            {user.role === 'admin' ? (
                              <><Shield className="w-3 h-3 mr-1" />Admin</>
                            ) : user.role === 'coordinator' ? (
                              <><Users className="w-3 h-3 mr-1" />Coordinator</>
                            ) : (
                              <><GraduationCap className="w-3 h-3 mr-1" />Student</>
                            )}
                          </span>
                          {(user.role === 'admin' || user.role === 'coordinator') && user.designation && (
                            <span className="text-xs text-gray-500 pl-1">{user.designation}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.department || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(user.createdAt || user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          {user.id !== 1 && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(user.id, user.username)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Modal
            isOpen={showModal}
            onClose={closeModal}
            title={editingUser ? 'Edit User' : 'Create New User'}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingUser && (
                <>
                  <Input
                    label="Username"
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange('username')}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange('password')}
                    required
                  />
                </>
              )}

              <Input
                label="Full Name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange('name')}
                required
              />

              <Select
                label="Role"
                value={formData.role}
                onChange={handleChange('role')}
                options={[
                  { value: 'student', label: 'Student' },
                  { value: 'admin', label: 'Admin / Staff' },
                  { value: 'coordinator', label: 'Event Coordinator' }
                ]}
                required
              />

              {(formData.role === 'admin' || formData.role === 'coordinator') && (
                <Select
                  label="Designation"
                  value={formData.designation}
                  onChange={handleChange('designation')}
                  options={DESIGNATION_OPTIONS}
                />
              )}

              {editingUser && (
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={formData.password}
                  onChange={handleChange('password')}
                />
              )}

              <Input
                label="Department"
                type="text"
                placeholder="Enter department (optional)"
                value={formData.department}
                onChange={handleChange('department')}
              />
              <Input
                label="Email"
                type="email"
                placeholder="Enter email (optional)"
                value={formData.email}
                onChange={handleChange('email')}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </PageBackground>
  );
};

export default UserManagement;
