import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { GraduationCap, UserPlus } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    department: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await api.registerStudent({
        username: formData.username,
        password: formData.password,
        name: formData.name,
        department: formData.department,
        email: formData.email
      });

      if (response.success) {
        login(response.data);
        navigate('/student-dashboard');
      } else {
        setError(response.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Geometric Design */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950">
        {/* Geometric shapes */}
        <div className="absolute inset-0">
          {/* Diamond shapes */}
          <div className="absolute top-24 left-20 w-20 h-20 border-2 border-white/10 rotate-45" />
          <div className="absolute top-24 left-20 w-12 h-12 bg-saffron-500/10 rotate-45 translate-x-4 translate-y-4" />
          <div className="absolute bottom-28 right-24 w-24 h-24 border-2 border-saffron-400/15 rotate-12" />
          {/* Circles */}
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 -right-20 w-80 h-80 bg-saffron-500/8 rounded-full" />
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-white/5 rounded-full" />
          {/* Plus signs */}
          <div className="absolute top-1/3 right-20">
            <div className="w-8 h-1 bg-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="w-1 h-8 bg-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="absolute bottom-1/3 left-16">
            <div className="w-6 h-0.5 bg-saffron-400/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="w-0.5 h-6 bg-saffron-400/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          {/* Dot grid */}
          <div className="absolute top-20 right-20 grid grid-cols-4 gap-3">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-white/15 rounded-full" />
            ))}
          </div>
          <div className="absolute bottom-20 left-20 grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-saffron-400/15 rounded-full" />
            ))}
          </div>
          {/* Lines */}
          <div className="absolute top-0 left-1/3 w-px h-full bg-white/5" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/5" />
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
                <UserPlus className="w-5 h-5 text-saffron-400" />
              </div>
              <div>
                <p className="text-white font-medium">Quick Registration</p>
                <p className="text-primary-300 text-sm">Sign up and start exploring events</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <p className="text-white font-medium">Student Community</p>
                <p className="text-primary-300 text-sm">Join thousands of active participants</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">PDF</span>
              </div>
              <div>
                <p className="text-white font-medium">Earn Certificates</p>
                <p className="text-primary-300 text-sm">Download official participation certificates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
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
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create Student Account</h2>
              <p className="text-gray-500 text-sm mt-1">Register to browse and join campus events</p>
            </div>

            <Card>
              <Card.Body>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                  />
                  <Input
                    label="Username"
                    type="text"
                    placeholder="Choose a username (min. 3 characters)"
                    value={formData.username}
                    onChange={handleChange('username')}
                    required
                  />
                  <Input
                    label="Department"
                    type="text"
                    placeholder="e.g. Computer Science (optional)"
                    value={formData.department}
                    onChange={handleChange('department')}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email (optional)"
                    value={formData.email}
                    onChange={handleChange('email')}
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange('password')}
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    required
                  />

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>

                <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col gap-2">
                  <p className="text-sm text-gray-600 text-center">
                    Already have an account?{' '}
                    <Link to="/student-login" className="text-primary-600 hover:text-primary-700 font-medium">
                      Sign in
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

export default StudentRegister;
