import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Loading from './components/Loading';
import { Menu } from 'lucide-react';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tutor = lazy(() => import('./pages/Tutor'));
const Summarizer = lazy(() => import('./pages/Summarizer'));
const Quiz = lazy(() => import('./pages/Quiz'));
const QuizResult = lazy(() => import('./pages/QuizResult'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const History = lazy(() => import('./pages/History'));
const Settings = lazy(() => import('./pages/Settings'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loading fullScreen text="Loading..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loading fullScreen text="Loading..." />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar isLanding={false} />
      <div className="pt-16 lg:pt-20">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 min-w-0 pb-8 lg:pl-64">
          {children}
        </main>
      </div>

      {/* Mobile sidebar trigger. z-20 keeps it below the Sidebar overlay
          (z-30) so it cannot be tapped through while the drawer is open. */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={`lg:hidden fixed bottom-5 left-5 z-20 w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/30 hover:bg-brand-700 active:scale-95 transition-all ${
          isSidebarOpen ? 'pointer-events-none opacity-0' : ''
        }`}
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading fullScreen text="Loading StudyMate AI..." />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutor"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Tutor />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/summarizer"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Summarizer />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Quiz />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/result/:quizId"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <QuizResult />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Flashcards />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <History />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;