import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { siteConfig } from "@/config/site";
import { hasPermission, type Permission, type StaffMember } from "@/data/staff";
import { getFirebaseAuth } from "@/lib/firebase";

/**
 * Admin session: Firebase Auth + local staff id for permissions UI.
 */
const SESSION_KEY = "rowad.demoSession";
const STAFF_KEY = "rowad.demoStaffId";
const REMEMBER_KEY = "rowad.demoRememberEmail";

export function hasDemoSession() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function currentStaffId() {
  try {
    return window.sessionStorage.getItem(STAFF_KEY) ?? "";
  } catch {
    return "";
  }
}

export function checkDemoCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === siteConfig.demoAdmin.email &&
    password === siteConfig.demoAdmin.password
  );
}

export function findStaffByCredentials(staff: StaffMember[], email: string, password: string) {
  const e = email.trim().toLowerCase();
  return staff.find((m) => m.active && m.email.toLowerCase() === e && m.password === password);
}

/** @param rememberEmailOrOpts legacy string email or options object */
export function startDemoSession(
  rememberEmailOrOpts?: string | { rememberEmail?: string; staffId?: string },
) {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    const opts =
      typeof rememberEmailOrOpts === "string" || rememberEmailOrOpts === undefined
        ? { rememberEmail: rememberEmailOrOpts, staffId: "staff-owner" }
        : rememberEmailOrOpts;
    window.sessionStorage.setItem(STAFF_KEY, opts.staffId ?? "staff-owner");
    if (opts.rememberEmail) window.localStorage.setItem(REMEMBER_KEY, opts.rememberEmail);
    else if (opts.rememberEmail === "") window.localStorage.removeItem(REMEMBER_KEY);
  } catch {
    /* ignore */
  }
}

export async function endDemoSession() {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(STAFF_KEY);
  } catch {
    /* ignore */
  }
  const auth = getFirebaseAuth();
  if (auth?.currentUser) {
    try {
      await signOut(auth);
    } catch {
      /* ignore */
    }
  }
}

export function rememberedEmail() {
  try {
    return window.localStorage.getItem(REMEMBER_KEY) ?? "";
  } catch {
    return "";
  }
}

export function resolveCurrentStaff(staff: StaffMember[]): StaffMember | null {
  const id = currentStaffId();
  const found = staff.find((m) => m.id === id && m.active);
  if (found) return found;
  return staff.find((m) => m.role === "owner" && m.active) ?? staff[0] ?? null;
}

export function staffCan(member: StaffMember | null | undefined, need: Permission) {
  return hasPermission(member, need);
}

/**
 * Sign in with Firebase Auth. If the demo admin user does not exist yet,
 * create it once (Email/Password provider must be enabled in Firebase Console).
 */
export async function signInAdmin(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth غير متاح");
  const e = email.trim();
  try {
    const cred = await signInWithEmailAndPassword(auth, e, password);
    return cred.user;
  } catch (err: unknown) {
    const code =
      typeof err === "object" && err && "code" in err ? String((err as { code: string }).code) : "";
    // Bootstrap demo admin once (Email/Password must be enabled in Console).
    // Newer Firebase returns invalid-credential instead of user-not-found.
    if (checkDemoCredentials(e, password)) {
      try {
        const created = await createUserWithEmailAndPassword(auth, e, password);
        return created.user;
      } catch (createErr: unknown) {
        const c =
          typeof createErr === "object" && createErr && "code" in createErr
            ? String((createErr as { code: string }).code)
            : "";
        if (c === "auth/email-already-in-use") {
          throw err;
        }
        // If create fails for another reason, surface original sign-in error
        if (code) throw err;
        throw createErr;
      }
    }
    throw err;
  }
}

export function watchAuth(cb: (user: User | null) => void) {
  const auth = getFirebaseAuth();
  if (!auth) {
    cb(null);
    return () => undefined;
  }
  return onAuthStateChanged(auth, cb);
}
