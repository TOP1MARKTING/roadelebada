import {
  Palette,
  Printer,
  Signpost,
  Sticker,
  Fingerprint,
  Megaphone,
  Sparkles,
  Gift,
  Presentation,
  PartyPopper,
  Award,
  type LucideIcon,
} from "lucide-react";
import type { Bilingual } from "@/i18n";
import { assetToken } from "@/lib/assets";

export const serviceIcons = {
  printer: Printer,
  sticker: Sticker,
  gift: Gift,
  signpost: Signpost,
  presentation: Presentation,
  party: PartyPopper,
  award: Award,
  palette: Palette,
  fingerprint: Fingerprint,
  megaphone: Megaphone,
  sparkles: Sparkles,
} satisfies Record<string, LucideIcon>;

export type ServiceIconKey = keyof typeof serviceIcons;

export const serviceCategories = [
  "print",
  "packaging",
  "gifts",
  "signage",
  "displays",
  "occasions",
  "awards",
  "design",
  "branding",
  "ads",
] as const;
export type ServiceCategory = (typeof serviceCategories)[number];

export interface BilingualList {
  ar: string[];
  en: string[];
}

/** Serializable service record (persisted to localStorage by the admin prototype). */
export interface Service {
  slug: string;
  iconKey: ServiceIconKey;
  /** `asset:<key>` token or absolute image URL */
  image: string;
  gallery: string[];
  category: ServiceCategory;
  visible: boolean;
  updatedAt: string;
  title: Bilingual;
  short: Bilingual;
  detail: Bilingual;
  examples: BilingualList;
  benefits: BilingualList;
}

type ServiceSeed = Omit<Service, "visible" | "updatedAt">;

const seeds: ServiceSeed[] = [
  {
    slug: "commercial-printing",
    iconKey: "printer",
    image: assetToken("cat-print"),
    gallery: [assetToken("business-cards"), assetToken("pf-cards"), assetToken("printing-press")],
    category: "print",
    title: { ar: "المطبوعات التجارية", en: "Commercial Printing" },
    short: {
      ar: "تصميم وطباعة الكروت والمطويات والملفات وكل مطبوعات نشاطك التجاري.",
      en: "Design and printing of cards, brochures, folders and all your business prints.",
    },
    detail: {
      ar: "نصمم ونطبع المطبوعات اليومية لنشاطك التجاري، من الكروت الشخصية وبطاقات العمل إلى المطويات والملفات وقوائم الطعام. نساعدك في اختيار المقاس والخامة المناسبة، ونراجع معك التصميم قبل الطباعة.",
      en: "We design and print your everyday business materials, from personal and business cards to brochures, folders and menus. We help you pick the right size and material and review the design with you before printing.",
    },
    examples: {
      ar: [
        "الكروت الشخصية",
        "بطاقات العمل",
        "كروت الطاولة",
        "المطويات",
        "الملفات",
        "قوائم الطعام",
        "تعليقات الأبواب",
        "شهادات الشكر والتقدير",
      ],
      en: [
        "Personal cards",
        "Business cards",
        "Table cards",
        "Brochures",
        "Folders",
        "Food menus",
        "Door hangers",
        "Appreciation certificates",
      ],
    },
    benefits: {
      ar: [
        "تصميم وطباعة في مكان واحد",
        "خيارات متنوعة من الورق والمقاسات",
        "مراجعة التصميم قبل الطباعة",
        "مناسبة للشركات والمحلات والمطاعم",
      ],
      en: [
        "Design and print in one place",
        "Various paper and size options",
        "Design review before printing",
        "Suitable for companies, shops and restaurants",
      ],
    },
  },
  {
    slug: "stickers-labels",
    iconKey: "sticker",
    image: assetToken("cat-stickers"),
    gallery: [assetToken("svc-stickers"), assetToken("packaging"), assetToken("pf-packaging")],
    category: "packaging",
    title: { ar: "الاستيكرات والملصقات", en: "Stickers & Labels" },
    short: {
      ar: "استيكرات للمنتجات والعلب والسيارات، طباعة وقص بالمقاس والشكل الذي تحتاجه.",
      en: "Stickers for products, boxes and cars — printed and cut to the size and shape you need.",
    },
    detail: {
      ar: "نصمم ونطبع استيكرات المنتجات والعلب بالمقاسات والأشكال المناسبة لعبواتك، مع إمكانية القص بأشكال مخصصة. ونوفر أيضًا طباعة وتركيب استيكرات السيارات.",
      en: "We design and print product and box stickers in sizes and shapes that fit your packaging, with custom die-cut options. We also print and install car stickers.",
    },
    examples: {
      ar: [
        "استيكرات المنتجات",
        "طباعة الاستيكر",
        "استيكرات لاصقة للعلب",
        "طباعة وقص الملصقات",
        "طباعة وتركيب استيكرات السيارات",
      ],
      en: [
        "Product stickers",
        "Sticker printing",
        "Adhesive box stickers",
        "Label printing and cutting",
        "Car sticker printing and installation",
      ],
    },
    benefits: {
      ar: [
        "مقاسات وأشكال حسب الطلب",
        "قص بأشكال مخصصة",
        "مناسبة للمنتجات والتغليف",
        "تركيب استيكرات السيارات",
      ],
      en: [
        "Custom sizes and shapes",
        "Custom die-cut shapes",
        "Suitable for products and packaging",
        "Car sticker installation",
      ],
    },
  },
  {
    slug: "promo-gifts",
    iconKey: "gift",
    image: assetToken("cat-gifts"),
    gallery: [assetToken("packaging"), assetToken("svc-branding"), assetToken("pf-packaging")],
    category: "gifts",
    title: { ar: "الهدايا والتغليف", en: "Gifts & Packaging" },
    short: {
      ar: "طباعة شعارك على الأكواب والشنط والتيشرتات والأقلام والأكياس الورقية.",
      en: "Your logo printed on cups, bags, T-shirts, pens and paper bags.",
    },
    detail: {
      ar: "نصمم ونطبع المنتجات الدعائية والتغليف التي تحمل اسم وشعار نشاطك، مثل الأكواب والمجات والشنط والأكياس الورقية والتيشرتات والكابات، ونوفر ترقيم الملابس الرياضية.",
      en: "We design and print promotional products and packaging carrying your name and logo, such as cups, mugs, bags, paper bags, T-shirts and caps, and we also offer sportswear numbering.",
    },
    examples: {
      ar: [
        "الأكياس الورقية",
        "الشنط",
        "الأكواب الورقية",
        "الأكواب البلاستيك",
        "الأكواب والمجات",
        "الأقلام الدعائية",
        "التيشرتات",
        "الكابات والقبعات",
        "ترقيم الملابس الرياضية",
        "النيم تاق",
      ],
      en: [
        "Paper bags",
        "Bags",
        "Paper cups",
        "Plastic cups",
        "Cups and mugs",
        "Promotional pens",
        "T-shirts",
        "Caps and hats",
        "Sportswear numbering",
        "Name tags",
      ],
    },
    benefits: {
      ar: [
        "شعارك على منتجات يستخدمها عملاؤك",
        "مناسبة للمطاعم والمقاهي والمتاجر",
        "خيارات متنوعة من المنتجات",
        "مناسبة للفعاليات والفرق الرياضية",
      ],
      en: [
        "Your logo on products your customers use",
        "Suitable for restaurants, cafés and stores",
        "A wide range of products",
        "Suitable for events and sports teams",
      ],
    },
  },
  {
    slug: "signage",
    iconKey: "signpost",
    image: assetToken("cat-signage"),
    gallery: [
      assetToken("svc-signage"),
      assetToken("storefront-sign"),
      assetToken("about-signage"),
    ],
    category: "signage",
    title: { ar: "اللوحات والحروف", en: "Signs & Letters" },
    short: {
      ar: "لوحات إرشادية وفوركس وفلين، وحروف استيل وزنكور مضيئة لواجهتك.",
      en: "Wayfinding, forex and foam boards, plus steel and illuminated letters for your storefront.",
    },
    detail: {
      ar: "نصمم وننفذ اللوحات الإرشادية ولوحات الفوركس والفلين، والحروف الاستيل وحروف الزنكور المضيئة للواجهات، بالمقاسات المناسبة لمكانك.",
      en: "We design and produce wayfinding signs, forex and foam boards, and steel and illuminated letters for storefronts, sized to fit your location.",
    },
    examples: {
      ar: [
        "اللوحات الإرشادية",
        "لوحات الفوركس",
        "لوحات الفلين",
        "الطباعة على الفلين",
        "حروف الاستيل",
        "حروف الزنكور المضيئة",
      ],
      en: [
        "Wayfinding signs",
        "Forex boards",
        "Foam boards",
        "Printing on foam board",
        "Steel letters",
        "Illuminated letters",
      ],
    },
    benefits: {
      ar: [
        "مقاسات حسب المكان",
        "خامات متنوعة للداخل والخارج",
        "وضوح في القراءة",
        "تصميم وتنفيذ في مكان واحد",
      ],
      en: [
        "Sizes made for your location",
        "Indoor and outdoor materials",
        "Clear readability",
        "Design and production in one place",
      ],
    },
  },
  {
    slug: "displays-stands",
    iconKey: "presentation",
    image: assetToken("cat-displays"),
    gallery: [assetToken("svc-ads"), assetToken("large-format"), assetToken("pf-banner")],
    category: "displays",
    title: { ar: "الاستاندات والعرض", en: "Stands & Displays" },
    short: {
      ar: "رول أب وإكس بانر وبوب أب وأعلام وطاولات دعائية للمعارض والفعاليات.",
      en: "Roll-ups, X-banners, pop-ups, flags and promo tables for exhibitions and events.",
    },
    detail: {
      ar: "نجهز وسائل العرض التي تحتاجها في المعارض والفعاليات وداخل محلك، من الرول أب والإكس بانر واستاند البوب أب إلى الأعلام والطاولات الدعائية والستائر المطبوعة.",
      en: "We prepare the display materials you need for exhibitions, events and inside your shop, from roll-ups, X-banners and pop-up stands to flags, promo tables and printed curtains.",
    },
    examples: {
      ar: [
        "رول أب استاند",
        "إكس بانر استاند",
        "استاند بوب أب",
        "الأعلام الدعائية",
        "الطاولة الدعائية",
        "الستائر المطبوعة",
      ],
      en: [
        "Roll-up stand",
        "X-banner stand",
        "Pop-up stand",
        "Promotional flags",
        "Promotional table",
        "Printed curtains",
      ],
    },
    benefits: {
      ar: [
        "سهلة الحمل والتركيب",
        "مناسبة للمعارض والفعاليات",
        "طباعة بألوان واضحة",
        "مقاسات متعددة",
      ],
      en: [
        "Easy to carry and set up",
        "Suitable for exhibitions and events",
        "Clear, vivid printing",
        "Multiple sizes",
      ],
    },
  },
  {
    slug: "occasions",
    iconKey: "party",
    image: assetToken("cat-occasions"),
    gallery: [assetToken("cat-occasions"), assetToken("pf-cards"), assetToken("business-cards")],
    category: "occasions",
    title: { ar: "المناسبات والأفراح", en: "Occasions" },
    short: {
      ar: "كروت الزواج والتهنئة، واستاندات المواليد، وبروشات التخرج وتعليقات المويه.",
      en: "Wedding and greeting cards, newborn stands, graduation brooches and water bottle tags.",
    },
    detail: {
      ar: "نصمم ونطبع كل ما تحتاجه لمناسبتك، من كروت ورسائل الزواج وكروت التهنئة إلى استاندات المواليد وبروشات التخرج والمجسمات المدرسية وتعليقات المويه.",
      en: "We design and print everything for your occasion, from wedding invitations and greeting cards to newborn stands, graduation brooches, school models and water bottle tags.",
    },
    examples: {
      ar: [
        "كروت التهنئة والزواج",
        "رسائل الزواج",
        "استاندات المواليد",
        "بروشات التخرج",
        "المجسمات المدرسية",
        "تعليقات المويه",
      ],
      en: [
        "Greeting and wedding cards",
        "Wedding invitations",
        "Newborn stands",
        "Graduation brooches",
        "School models",
        "Water bottle tags",
      ],
    },
    benefits: {
      ar: [
        "تصميم خاص لكل مناسبة",
        "مراجعة الأسماء والتفاصيل قبل الطباعة",
        "خيارات متنوعة من الخامات",
        "كل احتياجات المناسبة في مكان واحد",
      ],
      en: [
        "A custom design for every occasion",
        "Names and details reviewed before printing",
        "Various material options",
        "Everything for your occasion in one place",
      ],
    },
  },
  {
    slug: "awards-stamps",
    iconKey: "award",
    image: assetToken("cat-awards"),
    gallery: [assetToken("cat-awards"), assetToken("studio-press"), assetToken("about-designer")],
    category: "awards",
    title: { ar: "الدروع والأختام", en: "Awards & Stamps" },
    short: {
      ar: "دروع تذكارية ولوحات مكتبية وحفر بالليزر، وأختام شخصية وللشركات.",
      en: "Commemorative shields, desk plates, laser engraving, and personal and company stamps.",
    },
    detail: {
      ar: "ننفذ الدروع التذكارية واللوحات المكتبية والحفر بالليزر بالأسماء والشعارات، ونصمم ونجهز الأختام الشخصية وأختام الشركات.",
      en: "We produce commemorative shields, desk plates and laser engraving with names and logos, and we design and prepare personal and company stamps.",
    },
    examples: {
      ar: [
        "الدروع التذكارية",
        "الحفر بالليزر",
        "اللوحات المكتبية",
        "الأختام الشخصية وأختام الشركات",
      ],
      en: [
        "Commemorative shields",
        "Laser engraving",
        "Desk plates",
        "Personal and company stamps",
      ],
    },
    benefits: {
      ar: [
        "حفر دقيق للأسماء والشعارات",
        "مناسبة للتكريم والمناسبات الرسمية",
        "أختام للأفراد والشركات",
        "مراجعة النص قبل التنفيذ",
      ],
      en: [
        "Precise engraving of names and logos",
        "Suitable for honors and official events",
        "Stamps for individuals and companies",
        "Text reviewed before production",
      ],
    },
  },
];

export const defaultServices: Service[] = seeds.map((s, i) => ({
  ...s,
  visible: true,
  updatedAt: new Date(Date.UTC(2026, 9, 1 + i * 3)).toISOString(),
}));

export const serviceCategoryKey = (c: ServiceCategory) => `svccat.${c}`;
