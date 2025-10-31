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
  limit,
  Timestamp,
  writeBatch,
  onSnapshot,
  Query,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type {
  Project,
  Task,
  CreateProjectInput,
  UpdateProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
  DashboardStats,
  ProjectAnalytics,
  ActivityEvent
} from '@/types/project.types';

// Collection references
const getProjectsRef = (orgId: string) => collection(db, `orgs/${orgId}/projects`);
const getTasksRef = (orgId: string, projectId: string) => 
  collection(db, `orgs/${orgId}/projects/${projectId}/tasks`);
const getActivityRef = (orgId: string) => collection(db, `orgs/${orgId}/activity`);

/**
 * PROJECT MANAGEMENT
 */
export const projectService = {
  /**
   * Create a new project
   */
  async create(orgId: string, userId: string, input: CreateProjectInput): Promise<Project> {
    const projectsRef = getProjectsRef(orgId);
    
    const projectData = {
      orgId,
      name: input.name,
      description: input.description,
      status: 'planning' as const,
      startDate: Timestamp.fromDate(input.startDate),
      endDate: input.endDate ? Timestamp.fromDate(input.endDate) : null,
      ownerId: userId,
      memberIds: input.memberIds || [userId],
      tags: input.tags || [],
      color: input.color || '#3b82f6',
      progress: 0,
      tasksTotal: 0,
      tasksCompleted: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId
    };

    const docRef = await addDoc(projectsRef, projectData);
    
    // Log activity
    await logActivity(orgId, {
      type: 'project_created',
      userId,
      userName: 'User', // TODO: Get from user profile
      projectId: docRef.id,
      projectName: input.name,
      description: `Created project "${input.name}"`,
      timestamp: Timestamp.now()
    });

    return { id: docRef.id, ...projectData } as Project;
  },

  /**
   * Get project by ID
   */
  async getById(orgId: string, projectId: string): Promise<Project | null> {
    const projectRef = doc(db, `orgs/${orgId}/projects/${projectId}`);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) {
      return null;
    }

    return { id: projectSnap.id, ...projectSnap.data() } as Project;
  },

  /**
   * Get all projects for an organization
   */
  async getAll(orgId: string): Promise<Project[]> {
    const projectsRef = getProjectsRef(orgId);
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  },

  /**
   * Get active projects
   */
  async getActive(orgId: string): Promise<Project[]> {
    const projectsRef = getProjectsRef(orgId);
    const q = query(
      projectsRef,
      where('status', 'in', ['planning', 'active']),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  },

  /**
   * Update project
   */
  async update(orgId: string, projectId: string, userId: string, input: UpdateProjectInput): Promise<void> {
    const projectRef = doc(db, `orgs/${orgId}/projects/${projectId}`);
    
    const updateData: any = {
      ...input,
      updatedAt: Timestamp.now()
    };

    if (input.startDate) {
      updateData.startDate = Timestamp.fromDate(input.startDate);
    }
    if (input.endDate) {
      updateData.endDate = Timestamp.fromDate(input.endDate);
    }

    await updateDoc(projectRef, updateData);

    // Log activity
    await logActivity(orgId, {
      type: 'project_updated',
      userId,
      userName: 'User',
      projectId,
      projectName: input.name || 'Project',
      description: `Updated project`,
      timestamp: Timestamp.now()
    });
  },

  /**
   * Delete project
   */
  async delete(orgId: string, projectId: string): Promise<void> {
    const batch = writeBatch(db);
    
    // Delete project document
    const projectRef = doc(db, `orgs/${orgId}/projects/${projectId}`);
    batch.delete(projectRef);
    
    // Delete all tasks (would need to query and batch delete)
    // For now, just delete the project
    await batch.commit();
  },

  /**
   * Subscribe to project updates
   */
  subscribe(orgId: string, projectId: string, callback: (project: Project | null) => void): () => void {
    const projectRef = doc(db, `orgs/${orgId}/projects/${projectId}`);
    
    return onSnapshot(projectRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as Project);
      } else {
        callback(null);
      }
    });
  },

  /**
   * Subscribe to all projects
   */
  subscribeToAll(orgId: string, callback: (projects: Project[]) => void): () => void {
    const projectsRef = getProjectsRef(orgId);
    const q = query(projectsRef, orderBy('updatedAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      callback(projects);
    });
  }
};

/**
 * TASK MANAGEMENT
 */
export const taskService = {
  /**
   * Create a new task
   */
  async create(orgId: string, userId: string, input: CreateTaskInput): Promise<Task> {
    const tasksRef = getTasksRef(orgId, input.projectId);
    
    const taskData = {
      projectId: input.projectId,
      orgId,
      title: input.title,
      description: input.description,
      status: 'todo' as const,
      priority: input.priority,
      assigneeId: input.assigneeId || null,
      reporterId: userId,
      estimatedHours: input.estimatedHours || null,
      actualHours: null,
      dueDate: input.dueDate ? Timestamp.fromDate(input.dueDate) : null,
      completedAt: null,
      tags: input.tags || [],
      dependencies: [],
      order: Date.now(), // Simple ordering
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(tasksRef, taskData);
    
    // Update project task count
    await updateProjectTaskCount(orgId, input.projectId);
    
    // Log activity
    await logActivity(orgId, {
      type: 'task_created',
      userId,
      userName: 'User',
      projectId: input.projectId,
      taskId: docRef.id,
      taskTitle: input.title,
      description: `Created task "${input.title}"`,
      timestamp: Timestamp.now()
    });

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
  async getByProject(orgId: string, projectId: string): Promise<Task[]> {
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
   * Update task
   */
  async update(orgId: string, projectId: string, taskId: string, userId: string, input: UpdateTaskInput): Promise<void> {
    const taskRef = doc(db, `orgs/${orgId}/projects/${projectId}/tasks/${taskId}`);
    
    const updateData: any = {
      ...input,
      updatedAt: Timestamp.now()
    };

    if (input.dueDate) {
      updateData.dueDate = Timestamp.fromDate(input.dueDate);
    }

    // If task is being completed, set completedAt
    if (input.status === 'completed') {
      updateData.completedAt = Timestamp.now();
      
      // Log completion activity
      await logActivity(orgId, {
        type: 'task_completed',
        userId,
        userName: 'User',
        projectId,
        taskId,
        taskTitle: input.title || 'Task',
        description: `Completed task`,
        timestamp: Timestamp.now()
      });
    }

    await updateDoc(taskRef, updateData);
    
    // Update project progress
    await updateProjectTaskCount(orgId, projectId);
  },

  /**
   * Delete task
   */
  async delete(orgId: string, projectId: string, taskId: string): Promise<void> {
    const taskRef = doc(db, `orgs/${orgId}/projects/${projectId}/tasks/${taskId}`);
    await deleteDoc(taskRef);
    
    // Update project task count
    await updateProjectTaskCount(orgId, projectId);
  },

  /**
   * Subscribe to project tasks
   */
  subscribe(orgId: string, projectId: string, callback: (tasks: Task[]) => void): () => void {
    const tasksRef = getTasksRef(orgId, projectId);
    const q = query(tasksRef, orderBy('order', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      callback(tasks);
    });
  }
};

/**
 * DASHBOARD & ANALYTICS
 */
export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  async getStats(orgId: string): Promise<DashboardStats> {
    const projects = await projectService.getAll(orgId);
    const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'planning');
    const completedProjects = projects.filter(p => p.status === 'completed');
    
    // Calculate task statistics across all projects
    const totalTasks = projects.reduce((sum, p) => sum + p.tasksTotal, 0);
    const tasksCompleted = projects.reduce((sum, p) => sum + p.tasksCompleted, 0);
    const tasksInProgress = totalTasks - tasksCompleted;
    const completionRate = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;

    // Get upcoming tasks (would need to query across projects)
    const upcomingDeadlines: Task[] = [];
    
    // Get recent activity
    const activityRef = getActivityRef(orgId);
    const activityQuery = query(activityRef, orderBy('timestamp', 'desc'), limit(10));
    const activitySnap = await getDocs(activityQuery);
    const recentActivity = activitySnap.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as ActivityEvent));

    return {
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      totalTasks,
      tasksInProgress,
      tasksCompleted,
      completionRate: Math.round(completionRate),
      overdueTasksCount: 0, // TODO: Calculate
      upcomingDeadlines,
      recentActivity
    };
  },

  /**
   * Subscribe to dashboard stats
   */
  subscribe(orgId: string, callback: (stats: DashboardStats) => void): () => void {
    // Subscribe to projects and recalculate stats on changes
    return projectService.subscribeToAll(orgId, async () => {
      const stats = await dashboardService.getStats(orgId);
      callback(stats);
    });
  }
};

/**
 * HELPER FUNCTIONS
 */

/**
 * Update project task counts and progress
 */
async function updateProjectTaskCount(orgId: string, projectId: string): Promise<void> {
  const tasksRef = getTasksRef(orgId, projectId);
  const allTasks = await getDocs(tasksRef);
  const tasks = allTasks.docs.map(doc => doc.data() as Task);
  
  const tasksTotal = tasks.length;
  const tasksCompleted = tasks.filter(t => t.status === 'completed').length;
  const progress = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

  const projectRef = doc(db, `orgs/${orgId}/projects/${projectId}`);
  await updateDoc(projectRef, {
    tasksTotal,
    tasksCompleted,
    progress,
    updatedAt: Timestamp.now()
  });
}

/**
 * Log activity event
 */
async function logActivity(orgId: string, event: Omit<ActivityEvent, 'id'>): Promise<void> {
  const activityRef = getActivityRef(orgId);
  await addDoc(activityRef, event);
}
