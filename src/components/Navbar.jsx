import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Bell } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const { user, logout, canManageEvents } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={canManageEvents() ? '/admin-dashboard' : '/student-dashboard'} className="flex items-center space-x-3" aria-label="Go to dashboard">
              <img src="/Logo.jpeg" alt="CSMU Logo" className="w-9 h-9 rounded-lg object-cover" />
              <div>
                <span className="text-base font-bold text-primary-900">Chhatrapati Shivaji Maharaj University</span>
                <span className="text-gray-400 text-xs ml-2 hidden md:inline">Event Management</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                {canManageEvents() && (
                  <Link to="/create-event" aria-label="Create new event">
                    <Button variant="primary" size="sm">Create Event</Button>
                  </Link>
                )}
                <Link to="/notifications" className="text-gray-500 hover:text-primary-600 relative p-1.5 hover:bg-gray-100 rounded-lg transition-colors" aria-label="View notifications">
                  <Bell className="w-4 h-4" />
                </Link>
                <div className="flex items-center space-x-3 border-l border-gray-200 pl-4" aria-live="polite">
                  <div className="text-sm">
                    <span className="font-medium text-gray-800">{user.name}</span>
                    <span className="ml-2 text-gray-400 text-xs uppercase" aria-label={`Role: ${user.role}`}>{user.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
