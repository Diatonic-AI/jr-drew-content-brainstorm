import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MFAEnrollment } from '@/components/auth/MFAEnrollment';
import { useAuth } from '@/contexts/AuthContext';

const SetupMFA = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber;

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleComplete = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <MFAEnrollment
          user={user}
          onComplete={handleComplete}
          initialPhone={phoneNumber}
        />
      </div>
    </div>
  );
};

export default SetupMFA;
