import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, GraduationCap, Calendar, Users, Award, ArrowRight, QrCode, BookOpen, Trophy, ChevronRight, MapPin, Clock } from 'lucide-react';
import { api } from '../services/api';

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const response = await api.getEvents();
    if (response.success) {
      setEvents(response.data);
    }
    setLoading(false);
  };

  const getTypeColor = (type) => {
    const colors = {
      sports: 'bg-green-50 text-green-700 border-green-300',
      cultural: 'bg-purple-50 text-purple-700 border-purple-300',
      technical: 'bg-blue-50 text-blue-700 border-blue-300',
      workshop: 'bg-yellow-50 text-yellow-700 border-yellow-300'
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-300';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-primary-700 via-saffron-500 to-primary-700" />

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/Logo.jpeg" alt="CSMU Logo" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
            <div>
              <h1 className="text-primary-900 text-base font-bold leading-tight">Chhatrapati Shivaji Maharaj University</h1>
              <p className="text-gray-400 text-xs tracking-wide">Event Management Portal</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="https://csmu.ac.in/" target="_blank" rel="noopener noreferrer" className="text-gray-500 text-sm hover:text-primary-700 transition-colors">About CSMU</a>
            <a href="#events" className="text-gray-500 text-sm hover:text-primary-700 transition-colors">Events</a>
            <div className="bg-primary-50 text-primary-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-primary-100">
              Academic Year 2026-27
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 bg-saffron-400 rounded-full" />
                <span className="text-white/80 text-xs font-medium tracking-wide">CSMU EVENT MANAGEMENT SYSTEM</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Manage Campus Events with
                <span className="text-saffron-400"> Precision</span>
              </h2>
              <p className="text-primary-200 text-lg leading-relaxed mb-8">
                A centralized platform for managing inter-college events, registrations, attendance tracking, and certificate generation — built for administrators and students.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/admin-login" className="inline-flex items-center justify-center space-x-2 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-saffron-500/25">
                  <Shield className="w-5 h-5" />
                  <span>Admin / Coordinator Login</span>
                </Link>
                <Link to="/student-login" className="inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors">
                  <GraduationCap className="w-5 h-5" />
                  <span>Student Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Role Cards Section */}
        <div className="max-w-7xl mx-auto px-6 -mt-10">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Administrator Card */}
            <Link to="/admin-login" className="block group">
              <div className="bg-white border border-gray-200 rounded-xl p-7 shadow-lg hover:shadow-xl hover:border-saffron-200 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-5">
                  <div className="w-12 h-12 bg-saffron-50 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-saffron-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-lg font-bold">Admin & Coordinator</h3>
                    <p className="text-gray-400 text-sm">Administrators, Staff & Event Coordinators</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                    <span>Create & manage events</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                    <span>Track registrations</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                    <span>Winners & certificates</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <QrCode className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                    <span>QR attendance</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-saffron-600 font-semibold text-sm">Login as Admin / Coordinator</span>
                  <ChevronRight className="w-4 h-4 text-saffron-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Student Card */}
            <Link to="/student-login" className="block group">
              <div className="bg-white border border-gray-200 rounded-xl p-7 shadow-lg hover:shadow-xl hover:border-primary-200 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-5">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-lg font-bold">Student</h3>
                    <p className="text-gray-400 text-sm">Current Students & Participants</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span>Browse & register</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span>Team registrations</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span>Download certificates</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span>Track schedules</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-primary-600 font-semibold text-sm">Login as Student</span>
                  <ChevronRight className="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Public Events Section */}
        <div id="events" className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Events</h3>
            <p className="text-gray-500 max-w-lg mx-auto">Browse and discover events happening at CSMU</p>
          </div>
          
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading events...</div>
          ) : events.filter(e => e.status === 'active').length === 0 ? (
            <div className="text-center text-gray-500 py-8">No events available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.filter(e => e.status === 'active').map((event) => (
                <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-medium border ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium border ${event.status === 'active' ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-50 text-gray-700 border-gray-300'}`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{event.name}</h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-primary-500" />
                      <span>Team Size: {event.teamSize} | Max Teams: {event.maxTeams}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-primary-500" />
                      <span>Deadline: {event.deadline}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-3">
                      <span className="text-primary-600 font-medium">Please log in to register for this event.</span>
                    </p>
                    <Link to="/student-login" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                      Login to Register
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Platform Capabilities</h3>
            <p className="text-gray-500 max-w-lg mx-auto">Everything you need to run campus events efficiently</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, label: 'Event Management', desc: 'Create, organize & manage events seamlessly', color: 'bg-blue-50 text-blue-600' },
              { icon: QrCode, label: 'QR Attendance', desc: 'Scan-based attendance tracking system', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Trophy, label: 'Winner Records', desc: 'Record awards and rank participants', color: 'bg-amber-50 text-amber-600' },
              { icon: Award, label: 'Certificates', desc: 'Auto-generated participation certificates', color: 'bg-purple-50 text-purple-600' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-gray-200 transition-all duration-300">
                <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <p className="text-gray-900 text-sm font-semibold mb-1">{feature.label}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <img src="/Logo.jpeg" alt="CSMU Logo" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-gray-400 text-sm">Chhatrapati Shivaji Maharaj University</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-xs text-gray-500">
              <span>Authorized access only. All activities are monitored.</span>
              <span>© 2026 CSMU — Event Management System</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
