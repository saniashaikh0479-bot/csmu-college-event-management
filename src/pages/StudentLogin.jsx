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
    <div className="min-h-screen flex">
      {/* Left Panel - Geometric Design */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
        {/* Geometric shapes */}
        <div className="absolute inset-0">
          {/* Hexagonal pattern */}
          <div className="absolute top-12 left-12 w-28 h-28 border-2 border-white/10 rotate-45" />
          <div className="absolute top-12 left-12 w-20 h-20 border-2 border-saffron-400/15 rotate-12 translate-x-8 translate-y-8" />
          <div className="absolute bottom-20 right-16 w-32 h-32 border-2 border-white/10 -rotate-12" />
          {/* Large circles */}
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-saffron-500/10 rounded-full" />
          <div className="absolute -top-32 left-1/3 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 -left-20 w-64 h-64 bg-white/5 rounded-full" />
          {/* Triangles (CSS) */}
          <div className="absolute top-1/3 right-16 w-0 h-0 border-l-[24px] border-r-[24px] border-b-[42px] border-l-transparent border-r-transparent border-b-white/10" />
          <div className="absolute bottom-1/3 left-24 w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-saffron-400/15" />
          {/* Dot grid */}
          <div className="absolute bottom-16 left-16 grid grid-cols-5 gap-4">
            {[...Array(25)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-white/15 rounded-full" />
            ))}
          </div>
          {/* Cross lines */}
          <div className="absolute top-0 right-1/3 w-px h-full bg-white/5" />
          <div className="absolute top-2/3 left-0 w-full h-px bg-white/5" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="mb-8">
            <img src="/Logo.jpeg" alt="CSMU Logo" className="w-16 h-16 rounded-xl object-cover shadow-lg mb-6" />
            <h1 className="text-4xl font-bold text-white mb-3">Chhatrapati Shivaji Maharaj University</h1>
            <p className="text-primary-200 text-lg">Event Management System</p>
          </div>
          <div className="space-y-4 mt-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-saffron-500/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-saffron-400" />
              </div>
              <div>
                <p className="text-white font-medium">Browse & Register</p>
                <p className="text-primary-300 text-sm">Find events that match your interests</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">QR</span>
              </div>
              <div>
                <p className="text-white font-medium">Track Attendance</p>
                <p className="text-primary-300 text-sm">Scan QR codes at event venues</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">PDF</span>
              </div>
              <div>
                <p className="text-white font-medium">Download Certificates</p>
                <p className="text-primary-300 text-sm">Get your participation & winner certificates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        {/* Header for mobile */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center space-x-3">
            <img src="/Logo.jpeg" alt="CSMU Logo" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <h1 className="text-primary-900 text-sm font-bold">Chhatrapati Shivaji Maharaj University</h1>
              <p className="text-gray-400 text-xs">Event Management Portal</p>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
                <GraduationCap className="w-8 h-8 text-white" />
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

                <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col gap-2">
                  <p className="text-sm text-gray-600 text-center">
                    New student?{' '}
                    <Link to="/student-register" className="text-primary-600 hover:text-primary-700 font-medium">
                      Create an account
                    </Link>
                  </p>
                  <Link to="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium text-center">
                    ← Back to Home
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLogin;
