import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator
} from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'jrpm-dev',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Offline persistence & multi-tab support (web only)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  ignoreUndefinedProperties: true
});
export const storage = getStorage(app);
// Specify default region (adjust if different in deployment)
export const functions = getFunctions(app, 'us-central1');
export const googleProvider = new GoogleAuthProvider();

// Connect to emulators in development
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9105', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 9181);
  connectFunctionsEmulator(functions, '127.0.0.1', 5011);
  connectStorageEmulator(storage, '127.0.0.1', 9210);
  console.log('🔧 Connected to Firebase Emulators');
}

let appCheck: ReturnType<typeof initializeAppCheck> | undefined;
const appCheckKey = import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY as string | undefined;
if (appCheckKey) {
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(appCheckKey),
    isTokenAutoRefreshEnabled: true
  });
}

export { appCheck };