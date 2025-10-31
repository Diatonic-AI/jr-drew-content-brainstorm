import type { AppNotification } from '@/stores/notificationStore';
import type {
  ActivityAnomaly,
  ActivityDaySummary,
  ActivityEvent,
  ActivityTimelineBlock,
  ActivityTag
} from '@/types/activity';
import type { AIInsight, CoachSuggestion } from '@/types/ai';
import type { BreakAnalytics, BreakReminder, BreakSession } from '@/types/breaks';
import type { AmbientSound, FocusGoal, FocusSession, FocusTimerSnapshot } from '@/types/focus';
import type { Integration, IntegrationConnection } from '@/types/integrations';
import type { Project, ProjectSummary } from '@/types/projects';
import type { ScoreSnapshot } from '@/types/scores';
import type { Task } from '@/types/tasks';
import type {
  TrackingAlert,
  TrackingConfiguration,
  TrackingDayTotals,
  TrackingDiagnostics,
  TrackingSession
} from '@/types/tracking';

const TODAY = '2025-10-29';
const YESTERDAY = '2025-10-28';
const THIS_WEEK_START = '2025-10-27';
const primaryUserId = 'user-amber';
const secondaryUserId = 'user-lina';
const workspaceId = 'workspace-rize-demo';

const makeIso = (date: string, time: string) => `${date}T${time}:00.000Z`;

const focusTag: ActivityTag = {
  id: 'tag-deep-work',
  label: 'Deep Work',
  category: 'development',
  color: '#22d3ee'
};

export const projects: Project[] = [
  {
    id: 'proj-analytics-hub',
    name: 'Customer Intelligence Hub',
    description: 'Build analytics pipeline for multi-channel engagement insights.',
    status: 'active',
    type: 'client',
    color: '#6366f1',
    icon: 'trending-up',
    clientId: 'client-aurora',
    clientName: 'Aurora Labs',
    tags: ['analytics', 'ai-assisted'],
    isBillable: true,
    hourlyRate: 185,
    estimatedMinutes: 5800,
    createdAt: makeIso('2025-07-14', '15:00'),
    updatedAt: makeIso('2025-10-28', '17:45'),
    startDate: makeIso('2025-07-21', '09:00'),
    dueDate: makeIso('2025-11-15', '23:59'),
    ownerId: primaryUserId,
    members: [
      { userId: primaryUserId, role: 'owner', allocationPercentage: 60, joinedAt: makeIso('2025-07-14', '15:00') },
      { userId: secondaryUserId, role: 'contributor', allocationPercentage: 40, joinedAt: makeIso('2025-08-01', '13:00') }
    ],
    milestones: [
      {
        id: 'ms-realtime-dashboard',
        title: 'Realtime dashboard beta',
        description: 'Ship the realtime activity stream with performance budget <200ms.',
        dueDate: makeIso('2025-11-05', '17:00'),
        status: 'in-progress',
        progressPercent: 75
      },
      {
        id: 'ms-signal-model',
        title: 'Signal scoring model',
        description: 'Deploy V2 model to classify focus vs. collaboration events.',
        dueDate: makeIso('2025-10-31', '18:00'),
        status: 'in-progress',
        progressPercent: 55
      }
    ]
  },
  {
    id: 'proj-onboarding-flow',
    name: 'Onboarding Flow Refresh',
    description: 'Redesign onboarding to shorten time-to-value for new teams.',
    status: 'active',
    type: 'internal',
    color: '#f97316',
    icon: 'sparkles',
    clientId: 'internal',
    clientName: 'Product Core',
    tags: ['growth', 'activation'],
    isBillable: false,
    estimatedMinutes: 3200,
    createdAt: makeIso('2025-08-04', '14:30'),
    updatedAt: makeIso('2025-10-27', '18:20'),
    startDate: makeIso('2025-08-11', '09:30'),
    dueDate: makeIso('2025-12-05', '21:00'),
    ownerId: secondaryUserId,
    members: [
      { userId: secondaryUserId, role: 'owner', allocationPercentage: 50, joinedAt: makeIso('2025-08-04', '14:30') },
      { userId: primaryUserId, role: 'contributor', allocationPercentage: 25, joinedAt: makeIso('2025-09-01', '10:00') }
    ],
    milestones: [
      {
        id: 'ms-user-journey',
        title: 'Journey mapping completed',
        status: 'completed',
        progressPercent: 100,
        completedAt: makeIso('2025-09-18', '22:00'),
        dueDate: makeIso('2025-09-20', '22:00')
      },
      {
        id: 'ms-experiment-plan',
        title: 'Activation experiment plan',
        status: 'pending',
        dueDate: makeIso('2025-11-18', '17:00'),
        progressPercent: 10
      }
    ]
  },
  {
    id: 'proj-ops-automation',
    name: 'RevOps Automation Toolkit',
    description: 'Automate weekly revenue health checks with workflow templates.',
    status: 'paused',
    type: 'client',
    color: '#10b981',
    icon: 'workflow',
    clientId: 'client-nimbus',
    clientName: 'Nimbus Operations',
    tags: ['automation', 'workflow'],
    isBillable: true,
    hourlyRate: 150,
    estimatedMinutes: 2100,
    createdAt: makeIso('2025-05-22', '20:00'),
    updatedAt: makeIso('2025-10-10', '19:15'),
    startDate: makeIso('2025-06-01', '10:00'),
    ownerId: primaryUserId,
    members: [
      { userId: primaryUserId, role: 'owner', allocationPercentage: 30, joinedAt: makeIso('2025-05-22', '20:00') },
      { userId: 'user-sam', role: 'viewer', allocationPercentage: 20, joinedAt: makeIso('2025-06-05', '16:45') }
    ],
    milestones: [
      {
        id: 'ms-beta-playbooks',
        title: 'Beta playbook launch',
        status: 'on-hold',
        dueDate: makeIso('2025-10-07', '16:00'),
        progressPercent: 35
      }
    ]
  }
];

export const projectSummaries: ProjectSummary[] = [
  {
    project: projects[0],
    allocation: {
      projectId: 'proj-analytics-hub',
      totalTrackedMinutes: 428,
      focusMinutes: 318,
      meetingMinutes: 64,
      documentationMinutes: 46,
      percentage: 0.42
    },
    health: [
      { name: 'On Track', value: 82, status: 'on-track', trend: 'up', description: 'Velocity is above target for the sprint.' },
      { name: 'Risk', value: 18, status: 'at-risk', trend: 'steady', description: 'Model training blocked by data drift warnings.' }
    ],
    activeTasks: 6,
    overdueTasks: 1,
    upcomingMilestones: projects[0].milestones.filter((milestone) => milestone.progressPercent < 100)
  },
  {
    project: projects[1],
    allocation: {
      projectId: 'proj-onboarding-flow',
      totalTrackedMinutes: 286,
      focusMinutes: 160,
      meetingMinutes: 92,
      documentationMinutes: 34,
      percentage: 0.28
    },
    health: [
      { name: 'On Track', value: 68, status: 'at-risk', trend: 'down', description: 'Need more design bandwidth for experimentation.' },
      { name: 'Engagement', value: 74, status: 'on-track', trend: 'up', description: 'Beta cohort adoption trending upward.' }
    ],
    activeTasks: 4,
    overdueTasks: 2,
    upcomingMilestones: projects[1].milestones.filter((milestone) => milestone.progressPercent < 100)
  },
  {
    project: projects[2],
    allocation: {
      projectId: 'proj-ops-automation',
      totalTrackedMinutes: 102,
      focusMinutes: 62,
      meetingMinutes: 24,
      documentationMinutes: 16,
      percentage: 0.1
    },
    health: [
      { name: 'On Track', value: 45, status: 'off-track', trend: 'down', description: 'Paused awaiting client approval.' }
    ],
    activeTasks: 2,
    overdueTasks: 1,
    upcomingMilestones: projects[2].milestones.filter((milestone) => milestone.progressPercent < 100)
  }
];

export const tasks: Task[] = [
  {
    id: 'task-analytics-stream',
    projectId: 'proj-analytics-hub',
    title: 'Wire realtime timeline stream to dashboard',
    description: 'Hook websocket events into dashboard timeline blocks and ensure optimistic updates.',
    status: 'in-progress',
    priority: 'high',
    tags: ['realtime', 'frontend'],
    assignees: [
      { userId: primaryUserId, assignedAt: makeIso('2025-10-21', '14:00'), effortAllocationPercent: 70 }
    ],
    checklist: [
      { id: 'chk-timeline', title: 'Timeline reconciles against activity store', completed: true, completedAt: makeIso('2025-10-27', '18:40'), assigneeId: primaryUserId },
      { id: 'chk-handoff', title: 'QA handoff notes captured', completed: false }
    ],
    dependencies: [],
    estimatedMinutes: 540,
    actualMinutes: 360,
    dueDate: makeIso('2025-11-01', '17:00'),
    startDate: makeIso('2025-10-20', '09:00'),
    createdAt: makeIso('2025-10-15', '16:20'),
    updatedAt: makeIso('2025-10-29', '15:10'),
    activityScore: 83,
    lastActivityAt: makeIso('2025-10-29', '14:55')
  },
  {
    id: 'task-ml-alerting',
    projectId: 'proj-analytics-hub',
    title: 'Implement anomaly alerting for idle detection',
    description: 'Enable the anomaly worker to raise alerts when idle mode drifts.',
    status: 'todo',
    priority: 'medium',
    tags: ['ml', 'backend'],
    assignees: [
      { userId: secondaryUserId, assignedAt: makeIso('2025-10-24', '12:00') }
    ],
    checklist: [
      { id: 'chk-thresholds', title: 'Review detection thresholds with data science', completed: false },
      { id: 'chk-alert-template', title: 'Wire Slack alert template', completed: false }
    ],
    dependencies: [{ taskId: 'task-analytics-stream', type: 'blocked-by' }],
    estimatedMinutes: 420,
    startDate: makeIso('2025-10-28', '10:00'),
    createdAt: makeIso('2025-10-24', '12:00'),
    updatedAt: makeIso('2025-10-28', '10:00'),
    lastActivityAt: makeIso('2025-10-28', '10:00')
  },
  {
    id: 'task-welcome-email',
    projectId: 'proj-onboarding-flow',
    title: 'Ship redesigned welcome email',
    description: 'Coordinate copy, design, and experiment tracking for welcome email refresh.',
    status: 'review',
    priority: 'medium',
    tags: ['activation', 'email'],
    assignees: [{ userId: secondaryUserId, assignedAt: makeIso('2025-10-10', '09:30') }],
    checklist: [
      { id: 'chk-copy', title: 'Copy reviewed', completed: true, completedAt: makeIso('2025-10-24', '18:30'), assigneeId: secondaryUserId },
      { id: 'chk-delivery', title: 'ESP automation updated', completed: false }
    ],
    dependencies: [],
    estimatedMinutes: 180,
    actualMinutes: 140,
    dueDate: makeIso('2025-10-30', '16:00'),
    startDate: makeIso('2025-10-08', '14:00'),
    createdAt: makeIso('2025-09-28', '12:00'),
    lastActivityAt: makeIso('2025-10-28', '21:15')
  },
  {
    id: 'task-experiment-sunset',
    projectId: 'proj-onboarding-flow',
    title: 'Sunset experiment variant with low activation lift',
    status: 'done',
    priority: 'low',
    tags: ['experiment', 'cleanup'],
    assignees: [{ userId: secondaryUserId, assignedAt: makeIso('2025-10-12', '15:00') }],
    checklist: [],
    dependencies: [],
    estimatedMinutes: 60,
    actualMinutes: 45,
    dueDate: makeIso('2025-10-22', '12:00'),
    startDate: makeIso('2025-10-20', '13:00'),
    completedAt: makeIso('2025-10-22', '11:40'),
    createdAt: makeIso('2025-10-11', '09:00'),
    lastActivityAt: makeIso('2025-10-22', '11:45')
  }
];

export const timelineBlocks: ActivityTimelineBlock[] = [
  {
    id: 'block-standup',
    startTime: makeIso(TODAY, '08:00'),
    endTime: makeIso(TODAY, '09:30'),
    durationSeconds: 5400,
    category: 'meeting',
    dominantTag: { id: 'tag-standup', label: 'Daily Standup', category: 'meeting', color: '#f59e0b' },
    projectId: 'proj-analytics-hub',
    eventIds: ['evt-standup', 'evt-sync'],
    score: 72
  },
  {
    id: 'block-deep-work-am',
    startTime: makeIso(TODAY, '09:30'),
    endTime: makeIso(TODAY, '11:45'),
    durationSeconds: 8100,
    category: 'development',
    dominantTag: focusTag,
    projectId: 'proj-analytics-hub',
    taskId: 'task-analytics-stream',
    eventIds: ['evt-focus-1', 'evt-focus-2'],
    score: 88
  },
  {
    id: 'block-break',
    startTime: makeIso(TODAY, '11:45'),
    endTime: makeIso(TODAY, '12:00'),
    durationSeconds: 900,
    category: 'break',
    eventIds: ['evt-break-1']
  },
  {
    id: 'block-deep-work-pm',
    startTime: makeIso(TODAY, '12:30'),
    endTime: makeIso(TODAY, '14:00'),
    durationSeconds: 5400,
    category: 'development',
    dominantTag: focusTag,
    projectId: 'proj-onboarding-flow',
    taskId: 'task-welcome-email',
    eventIds: ['evt-focus-3', 'evt-collab-1'],
    score: 82
  }
];

export const activityEvents: ActivityEvent[] = [
  {
    id: 'evt-standup',
    userId: primaryUserId,
    capturedAt: makeIso(TODAY, '08:45'),
    startTime: makeIso(TODAY, '08:00'),
    endTime: makeIso(TODAY, '08:45'),
    durationSeconds: 2700,
    source: 'desktop',
    application: {
      name: 'Google Meet',
      identifier: 'google-meet',
      category: 'communication',
      accentColor: '#3b82f6',
      icon: 'video'
    },
    windowTitle: 'Daily Standup — Customer Intelligence',
    url: 'https://meet.google.com/demo-standup',
    projectId: 'proj-analytics-hub',
    tags: [{ id: 'tag-standup', label: 'Standup', category: 'meeting' }],
    category: 'meeting',
    score: 70
  },
  {
    id: 'evt-sync',
    userId: primaryUserId,
    capturedAt: makeIso(TODAY, '09:35'),
    startTime: makeIso(TODAY, '08:45'),
    endTime: makeIso(TODAY, '09:30'),
    durationSeconds: 2700,
    source: 'desktop',
    application: {
      name: 'Slack',
      identifier: 'slack',
      category: 'communication',
      accentColor: '#a855f7'
    },
    windowTitle: '⚡️ #revops sync',
    url: 'slack://channel?id=revops',
    projectId: 'proj-analytics-hub',
    category: 'communication',
    tags: [{ id: 'tag-sync', label: 'Team Sync', category: 'meeting' }],
    score: 64
  },
  {
    id: 'evt-focus-1',
    userId: primaryUserId,
    capturedAt: makeIso(TODAY, '10:00'),
    startTime: makeIso(TODAY, '09:30'),
    endTime: makeIso(TODAY, '10:30'),
    durationSeconds: 3600,
    source: 'desktop',
    application: {
      name: 'VS Code',
      identifier: 'vscode',
      category: 'development',
      accentColor: '#2563eb'
    },
    windowTitle: 'timeline-service.ts — Rize Web',
    url: 'vscode://file/timeline-service.ts',
    projectId: 'proj-analytics-hub',
    taskId: 'task-analytics-stream',
    tags: [focusTag],
    category: 'development',
    score: 92,
    interactionCounts: { keyboard: 754, mouse: 182 }
  },
  {
    id: 'evt-focus-2',
    userId: primaryUserId,
    capturedAt: makeIso(TODAY, '11:50'),
    startTime: makeIso(TODAY, '10:30'),
    endTime: makeIso(TODAY, '11:45'),
    durationSeconds: 4500,
    source: 'desktop',
    application: {
      name: 'Cursor',
      identifier: 'cursor-ai',
      category: 'development',
      accentColor: '#14b8a6'
    },
    windowTitle: 'Implement break detection heuristics',
    url: 'cursor://workspace/rize',
    projectId: 'proj-analytics-hub',
    taskId: 'task-analytics-stream',
    tags: [focusTag],
    category: 'development',
    score: 86,
    interactionCounts: { keyboard: 612, mouse: 98 }
  },
  {
    id: 'evt-break-1',
    userId: primaryUserId,
    capturedAt: makeIso(TODAY, '12:00'),
    startTime: makeIso(TODAY, '11:45'),
    endTime: makeIso(TODAY, '12:00'),
    durationSeconds: 900,
    source: 'manual',
    application: { name: 'Break Timer', identifier: 'break-timer', category: 'break', accentColor: '#f97316' },
    category: 'break',
    tags: [{ id: 'tag-break', label: 'Micro break', category: 'break' }],
    score: 100
  },
  {
    id: 'evt-focus-3',
    userId: secondaryUserId,
    capturedAt: makeIso(TODAY, '13:30'),
    startTime: makeIso(TODAY, '12:30'),
    endTime: makeIso(TODAY, '13:45'),
    durationSeconds: 4500,
    source: 'desktop',
    application: { name: 'Figma', identifier: 'figma', category: 'design', accentColor: '#8b5cf6' },
    windowTitle: 'Onboarding welcome email',
    url: 'https://figma.com/file/onboarding-email',
    projectId: 'proj-onboarding-flow',
    taskId: 'task-welcome-email',
    tags: [{ id: 'tag-design', label: 'Design', category: 'design' }],
    category: 'design',
    score: 80
  },
  {
    id: 'evt-collab-1',
    userId: secondaryUserId,
    capturedAt: makeIso(TODAY, '14:05'),
    startTime: makeIso(TODAY, '13:45'),
    endTime: makeIso(TODAY, '14:00'),
    durationSeconds: 900,
    source: 'desktop',
    application: { name: 'Linear', identifier: 'linear', category: 'project-management', accentColor: '#0ea5e9' },
    windowTitle: 'QA TODOs — Linear',
    url: 'https://linear.app/rize/view/QA-234',
    projectId: 'proj-onboarding-flow',
    taskId: 'task-welcome-email',
    tags: [{ id: 'tag-qa', label: 'QA', category: 'documentation' }],
    category: 'documentation',
    score: 78
  }
];

export const activityDaySummary: ActivityDaySummary = {
  date: TODAY,
  totalTrackedSeconds: activityEvents.reduce((total, event) => total + event.durationSeconds, 0),
  activeSeconds: activityEvents.filter((event) => event.category !== 'break').reduce((total, event) => total + event.durationSeconds, 0),
  idleSeconds: 900,
  breakSeconds: 900,
  categoryBreakdown: {
    meeting: 2700,
    communication: 2700,
    development: 8100,
    design: 4500,
    documentation: 900,
    break: 900
  },
  projectBreakdown: {
    'proj-analytics-hub': 13500,
    'proj-onboarding-flow': 5400
  },
  topApplications: [
    { name: 'VS Code', identifier: 'vscode', category: 'development', accentColor: '#2563eb' },
    { name: 'Figma', identifier: 'figma', category: 'design', accentColor: '#8b5cf6' },
    { name: 'Google Meet', identifier: 'google-meet', category: 'communication', accentColor: '#3b82f6' }
  ]
};

export const activityAnomalies: ActivityAnomaly[] = [
  {
    id: 'anomaly-offline-gap',
    eventId: 'evt-focus-2',
    detectedAt: makeIso(TODAY, '12:05'),
    reason: 'missing-end',
    severity: 'low',
    notes: 'Session ended during offline period and was auto-closed.'
  }
];

export const trackingConfiguration: TrackingConfiguration = {
  autoStartAtLogin: true,
  autoPauseOnIdle: true,
  idleThresholdSeconds: 300,
  collectKeyboardMouseCounts: true,
  manualOverrideEnabled: true,
  workday: {
    timeZone: 'America/Los_Angeles',
    startTime: '08:00',
    endTime: '18:00',
    targetMinutes: 480,
    workingDays: [1, 2, 3, 4, 5]
  },
  breakReminders: {
    minWorkStreakMinutes: 50,
    maxBreakMinutes: 30,
    microBreakIntervalMinutes: 10,
    notificationsEnabled: true,
    desktopNotifications: true,
    emailNotifications: false
  },
  privacy: {
    redactWindowTitles: false,
    redactUrls: false,
    requireManualApprovalForNewApplications: false,
    allowAudioRecording: false,
    allowScreenshotting: false
  }
};

export const trackingSession: TrackingSession = {
  id: 'session-today-primary',
  userId: primaryUserId,
  startedAt: makeIso(TODAY, '07:58'),
  status: 'active',
  configurationSnapshot: trackingConfiguration,
  timelineBlocks,
  totalTrackedSeconds: timelineBlocks.reduce((sum, block) => sum + block.durationSeconds, 0),
  syncedOfflineEvents: []
};

export const trackingDayTotals: TrackingDayTotals = {
  date: TODAY,
  trackedSeconds: trackingSession.totalTrackedSeconds,
  activeSeconds: trackingSession.totalTrackedSeconds - 900,
  idleSeconds: 900,
  breakSeconds: 900,
  autoTaggedSeconds: 10800,
  manualTaggedSeconds: 1800,
  timelineBlocks
};

export const trackingAlerts: TrackingAlert[] = [
  {
    id: 'alert-break-reminder',
    type: 'missing-break',
    createdAt: makeIso(TODAY, '10:55'),
    severity: 'warning',
    metadata: { streakMinutes: 95 }
  }
];

export const trackingDiagnostics: TrackingDiagnostics = {
  lastHeartbeatAt: makeIso(TODAY, '14:05'),
  lastIdleEventAt: makeIso(TODAY, '11:42'),
  lastBreakStartedAt: makeIso(TODAY, '11:45'),
  version: '2.4.1',
  os: 'macOS 15.0',
  platform: 'mac'
};

export const breakAnalytics: BreakAnalytics = {
  date: TODAY,
  breaksTaken: 3,
  compliantBreaks: 2,
  averageDurationMinutes: 11,
  longestWorkStreakMinutes: 104,
  idleMinutes: 18,
  complianceRatio: 0.78
};

export const breakSessions: BreakSession[] = [
  {
    id: 'break-morning-reset',
    userId: primaryUserId,
    startedAt: makeIso(TODAY, '09:10'),
    endedAt: makeIso(TODAY, '09:18'),
    scheduledDurationMinutes: 10,
    actualDurationMinutes: 8,
    type: 'micro',
    status: 'completed',
    triggeredBy: 'reminder'
  },
  {
    id: 'break-midday-walk',
    userId: primaryUserId,
    startedAt: makeIso(TODAY, '11:45'),
    endedAt: makeIso(TODAY, '12:00'),
    scheduledDurationMinutes: 15,
    actualDurationMinutes: 15,
    type: 'short',
    status: 'completed',
    triggeredBy: 'manual',
    resumedActivityId: 'evt-focus-3'
  }
];

export const breakReminders: BreakReminder[] = [
  {
    id: 'reminder-focus-pressure',
    userId: primaryUserId,
    issuedAt: makeIso(TODAY, '10:45'),
    type: 'micro',
    workStreakMinutes: 95,
    deliveryChannels: ['desktop', 'slack']
  }
];

export const ambientSounds: AmbientSound[] = [
  {
    id: 'sound-oceanic',
    name: 'Oceanic Low Tide',
    src: '/sounds/ocean-low-tide.mp3',
    volume: 0.45,
    category: 'nature',
    tags: ['calm', 'low-frequency'],
    description: 'Gentle rolling waves with low white noise undertones.',
    durationSeconds: 1800
  },
  {
    id: 'sound-brown-noise',
    name: 'Brown Noise Focus',
    src: '/sounds/brown-noise.mp3',
    volume: 0.4,
    category: 'brown-noise',
    tags: ['focus', 'steady']
  }
];

export const focusSessions: FocusSession[] = [
  {
    id: 'focus-session-current',
    userId: primaryUserId,
    projectId: 'proj-analytics-hub',
    taskId: 'task-analytics-stream',
    status: 'in-progress',
    startedAt: makeIso(TODAY, '09:30'),
    plannedDurationMinutes: 90,
    segments: [
      { id: 'seg-warmup', phase: 'warmup', startTime: makeIso(TODAY, '09:30'), endTime: makeIso(TODAY, '09:35'), relatedActivityIds: ['evt-sync'] },
      { id: 'seg-focus', phase: 'focus', startTime: makeIso(TODAY, '09:35'), relatedActivityIds: ['evt-focus-1', 'evt-focus-2'] }
    ],
    distractionSeconds: 120,
    score: 87
  },
  {
    id: 'focus-session-yesterday',
    userId: primaryUserId,
    projectId: 'proj-onboarding-flow',
    status: 'completed',
    startedAt: makeIso(YESTERDAY, '15:00'),
    endedAt: makeIso(YESTERDAY, '16:10'),
    plannedDurationMinutes: 75,
    actualDurationMinutes: 70,
    segments: [
      { id: 'seg-focus-y', phase: 'focus', startTime: makeIso(YESTERDAY, '15:00'), endTime: makeIso(YESTERDAY, '16:10'), relatedActivityIds: [] }
    ],
    score: 82
  }
];

export const focusGoals: FocusGoal[] = [
  {
    id: 'goal-deep-work',
    userId: primaryUserId,
    title: '3 hours of deep work',
    targetMinutes: 180,
    cadence: 'daily',
    activityCategories: ['development', 'design'],
    createdAt: makeIso('2025-09-01', '12:00'),
    progressMinutes: 155,
    progressRatio: 0.86
  }
];

export const focusTimerSnapshot: FocusTimerSnapshot = {
  sessionId: 'focus-session-current',
  phase: 'focus',
  remainingSeconds: 1800,
  elapsedSeconds: 3600,
  completionRatio: 0.67,
  soundId: 'sound-brown-noise',
  isMuted: false,
  isPaused: false
};

export const scoreSnapshot: ScoreSnapshot = {
  generatedAt: makeIso(TODAY, '15:20'),
  metrics: [
    { id: 'focus', type: 'focus', label: 'Focus', value: 84, previousValue: 79, trend: 'up', target: 85 },
    { id: 'meetings', type: 'meetings', label: 'Meetings', value: 72, previousValue: 68, trend: 'steady', target: 75 },
    { id: 'breaks', type: 'breaks', label: 'Break Compliance', value: 78, previousValue: 74, trend: 'up', target: 80 }
  ],
  breakdowns: [
    {
      metric: { id: 'focus', type: 'focus', label: 'Focus', value: 84, previousValue: 79, trend: 'up' },
      factors: [
        { label: 'Deep work blocks', impact: 0.4, description: 'Two >90 minute focus sessions logged' },
        { label: 'Distraction minutes', impact: -0.15, description: '12 context switches detected' }
      ]
    }
  ],
  history: {
    focus: [
      { period: THIS_WEEK_START, value: 81 },
      { period: TODAY, value: 84 }
    ],
    meetings: [
      { period: THIS_WEEK_START, value: 68 },
      { period: TODAY, value: 72 }
    ],
    breaks: [
      { period: THIS_WEEK_START, value: 74 },
      { period: TODAY, value: 78 }
    ],
    'context-switching': [],
    consistency: [],
    energy: []
  }
};

export const integrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    slug: 'slack',
    category: 'communication',
    description: 'Send focus reminders and daily summaries to Slack channels.',
    icon: '/icons/slack.svg',
    docsUrl: 'https://docs.rize.app/integrations/slack',
    oauthScopes: ['chat:write', 'channels:read'],
    capabilities: [
      { id: 'notifications', name: 'Notifications', description: 'Send alerts to Slack channels', enabled: true },
      { id: 'status-sync', name: 'Status sync', description: 'Update Slack status during focus sessions', enabled: false }
    ]
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    slug: 'calendar',
    category: 'calendar',
    description: 'Auto-block focus sessions around calendar events.',
    icon: '/icons/google-calendar.svg',
    docsUrl: 'https://docs.rize.app/integrations/google-calendar',
    oauthScopes: ['calendar.events.readonly'],
    capabilities: [
      { id: 'import-events', name: 'Import events', description: 'Import busy slots', enabled: true }
    ]
  }
];

export const integrationConnections: IntegrationConnection[] = [
  {
    id: 'conn-slack-primary',
    integrationId: 'slack',
    workspaceId,
    userId: primaryUserId,
    status: 'active',
    createdAt: makeIso('2025-09-10', '18:20'),
    updatedAt: makeIso('2025-10-27', '20:15'),
    lastSyncedAt: makeIso(TODAY, '09:00'),
    settings: { channel: '#focus-updates' }
  },
  {
    id: 'conn-google-calendar',
    integrationId: 'google-calendar',
    workspaceId,
    userId: primaryUserId,
    status: 'active',
    createdAt: makeIso('2025-09-03', '09:12'),
    updatedAt: makeIso('2025-10-15', '11:30'),
    settings: { auto_block_focus: true }
  }
];

export const notifications: AppNotification[] = [
  {
    id: 'notif-break-overdue',
    title: 'Break overdue',
    description: 'You postponed your 10:45 break. Start one now?',
    variant: 'warning',
    createdAt: makeIso(TODAY, '10:50'),
    actionLabel: 'Start break',
    actionHref: '/productivity/focus'
  },
  {
    id: 'notif-slack-sync',
    title: 'Slack sync complete',
    description: 'Focus summary posted to #focus-updates.',
    variant: 'success',
    createdAt: makeIso(TODAY, '09:05')
  }
];

export const aiInsights: AIInsight[] = [
  {
    id: 'insight-break-fatigue',
    sessionId: 'assistant-session-today',
    type: 'break-compliance',
    title: 'Break cadence slipping',
    summary: 'You skipped 1 scheduled break in the last 4 hours. Consider a 10-minute reset to maintain focus.',
    createdAt: makeIso(TODAY, '12:05'),
    priority: 'warning',
    recommendedActions: ['Start a short break now', 'Reduce meeting overlap next block'],
    relatedActivityIds: ['evt-focus-2']
  }
];

export const aiSuggestions: CoachSuggestion[] = [
  {
    id: 'suggestion-plan-afternoon',
    sessionId: 'assistant-session-today',
    message: 'Block a 90-minute deep work session at 3:00pm to finish the timeline polish.',
    actionLabel: 'Schedule focus block',
    actionIntent: 'schedule_focus_block',
    createdAt: makeIso(TODAY, '13:50'),
    expiresAt: makeIso(TODAY, '15:00')
  }
];

export const mockDatabase = {
  projects,
  projectSummaries,
  tasks,
  timelineBlocks,
  activityEvents,
  activityDaySummary,
  activityAnomalies,
  trackingConfiguration,
  trackingSession,
  trackingDayTotals,
  trackingAlerts,
  trackingDiagnostics,
  breakAnalytics,
  breakSessions,
  breakReminders,
  ambientSounds,
  focusSessions,
  focusGoals,
  focusTimerSnapshot,
  scoreSnapshot,
  integrations,
  integrationConnections,
  notifications,
  aiInsights,
  aiSuggestions
};

export type MockDatabase = typeof mockDatabase;
