import type { Bilingual } from "@/i18n";

export const blogCategories = ["web-design", "seo"] as const;
export type BlogCategory = (typeof blogCategories)[number];

export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: Bilingual;
  excerpt: Bilingual;
  contentHtml: Bilingual;
  category: BlogCategory;
  authorId: string | null;
  tags: string[];
  status: BlogStatus;
  featured: boolean;
  coverImage: string;
  coverImageEn: string;
  coverAlt: Bilingual;
  metaTitle: Bilingual;
  metaDescription: Bilingual;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export const blogCategoryLabel: Record<BlogCategory, Bilingual> = {
  "web-design": { ar: "تصميم مواقع", en: "Web design" },
  seo: { ar: "SEO", en: "SEO" },
};

export const defaultBlogPosts: BlogPost[] = [
  {
    id: "post-seo-print",
    slug: "seo-guide-print-business",
    title: {
      ar: "دليل تحسين محركات البحث لمشاريع الطباعة والدعاية",
      en: "SEO guide for print & advertising businesses",
    },
    excerpt: {
      ar: "خطوات عملية لظهور خدمات الطباعة والهدايا الدعائية في نتائج البحث وجذب عملاء جدد.",
      en: "Practical steps to rank print and promo gift services and attract new clients.",
    },
    contentHtml: {
      ar: `<h2>لماذا يهم الـ SEO لوكالات الطباعة؟</h2>
<p>العملاء يبحثون يوميًا عن خدمات مثل <strong>المطبوعات التجارية</strong> و<strong>الاستيكرات</strong> و<strong>الهدايا الدعائية</strong>. الظهور في نتائج البحث يعني طلبات أكثر بدون الاعتماد فقط على الإعلانات المدفوعة.</p>
<h2>عناصر الصفحة الأساسية</h2>
<p>استخدم عنوانًا واضحًا، وصفًا مقنعًا، وصورًا بوصف Alt، وروابط داخلية لصفحات الخدمات.</p>
<h3>نصيحة سريعة</h3>
<p>اربط كل مقال بخدمة مناسبة في الموقع حتى يزيد التفاعل ومعدل التحويل.</p>`,
      en: `<h2>Why SEO matters for print agencies</h2>
<p>Customers search daily for commercial printing, stickers and promo gifts. Ranking means more inbound quote requests.</p>
<h2>Core page elements</h2>
<p>Use a clear title, persuasive description, images with Alt text, and internal links to service pages.</p>`,
    },
    category: "seo",
    authorId: null,
    tags: ["seo", "طباعة", "دعاية"],
    status: "published",
    featured: true,
    coverImage: "asset:pf-cards",
    coverImageEn: "",
    coverAlt: {
      ar: "مطبوعات وهدايا دعائية على مكتب",
      en: "Print and promo products on a desk",
    },
    metaTitle: {
      ar: "دليل SEO لمشاريع الطباعة والدعاية | رواد الإبداع",
      en: "SEO guide for print businesses | Rowad Al Ebdaa",
    },
    metaDescription: {
      ar: "تعرّف على خطوات تحسين ظهور خدمات الطباعة والهدايا الدعائية في جوجل.",
      en: "Learn how to improve visibility for print and promo services on Google.",
    },
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z",
    publishedAt: "2026-09-01T10:00:00.000Z",
  },
];

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u0600-\u06FF]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function publishedPosts(list: BlogPost[]) {
  return [...list]
    .filter((p) => p.status === "published")
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt);
    });
}
