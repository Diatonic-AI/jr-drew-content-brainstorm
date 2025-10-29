import { z } from 'zod';
import { FirestoreDoc, LifecycleFlags, OrgId, ProjectId, TimestampMs, UID } from './shared';

export const ProjectStatus = z.enum(['draft', 'active', 'on-hold', 'complete']);
export const SprintCadence = z.enum(['weekly', 'biweekly', 'monthly']);

export const SprintSchema = z.object({
  id: z.string(),
  projectId: ProjectId,
  orgId: OrgId,
  name: z.string().min(1),
  cadence: SprintCadence.default('biweekly'),
  startAt: TimestampMs,
  endAt: TimestampMs
});

export const ColumnSchema = z.object({
  id: z.string(),
  projectId: ProjectId,
  orgId: OrgId,
  title: z.string().min(1),
  order: z.number().int().nonnegative()
});

export const ProjectSchema = FirestoreDoc({
  projectId: ProjectId,
  orgId: OrgId,
  name: z.string().min(2),
  description: z.string().max(4096).optional(),
  status: ProjectStatus.default('draft'),
  leadId: UID.nullable(),
  sprintCadence: SprintCadence.optional(),
  lastSyncedAt: TimestampMs.nullable(),
  flags: LifecycleFlags.default({ archived: false, deleted: false })
});

export type ProjectDoc = z.infer<typeof ProjectSchema>;
export type SprintDoc = z.infer<typeof SprintSchema>;
export type ColumnDoc = z.infer<typeof ColumnSchema>;
