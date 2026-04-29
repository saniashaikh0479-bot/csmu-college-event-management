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
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-primary-600" />
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
  );
};

export default StudentRegister;
