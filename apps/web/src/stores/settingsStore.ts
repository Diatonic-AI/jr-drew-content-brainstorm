import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { SettingsState } from '@/types/settings'

const defaultSettings: SettingsState = {
  theme: 'system',
  workHours: {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    startTime: '08:00',
    endTime: '18:00',
    workingDays: [1, 2, 3, 4, 5],
    targetMinutesPerDay: 480,
  },
  notifications: [],
  focus: {
    defaultDurationMinutes: 50,
    breakDurationMinutes: 10,
    longBreakDurationMinutes: 20,
    longBreakInterval: 4,
    autoStartNextSession: false,
    autoStartBreaks: false,
    enableAmbientSounds: true,
    defaultSoundId: undefined,
    distractionCategories: ['communication', 'break'],
  },
  breaks: {
    enableReminders: true,
    reminderIntervalMinutes: 50,
    minimumBreakMinutes: 5,
    longBreakInterval: 4,
    longBreakDurationMinutes: 20,
    allowAutoStartBreaks: false,
  },
  tracking: {
    autoStartAtLogin: true,
    autoPauseOnIdle: true,
    idleThresholdSeconds: 300,
    collectKeyboardMouseCounts: true,
    manualOverrideEnabled: true,
    workday: {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      startTime: '08:00',
      endTime: '18:00',
      targetMinutes: 480,
      workingDays: [1, 2, 3, 4, 5],
    },
    breakReminders: {
      minWorkStreakMinutes: 50,
      maxBreakMinutes: 30,
      microBreakIntervalMinutes: 10,
      notificationsEnabled: true,
      desktopNotifications: true,
      emailNotifications: false,
    },
    privacy: {
      redactWindowTitles: false,
      redactUrls: false,
      requireManualApprovalForNewApplications: false,
      allowAudioRecording: false,
      allowScreenshotting: false,
    },
  },
  keyboardShortcuts: [],
  privacy: {
    allowDataExport: true,
    allowTeamVisibility: false,
    shareFocusScoresWithTeam: false,
    redactSensitiveTitles: false,
    includeUrlsInActivityLog: true,
  },
  integrations: {
    enabledIntegrationIds: [],
    autoConnectCalendar: true,
    autoConnectCommunicationTools: false,
    configuration: {},
  },
  ai: {
    model: 'gpt-4o-realtime',
    enableRealtimeVoice: true,
    enableCoachingTips: true,
    autoSummarizeDay: true,
    proactiveBreakThresholdMinutes: 90,
    voice: {
      voiceId: 'alloy',
      speakingRate: 1,
      pitch: 0,
    },
  },
  features: [],
}

interface SettingsStore {
  settings: SettingsState
  setSettings: (settings: SettingsState) => void
  updateSettings: (settings: Partial<SettingsState>) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setSettings: (settings) => set(() => ({ settings })),
      updateSettings: (settings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...settings,
            workHours: {
              ...state.settings.workHours,
              ...settings.workHours,
            },
            focus: {
              ...state.settings.focus,
              ...settings.focus,
            },
            breaks: {
              ...state.settings.breaks,
              ...settings.breaks,
            },
            tracking: {
              ...state.settings.tracking,
              ...settings.tracking,
              workday: {
                ...state.settings.tracking.workday,
                ...settings.tracking?.workday,
              },
              breakReminders: {
                ...state.settings.tracking.breakReminders,
                ...settings.tracking?.breakReminders,
              },
              privacy: {
                ...state.settings.tracking.privacy,
                ...settings.tracking?.privacy,
              },
            },
            ai: {
              ...state.settings.ai,
              ...settings.ai,
            },
            integrations: {
              ...state.settings.integrations,
              ...settings.integrations,
              configuration: {
                ...state.settings.integrations.configuration,
                ...settings.integrations?.configuration,
              },
            },
          },
        })),
      reset: () => set(() => ({ settings: defaultSettings })),
    }),
    {
      name: 'settings-store',
    }
  )
)

