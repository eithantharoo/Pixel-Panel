import { Navigate } from 'react-router-dom';
import { isAuthenticated, loadAuth } from '../../utils/authState';

export default function RequireAdmin({ children }) {
  if (!isAuthenticated()) return <Navigate to="/" replace />;
  if (loadAuth()?.user?.role !== 'admin') return <Navigate to="/home" replace />;
  return children;
}
