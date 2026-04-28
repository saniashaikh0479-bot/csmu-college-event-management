import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Bell } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary-900 border-b-2 border-primary-700" role="navigation" aria-label="Main navigation">
      <div className="px-4">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link to={isAdmin() ? '/admin-dashboard' : '/student-dashboard'} className="flex items-center space-x-3 text-white" aria-label="Go to dashboard">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <span className="text-primary-900 font-bold text-sm">CE</span>
              </div>
              <div>
                <span className="text-sm font-bold">College of Engineering</span>
                <span className="text-primary-300 text-xs ml-2">Event Management</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                {isAdmin() && (
                  <Link to="/create-event" aria-label="Create new event">
                    <Button variant="secondary" size="sm">Create Event</Button>
                  </Link>
                )}
                <Link to="/notifications" className="text-white hover:text-gray-200 relative" aria-label="View notifications">
                  <Bell className="w-4 h-4" />
                </Link>
                <div className="flex items-center space-x-3 border-l border-primary-600 pl-4" aria-live="polite">
                  <div className="text-white text-sm">
                    <span className="font-medium">{user.name}</span>
                    <span className="ml-2 text-primary-300 text-xs uppercase" aria-label={`Role: ${user.role}`}>{user.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-primary-300 hover:text-white transition-colors"
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
