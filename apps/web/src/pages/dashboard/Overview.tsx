import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@diatonic/ui';
import { Plus, ArrowRight, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { dashboardService, projectService } from '@/services/project.service';
import type { DashboardStats, Project } from '@/types/project.types';

const DashboardOverview = () => {
  const { currentOrg, userProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get orgId from currentOrg
  const orgId = currentOrg?.id;

  useEffect(() => {
    if (!orgId) {
      // Still loading auth context
      return;
    }

    // Load initial data
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [dashStats, allProjects] = await Promise.all([
          dashboardService.getStats(orgId),
          projectService.getAll(orgId)
        ]);
        
        setStats(dashStats);
        setProjects(allProjects.slice(0, 6)); // Show only first 6 projects
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    const unsubscribe = dashboardService.subscribe(orgId, (updatedStats) => {
      setStats(updatedStats);
    });

    return () => unsubscribe();
  }, [orgId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl border border-border bg-muted/40" />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-xl border border-border bg-muted/40" />
          <div className="h-96 animate-pulse rounded-xl border border-border bg-muted/40" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-semibold">Failed to load dashboard</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">No data available</h2>
        <p className="mt-2 text-sm text-muted-foreground">Start by creating your first project</p>
      </div>
    );
  }

  const hasProjects = projects.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <Link to="/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          subtitle={`${stats.activeProjects} active`}
          icon={<TrendingUp className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          subtitle={`${stats.tasksInProgress} in progress`}
          icon={<Clock className="h-5 w-5" />}
          color="purple"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.tasksCompleted}
          subtitle={`${stats.completionRate}% completion rate`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Overdue Tasks"
          value={stats.overdueTasksCount}
          subtitle="Needs attention"
          icon={<AlertCircle className="h-5 w-5" />}
          color={stats.overdueTasksCount > 0 ? 'red' : 'gray'}
        />
      </div>

      {/* Projects Section */}
      {hasProjects ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Projects</h2>
            <Link to="/projects">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Activity</h2>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completion Rate Progress */}
      {stats.totalTasks > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Overall Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Task Completion</span>
              <span className="font-medium">{stats.completionRate}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.tasksCompleted} of {stats.totalTasks} tasks completed
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Stat Card Component
 */
interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'green' | 'red' | 'gray';
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    purple: 'bg-purple-500/10 text-purple-500',
    green: 'bg-green-500/10 text-green-500',
    red: 'bg-red-500/10 text-red-500',
    gray: 'bg-gray-500/10 text-gray-500'
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Project Card Component
 */
interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    planning: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    'on-hold': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    completed: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    archived: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  };

  return (
    <Link to={`/projects/${project.id}`}>
      <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold group-hover:text-primary">{project.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
          </div>
          <span className={`rounded-full border px-2 py-1 text-xs font-medium ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {project.tasksCompleted}/{project.tasksTotal} tasks
            </span>
            <span>{project.memberIds.length} members</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Activity Item Component
 */
interface ActivityItemProps {
  activity: any;
}

function ActivityItem({ activity }: ActivityItemProps) {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'project_created':
        return <Plus className="h-4 w-4" />;
      case 'task_completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'task_created':
        return <Plus className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const timeAgo = (timestamp: any) => {
    const seconds = Math.floor((Date.now() - timestamp.toMillis()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-primary/10 p-2 text-primary">{getActivityIcon()}</div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">{activity.userName}</span> {activity.description}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{timeAgo(activity.timestamp)}</p>
      </div>
    </div>
  );
}

/**
 * Empty State Component
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 py-12">
      <div className="rounded-full bg-primary/10 p-4">
        <TrendingUp className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Get started by creating your first project to track tasks and progress.
      </p>
      <Link to="/projects/new">
        <Button className="mt-6 gap-2">
          <Plus className="h-4 w-4" />
          Create Your First Project
        </Button>
      </Link>
    </div>
  );
}

export default DashboardOverview;
