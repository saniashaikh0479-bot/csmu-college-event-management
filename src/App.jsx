import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { ToastProvider } from './contexts/ToastContext';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load all page components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const StudentLogin = lazy(() => import('./pages/StudentLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const CreateEvent = lazy(() => import('./pages/CreateEvent'));
const EditEvent = lazy(() => import('./pages/EditEvent'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const EventRegistration = lazy(() => import('./pages/EventRegistration'));
const EventSelect = lazy(() => import('./pages/EventSelect'));
const ParticipantManagement = lazy(() => import('./pages/ParticipantManagement'));
const QRAttendance = lazy(() => import('./pages/QRAttendance'));
const WinnerUpdate = lazy(() => import('./pages/WinnerUpdate'));
const CertificateGeneration = lazy(() => import('./pages/CertificateGeneration'));
const BrowseEvents = lazy(() => import('./pages/BrowseEvents'));
const MyRegistrations = lazy(() => import('./pages/MyRegistrations'));
const MyCertificates = lazy(() => import('./pages/MyCertificates'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const Notifications = lazy(() => import('./pages/Notifications'));

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin, isStudent } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-100"><div className="text-gray-600">Loading...</div></div>;
  
  if (!user) return <Navigate to="/" replace />;
  
  if (requireAdmin && !isAdmin()) return <Navigate to="/student-dashboard" replace />;
  
  return children;
};

function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-100"><LoadingSpinner message="Loading..." /></div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/student-dashboard" element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/create-event" element={
          <ProtectedRoute requireAdmin>
            <CreateEvent />
          </ProtectedRoute>
        } />
        
        <Route path="/edit-event/:id" element={
          <ProtectedRoute requireAdmin>
            <EditEvent />
          </ProtectedRoute>
        } />
        
        <Route path="/event/:id" element={
          <ProtectedRoute>
            <EventDetails />
          </ProtectedRoute>
        } />
        
        <Route path="/register/:eventId" element={
          <ProtectedRoute>
            <EventRegistration />
          </ProtectedRoute>
        } />
        
        <Route path="/participants/:eventId" element={
          <ProtectedRoute requireAdmin>
            <ParticipantManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/attendance/:eventId" element={
          <ProtectedRoute requireAdmin>
            <QRAttendance />
          </ProtectedRoute>
        } />
        
        <Route path="/winners/:eventId" element={
          <ProtectedRoute requireAdmin>
            <WinnerUpdate />
          </ProtectedRoute>
        } />
        
        <Route path="/certificates/:eventId" element={
          <ProtectedRoute requireAdmin>
            <CertificateGeneration />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />

        {/* Admin event selection pages (no eventId) */}
        <Route path="/participants" element={
          <ProtectedRoute requireAdmin>
            <EventSelect title="Participant Management" description="Select an event to view participants" actionLabel="View Participants" actionPath="/participants" />
          </ProtectedRoute>
        } />

        <Route path="/attendance" element={
          <ProtectedRoute requireAdmin>
            <EventSelect title="QR Attendance" description="Select an event to manage attendance" actionLabel="Mark Attendance" actionPath="/attendance" />
          </ProtectedRoute>
        } />

        <Route path="/winners" element={
          <ProtectedRoute requireAdmin>
            <EventSelect title="Update Winners" description="Select an event to record winners" actionLabel="Update Winners" actionPath="/winners" />
          </ProtectedRoute>
        } />

        <Route path="/certificates" element={
          <ProtectedRoute requireAdmin>
            <EventSelect title="Certificate Generation" description="Select an event to generate certificates" actionLabel="Generate Certificates" actionPath="/certificates" />
          </ProtectedRoute>
        } />

        {/* Student pages */}
        <Route path="/events" element={
          <ProtectedRoute>
            <BrowseEvents />
          </ProtectedRoute>
        } />

        <Route path="/my-registrations" element={
          <ProtectedRoute>
            <MyRegistrations />
          </ProtectedRoute>
        } />

        <Route path="/my-certificates" element={
          <ProtectedRoute>
            <MyCertificates />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <EventProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </EventProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
