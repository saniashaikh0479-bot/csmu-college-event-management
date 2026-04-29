import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { UserPlus, Edit2, Trash2, Shield, GraduationCap } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'student',
    department: '',
    email: ''
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const response = editingUser
      ? await api.updateUser(editingUser.id, {
          name: formData.name,
          department: formData.department,
          email: formData.email
        })
      : await api.createUser(formData);

    if (response.success) {
      setShowModal(false);
      setEditingUser(null);
      setFormData({
        username: '',
        password: '',
        name: '',
        role: 'student',
        department: '',
        email: ''
      });
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 ml-60 p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="text-gray-600 text-sm mt-1">Create and manage admin and student accounts</p>
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
                variant={filter === 'student' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('student')}
              >
                <GraduationCap className="w-4 h-4 mr-1" />
                Students
              </Button>
            </div>
            <Button variant="primary" onClick={() => {
              setEditingUser(null);
              setFormData({
                username: '',
                password: '',
                name: '',
                role: 'student',
                department: '',
                email: ''
              });
              setShowModal(true);
            }}>
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
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
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-saffron-50 text-saffron-700 border border-saffron-200' 
                            : 'bg-primary-50 text-primary-700 border border-primary-200'
                        }`}>
                          {user.role === 'admin' ? (
                            <>
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            <>
                              <GraduationCap className="w-3 h-3 mr-1" />
                              Student
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.department || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
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
            onClose={() => {
              setShowModal(false);
              setEditingUser(null);
              setError('');
            }}
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
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                  />
                </>
              )}
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              {!editingUser && (
                <Select
                  label="Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  options={[
                    { value: 'student', label: 'Student' },
                    { value: 'admin', label: 'Administrator' }
                  ]}
                  required
                />
              )}
              <Input
                label="Department"
                type="text"
                placeholder="Enter department (optional)"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                placeholder="Enter email (optional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setShowModal(false);
                  setEditingUser(null);
                  setError('');
                }}>
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
    </div>
  );
};

export default UserManagement;
