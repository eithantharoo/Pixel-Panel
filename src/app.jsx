import { Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import GetStartedPage from './pages/GetStartedPage';
import InterestsPage from './pages/InterestsPage';
import HomePage from './pages/HomePage';
import ReaderPage from './pages/ReaderPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/get-started" element={<GetStartedPage />} />
      <Route path="/interests" element={<InterestsPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/reader" element={<ReaderPage />} />
    </Routes>
  );
}
