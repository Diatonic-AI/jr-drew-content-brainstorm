import { useState, useEffect } from 'react';
import { Button } from '@diatonic/ui';
import { Shield, Smartphone, Mail, Trash2, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { multiFactor, type MultiFactorInfo } from 'firebase/auth';

import { useAuth } from '@/contexts/AuthContext';
import { MFAEnrollment } from '@/components/auth/MFAEnrollment';

const SecuritySettings = () => {
  const { user } = useAuth();
  const [mfaFactors, setMfaFactors] = useState<MultiFactorInfo[]>([]);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadMFAFactors();
    }
  }, [user]);

  const loadMFAFactors = () => {
    if (!user) return;
    
    const factors = multiFactor(user).enrolledFactors;
    setMfaFactors(factors);
  };

  const handleRemoveFactor = async (factorUid: string) => {
    if (!user) return;

    try {
      setRemoving(factorUid);
      setError(null);

      const factor = mfaFactors.find(f => f.uid === factorUid);
      if (factor) {
        await multiFactor(user).unenroll(factor);
        setSuccess('MFA method removed successfully');
        loadMFAFactors();
        
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove MFA method');
    } finally {
      setRemoving(null);
    }
  };

  const handleEnrollmentComplete = () => {
    setShowEnrollment(false);
    setSuccess('MFA method added successfully');
    loadMFAFactors();
    setTimeout(() => setSuccess(null), 3000);
  };

  if (!user) {
    return null;
  }

  if (showEnrollment) {
    return (
      <div className="mx-auto max-w-2xl">
        <Button
          onClick={() => setShowEnrollment(false)}
          variant="ghost"
          className="mb-6"
        >
          ← Back to Security Settings
        </Button>
        <MFAEnrollment
          user={user}
          onComplete={handleEnrollmentComplete}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account security and multi-factor authentication methods
        </p>
      </div>

      {/* Email Verification Status */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className={`rounded-lg p-3 ${user.emailVerified ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
            <Mail className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Email Verification</h3>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            {user.emailVerified ? (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified</span>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="h-4 w-4" />
                <span>Not verified</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Factor Authentication */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Multi-Factor Authentication</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add extra security layers to your account
            </p>
          </div>
          <Button onClick={() => setShowEnrollment(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Method
          </Button>
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
            <p>{success}</p>
          </div>
        )}

        {mfaFactors.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No MFA methods configured</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a phone number or backup email to secure your account
            </p>
            <Button onClick={() => setShowEnrollment(true)} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Setup MFA
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {mfaFactors.map((factor) => (
              <div
                key={factor.uid}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3 text-primary">
                    {factor.factorId === 'phone' ? (
                      <Smartphone className="h-5 w-5" />
                    ) : (
                      <Mail className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{factor.displayName || 'MFA Method'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {factor.factorId === 'phone' ? 'Phone Authentication' : 'Email Authentication'}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Enrolled on {new Date(factor.enrollmentTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleRemoveFactor(factor.uid)}
                  disabled={removing === factor.uid}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  {removing === factor.uid ? (
                    'Removing...'
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Recommendations */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold">Security Recommendations</h3>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            <span>Use a strong, unique password for your account</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            <span>Enable at least one multi-factor authentication method</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            <span>Keep your recovery email and phone number up to date</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            <span>Review your account activity regularly</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SecuritySettings;
