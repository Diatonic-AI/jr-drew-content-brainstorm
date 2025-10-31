import { collection, doc, type Firestore } from 'firebase/firestore';

import { buildConverter } from './converters';
import { OrgSchema } from '../../schemas/organization';
import { ProjectSchema } from '../../schemas/project';
import { TaskSchema } from '../../schemas/task';
import { UserDoc } from '../../schemas/user';

export const usersCollection = (db: Firestore) =>
  collection(db, 'users').withConverter(buildConverter(UserDoc));

export const userDoc = (db: Firestore, uid: string) =>
  doc(db, 'users', uid).withConverter(buildConverter(UserDoc));

export const orgsCollection = (db: Firestore) =>
  collection(db, 'orgs').withConverter(buildConverter(OrgSchema));

export const orgDoc = (db: Firestore, orgId: string) =>
  doc(db, 'orgs', orgId).withConverter(buildConverter(OrgSchema));

export const projectsCollection = (db: Firestore, orgId: string) =>
  collection(db, `orgs/${orgId}/projects`).withConverter(buildConverter(ProjectSchema));

export const projectDoc = (db: Firestore, orgId: string, projectId: string) =>
  doc(db, `orgs/${orgId}/projects/${projectId}`).withConverter(buildConverter(ProjectSchema));

export const tasksCollection = (db: Firestore, orgId: string, projectId: string) =>
  collection(db, `orgs/${orgId}/projects/${projectId}/tasks`).withConverter(buildConverter(TaskSchema));

export const taskDoc = (db: Firestore, orgId: string, projectId: string, taskId: string) =>
  doc(db, `orgs/${orgId}/projects/${projectId}/tasks/${taskId}`).withConverter(buildConverter(TaskSchema));
