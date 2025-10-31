import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@diatonic/ui';
import { Mail, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';

import { useAuth } from '@/contexts/AuthContext';
import { functions } from '@/lib/firebase/client';
import { Input } from '@/components/ui/input';

const VerifyEmailCode = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || user?.email;
  
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/signup', { replace: true });
    }
  }, [email, navigate]);

  if (!email) {
    return null;
  }

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    try {
      setVerifying(true);
      setError(null);

      const verifyEmailCodeFn = httpsCallable(functions, 'verifyEmailCode');
      const result = await verifyEmailCodeFn({ email, code }) as { data: any };

      if (result.data && result.data.success) {
        setSuccess(true);
        // Reload user to get updated emailVerified status
        if (user) {
          await user.reload();
        }
        setTimeout(() => {
          // Redirect to dashboard or MFA setup
          navigate('/dashboard', { replace: true });
        }, 1500);
      } else {
        throw new Error('Verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResending(true);
      setError(null);

      // Generate new code
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      const sendVerificationEmailFn = httpsCallable(functions, 'sendVerificationEmail');
      await sendVerificationEmailFn({
        email,
        code: newCode,
        firstName: location.state?.firstName
      });

      setSuccess(false);
      setCode('');
      alert('New verification code sent! Check your email.');
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    
    // Auto-submit when 6 digits entered
    if (value.length === 6) {
      setTimeout(() => handleVerifyCode(), 300);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Enter Verification Code</h1>
          <p className="mt-2 text-muted-foreground">
            We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-center block">
                Verification Code
              </label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="000000"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                className="text-center text-3xl font-bold tracking-[0.5em] px-2"
                autoFocus
                disabled={verifying || success}
              />
              <p className="text-xs text-center text-muted-foreground">
                Enter the 6-digit code from your email
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <p>Email verified! Redirecting...</p>
              </div>
            )}

            <Button
              onClick={handleVerifyCode}
              disabled={verifying || code.length !== 6 || success}
              className="w-full"
            >
              {verifying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verified!
                </>
              ) : (
                'Verify Email'
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            onClick={handleResendCode}
            disabled={resending || success}
            variant="outline"
            className="w-full"
          >
            {resending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend Code
              </>
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Didn't receive the code? Check your spam folder or click "Resend Code" above.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailCode;
