import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@diatonic/ui';
import { Mail, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { sendEmailVerification, reload } from 'firebase/auth';

import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase/client';

const VerifyEmail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user is already verified, redirect to dashboard
    if (user?.emailVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [user?.emailVerified, navigate]);

  const handleResendEmail = async () => {
    if (!user) return;

    try {
      setSending(true);
      setError(null);
      await sendEmailVerification(user);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification email');
    } finally {
      setSending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;

    try {
      setChecking(true);
      setError(null);
      
      // Reload user to get latest email verification status
      await reload(user);
      
      // Force refresh of auth state
      if (auth.currentUser?.emailVerified) {
        // Suggest MFA setup after verification
        navigate('/setup-mfa', { replace: true });
      } else {
        setError('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (err) {
      setError('Failed to check verification status');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Verify your email</h1>
          <p className="mt-2 text-muted-foreground">
            We've sent a verification email to <span className="font-medium text-foreground">{user?.email}</span>
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  1
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Check your inbox</p>
                <p className="text-xs text-muted-foreground">Look for an email from us with a verification link</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  2
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Click the verification link</p>
                <p className="text-xs text-muted-foreground">This will confirm your email address</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  3
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Return here and continue</p>
                <p className="text-xs text-muted-foreground">Click the button below once verified</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {sent && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <p>Verification email sent! Check your inbox.</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleCheckVerification}
              disabled={checking}
              className="w-full"
            >
              {checking ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  I've Verified My Email
                </>
              )}
            </Button>

            <Button
              onClick={handleResendEmail}
              disabled={sending}
              variant="outline"
              className="w-full"
            >
              {sending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Didn't receive the email? Check your spam folder or{' '}
          <button
            onClick={handleResendEmail}
            className="font-medium text-primary underline-offset-4 hover:underline"
            disabled={sending}
          >
            resend it
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
