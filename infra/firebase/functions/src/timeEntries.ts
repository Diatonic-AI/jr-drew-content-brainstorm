import {
  onCall,
  HttpsError,
  type CallableRequest,
} from 'firebase-functions/v2/https';
import {
  FieldValue,
  Timestamp,
  type DocumentSnapshot,
} from 'firebase-admin/firestore';
import { z } from 'zod';

import { getDb } from './lib/firebase.js';
import {
  TimeEntrySchema,
  CreateTimeEntrySchema,
} from '../../schemas/timeEntries.schema.js';
import { ActivitySchema } from '../../schemas/activity.schema.js';

const db = getDb();

const StopTimeEntrySchema = z.object({
  entryId: z.string().min(1),
  end: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  billable: z.boolean().optional(),
});

const GetTimeEntriesSchema = z
  .object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    projectId: z.string().optional(),
    taskId: z.string().optional(),
    limit: z.number().int().min(1).max(500).optional(),
  })
  .strict();

function requireAuth<T>(request: CallableRequest<T>): string {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication is required.');
  }
  return request.auth.uid;
}

function toIsoString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  return undefined;
}

function sanitizeTags(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === 'string') : [];
}

async function serializeTimeEntry(
  snapshot: DocumentSnapshot
): Promise<z.infer<typeof TimeEntrySchema>> {
  const data = snapshot.data();
  if (!data) {
    throw new HttpsError('internal', 'Time entry payload missing.');
  }

  const start = toIsoString(data.start) ?? new Date().toISOString();
  const end = data.end == null ? null : toIsoString(data.end) ?? null;
  const createdAt = toIsoString(data.createdAt) ?? new Date().toISOString();
  const updatedAt =
    toIsoString(data.updatedAt) ?? toIsoString(data.createdAt) ?? createdAt;

  const entry = {
    id: snapshot.id,
    userId: data.userId as string,
    projectId: data.projectId as string | undefined,
    taskId: data.taskId as string | undefined,
    start,
    end,
    duration:
      typeof data.duration === 'number' && Number.isFinite(data.duration)
        ? data.duration
        : null,
    notes: typeof data.notes === 'string' ? data.notes : undefined,
    tags: sanitizeTags(data.tags),
    billable: typeof data.billable === 'boolean' ? data.billable : false,
    createdAt,
    updatedAt,
  };

  return TimeEntrySchema.parse(entry);
}

export const startTimeEntry = onCall(
  { region: 'us-central1' },
  async (request) => {
    const userId = requireAuth(request);

    const parsed = CreateTimeEntrySchema.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid payload.',
        parsed.error.flatten()
      );
    }

    const payload = parsed.data;

    const existingActive = await db
      .collection('timeEntries')
      .where('userId', '==', userId)
      .where('end', '==', null)
      .limit(1)
      .get();

    if (!existingActive.empty) {
      throw new HttpsError(
        'failed-precondition',
        'An active timer is already running.'
      );
    }

    const timeEntryRef = db.collection('timeEntries').doc();
    const nowIso = new Date().toISOString();

    const timeEntryData: Record<string, unknown> = {
      id: timeEntryRef.id,
      userId,
      start: payload.start ?? nowIso,
      end: payload.end ?? null,
      duration: null,
      tags: Array.isArray(payload.tags) ? payload.tags : [],
      billable: payload.billable ?? false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (payload.projectId) {
      timeEntryData.projectId = payload.projectId;
    }
    if (payload.taskId) {
      timeEntryData.taskId = payload.taskId;
    }
    if (payload.notes) {
      timeEntryData.notes = payload.notes;
    }

    await timeEntryRef.set(timeEntryData);

    await logActivity({
      userId,
      action: 'timeEntry.start',
      entityType: 'timeEntry',
      entityId: timeEntryRef.id,
      context: {
        projectId: payload.projectId ?? null,
        taskId: payload.taskId ?? null,
      },
    });

    const persisted = await timeEntryRef.get();
    return serializeTimeEntry(persisted);
  }
);

export const stopTimeEntry = onCall(
  { region: 'us-central1' },
  async (request) => {
    const userId = requireAuth(request);

    const parsed = StopTimeEntrySchema.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid payload.',
        parsed.error.flatten()
      );
    }

    const { entryId, end, notes, tags, billable } = parsed.data;
    const entryRef = db.collection('timeEntries').doc(entryId);
    const entrySnap = await entryRef.get();

    if (!entrySnap.exists) {
      throw new HttpsError('not-found', 'Time entry not found.');
    }

    const entryData = await serializeTimeEntry(entrySnap);

    if (entryData.userId !== userId) {
      throw new HttpsError(
        'permission-denied',
        'Cannot modify another user entry.'
      );
    }

    if (entryData.end) {
      throw new HttpsError(
        'failed-precondition',
        'This time entry is already stopped.'
      );
    }

    const endDate = end ? new Date(end) : new Date();
    const startDate = new Date(entryData.start);
    const durationSeconds = Math.max(
      0,
      Math.round((endDate.getTime() - startDate.getTime()) / 1000)
    );

    const updateData: Record<string, unknown> = {
      end: endDate.toISOString(),
      duration: durationSeconds,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (typeof notes === 'string') {
      updateData.notes = notes;
    }
    if (Array.isArray(tags)) {
      updateData.tags = tags;
    }
    if (typeof billable === 'boolean') {
      updateData.billable = billable;
    }

    await entryRef.update(updateData);

    await logActivity({
      userId,
      action: 'timeEntry.stop',
      entityType: 'timeEntry',
      entityId: entryId,
      context: {
        duration: durationSeconds,
      },
    });

    const updatedSnap = await entryRef.get();
    return serializeTimeEntry(updatedSnap);
  }
);

export const getTimeEntries = onCall(
  { region: 'us-central1' },
  async (request) => {
    const userId = requireAuth(request);

    const parsed = GetTimeEntriesSchema.safeParse(request.data ?? {});
    if (!parsed.success) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid query parameters.',
        parsed.error.flatten()
      );
    }

    const { startDate, endDate, projectId, taskId, limit } = parsed.data;

    let query = db
      .collection('timeEntries')
      .where('userId', '==', userId)
      .orderBy('start', 'desc')
      .limit(limit ?? 100);

    if (projectId) {
      query = query.where('projectId', '==', projectId);
    }

    if (taskId) {
      query = query.where('taskId', '==', taskId);
    }

    if (startDate) {
      query = query.where('start', '>=', startDate);
    }

    if (endDate) {
      query = query.where('start', '<=', endDate);
    }

    const snapshot = await query.get();
    const entries = await Promise.all(snapshot.docs.map(serializeTimeEntry));

    return { entries };
  }
);

async function logActivity(activity: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  context?: Record<string, unknown> | null;
}) {
  const activityRef = db.collection('activity').doc();
  const isoNow = new Date().toISOString();

  const parsed = ActivitySchema.safeParse({
    ...activity,
    id: activityRef.id,
    timestamp: isoNow,
  });

  if (!parsed.success) {
    throw new HttpsError(
      'internal',
      'Failed to log activity.',
      parsed.error.flatten()
    );
  }

  const { timestamp, ...rest } = parsed.data;

  await activityRef.set({
    ...rest,
    timestamp: FieldValue.serverTimestamp(),
  });
}
