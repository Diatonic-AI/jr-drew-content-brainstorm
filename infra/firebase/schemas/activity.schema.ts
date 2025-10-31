import { z } from 'zod';

export const ActivitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  timestamp: z.string().datetime(),
  context: z.record(z.unknown()).optional(),
  changes: z
    .object({
      before: z.record(z.unknown()).optional(),
      after: z.record(z.unknown()).optional(),
    })
    .optional(),
});

export type Activity = z.infer<typeof ActivitySchema>;
