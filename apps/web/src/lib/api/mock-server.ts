import type { AppNotification } from '@/stores/notificationStore';
import type { ActivityEvent, ActivityTimelineBlock } from '@/types/activity';
import type { AIInsight, CoachSuggestion } from '@/types/ai';
import type { BreakAnalytics, BreakPreference, BreakReminder, BreakSession } from '@/types/breaks';
import type { AmbientSound, FocusGoal, FocusSession, FocusTimerSnapshot } from '@/types/focus';
import type { IntegrationConnection, Integration } from '@/types/integrations';
import type { Project, ProjectSummary } from '@/types/projects';
import type { ScoreSnapshot } from '@/types/scores';
import type { Task } from '@/types/tasks';
import type { TrackingConfiguration, TrackingDayTotals } from '@/types/tracking';

import { mockDatabase, type MockDatabase } from './mock-data';

const deepClone = <T>(value: T): T =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T);

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

let db: MockDatabase = deepClone(mockDatabase);

const mergeTrackingConfiguration = (
  current: TrackingConfiguration,
  partial: Partial<TrackingConfiguration>
): TrackingConfiguration => ({
  ...current,
  ...partial,
  workday: { ...current.workday, ...partial.workday },
  breakReminders: { ...current.breakReminders, ...partial.breakReminders },
  privacy: { ...current.privacy, ...partial.privacy }
});

const upsertById = <T extends { id: string }>(collection: T[], entity: T) => {
  const index = collection.findIndex((item) => item.id === entity.id);
  if (index === -1) {
    collection.unshift(entity);
  } else {
    collection[index] = entity;
  }
  return entity;
};

export const mockApi = {
  reset() {
    db = deepClone(mockDatabase);
  },
  projects: {
    async list(): Promise<Project[]> {
      await delay();
      return deepClone(db.projects);
    },
    async summaries(): Promise<ProjectSummary[]> {
      await delay();
      return deepClone(db.projectSummaries);
    },
    async summary(projectId: string): Promise<ProjectSummary | undefined> {
      await delay();
      const summary = db.projectSummaries.find((item) => item.project.id === projectId);
      return summary ? deepClone(summary) : undefined;
    },
    async save(project: Project): Promise<Project> {
      await delay();
      const saved = upsertById(db.projects, project);
      const summaryIndex = db.projectSummaries.findIndex((summary) => summary.project.id === project.id);
      if (summaryIndex !== -1) {
        db.projectSummaries[summaryIndex] = {
          ...db.projectSummaries[summaryIndex],
          project: saved
        };
      }
      return deepClone(saved);
    }
  },
  tasks: {
    async list(): Promise<Task[]> {
      await delay();
      return deepClone(db.tasks);
    },
    async save(task: Task): Promise<Task> {
      await delay();
      const saved = upsertById(db.tasks, task);
      return deepClone(saved);
    }
  },
  tracking: {
    async dayTotals(date: string): Promise<TrackingDayTotals> {
      await delay();
      return deepClone({ ...db.trackingDayTotals, date });
    },
    async events(date: string): Promise<ActivityEvent[]> {
      await delay();
      return deepClone(
        db.activityEvents.filter((event) => event.startTime.startsWith(date))
      );
    },
    async timeline(date: string): Promise<ActivityTimelineBlock[]> {
      await delay();
      return deepClone(db.timelineBlocks.map((block) => ({ ...block, startTime: block.startTime, endTime: block.endTime })));
    },
    async updateConfiguration(configuration: Partial<TrackingConfiguration>): Promise<TrackingConfiguration> {
      await delay();
      db.trackingConfiguration = mergeTrackingConfiguration(db.trackingConfiguration, configuration);
      return deepClone(db.trackingConfiguration);
    },
    async logEvents(events: ActivityEvent[]): Promise<void> {
      if (!events.length) return;
      await delay(60);
      db.activityEvents.push(...events);
    }
  },
  analytics: {
    async scoreSnapshot(date: string): Promise<ScoreSnapshot> {
      await delay();
      return deepClone({ ...db.scoreSnapshot, generatedAt: date });
    }
  },
  breaks: {
    async analytics(date: string): Promise<BreakAnalytics> {
      await delay();
      return deepClone({ ...db.breakAnalytics, date });
    },
    async sessions(): Promise<BreakSession[]> {
      await delay();
      return deepClone(db.breakSessions);
    },
    async reminders(): Promise<BreakReminder[]> {
      await delay();
      return deepClone(db.breakReminders);
    },
    async updatePreference(preference: BreakPreference): Promise<BreakPreference> {
      await delay();
      // Persisted via settings store; nothing to mutate beyond returning clone
      return deepClone(preference);
    },
    async logBreak(session: BreakSession): Promise<BreakSession> {
      await delay();
      const saved = upsertById(db.breakSessions, session);
      return deepClone(saved);
    }
  },
  focus: {
    async sessions(): Promise<FocusSession[]> {
      await delay();
      return deepClone(db.focusSessions);
    },
    async ambientSounds(): Promise<AmbientSound[]> {
      await delay();
      return deepClone(db.ambientSounds);
    },
    async goals(): Promise<FocusGoal[]> {
      await delay();
      return deepClone(db.focusGoals);
    },
    async timerSnapshot(): Promise<FocusTimerSnapshot> {
      await delay();
      return deepClone(db.focusTimerSnapshot);
    },
    async saveSession(session: FocusSession): Promise<FocusSession> {
      await delay();
      const saved = upsertById(db.focusSessions, session);
      if (session.status === 'in-progress') {
        db.focusTimerSnapshot = {
          sessionId: session.id,
          phase: 'focus',
          remainingSeconds: session.plannedDurationMinutes * 60 - (session.segments?.[0]?.durationSeconds ?? 0),
          elapsedSeconds: session.segments?.reduce((total, segment) => total + (segment.durationSeconds ?? 0), 0) ?? 0,
          completionRatio: 0.5,
          soundId: db.focusTimerSnapshot.soundId,
          isMuted: db.focusTimerSnapshot.isMuted,
          isPaused: false
        };
      }
      return deepClone(saved);
    }
  },
  integrations: {
    async list(): Promise<Integration[]> {
      await delay();
      return deepClone(db.integrations);
    },
    async connections(): Promise<IntegrationConnection[]> {
      await delay();
      return deepClone(db.integrationConnections);
    }
  },
  notifications: {
    async list(): Promise<AppNotification[]> {
      await delay(80);
      return deepClone(db.notifications);
    }
  },
  ai: {
    async insights(): Promise<AIInsight[]> {
      await delay();
      return deepClone(db.aiInsights);
    },
    async suggestions(): Promise<CoachSuggestion[]> {
      await delay();
      return deepClone(db.aiSuggestions);
    }
  }
};

export type MockApi = typeof mockApi;
