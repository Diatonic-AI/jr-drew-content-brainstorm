import { Button } from '@diatonic/ui';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // If no email in state, redirect to login
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  const handleResendEmail = async () => {
    const user = auth.currentUser;
    if (!user) {
      setResendMessage({ type: 'error', text: 'No user found. Please sign up again.' });
      return;
    }

    try {
      setIsResending(true);
      setResendMessage(null);
      
      await sendEmailVerification(user, {
        url: `${window.location.origin}/dashboard`,
        handleCodeInApp: false
      });
      
      setResendMessage({ 
        type: 'success', 
        text: 'Verification email sent! Check your inbox.' 
      });
    } catch (error) {
      setResendMessage({ 
        type: 'error', 
        text: 'Failed to send email. Please try again.' 
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      setIsChecking(true);
      // Reload user to get fresh emailVerified status
      await user.reload();
      
      if (user.emailVerified) {
        // Email verified! Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        setResendMessage({ 
          type: 'error', 
          text: 'Email not verified yet. Please check your inbox and click the verification link.' 
        });
      }
    } catch (error) {
      setResendMessage({ 
        type: 'error', 
        text: 'Failed to check verification status.' 
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Verify your email</h1>
          <p className="mt-2 text-muted-foreground">
            We've sent a verification link to
          </p>
          <p className="mt-1 font-medium">{email}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-md bg-muted/50 p-4">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Check your inbox</p>
                <p className="text-muted-foreground mt-1">
                  Click the verification link in the email to activate your account.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-md bg-muted/50 p-4">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Don't see it?</p>
                <p className="text-muted-foreground mt-1">
                  Check your spam folder or request a new verification email.
                </p>
              </div>
            </div>
          </div>

          {resendMessage && (
            <div className={`rounded-md p-4 ${
              resendMessage.type === 'success' 
                ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              <p className="text-sm">{resendMessage.text}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleCheckVerification}
              disabled={isChecking}
              className="w-full"
            >
              {isChecking ? 'Checking...' : 'I\'ve verified my email'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
