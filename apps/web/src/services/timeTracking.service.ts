import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

/**
 * Time Session Interface
 */
export interface TimeSession {
  id: string;
  orgId: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  category?: string;
  description?: string;
  isManual: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Time Entry Interface
 */
export interface TimeEntry {
  id: string;
  orgId: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  date: Date;
  duration: number; // in seconds
  category?: string;
  description?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session Statistics
 */
export interface SessionStats {
  totalDuration: number; // seconds
  sessionsCount: number;
  avgSessionDuration: number; // seconds
  longestSession: number; // seconds
  mostProductiveTime?: { hour: number; duration: number };
}

// Collection references
const getSessionsRef = (orgId: string) => collection(db, `orgs/${orgId}/timeSessions`);
const getEntriesRef = (orgId: string) => collection(db, `orgs/${orgId}/timeEntries`);

/**
 * TIME TRACKING SERVICE
 */
export const timeTrackingService = {
  /**
   * Start a new time session
   */
  async startSession(
    orgId: string,
    userId: string,
    projectId?: string,
    taskId?: string
  ): Promise<TimeSession> {
    const sessionsRef = getSessionsRef(orgId);

    const sessionData = {
      orgId,
      userId,
      projectId: projectId || null,
      taskId: taskId || null,
      startTime: Timestamp.now(),
      endTime: null,
      duration: null,
      category: null,
      description: null,
      isManual: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(sessionsRef, sessionData);

    return { id: docRef.id, ...sessionData } as TimeSession;
  },

  /**
   * Stop active session
   */
  async stopSession(orgId: string, sessionId: string): Promise<void> {
    const sessionRef = doc(db, `orgs/${orgId}/timeSessions/${sessionId}`);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      throw new Error('Session not found');
    }

    const sessionData = sessionSnap.data();
    const startTime = sessionData.startTime.toDate();
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    await updateDoc(sessionRef, {
      endTime: Timestamp.fromDate(endTime),
      duration,
      updatedAt: Timestamp.now()
    });
  },

  /**
   * Get active session for user
   */
  async getActiveSession(orgId: string, userId: string): Promise<TimeSession | null> {
    const sessionsRef = getSessionsRef(orgId);
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      where('endTime', '==', null),
      orderBy('startTime', 'desc'),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as TimeSession;
  },

  /**
   * Get sessions for user in date range
   */
  async getSessions(
    orgId: string,
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TimeSession[]> {
    const sessionsRef = getSessionsRef(orgId);
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      where('startTime', '>=', Timestamp.fromDate(startDate)),
      where('startTime', '<=', Timestamp.fromDate(endDate)),
      orderBy('startTime', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimeSession));
  },

  /**
   * Get today's sessions
   */
  async getTodaySessions(orgId: string, userId: string): Promise<TimeSession[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getSessions(orgId, userId, today, tomorrow);
  },

  /**
   * Calculate session statistics
   */
  async getSessionStats(
    orgId: string,
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<SessionStats> {
    const sessions = await this.getSessions(orgId, userId, startDate, endDate);

    if (sessions.length === 0) {
      return {
        totalDuration: 0,
        sessionsCount: 0,
        avgSessionDuration: 0,
        longestSession: 0
      };
    }

    const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const longestSession = Math.max(...sessions.map(s => s.duration || 0));
    const avgSessionDuration = totalDuration / sessions.length;

    return {
      totalDuration,
      sessionsCount: sessions.length,
      avgSessionDuration,
      longestSession
    };
  },

  /**
   * Create manual time entry
   */
  async createEntry(
    orgId: string,
    userId: string,
    data: {
      projectId?: string;
      taskId?: string;
      date: Date;
      duration: number;
      description?: string;
      category?: string;
      tags?: string[];
    }
  ): Promise<TimeEntry> {
    const entriesRef = getEntriesRef(orgId);

    const entryData = {
      orgId,
      userId,
      projectId: data.projectId || null,
      taskId: data.taskId || null,
      date: Timestamp.fromDate(data.date),
      duration: data.duration,
      description: data.description || null,
      category: data.category || null,
      tags: data.tags || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(entriesRef, entryData);

    return { id: docRef.id, ...entryData } as TimeEntry;
  },

  /**
   * Get time entries for date range
   */
  async getEntries(
    orgId: string,
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TimeEntry[]> {
    const entriesRef = getEntriesRef(orgId);
    const q = query(
      entriesRef,
      where('userId', '==', userId),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimeEntry));
  },

  /**
   * Get total time for project
   */
  async getProjectTime(orgId: string, projectId: string): Promise<number> {
    const sessionsRef = getSessionsRef(orgId);
    const q = query(
      sessionsRef,
      where('projectId', '==', projectId),
      where('endTime', '!=', null)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.reduce((total, doc) => {
      const session = doc.data();
      return total + (session.duration || 0);
    }, 0);
  },

  /**
   * Get total time for task
   */
  async getTaskTime(orgId: string, taskId: string): Promise<number> {
    const sessionsRef = getSessionsRef(orgId);
    const q = query(sessionsRef, where('taskId', '==', taskId), where('endTime', '!=', null));

    const snapshot = await getDocs(q);

    return snapshot.docs.reduce((total, doc) => {
      const session = doc.data();
      return total + (session.duration || 0);
    }, 0);
  },

  /**
   * Subscribe to active session
   */
  subscribeToActiveSession(
    orgId: string,
    userId: string,
    callback: (session: TimeSession | null) => void
  ): () => void {
    const sessionsRef = getSessionsRef(orgId);
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      where('endTime', '==', null),
      limit(1)
    );

    return onSnapshot(q, snapshot => {
      if (snapshot.empty) {
        callback(null);
      } else {
        const doc = snapshot.docs[0];
        callback({ id: doc.id, ...doc.data() } as TimeSession);
      }
    });
  },

  /**
   * Subscribe to today's sessions
   */
  subscribeToTodaySessions(
    orgId: string,
    userId: string,
    callback: (sessions: TimeSession[]) => void
  ): () => void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionsRef = getSessionsRef(orgId);
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      where('startTime', '>=', Timestamp.fromDate(today)),
      orderBy('startTime', 'desc')
    );

    return onSnapshot(q, snapshot => {
      const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimeSession));
      callback(sessions);
    });
  }
};
