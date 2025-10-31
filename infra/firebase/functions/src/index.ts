// Modular exports: delegate to organized modules for clarity & maintainability
// export * from './modules/tasks.js'; // Commented out due to deployment conflict
export * from './modules/scheduler.js';
export * from './modules/project-export.js';
export * from './modules/project-import.js';
// export * from './auth-triggers.js'; // TODO: Fix v2 API types
export * from './email-verification.js';
export {
  startTimeEntry,
  stopTimeEntry,
  getTimeEntries,
} from './timeEntries.js';
