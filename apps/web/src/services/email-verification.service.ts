import { doc, setDoc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store verification code in Firestore
 */
export async function storeVerificationCode(
  email: string,
  code: string,
  expiresInMinutes: number = 10
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

  await setDoc(doc(db, 'email_verifications', email), {
    code,
    email,
    expiresAt: Timestamp.fromDate(expiresAt),
    createdAt: Timestamp.now(),
    attempts: 0
  });
}

/**
 * Verify code matches stored code
 */
export async function verifyEmailCode(email: string, code: string): Promise<boolean> {
  const docRef = doc(db, 'email_verifications', email);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Verification code not found or expired');
  }

  const data = docSnap.data();
  const now = new Date();
  const expiresAt = data.expiresAt.toDate();

  // Check if expired
  if (now > expiresAt) {
    await deleteDoc(docRef);
    throw new Error('Verification code has expired');
  }

  // Check attempts
  if (data.attempts >= 3) {
    await deleteDoc(docRef);
    throw new Error('Too many failed attempts. Please request a new code.');
  }

  // Verify code
  if (data.code === code) {
    // Delete the verification code after successful verification
    await deleteDoc(docRef);
    return true;
  } else {
    // Increment attempts
    await setDoc(
      docRef,
      { attempts: data.attempts + 1 },
      { merge: true }
    );
    throw new Error('Invalid verification code');
  }
}

/**
 * Resend verification code (generates new code)
 */
export async function resendVerificationCode(email: string): Promise<string> {
  const code = generateVerificationCode();
  await storeVerificationCode(email, code);
  return code;
}

/**
 * Send verification email via Firebase Functions
 * This will be called by a Cloud Function
 */
export interface SendVerificationEmailRequest {
  email: string;
  code: string;
  firstName?: string;
}
