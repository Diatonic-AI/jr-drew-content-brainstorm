import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types/project.types';

// Collection reference
const getTasksRef = (orgId: string, projectId: string) =>
  collection(db, `orgs/${orgId}/projects/${projectId}/tasks`);

/**
 * TASK MANAGEMENT SERVICE
 */
export const taskService = {
  /**
   * Create a new task
   */
  async create(
    orgId: string,
    projectId: string,
    userId: string,
    input: CreateTaskInput
  ): Promise<Task> {
    const tasksRef = getTasksRef(orgId, projectId);

    const taskData = {
      projectId,
      title: input.title,
      description: input.description || '',
      status: input.status || 'todo',
      priority: input.priority || 'medium',
      assigneeId: input.assigneeId || null,
      dueDate: input.dueDate ? Timestamp.fromDate(input.dueDate) : null,
      estimatedHours: input.estimatedHours || null,
      actualHours: 0,
      tags: input.tags || [],
      columnId: input.columnId || null,
      order: input.order || 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId,
      completedAt: null
    };

    const docRef = await addDoc(tasksRef, taskData);

    return { id: docRef.id, ...taskData } as Task;
  },

  /**
   * Get task by ID
   */
  async getById(orgId: string, projectId: string, taskId: string): Promise<Task | null> {
    const taskRef = doc(db, `orgs/${orgId}/projects/${projectId}/tasks/${taskId}`);
    const taskSnap = await getDoc(taskRef);

    if (!taskSnap.exists()) {
      return null;
    }

    return { id: taskSnap.id, ...taskSnap.data() } as Task;
  },

  /**
   * Get all tasks for a project
   */
  async getAll(orgId: string, projectId: string): Promise<Task[]> {
    const tasksRef = getTasksRef(orgId, projectId);
    const q = query(tasksRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  },

  /**
   * Get tasks by status
   */
  async getByStatus(orgId: string, projectId: string, status: string): Promise<Task[]> {
    const tasksRef = getTasksRef(orgId, projectId);
    const q = query(tasksRef, where('status', '==', status), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  },

  /**
   * Get tasks assigned to user
   */
  async getAssignedToUser(orgId: string, userId: string): Promise<Task[]> {
    // Query across all projects for this org
    // Note: This requires composite index in Firestore
    const tasks: Task[] = [];

    // Get all projects first
    const projectsRef = collection(db, `orgs/${orgId}/projects`);
    const projectsSnap = await getDocs(projectsRef);

    // Then get tasks for each project
    for (const projectDoc of projectsSnap.docs) {
      const tasksRef = getTasksRef(orgId, projectDoc.id);
      const q = query(
        tasksRef,
        where('assigneeId', '==', userId),
        orderBy('dueDate', 'asc')
      );
      const tasksSnap = await getDocs(q);

      tasksSnap.docs.forEach(doc => {
        tasks.push({ id: doc.id, ...doc.data() } as Task);
      });
    }

    return tasks;
  },

  /**
   * Update task
   */
  async update(
    orgId: string,
    projectId: string,
    taskId: string,
    input: UpdateTaskInput
  ): Promise<void> {
    const taskRef = doc(db, `orgs/${orgId}/projects/${projectId}/tasks/${taskId}`);

    const updateData: any = {
      ...input,
      updatedAt: Timestamp.now()
    };

    if (input.dueDate) {
      updateData.dueDate = Timestamp.fromDate(input.dueDate);
    }

    // If status changed to completed, set completedAt
    if (input.status === 'done' || input.status === 'completed') {
      updateData.completedAt = Timestamp.now();
    }

    await updateDoc(taskRef, updateData);
  },

  /**
   * Delete task
   */
  async delete(orgId: string, projectId: string, taskId: string): Promise<void> {
    const taskRef = doc(db, `orgs/${orgId}/projects/${projectId}/tasks/${taskId}`);
    await deleteDoc(taskRef);
  },

  /**
   * Move task to different column
   */
  async moveToColumn(
    orgId: string,
    projectId: string,
    taskId: string,
    columnId: string,
    newOrder: number
  ): Promise<void> {
    const taskRef = doc(db, `orgs/${orgId}/projects/${projectId}/tasks/${taskId}`);
    await updateDoc(taskRef, {
      columnId,
      order: newOrder,
      updatedAt: Timestamp.now()
    });
  },

  /**
   * Update task order
   */
  async updateOrder(
    orgId: string,
    projectId: string,
    taskId: string,
    newOrder: number
  ): Promise<void> {
    const taskRef = doc(db, `orgs/${orgId}/projects/${projectId}/tasks/${taskId}`);
    await updateDoc(taskRef, {
      order: newOrder,
      updatedAt: Timestamp.now()
    });
  },

  /**
   * Subscribe to task updates
   */
  subscribe(
    orgId: string,
    projectId: string,
    taskId: string,
    callback: (task: Task | null) => void
  ): () => void {
    const taskRef = doc(db, `orgs/${orgId}/projects/${projectId}/tasks/${taskId}`);

    return onSnapshot(taskRef, doc => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as Task);
      } else {
        callback(null);
      }
    });
  },

  /**
   * Subscribe to all tasks in project
   */
  subscribeToProject(
    orgId: string,
    projectId: string,
    callback: (tasks: Task[]) => void
  ): () => void {
    const tasksRef = getTasksRef(orgId, projectId);
    const q = query(tasksRef, orderBy('order', 'asc'));

    return onSnapshot(q, snapshot => {
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      callback(tasks);
    });
  }
};
