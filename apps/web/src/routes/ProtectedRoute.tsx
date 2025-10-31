import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';

import { useAuth } from '@/contexts/AuthContext';

/**
 * Loading spinner component
 */
function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if email is verified
  if (!user.emailVerified) {
    // Redirect to verification code page with email in state
    return <Navigate to="/verify-email-code" state={{ email: user.email }} replace />;
  }

  // User is authenticated and email verified, render protected content
  return <AppShell />;
};

export default ProtectedRoute;
