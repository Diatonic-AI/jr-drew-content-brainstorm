import { z } from 'zod';

export const TimestampInput = z.union([z.number().int().nonnegative(), z.string(), z.date()]);
export const NonEmptyString = z.string().min(1);
export const UID = z.string().min(6);
export const OrgId = z.string().min(4);
export const ProjectId = z.string().min(4);
export const TaskId = z.string().min(4);

export const LifecycleFlags = z.object({
  archived: z.boolean().default(false),
  deleted: z.boolean().default(false)
});

export const DocMetaFlexible = z.object({
  id: z.string().optional(),
  createdAt: TimestampInput.optional(),
  updatedAt: TimestampInput.optional()
});
