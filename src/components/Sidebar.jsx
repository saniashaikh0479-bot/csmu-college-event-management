import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, QrCode, Trophy, Award, User as UserIcon, Bell, FileText, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin, isStudent } = useAuth();

  const adminMenu = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Create Event', path: '/create-event', icon: Calendar },
    { name: 'Participants', path: '/participants', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: QrCode },
    { name: 'Winners', path: '/winners', icon: Trophy },
    { name: 'Certificates', path: '/certificates', icon: Award },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const studentMenu = [
    { name: 'Dashboard', path: '/student-dashboard', icon: LayoutDashboard },
    { name: 'Browse Events', path: '/events', icon: Calendar },
    { name: 'My Registrations', path: '/my-registrations', icon: Users },
    { name: 'My Certificates', path: '/my-certificates', icon: Award },
    { name: 'Profile', path: '/profile', icon: UserIcon },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const menu = isAdmin() ? adminMenu : studentMenu;

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-300 min-h-screen fixed left-0 top-14" role="navigation" aria-label="Sidebar navigation">
      <div className="p-3 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {isAdmin() ? 'Administration' : 'Student Portal'}
        </p>
      </div>
      <nav className="p-2 space-y-0.5" aria-label="Main menu">
        <ul className="space-y-0.5" role="list">
          {menu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 text-sm transition-colors ${
                  isActive(item.path) ? 'bg-primary-700 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={isActive(item.path) ? 'page' : undefined}
                aria-label={`Navigate to ${item.name}`}
              >
                <item.icon className="w-4 h-4" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
        <p className="text-xs text-gray-400"> 2025 College of Engineering</p>
      </div>
    </aside>
  );
};

export default Sidebar;
