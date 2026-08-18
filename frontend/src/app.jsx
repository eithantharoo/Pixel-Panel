import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './page-1/login_page';
import SignupPage from './page-2/signup_page';
import GetStartedPage from './page-3/page_3';
import InterestsPage from './pages/InterestsPage';
import HomePage from './pages/HomePage';
import ReaderPage from './pages/ReaderPage';
import AdminStoriesPage from './pages/AdminStoriesPage';
import AdminPlaceholderPage from './pages/AdminPlaceholderPage';

import RequireAuth from './components/auth/RequireAuth';
import AdminLayout from './components/hub/AdminLayout';

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Normal logged-in pages */}
      <Route
        path="/get-started"
        element={
          <RequireAuth>
            <GetStartedPage />
          </RequireAuth>
        }
      />
      <Route
        path="/interests"
        element={
          <RequireAuth>
            <InterestsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/home"
        element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        }
      />
      <Route
        path="/reader"
        element={
          <RequireAuth>
            <ReaderPage />
          </RequireAuth>
        }
      />

      {/* All admin pages share one top bar and sidebar */}
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="stories" replace />} />
        <Route path="stories" element={<AdminStoriesPage />} />
        <Route path="progress" element={<AdminPlaceholderPage />} />
        <Route path="favorites" element={<AdminPlaceholderPage />} />
        <Route path="settings" element={<AdminPlaceholderPage />} />
        <Route path="help" element={<AdminPlaceholderPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}