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
      // Define public routes that don't require authentication
      const publicRoutes = ['/', '/privacy', '/terms', '/help', '/reset-password'];
      
      // If user is signed out and not on a public page, navigate smoothly
      if (!publicRoutes.includes(location.pathname)) {
        navigate('/', { replace: true });
      }
    }
  }, [user, session, navigate, location.pathname]);

  return <>{children}</>;
}