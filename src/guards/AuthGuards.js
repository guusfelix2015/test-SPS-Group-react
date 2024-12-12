import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export function RequireAuth({ children }) {
  const isUserAuthenticated = isAuthenticated();
  
  if (!isUserAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
}

export function RequireNotAuth({ children }) {
  const isUserAuthenticated = isAuthenticated();
  
  if (isUserAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
} 