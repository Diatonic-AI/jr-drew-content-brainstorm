import { z } from 'zod';

import { FirestoreDoc, LifecycleFlags, OrgId, TimestampMs } from './shared';
import { UserRoles } from './user';

export const OrgPlan = z.enum(['free', 'pro', 'enterprise']);

export const OrgSettings = z.object({
  timezone: z.string().default('UTC'),
  weekStartsOn: z.number().int().min(0).max(6).default(1),
  notifications: z.object({
    email: z.boolean().default(true),
    slack: z.boolean().default(false)
  })
});

export const OrgSchema = FirestoreDoc({
  orgId: OrgId,
  name: z.string().min(2),
  slug: z.string().min(2),
  ownerId: z.string(),
  plan: OrgPlan.default('free'),
  billingCustomerId: z.string().nullable(),
  activeUntil: TimestampMs.nullable(),
  settings: OrgSettings,
  flags: LifecycleFlags.default({ archived: false, deleted: false })
});

export type OrgDoc = z.infer<typeof OrgSchema>;

export const OrgRoleDefinition = z.object({
  role: UserRoles,
  permissions: z.array(z.string())
});

export type OrgRoleDefinition = z.infer<typeof OrgRoleDefinition>;
