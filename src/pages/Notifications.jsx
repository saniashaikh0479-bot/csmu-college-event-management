import React from 'react';
import { Bell, Calendar, Award, CheckCircle, Clock, X } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Notifications = () => {
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      type: 'event',
      title: 'New Event: Tech Hackathon',
      message: 'Registration is now open for the 24-hour coding challenge. Team size: 2-4 members.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Event Reminder: Dance Competition',
      message: 'Your registered event "Dance Competition" is scheduled for May 20, 2025.',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'certificate',
      title: 'Certificate Available',
      message: 'Your participation certificate for "Workshop on AI" is now available for download.',
      time: '3 days ago',
      read: true
    },
    {
      id: 4,
      type: 'deadline',
      title: 'Registration Deadline Approaching',
      message: 'Cricket Tournament registration closes in 2 days. Register now to secure your spot!',
      time: '5 days ago',
      read: true
    },
    {
      id: 5,
      type: 'result',
      title: 'Results Announced',
      message: 'Results for the "Inter-College Cricket Tournament" have been announced. Check the dashboard.',
      time: '1 week ago',
      read: true
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
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
    return colors[type] || 'bg-gray-100';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 ml-56 p-4">
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
                    <tr key={notification.id} className={`border-b border-gray-300 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                      <td className="px-4 py-2">
                        {!notification.read && (
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
                      <td className="px-4 py-2 text-sm text-gray-600">{notification.time}</td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          {!notification.read && (
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
    </div>
  );
};

export default Notifications;
