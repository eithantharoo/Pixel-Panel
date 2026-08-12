import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './page-1/login_page';
import SignupPage from './page-2/signup_page';
import GetStartedPage from './page-3/page_3';
import InterestsPage from './pages/InterestsPage';
import HomePage from './pages/HomePage';
import ReaderPage from './pages/ReaderPage';
import RequireAuth from './components/auth/RequireAuth';

export default function App() {
  return (
    <Routes>
      {/* Default page is Login */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/get-started" element={<RequireAuth><GetStartedPage /></RequireAuth>} />
      <Route path="/interests" element={<RequireAuth><InterestsPage /></RequireAuth>} />
      <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
      <Route path="/reader" element={<RequireAuth><ReaderPage /></RequireAuth>} />
    </Routes>
  );
}
