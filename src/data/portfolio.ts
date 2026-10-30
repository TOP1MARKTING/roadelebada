import type { Bilingual } from "@/i18n";
import { assetToken } from "@/lib/assets";

export const portfolioCategories = ["design", "branding", "print", "signage", "packaging"] as const;
export type PortfolioCategory = (typeof portfolioCategories)[number];

/**
 * Portfolio entries are illustrative design samples that showcase service
 * types — they are NOT documented projects delivered to real clients.
 */
/** Visual frame for gallery tiles — match the source photo orientation. */
export type PortfolioFrame = "tall" | "square" | "wide";

export interface PortfolioItem {
  id: string;
  title: Bilingual;
  category: PortfolioCategory;
  description: Bilingual;
  image: string;
  /** tall = portrait, square = 1:1, wide = landscape */
  frame: PortfolioFrame;
  published: boolean;
  createdAt: string;
}

const d = (m: number, day: number) => new Date(Date.UTC(2026, m - 1, day)).toISOString();

/**
 * Home order: tall → short → tall → tall → short → wide
 * so portrait photos fill tall tiles and landscape fill short ones.
 */
export const defaultPortfolio: PortfolioItem[] = [
  {
    id: "pf-01",
    title: { ar: "مساحة عمل تصميم الهوية", en: "Brand design workspace" },
    category: "design",
    description: {
      ar: "لقطة لمكتب تصميم مع لابتوب وعينات ألوان وأنماط هندسية أثناء تطوير الهوية.",
      en: "A design desk with laptop, color swatches and geometric patterns during identity development.",
    },
    image: assetToken("pf-workspace"),
    frame: "tall",
    published: true,
    createdAt: d(10, 24),
  },
  {
    id: "pf-02",
    title: { ar: "تغليف وعلب وأكياس", en: "Boxes and shopping bags" },
    category: "packaging",
    description: {
      ar: "علب كرتون أبيض وكرتون طبيعي مع أكياس تسوق بهوية الوكالة.",
      en: "White and kraft boxes with shopping bags carrying the agency identity.",
    },
    image: assetToken("pf-boxes"),
    frame: "square",
    published: true,
    createdAt: d(10, 22),
  },
  {
    id: "pf-03",
    title: { ar: "طقم هدايا ترويجية متكامل", en: "Complete promotional gift set" },
    category: "branding",
    description: {
      ar: "أكواب وأكياس قماش وكرتون وتيشيرتات وأقلام بهوية موحّدة للعلامة.",
      en: "Mugs, paper bags, kraft bags, tees and pens with a unified brand identity.",
    },
    image: assetToken("pf-merch"),
    frame: "tall",
    published: true,
    createdAt: d(10, 21),
  },
  {
    id: "pf-04",
    title: { ar: "طباعة رقمية للشعارات", en: "Digital logo printing" },
    category: "print",
    description: {
      ar: "ماكينة طباعة رقمية أثناء إخراج شعار الوكالة على وسائط عالية الجودة.",
      en: "A digital press outputting the agency logo on high-quality media.",
    },
    image: assetToken("printing-press"),
    frame: "tall",
    published: true,
    createdAt: d(10, 25),
  },
  {
    id: "pf-05",
    title: { ar: "هوية على الملابس والإكسسوارات", en: "Apparel and accessory branding" },
    category: "branding",
    description: {
      ar: "نموذج لتطبيق الهوية على تيشيرتات وقبعة ومجمعة بيضاء بألوان البرتقالي والأسود.",
      en: "A sample of the brand applied to t-shirts, a cap and a white mug in orange and black.",
    },
    image: assetToken("pf-apparel"),
    frame: "square",
    published: true,
    createdAt: d(10, 20),
  },
  {
    id: "pf-06",
    title: { ar: "بطاقات أعمال بطابع فاخر", en: "Premium business cards" },
    category: "branding",
    description: {
      ar: "بطاقات سوداء وكريمية مع نقش ذهبي دائري وهوية الخط البرتقالي.",
      en: "Black and cream cards with gold circular detailing and orange brand script.",
    },
    image: assetToken("pf-cards-gold"),
    frame: "wide",
    published: true,
    createdAt: d(10, 23),
  },
  {
    id: "pf-07",
    title: { ar: "قرطاسية يومية بهوية أنيقة", en: "Everyday branded stationery" },
    category: "branding",
    description: {
      ar: "بطاقات أعمال مع دفتر وقلم وفنجان قهوة في تكوين هادئ.",
      en: "Business cards with a notebook, pen and coffee in a calm flat-lay.",
    },
    image: assetToken("pf-cards-desk"),
    frame: "square",
    published: true,
    createdAt: d(10, 26),
  },
  {
    id: "pf-08",
    title: { ar: "حقيبة قماش وأظرف ملونة", en: "Tote bag and branded envelopes" },
    category: "packaging",
    description: {
      ar: "حقيبة قماش وأظرف كرافت مع دليل ألوان وعينات بطاقات أعمال.",
      en: "A canvas tote and kraft envelopes with a color guide and business card samples.",
    },
    image: assetToken("pf-tote"),
    frame: "wide",
    published: true,
    createdAt: d(10, 27),
  },
  {
    id: "pf-09",
    title: { ar: "لوحة واجهة معدنية مضيئة", en: "Illuminated metal facade sign" },
    category: "signage",
    description: {
      ar: "تصور للوحة واجهة من المعدن المصقول بإضاءة خلفية ناعمة تبرز الشعار في المساء.",
      en: "A brushed-metal facade sign concept with soft backlighting that highlights the emblem at night.",
    },
    image: assetToken("storefront-sign"),
    frame: "wide",
    published: true,
    createdAt: d(10, 4),
  },
  {
    id: "pf-10",
    title: { ar: "لوحة محل بإضاءة مخفية", en: "Shop sign with hidden lighting" },
    category: "signage",
    description: {
      ar: "نموذج لواجهة محل مع لوحة رئيسية بإضاءة مخفية متناسقة مع تصميم المدخل.",
      en: "A storefront sample with a main sign using hidden lighting that matches the entrance design.",
    },
    image: assetToken("svc-signage"),
    frame: "wide",
    published: true,
    createdAt: d(10, 7),
  },
  {
    id: "pf-11",
    title: { ar: "لوحة إعلانية خارجية", en: "Outdoor billboard concept" },
    category: "signage",
    description: {
      ar: "تصور لإعلان خارجي بتكوين بصري بسيط يُقرأ بوضوح من مسافة بعيدة.",
      en: "An outdoor billboard concept with a simple visual composition readable from a distance.",
    },
    image: assetToken("svc-ads"),
    frame: "wide",
    published: true,
    createdAt: d(10, 10),
  },
  {
    id: "pf-12",
    title: { ar: "طباعة بنر بمقاس كبير", en: "Large-format banner print" },
    category: "print",
    description: {
      ar: "تصور لطباعة بنر عريض بألوان زاهية على خامة فينيل مناسبة للعرض الداخلي والخارجي.",
      en: "A wide banner print concept in vivid colors on vinyl suitable for indoor and outdoor display.",
    },
    image: assetToken("large-format"),
    frame: "wide",
    published: true,
    createdAt: d(9, 26),
  },
];

export const frameAspectClass: Record<PortfolioFrame, string> = {
  tall: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[4/3]",
};

export const portfolioCategoryKey = (c: PortfolioCategory) => `pfcat.${c}`;
