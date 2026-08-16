import { Routes, Route } from 'react-router-dom';
import LoginPage from './page-1/login_page'; 
import SignupPage from './page-2/signup_page'; 
import GetStartedPage from './page-3/page_3'; 
import InterestsPage from './pages/InterestsPage';
import LanguagePage from './pages/LanguagePage';
import HomePage from './pages/HomePage';
import ReaderPage from './pages/ReaderPage';

export default function App() {
  return (
    <Routes>
      {/* Default page is Login */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/get-started" element={<GetStartedPage />} />
      <Route path="/interests" element={<InterestsPage />} />
      <Route path="/language" element={<LanguagePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/reader" element={<ReaderPage />} />
    </Routes>
  );
}
