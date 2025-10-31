import { z } from 'zod';

import { DocMetaFlexible, LifecycleFlags, OrgId, ProjectId, TaskId, TimestampInput, UID } from './shared.js';

export const ProjectStatus = z.enum(['draft', 'active', 'on-hold', 'complete']);
export const TaskStatus = z.enum(['todo', 'in-progress', 'blocked', 'done']);
export const TaskPriority = z.enum(['low', 'medium', 'high', 'urgent']);
export const SprintCadence = z.enum(['weekly', 'biweekly', 'monthly']);

const withMeta = <T extends z.ZodRawShape>(shape: T) => z.object(shape).merge(DocMetaFlexible);

export const ProjectDoc = withMeta({
  projectId: ProjectId.optional(),
  orgId: OrgId,
  name: z.string().min(2),
  description: z.string().max(4096).optional(),
  status: ProjectStatus.default('draft'),
  leadId: UID.nullable(),
  sprintCadence: SprintCadence.optional(),
  lastSyncedAt: TimestampInput.nullable(),
  flags: LifecycleFlags.default({ archived: false, deleted: false })
});

export const TaskDoc = withMeta({
  taskId: TaskId.optional(),
  orgId: OrgId,
  projectId: ProjectId,
  title: z.string().min(1),
  description: z.string().max(8192).optional(),
  status: TaskStatus.default('todo'),
  priority: TaskPriority.default('medium'),
  assigneeId: UID.nullable(),
  dueDate: TimestampInput.nullable(),
  dueSoon: z.boolean().default(false),
  labels: z.array(z.string()).default([])
});

export const SprintDoc = withMeta({
  projectId: ProjectId,
  orgId: OrgId,
  name: z.string().min(1),
  cadence: SprintCadence.default('biweekly'),
  startAt: TimestampInput,
  endAt: TimestampInput
});

export const ColumnDoc = withMeta({
  projectId: ProjectId,
  orgId: OrgId,
  title: z.string().min(1),
  order: z.number().int().nonnegative()
});

export const ProjectExportParams = z.object({
  orgId: OrgId,
  projectId: ProjectId
});

export const ProjectImportPayload = z.object({
  project: ProjectDoc.nullable().optional(),
  tasks: z.array(TaskDoc).default([]),
  sprints: z.array(SprintDoc).default([]),
  columns: z.array(ColumnDoc).default([])
});

export const ProjectImportRequest = z.object({
  orgId: OrgId,
  projectId: ProjectId,
  payload: ProjectImportPayload
});

export type ProjectImportRequest = z.infer<typeof ProjectImportRequest>;
