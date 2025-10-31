import { z } from 'zod';

const SortSchema = z.object({
  by: z.string(),
  dir: z.enum(['asc', 'desc']),
});

export const SavedViewSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  scope: z.enum(['user', 'org']),
  orgId: z.string().optional(),
  route: z.string(),
  name: z.string().min(1).max(100),
  filters: z.record(z.unknown()).optional(),
  sorts: z.array(SortSchema).default([]),
  columns: z.array(z.string()).optional(),
  grouping: z.string().optional(),
  range: z
    .object({
      from: z.number(),
      to: z.number(),
    })
    .optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export type SavedView = z.infer<typeof SavedViewSchema>;
