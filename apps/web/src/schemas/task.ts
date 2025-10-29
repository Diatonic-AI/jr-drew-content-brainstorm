import { z } from 'zod';
import { FirestoreDoc, OrgId, ProjectId, TaskId, TimestampMs, UID } from './shared';

export const TaskStatus = z.enum(['todo', 'in-progress', 'blocked', 'done']);
export const TaskPriority = z.enum(['low', 'medium', 'high', 'urgent']);

export const TaskSchema = FirestoreDoc({
  taskId: TaskId,
  orgId: OrgId,
  projectId: ProjectId,
  title: z.string().min(1),
  description: z.string().max(8192).optional(),
  status: TaskStatus.default('todo'),
  priority: TaskPriority.default('medium'),
  assigneeId: UID.nullable(),
  dueDate: TimestampMs.nullable(),
  dueSoon: z.boolean().default(false),
  labels: z.array(z.string()).default([])
});

export type TaskDoc = z.infer<typeof TaskSchema>;
