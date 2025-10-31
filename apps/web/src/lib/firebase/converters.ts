import type { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { type z } from 'zod';

const normalizeTimestamps = (data: Record<string, unknown>) => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      result[key] = value.toMillis();
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => (item instanceof Timestamp ? item.toMillis() : item));
    } else {
      result[key] = value;
    }
  }
  return result;
};

export const buildConverter = <Schema extends z.ZodTypeAny>(schema: Schema): FirestoreDataConverter<z.infer<Schema>> => ({
  toFirestore: (modelObject: z.infer<Schema>): DocumentData => ({ ...modelObject }),
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const raw = normalizeTimestamps({ id: snapshot.id, ...snapshot.data(options) });
    return schema.parse(raw);
  }
});

export const parseWith = <Schema extends z.ZodTypeAny>(schema: Schema) => (input: unknown) => schema.parse(input);
