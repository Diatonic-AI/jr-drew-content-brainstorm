/**
 * Firebase Admin SDK Bootstrap Module
 * 
 * This module provides singleton instances of Firebase Admin services to prevent
 * the `app/duplicate-app` error that occurs when `initializeApp()` is called
 * multiple times across different function modules.
 * 
 * Usage:
 * ```typescript
 * import { getDb, getAuth, getStorage } from '../lib/firebase.js';
 * 
 * const db = getDb();
 * const auth = getAuth();
 * ```
 */

import { initializeApp, getApps, type App } from 'firebase-admin/app';
import { getAuth as getAdminAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage as getAdminStorage, type Storage } from 'firebase-admin/storage';

/**
 * Get or initialize the Firebase Admin App instance
 * 
 * Uses the singleton pattern to ensure only one app instance exists.
 * Safe to call multiple times - subsequent calls return the existing instance.
 */
export function getAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }
  return initializeApp();
}

/**
 * Get the Firestore database instance
 * 
 * Returns a singleton Firestore instance initialized with the Admin SDK.
 * Safe to call from multiple function modules.
 */
export function getDb(): Firestore {
  const app = getAdminApp();
  return getFirestore(app);
}

/**
 * Get the Firebase Auth instance
 * 
 * Returns a singleton Auth instance for user management and token verification.
 * Safe to call from multiple function modules.
 */
export function getAuth(): Auth {
  const app = getAdminApp();
  return getAdminAuth(app);
}

/**
 * Get the Firebase Storage instance
 * 
 * Returns a singleton Storage instance for file operations.
 * Safe to call from multiple function modules.
 */
export function getStorage(): Storage {
  const app = getAdminApp();
  return getAdminStorage(app);
}
