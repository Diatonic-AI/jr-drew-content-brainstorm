import { z } from 'zod';

export const TimestampMs = z.number().int().nonnegative();
export const OptionalTimestampMs = TimestampMs.optional();

export const ISODateString = z
  .string()
  .regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:.+Z/, { message: 'Expected ISO-8601 timestamp' });

export const UID = z.string().min(6);
export const OrgId = z.string().min(4);
export const ProjectId = z.string().min(4);
export const TaskId = z.string().min(4);

export const DocumentMeta = z.object({
  id: z.string(),
  createdAt: TimestampMs,
  updatedAt: TimestampMs
});

export const LifecycleFlags = z.object({
  archived: z.boolean().default(false),
  deleted: z.boolean().default(false)
});

export const FirestoreDoc = <T extends z.ZodRawShape>(shape: T) =>
  z.object({
    ...shape,
    ...DocumentMeta.shape
  });

export type DocumentMeta = z.infer<typeof DocumentMeta>;
