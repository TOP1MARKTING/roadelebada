import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
  onSnapshot,
  type Firestore,
  type Unsubscribe,
} from "firebase/firestore";
import { defaultServices, type Service } from "@/data/services";
import { defaultPortfolio, type PortfolioItem } from "@/data/portfolio";
import { defaultBlogPosts, type BlogPost } from "@/data/blog";
import { defaultStaff, type StaffMember } from "@/data/staff";
import { type ContactMessage, type QuoteRequest } from "@/data/demo";
import {
  defaultCompany,
  defaultWebsite,
  type CompanySettings,
  type WebsiteSettings,
} from "@/data/site-settings";
import { fsPaths } from "./firestore-paths";

export type SiteBundle = {
  company: CompanySettings;
  website: WebsiteSettings;
  services: Service[];
  portfolio: PortfolioItem[];
  posts: BlogPost[];
  staff: StaffMember[];
  quotes: QuoteRequest[];
  messages: ContactMessage[];
  seeded: boolean;
};

const stripUndefined = <T extends Record<string, unknown>>(obj: T): T => {
  const out = { ...obj };
  for (const k of Object.keys(out)) {
    if (out[k] === undefined) delete out[k];
  }
  return out;
};

async function readCollection<T>(
  db: Firestore,
  path: string,
  idField: "id" | "slug" = "id",
): Promise<T[]> {
  const snap = await getDocs(collection(db, path));
  return snap.docs.map((d) => {
    const data = d.data() as T;
    if (idField === "slug") {
      return { ...data, slug: (data as { slug?: string }).slug ?? d.id };
    }
    return { ...data, id: (data as { id?: string }).id ?? d.id };
  });
}

async function safeCollection<T>(
  db: Firestore,
  path: string,
  idField: "id" | "slug" = "id",
): Promise<T[]> {
  try {
    return await readCollection<T>(db, path, idField);
  } catch {
    // e.g. quotes/messages/staff require auth — public visitors skip them
    return [];
  }
}

export async function loadSiteBundle(db: Firestore): Promise<SiteBundle> {
  const [companySnap, websiteSnap, metaSnap, services, portfolio, posts, staff, quotes, messages] =
    await Promise.all([
      getDoc(doc(db, fsPaths.company)),
      getDoc(doc(db, fsPaths.website)),
      getDoc(doc(db, fsPaths.meta)),
      readCollection<Service>(db, fsPaths.services, "slug"),
      readCollection<PortfolioItem>(db, fsPaths.portfolio),
      readCollection<BlogPost>(db, fsPaths.posts),
      safeCollection<StaffMember>(db, fsPaths.staff),
      safeCollection<QuoteRequest>(db, fsPaths.quotes),
      safeCollection<ContactMessage>(db, fsPaths.messages),
    ]);

  const seeded = Boolean(metaSnap.exists() && metaSnap.data()?.seeded);

  const gallerySyncedSlugs = new Set([
    "commercial-printing",
    "stickers-labels",
    "promo-gifts",
    "signage",
    "displays-stands",
    "awards-stamps",
    "occasions",
  ]);
  const mergedServices = (services.length ? services : defaultServices).map((s) => {
    if (!gallerySyncedSlugs.has(s.slug)) return s;
    const def = defaultServices.find((d) => d.slug === s.slug);
    if (!def) return s;
    // Keep CMS text/settings, but always ship the latest product gallery from code.
    return {
      ...s,
      image: def.image,
      gallery: def.gallery,
      examples: def.examples,
    };
  });

  return {
    company: companySnap.exists()
      ? ({ ...defaultCompany, ...companySnap.data() } as CompanySettings)
      : defaultCompany,
    website: websiteSnap.exists()
      ? ({ ...defaultWebsite, ...websiteSnap.data() } as WebsiteSettings)
      : defaultWebsite,
    services: mergedServices,
    portfolio: portfolio.length ? portfolio : defaultPortfolio,
    posts: posts.length ? posts : defaultBlogPosts,
    staff: staff.length ? staff : defaultStaff,
    quotes,
    messages,
    seeded,
  };
}

/** First-time seed of defaults into Firestore (requires admin auth under production rules). */
export async function seedFirestoreDefaults(db: Firestore) {
  const batch = writeBatch(db);
  batch.set(doc(db, fsPaths.company), stripUndefined({ ...defaultCompany } as never));
  batch.set(doc(db, fsPaths.website), stripUndefined({ ...defaultWebsite } as never));
  batch.set(doc(db, fsPaths.meta), {
    seeded: true,
    seededAt: new Date().toISOString(),
    version: 1,
  });

  for (const s of defaultServices) {
    batch.set(doc(db, fsPaths.services, s.slug), stripUndefined({ ...s } as never));
  }
  for (const p of defaultPortfolio) {
    batch.set(doc(db, fsPaths.portfolio, p.id), stripUndefined({ ...p } as never));
  }
  for (const p of defaultBlogPosts) {
    batch.set(doc(db, fsPaths.posts, p.id), stripUndefined({ ...p } as never));
  }
  for (const m of defaultStaff) {
    batch.set(doc(db, fsPaths.staff, m.id), stripUndefined({ ...m } as never));
  }

  await batch.commit();
}

export async function saveCompany(db: Firestore, company: CompanySettings) {
  await setDoc(doc(db, fsPaths.company), stripUndefined({ ...company } as never));
}

export async function saveWebsite(db: Firestore, website: WebsiteSettings) {
  await setDoc(doc(db, fsPaths.website), stripUndefined({ ...website } as never));
}

export async function saveServices(db: Firestore, services: Service[]) {
  const batch = writeBatch(db);
  for (const s of services) {
    batch.set(doc(db, fsPaths.services, s.slug), stripUndefined({ ...s } as never));
  }
  await batch.commit();
}

export async function savePortfolio(db: Firestore, items: PortfolioItem[]) {
  const batch = writeBatch(db);
  for (const p of items) {
    batch.set(doc(db, fsPaths.portfolio, p.id), stripUndefined({ ...p } as never));
  }
  await batch.commit();
}

export async function savePosts(db: Firestore, posts: BlogPost[]) {
  const batch = writeBatch(db);
  for (const p of posts) {
    batch.set(doc(db, fsPaths.posts, p.id), stripUndefined({ ...p } as never));
  }
  await batch.commit();
}

export async function saveStaff(db: Firestore, staff: StaffMember[]) {
  const batch = writeBatch(db);
  for (const m of staff) {
    batch.set(doc(db, fsPaths.staff, m.id), stripUndefined({ ...m } as never));
  }
  await batch.commit();
}

export async function saveQuotes(db: Firestore, quotes: QuoteRequest[]) {
  const batch = writeBatch(db);
  for (const q of quotes) {
    batch.set(doc(db, fsPaths.quotes, q.id), stripUndefined({ ...q } as never));
  }
  await batch.commit();
}

export async function saveMessages(db: Firestore, messages: ContactMessage[]) {
  const batch = writeBatch(db);
  for (const m of messages) {
    batch.set(doc(db, fsPaths.messages, m.id), stripUndefined({ ...m } as never));
  }
  await batch.commit();
}

export async function addQuoteDoc(db: Firestore, quote: QuoteRequest) {
  await setDoc(doc(db, fsPaths.quotes, quote.id), stripUndefined({ ...quote } as never));
}

export async function addMessageDoc(db: Firestore, message: ContactMessage) {
  await setDoc(doc(db, fsPaths.messages, message.id), stripUndefined({ ...message } as never));
}

export function subscribeQuotes(
  db: Firestore,
  onData: (quotes: QuoteRequest[]) => void,
): Unsubscribe {
  return onSnapshot(
    collection(db, fsPaths.quotes),
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuoteRequest);
      list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      onData(list);
    },
    () => {
      /* permission denied for signed-out visitors */
    },
  );
}

export function subscribeMessages(
  db: Firestore,
  onData: (messages: ContactMessage[]) => void,
): Unsubscribe {
  return onSnapshot(
    collection(db, fsPaths.messages),
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ContactMessage);
      list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      onData(list);
    },
    () => {
      /* permission denied for signed-out visitors */
    },
  );
}
