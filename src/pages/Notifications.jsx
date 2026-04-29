import React, { useEffect, useState } from 'react';
import { Bell, Check, X, Calendar, Users, Award, Clock, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PageBackground from '../components/PageBackground';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    setLoading(true);
    const response = await api.getNotifications(user.id);
    if (response.success) {
      setNotifications(response.data);
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    const response = await api.markNotificationRead(id);
    if (response.success) {
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: 1 } : n
      ));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    const response = await api.markAllNotificationsRead(user.id);
    if (response.success) {
      setNotifications(notifications.map(n => ({ ...n, read: 1 })));
    }
  };

  const deleteNotification = async (id) => {
    const response = await api.deleteNotification(id);
    if (response.success) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type) => {
    const icons = {
      event: <Calendar className="w-5 h-5 text-blue-600" />,
      reminder: <Clock className="w-5 h-5 text-yellow-600" />,
      certificate: <Award className="w-5 h-5 text-purple-600" />,
      deadline: <Clock className="w-5 h-5 text-red-600" />,
      result: <Award className="w-5 h-5 text-green-600" />
    };
    return icons[type] || <Bell className="w-5 h-5 text-gray-600" />;
  };

  const getBgColor = (type) => {
    const colors = {
      event: 'bg-blue-100',
      reminder: 'bg-yellow-100',
      certificate: 'bg-purple-100',
      deadline: 'bg-red-100',
      result: 'bg-green-100'
    };
    return colors[type] || 'bg-gray-50';
  };

  const unreadCount = notifications.filter(n => n.read === 0).length;

  if (loading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main id="main-content" className="flex-1 p-4">
            <p className="text-gray-600">Loading notifications...</p>
          </main>
        </div>
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
              <p className="text-gray-600 text-sm mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="secondary" onClick={markAllAsRead}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>

          <div className="bg-white border border-gray-300">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase w-12">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Message</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-600">
                      No notifications yet.
                    </td>
                  </tr>
                ) : (
                  notifications.map((notification) => (
                    <tr key={notification.id} className={`border-b border-gray-300 hover:bg-gray-50 ${notification.read === 0 ? 'bg-blue-50' : ''}`}>
                      <td className="px-4 py-2">
                        {notification.read === 0 && (
                          <div className="w-2 h-2 bg-primary-600 rounded-full" />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <div className={`w-8 h-8 ${getBgColor(notification.type)} rounded flex items-center justify-center`}>
                          {getIcon(notification.type)}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{notification.title}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 max-w-xs">{notification.message}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{formatTime(notification.created_at)}</td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          {notification.read === 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </PageBackground>
  );
};

export default Notifications;
