import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Client Firebase config (safe to expose — protect data with Firestore rules).
 * Override via VITE_FIREBASE_* env vars when needed.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyDy6vn6T6zrcdwpYT9_b6RLYKQzd-Awtk4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "roadelebada.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "roadelebada",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "roadelebada.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "1076811710574",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:1076811710574:web:9ceadf85b8877352a5667f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-SRTGVBCDR5",
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let analytics: Analytics | undefined;

export function getFirebaseApp() {
  if (typeof window === "undefined") return undefined;
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

export function getDb() {
  if (typeof window === "undefined") return undefined;
  if (!db) {
    const a = getFirebaseApp();
    if (!a) return undefined;
    db = getFirestore(a);
  }
  return db;
}

export function getFirebaseAuth() {
  if (typeof window === "undefined") return undefined;
  if (!auth) {
    const a = getFirebaseApp();
    if (!a) return undefined;
    auth = getAuth(a);
  }
  return auth;
}

export async function initAnalytics() {
  if (typeof window === "undefined" || analytics) return analytics;
  const a = getFirebaseApp();
  if (!a) return undefined;
  try {
    if (await isSupported()) {
      analytics = getAnalytics(a);
    }
  } catch {
    /* Analytics unavailable (SSR, blockers, etc.) */
  }
  return analytics;
}

export const firebaseProjectId = firebaseConfig.projectId;
