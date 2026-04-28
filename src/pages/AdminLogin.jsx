import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Shield } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
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
      const response = await api.loginAdmin(formData.username, formData.password);
      if (response.success) {
        login(response.user);
        navigate('/admin-dashboard');
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-primary-900 border-b-2 border-primary-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white flex items-center justify-center">
              <span className="text-primary-900 font-bold text-lg">CE</span>
            </div>
            <div>
              <h1 className="text-white text-lg font-bold leading-tight">College of Engineering</h1>
              <p className="text-primary-300 text-xs">Event Management Portal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <div className="bg-primary-800 p-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-800" />
            </div>
            <div>
              <h2 className="text-white text-lg font-bold">Administrator Login</h2>
              <p className="text-primary-200 text-xs">Event Coordinators & Department Heads</p>
            </div>
          </div>
          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username"
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
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-xs text-gray-500 mb-2">Demo credentials: principal / admin123</p>
              <Link to="/" className="text-primary-700 hover:underline text-sm">
                ← Back to Home
              </Link>
            </div>
          </Card.Body>
        </Card>
      </main>
    </div>
  );
};

export default AdminLogin;
