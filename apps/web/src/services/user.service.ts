import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';

import { db } from '@/lib/firebase/client';
import type { UserProfile } from '@/types/user';

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDoc = await getDoc(doc(db, 'users', uid));
  
  if (!userDoc.exists()) {
    return null;
  }
  
  const data = userDoc.data();
  return {
    id: userDoc.id,
    email: data.email,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    displayName: data.displayName || undefined,
    avatarUrl: data.avatarUrl || data.photoURL || undefined,
    role: data.role || 'member',
    locale: data.locale || 'en',
    timeZone: data.timeZone || 'UTC',
    currentOrgId: data.currentOrgId || undefined,
    createdAt: data.createdAt,
    memberships: data.memberships || []
  } as UserProfile;
}

/**
 * Create user profile in Firestore if it doesn't exist
 * Also creates a default organization and membership
 */
export async function createUserProfileIfNeeded(firebaseUser: FirebaseUser): Promise<UserProfile> {
  const uid = firebaseUser.uid;
  
  // Check if user profile already exists
  const existing = await getUserProfile(uid);
  if (existing) {
    return existing;
  }
  
  // Create new user profile
  const now = Date.now();
  const userProfile: UserProfile = {
    id: uid,
    email: firebaseUser.email!,
    firstName: firebaseUser.displayName?.split(' ')[0] || '',
    lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
    displayName: firebaseUser.displayName || undefined,
    avatarUrl: firebaseUser.photoURL || undefined,
    role: 'owner', // First user becomes owner of their org
    locale: 'en',
    timeZone: 'UTC',
    createdAt: new Date().toISOString(),
    memberships: []
  };
  
  // Create default organization for new user FIRST
  const orgId = await createDefaultOrganization(uid, firebaseUser.email!);
  
  // Now save user profile with currentOrgId
  await setDoc(doc(db, 'users', uid), {
    id: uid,
    email: firebaseUser.email,
    firstName: firebaseUser.displayName?.split(' ')[0] || '',
    lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
    displayName: firebaseUser.displayName || null,
    avatarUrl: firebaseUser.photoURL || null,
    role: 'owner',
    locale: 'en',
    timeZone: 'UTC',
    currentOrgId: orgId,
    createdAt: new Date().toISOString(),
    memberships: []
  });
  
  // Update userProfile with orgId
  userProfile.currentOrgId = orgId;
  
  return userProfile;
}

/**
 * Create a default organization for a new user
 */
async function createDefaultOrganization(uid: string, email: string): Promise<string> {
  const now = Date.now();
  
  // Create organization
  const orgRef = await addDoc(collection(db, 'orgs'), {
    orgId: '', // Will be set after creation
    name: `${email.split('@')[0]}'s Workspace`,
    slug: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-'),
    ownerId: uid,
    plan: 'free',
    billingCustomerId: null,
    activeUntil: null,
    settings: {
      timezone: 'UTC',
      weekStartsOn: 1,
      notifications: {
        email: true,
        slack: false
      }
    },
    flags: {
      archived: false,
      deleted: false
    },
    createdAt: now,
    updatedAt: now
  });
  
  const orgId = orgRef.id;
  
  // Update orgId field
  await setDoc(doc(db, 'orgs', orgId), { orgId }, { merge: true });
  
  // Create membership for owner
  await setDoc(doc(db, 'orgs', orgId, 'members', uid), {
    id: uid,
    uid,
    orgId,
    role: 'owner',
    invitedAt: null,
    joinedAt: now,
    createdAt: now,
    updatedAt: now
  });
  
  return orgId;
}

/**
 * Update user profile
 */
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  const now = Date.now();
  await setDoc(
    doc(db, 'users', uid),
    {
      ...updates,
      updatedAt: now
    },
    { merge: true }
  );
}

/**
 * Mark user as onboarded
 */
export async function markUserOnboarded(uid: string): Promise<void> {
  const now = Date.now();
  await setDoc(
    doc(db, 'users', uid),
    {
      onboardedAt: now,
      updatedAt: now
    },
    { merge: true }
  );
}
