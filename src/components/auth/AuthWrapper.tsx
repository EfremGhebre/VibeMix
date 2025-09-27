import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, session } = useAuth();

  useEffect(() => {
    // Smooth navigation on auth state changes
    if (!user && !session) {
      // If user is signed out and not on home page, navigate smoothly
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, [user, session, navigate, location.pathname]);

  return <>{children}</>;
}