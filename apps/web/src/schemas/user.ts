import { z } from 'zod';
import { DocumentMeta, FirestoreDoc, OptionalTimestampMs, UID } from './shared';

export const UserRoles = z.enum(['owner', 'admin', 'member', 'viewer']);

export const UserProfile = z.object({
  uid: UID,
  email: z.string().email(),
  displayName: z.string().min(1).nullable(),
  photoURL: z.string().url().nullable(),
  role: UserRoles.default('member'),
  onboardedAt: OptionalTimestampMs
});

export const UserDoc = FirestoreDoc(UserProfile.shape);
export type UserDoc = z.infer<typeof UserDoc>;
export type UserRole = z.infer<typeof UserRoles>;

export const OrgMembership = z.object({
  uid: UID,
  orgId: z.string(),
  role: UserRoles.default('member'),
  invitedAt: OptionalTimestampMs,
  joinedAt: OptionalTimestampMs
}).merge(DocumentMeta);

export type OrgMembership = z.infer<typeof OrgMembership>;
