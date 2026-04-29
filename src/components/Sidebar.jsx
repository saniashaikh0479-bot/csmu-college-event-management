import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, QrCode, Trophy, Award, User as UserIcon, Bell, FileText, Settings, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin, isStudent, isSuperAdmin, isCoordinator, canManageEvents } = useAuth();

  const eventManagerMenu = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Create Event', path: '/create-event', icon: Calendar },
    { name: 'Participants', path: '/participants', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: QrCode },
    { name: 'Winners', path: '/winners', icon: Trophy },
    { name: 'Certificates', path: '/certificates', icon: Award },
    ...(isSuperAdmin() ? [{ name: 'User Management', path: '/user-management', icon: UserPlus }] : []),
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

  const menu = canManageEvents() ? eventManagerMenu : studentMenu;

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="w-60 bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 min-h-screen relative overflow-hidden flex-shrink-0" role="navigation" aria-label="Sidebar navigation">
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-white rounded-full" />
        <div className="absolute top-40 right-10 w-24 h-24 border-2 border-white rotate-45" />
        <div className="absolute bottom-40 left-5 w-20 h-20 border-2 border-white rounded-lg rotate-12" />
        <div className="absolute bottom-20 right-5 w-16 h-16 border-2 border-white rounded-full" />
        <div className="absolute top-60 left-1/2 w-2 h-2 bg-white rounded-full" />
        <div className="absolute top-32 right-1/3 w-3 h-3 bg-white rounded-full" />
        <div className="absolute bottom-60 left-1/3 w-2 h-2 bg-white rounded-full" />
      </div>
      
      <div className="relative z-10 p-4 border-b border-white/10">
        <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">
          {isCoordinator() ? 'Event Coordinator' : canManageEvents() ? 'Administration' : 'Student Portal'}
        </p>
      </div>
      <nav className="relative z-10 p-3 space-y-1" aria-label="Main menu">
        <ul className="space-y-1" role="list">
          {menu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                  isActive(item.path) 
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                aria-current={isActive(item.path) ? 'page' : undefined}
                aria-label={`Navigate to ${item.name}`}
              >
                <item.icon className="w-4 h-4" aria-hidden="true" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="relative z-10 absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <p className="text-xs text-white/50">© 2026 CSMU</p>
      </div>
    </aside>
  );
};

export default Sidebar;
