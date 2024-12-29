import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const VerifyWrapper: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isVerified = useAuthStore((state) => state.isVerified);

  if (isAuthenticated && !isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};
