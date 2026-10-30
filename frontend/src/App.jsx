import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/ToastNotification';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AuthLayout from './components/layout/AuthLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import './styles/global.css';

// Route-level code splitting for production performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const Profile = lazy(() => import('./pages/Profile'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner fullPage text="Loading AGchat..." />}>
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsConditions />} />

            {/* Protected Routes inside Authenticated Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AuthLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/profile/:username" element={<Profile />} />
              </Route>
            </Route>

            {/* Custom 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
