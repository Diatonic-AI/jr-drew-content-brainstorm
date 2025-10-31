import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { z } from 'zod';

import { db } from '@/lib/firebase/client';
import { OrgSchema } from '@/schemas/organization';
import type { OrgDoc } from '@/schemas/organization';

/**
 * Organization with member data
 */
export interface OrganizationWithMembers extends OrgDoc {
  memberCount: number;
  members?: Array<{
    uid: string;
    role: string;
    joinedAt: number;
  }>;
}

/**
 * Get organization by ID
 */
export async function getOrganization(orgId: string): Promise<OrgDoc | null> {
  try {
    const orgRef = doc(db, 'orgs', orgId);
    const orgSnap = await getDoc(orgRef);

    if (!orgSnap.exists()) {
      console.warn(`Organization ${orgId} not found`);
      return null;
    }

    const data = orgSnap.data();

    // Validate with schema
    const validated = OrgSchema.parse({
      id: orgSnap.id,
      ...data
    });

    return validated;
  } catch (error) {
    console.error('Error fetching organization:', error);
    throw new Error('Failed to fetch organization');
  }
}

/**
 * Get organization with member details
 */
export async function getOrganizationWithMembers(
  orgId: string
): Promise<OrganizationWithMembers | null> {
  try {
    const org = await getOrganization(orgId);
    if (!org) return null;

    // Get members subcollection
    const membersRef = collection(db, 'orgs', orgId, 'members');
    const membersSnap = await getDocs(membersRef);

    const members = membersSnap.docs.map((doc) => ({
      uid: doc.id,
      role: doc.data().role || 'member',
      joinedAt: doc.data().joinedAt || Date.now()
    }));

    return {
      ...org,
      memberCount: members.length,
      members
    };
  } catch (error) {
    console.error('Error fetching organization with members:', error);
    throw new Error('Failed to fetch organization details');
  }
}

/**
 * Get all organizations for a user
 */
export async function getUserOrganizations(uid: string): Promise<OrgDoc[]> {
  try {
    // Query organizations where user is a member
    const orgsQuery = query(
      collection(db, 'orgs'),
      where('flags.deleted', '==', false),
      orderBy('createdAt', 'desc')
    );

    const orgsSnap = await getDocs(orgsQuery);
    const organizations: OrgDoc[] = [];

    for (const orgDoc of orgsSnap.docs) {
      // Check if user is a member
      const memberRef = doc(db, 'orgs', orgDoc.id, 'members', uid);
      const memberSnap = await getDoc(memberRef);

      if (memberSnap.exists()) {
        const validated = OrgSchema.parse({
          id: orgDoc.id,
          ...orgDoc.data()
        });
        organizations.push(validated);
      }
    }

    return organizations;
  } catch (error) {
    console.error('Error fetching user organizations:', error);
    throw new Error('Failed to fetch organizations');
  }
}

/**
 * Update organization details
 */
export async function updateOrganization(
  orgId: string,
  updates: Partial<OrgDoc>
): Promise<void> {
  try {
    const orgRef = doc(db, 'orgs', orgId);

    await setDoc(
      orgRef,
      {
        ...updates,
        updatedAt: Date.now()
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating organization:', error);
    throw new Error('Failed to update organization');
  }
}

/**
 * Get organization members
 */
export async function getOrganizationMembers(orgId: string) {
  try {
    const membersRef = collection(db, 'orgs', orgId, 'members');
    const membersSnap = await getDocs(membersRef);

    return membersSnap.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching organization members:', error);
    throw new Error('Failed to fetch members');
  }
}

/**
 * Check if user is a member of organization
 */
export async function isOrganizationMember(
  orgId: string,
  uid: string
): Promise<boolean> {
  try {
    const memberRef = doc(db, 'orgs', orgId, 'members', uid);
    const memberSnap = await getDoc(memberRef);
    return memberSnap.exists();
  } catch (error) {
    console.error('Error checking organization membership:', error);
    return false;
  }
}

/**
 * Get user's role in organization
 */
export async function getUserRoleInOrg(
  orgId: string,
  uid: string
): Promise<string | null> {
  try {
    const memberRef = doc(db, 'orgs', orgId, 'members', uid);
    const memberSnap = await getDoc(memberRef);

    if (!memberSnap.exists()) {
      return null;
    }

    return memberSnap.data().role || 'member';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}
