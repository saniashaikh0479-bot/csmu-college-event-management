import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, GraduationCap, Calendar, Users, Award, Settings } from 'lucide-react';
import Button from '../components/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Header Bar */}
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
          <div className="text-primary-300 text-xs">
            Academic Year 2025-26
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary-900 mb-2">
              College Event Management System
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Centralized platform for managing inter-college events, registrations, attendance tracking, and certificate generation. Please select your access level to continue.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Administrator Card */}
            <Link to="/admin-login" className="block group">
              <div className="bg-white border-2 border-gray-300 p-0 hover:border-primary-600 transition-colors">
                <div className="bg-primary-800 p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-800" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-bold">Administrator Access</h3>
                    <p className="text-primary-200 text-xs">Event Coordinators & Department Heads</p>
                  </div>
                </div>
                <div className="p-5">
                  <ul className="space-y-2 mb-5">
                    <li className="flex items-center text-sm text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                      Create and manage events
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <Users className="w-4 h-4 mr-2 text-primary-600" />
                      Track participant registrations
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <Award className="w-4 h-4 mr-2 text-primary-600" />
                      Record winners & generate certificates
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <Settings className="w-4 h-4 mr-2 text-primary-600" />
                      QR attendance & event analytics
                    </li>
                  </ul>
                  <Button variant="primary" className="w-full">
                    Login as Administrator
                  </Button>
                </div>
              </div>
            </Link>

            {/* Student Card */}
            <Link to="/student-login" className="block group">
              <div className="bg-white border-2 border-gray-300 p-0 hover:border-primary-600 transition-colors">
                <div className="bg-primary-600 p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-bold">Student Access</h3>
                    <p className="text-primary-100 text-xs">Current Students & Participants</p>
                  </div>
                </div>
                <div className="p-5">
                  <ul className="space-y-2 mb-5">
                    <li className="flex items-center text-sm text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                      Browse & register for events
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <Users className="w-4 h-4 mr-2 text-primary-600" />
                      Manage team registrations
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <Award className="w-4 h-4 mr-2 text-primary-600" />
                      Download participation certificates
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <Settings className="w-4 h-4 mr-2 text-primary-600" />
                      Track event status & schedules
                    </li>
                  </ul>
                  <Button variant="primary" className="w-full">
                    Login as Student
                  </Button>
                </div>
              </div>
            </Link>
          </div>

          {/* Info Bar */}
          <div className="bg-white border border-gray-300 p-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
              <p>Authorized access only. All activities are monitored and logged.</p>
              <p className="mt-2 md:mt-0">© 2025 College of Engineering — Event Management System</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
