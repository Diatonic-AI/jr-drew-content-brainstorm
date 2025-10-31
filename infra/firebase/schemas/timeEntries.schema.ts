import { z } from 'zod';

export const TimeEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  start: z.string().datetime(),
  end: z.string().datetime().nullable().optional(),
  duration: z.number().int().nonnegative().nullable().optional(),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).default([]),
  billable: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export type TimeEntry = z.infer<typeof TimeEntrySchema>;

export const CreateTimeEntrySchema = TimeEntrySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  duration: true,
}).extend({
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
});

export const UpdateTimeEntrySchema = TimeEntrySchema.partial().omit({
  id: true,
  userId: true,
  createdAt: true,
});
