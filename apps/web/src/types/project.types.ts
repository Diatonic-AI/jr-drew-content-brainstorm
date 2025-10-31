import { Timestamp } from 'firebase/firestore';

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Project {
  id: string;
  orgId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Timestamp;
  endDate?: Timestamp;
  ownerId: string;
  memberIds: string[];
  tags: string[];
  color?: string;
  progress: number; // 0-100
  tasksTotal: number;
  tasksCompleted: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface Task {
  id: string;
  projectId: string;
  orgId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  reporterId: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Timestamp;
  completedAt?: Timestamp;
  tags: string[];
  dependencies: string[]; // IDs of tasks this depends on
  order: number; // For drag-and-drop ordering
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TeamMember {
  id: string;
  orgId: string;
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: MemberRole;
  projectIds: string[];
  tasksAssigned: number;
  tasksCompleted: number;
  joinedAt: Timestamp;
  lastActiveAt: Timestamp;
}

export interface ProjectAnalytics {
  projectId: string;
  completionRate: number;
  velocityThisWeek: number;
  velocityLastWeek: number;
  averageTaskCompletionTime: number; // in hours
  blockedTasks: number;
  overdueTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByPriority: Record<TaskPriority, number>;
  memberContributions: Record<string, number>;
  updatedAt: Timestamp;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  tasksInProgress: number;
  tasksCompleted: number;
  completionRate: number;
  overdueTasksCount: number;
  upcomingDeadlines: Task[];
  recentActivity: ActivityEvent[];
}

export interface ActivityEvent {
  id: string;
  type: 'project_created' | 'project_updated' | 'task_created' | 'task_completed' | 'task_assigned' | 'member_added';
  userId: string;
  userName: string;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskTitle?: string;
  description: string;
  timestamp: Timestamp;
}

// Frontend display types
export interface ProjectCard {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  tasksTotal: number;
  tasksCompleted: number;
  memberCount: number;
  dueDate?: Date;
  color?: string;
}

export interface TaskCard {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: {
    id: string;
    name: string;
    photoURL?: string;
  };
  dueDate?: Date;
  tags: string[];
}

// Request/Response types
export interface CreateProjectInput {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  tags?: string[];
  color?: string;
  memberIds?: string[];
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  color?: string;
  memberIds?: string[];
}

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId?: string;
  estimatedHours?: number;
  dueDate?: Date;
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  tags?: string[];
}
