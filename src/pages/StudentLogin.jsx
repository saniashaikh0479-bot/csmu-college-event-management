import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { GraduationCap } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const StudentLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.loginStudent(formData.username, formData.password);
      if (response.success) {
        login(response.user);
        navigate('/student-dashboard');
      } else {
        setError(response.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-xs tracking-wider">CSMU</span>
            </div>
            <div>
              <h1 className="text-primary-900 text-base font-bold leading-tight">Chhatrapati Shivaji Maharaj University</h1>
              <p className="text-gray-400 text-xs">Event Management Portal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Student Login</h2>
            <p className="text-gray-500 text-sm mt-1">Current Students & Participants</p>
          </div>
          <Card>
            <Card.Body>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-3">Contact admin to get your account credentials</p>
                <Link to="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  ← Back to Home
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentLogin;
