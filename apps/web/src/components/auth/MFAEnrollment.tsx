import { useState } from 'react';
import { Button } from '@diatonic/ui';
import { Shield, Smartphone, Mail, CheckCircle2, AlertCircle, X } from 'lucide-react';
import {
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  type User
} from 'firebase/auth';

import { auth } from '@/lib/firebase/client';
import { Input } from '@/components/ui/input';

interface MFAEnrollmentProps {
  user: User;
  onComplete: () => void;
  onSkip?: () => void;
  initialPhone?: string;
}

export function MFAEnrollment({ user, onComplete, onSkip, initialPhone }: MFAEnrollmentProps) {
  const [step, setStep] = useState<'choice' | 'phone' | 'email'>(initialPhone ? 'phone' : 'choice');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  const initRecaptcha = () => {
    if (recaptchaVerifier) return recaptchaVerifier;

    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      }
    });

    setRecaptchaVerifier(verifier);
    return verifier;
  };

  const handlePhoneEnrollment = async () => {
    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const verifier = initRecaptcha();
      const multiFactorSession = await multiFactor(user).getSession();

      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        verifier
      );

      setVerificationId(verificationId);
      setStep('phone');
    } catch (err) {
      console.error('Phone enrollment error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!verificationCode || !verificationId) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const phoneAuthCredential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);

      await multiFactor(user).enroll(multiFactorAssertion, 'Primary Phone');

      onComplete();
    } catch (err) {
      console.error('Phone verification error:', err);
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailMFA = async () => {
    try {
      setLoading(true);
      setError(null);

      // Email MFA is automatically enabled when user has verified email
      // We just need to ensure they have a verified email
      if (user.emailVerified) {
        onComplete();
      } else {
        setError('Please verify your email first');
      }
    } catch (err) {
      setError('Failed to setup email MFA');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'choice') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-4 text-2xl font-bold">Secure Your Account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add an extra layer of security with multi-factor authentication
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setStep('phone')}
            className="w-full rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Phone Authentication (Recommended)</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Receive verification codes via SMS to your phone number
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleEmailMFA}
            disabled={loading}
            className="w-full rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Email Authentication (Backup)</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use your verified email as a backup authentication method
                </p>
              </div>
            </div>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {onSkip && (
          <div className="text-center">
            <button
              onClick={onSkip}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Skip for now
            </button>
          </div>
        )}

        <div id="recaptcha-container"></div>
      </div>
    );
  }

  if (step === 'phone') {
    if (!verificationId) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">Phone Authentication</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your phone number to receive a verification code
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                autoComplete="tel"
              />
              <p className="text-xs text-muted-foreground">
                Include country code (e.g., +1 for US, +44 for UK)
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => setStep('choice')}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handlePhoneEnrollment}
                disabled={loading || !phoneNumber}
                className="flex-1"
              >
                {loading ? 'Sending...' : 'Send Code'}
              </Button>
            </div>
          </div>

          <div id="recaptcha-container"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-4 text-2xl font-bold">Enter Verification Code</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a 6-digit code to {phoneNumber}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              Verification Code
            </label>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => {
                setVerificationId(null);
                setVerificationCode('');
              }}
              variant="outline"
              className="flex-1"
            >
              Resend Code
            </Button>
            <Button
              onClick={handleVerifyPhone}
              disabled={loading || verificationCode.length !== 6}
              className="flex-1"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
