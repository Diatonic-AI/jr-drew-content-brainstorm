import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { Resend } from 'resend';
import { getDb } from './lib/firebase.js';

// Define secret for Resend API key
const resendApiKey = defineSecret('RESEND_API_KEY');

interface SendVerificationEmailData {
  email: string;
  code: string;
  firstName?: string;
}

/**
 * Send verification email with 6-digit code
 * This is a callable function that can be invoked from the client
 */
export const sendVerificationEmail = onCall<SendVerificationEmailData>(
  { secrets: [resendApiKey] },
  async (request) => {
  const { email, code, firstName } = request.data;

  if (!email || !code) {
    throw new HttpsError('invalid-argument', 'Email and code are required');
  }

  try {
    const db = getDb();
    
    // Store the verification code in Firestore
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minute expiry

    await db.collection('email_verifications').doc(email).set({
      code,
      email,
      expiresAt: Timestamp.fromDate(expiresAt),
      createdAt: Timestamp.now(),
      attempts: 0
    });

    // Initialize Resend with the secret key
    const apiKey = resendApiKey.value();
    if (!apiKey) {
      throw new HttpsError(
        'failed-precondition',
        'Email service not configured. Please contact support.'
      );
    }

    const resend = new Resend(apiKey);

    // Send email via Resend
    try {
      const result = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Verify Your Email - Action Required',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
                }
                .email-wrapper {
                  max-width: 600px;
                  margin: 40px auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
                }
                .email-header {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: #ffffff;
                  padding: 40px 30px;
                  text-align: center;
                }
                .email-header h1 {
                  margin: 0;
                  font-size: 28px;
                  font-weight: 600;
                }
                .email-body {
                  padding: 40px 30px;
                }
                .greeting {
                  font-size: 18px;
                  margin-bottom: 20px;
                }
                .code-container {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  border-radius: 12px;
                  padding: 30px;
                  text-align: center;
                  margin: 30px 0;
                }
                .code {
                  font-size: 48px;
                  font-weight: bold;
                  letter-spacing: 12px;
                  color: #ffffff;
                  margin: 0;
                  font-family: 'Courier New', monospace;
                }
                .code-label {
                  color: rgba(255, 255, 255, 0.9);
                  font-size: 14px;
                  margin-top: 10px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .instructions {
                  color: #666666;
                  line-height: 1.8;
                }
                .expiry-notice {
                  background-color: #fff3cd;
                  border-left: 4px solid #ffc107;
                  padding: 15px;
                  margin: 25px 0;
                  border-radius: 4px;
                }
                .expiry-notice strong {
                  color: #856404;
                }
                .footer {
                  background-color: #f8f9fa;
                  padding: 30px;
                  text-align: center;
                  border-top: 1px solid #e9ecef;
                }
                .footer p {
                  color: #6c757d;
                  font-size: 14px;
                  margin: 5px 0;
                }
                .security-notice {
                  margin-top: 30px;
                  padding: 20px;
                  background-color: #f8f9fa;
                  border-radius: 6px;
                  font-size: 14px;
                  color: #6c757d;
                }
              </style>
            </head>
            <body>
              <div class="email-wrapper">
                <div class="email-header">
                  <h1>✉️ Email Verification</h1>
                </div>
                <div class="email-body">
                  <p class="greeting">Hi ${firstName || 'there'}! 👋</p>
                  <p class="instructions">
                    Thank you for signing up! To complete your registration and verify your email address,
                    please use the verification code below:
                  </p>
                  
                  <div class="code-container">
                    <div class="code-label">Your Verification Code</div>
                    <div class="code">${code}</div>
                  </div>

                  <div class="expiry-notice">
                    <strong>⏰ Important:</strong> This code will expire in <strong>10 minutes</strong>.
                  </div>

                  <p class="instructions">
                    Enter this code on the verification page to activate your account and get started.
                  </p>

                  <div class="security-notice">
                    <strong>🔒 Security Notice:</strong><br>
                    If you didn't request this verification code, you can safely ignore this email.
                    Someone may have entered your email address by mistake.
                  </div>
                </div>
                <div class="footer">
                  <p><strong>Need help?</strong></p>
                  <p>If you have any questions, please contact our support team.</p>
                  <p style="margin-top: 20px; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
                </div>
              </div>
            </body>
          </html>
        `,
        // Plain text fallback for email clients that don't support HTML
        text: `
Hi ${firstName || 'there'}!

Thank you for signing up! Your verification code is:

${code}

This code will expire in 10 minutes.

Enter this code on the verification page to activate your account.

If you didn't request this code, you can safely ignore this email.

Best regards,
Your Team
        `
      });

      console.log(`✅ Verification email sent successfully`);
      console.log(`   To: ${email}`);
      console.log(`   Message ID: ${result.data?.id}`);
    } catch (emailError: any) {
      console.error('❌ Failed to send verification email:', emailError);
      throw new HttpsError(
        'internal',
        `Failed to send verification email: ${emailError.message || 'Unknown error'}`
      );
    }

    return { success: true, message: 'Verification email sent' };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new HttpsError('internal', 'Failed to send verification email');
  }
  }
);

interface VerifyEmailCodeData {
  email: string;
  code: string;
}

/**
 * Verify the email code
 */
export const verifyEmailCode = onCall<VerifyEmailCodeData>(async (request) => {
  const { email, code } = request.data;

  if (!email || !code) {
    throw new HttpsError('invalid-argument', 'Email and code are required');
  }

  try {
    const db = getDb();
    const docRef = db.collection('email_verifications').doc(email);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new HttpsError('not-found', 'Verification code not found or expired');
    }

    const verificationData = docSnap.data()!;
    const now = new Date();
    const expiresAt = verificationData.expiresAt.toDate();

    // Check if expired
    if (now > expiresAt) {
      await docRef.delete();
      throw new HttpsError('deadline-exceeded', 'Verification code has expired');
    }

    // Check attempts
    if (verificationData.attempts >= 3) {
      await docRef.delete();
      throw new HttpsError(
        'resource-exhausted',
        'Too many failed attempts. Please request a new code.'
      );
    }

    // Verify code
    if (verificationData.code === code) {
      // Delete the verification code after successful verification
      await docRef.delete();

      // Mark the user's email as verified in Firebase Auth
      if (request.auth) {
        await getAuth().updateUser(request.auth.uid, {
          emailVerified: true
        });
      }

      return { success: true, verified: true };
    } else {
      // Increment attempts
      await docRef.update({
        attempts: FieldValue.increment(1)
      });
      throw new HttpsError('invalid-argument', 'Invalid verification code');
    }
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }
    console.error('Error verifying code:', error);
    throw new HttpsError('internal', 'Failed to verify code');
  }
});
