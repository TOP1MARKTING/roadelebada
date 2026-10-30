/**
 * Fictional demonstration records for the admin prototype.
 * Names, businesses and phone numbers are invented sample data — not real customers.
 */

export const quoteStatuses = ["new", "review", "contacted", "done", "cancelled"] as const;
export type QuoteStatus = (typeof quoteStatuses)[number];

export interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  business: string;
  email?: string;
  /** service slug or "other" */
  service: string;
  details: string;
  budget?: string;
  deadline?: string;
  status: QuoteStatus;
  createdAt: string;
  /** "demo" = seeded sample, "form" = submitted from the local quote form */
  source: "demo" | "form";
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  source: "demo" | "form";
}

const at = (m: number, day: number, h = 10) =>
  new Date(Date.UTC(2026, m - 1, day, h)).toISOString();

export const demoQuotes: QuoteRequest[] = [
  {
    id: "q-1012",
    name: "سارة الغامدي",
    phone: "0500000112",
    business: "مقهى ركن الهيل (تجريبي)",
    email: "sample1@example.com",
    service: "promo-gifts",
    details: "نرغب في طباعة شعار المقهى على الأكواب الورقية والأكياس الورقية.",
    budget: "5,000 – 10,000 ر.س",
    deadline: "2026-11-30",
    status: "new",
    createdAt: at(10, 24, 9),
    source: "demo",
  },
  {
    id: "q-1011",
    name: "فهد الزهراني",
    phone: "0500000111",
    business: "مؤسسة الواحة للتجارة (تجريبي)",
    service: "signage",
    details: "لوحة واجهة مضيئة لمحل بعرض 6 أمتار مع لوحة جانبية صغيرة.",
    budget: "حسب العرض",
    status: "review",
    createdAt: at(10, 22, 13),
    source: "demo",
  },
  {
    id: "q-1010",
    name: "نورة القحطاني",
    phone: "0500000110",
    business: "متجر لمسة ورد (تجريبي)",
    service: "stickers-labels",
    details: "ملصقات دائرية لعلب الهدايا بثلاثة مقاسات مع شعار المتجر.",
    deadline: "2026-11-10",
    status: "contacted",
    createdAt: at(10, 19, 11),
    source: "demo",
  },
  {
    id: "q-1009",
    name: "عبدالله العمري",
    phone: "0500000109",
    business: "مطعم سفرة الباحة (تجريبي)",
    service: "commercial-printing",
    details: "طباعة قوائم طعام مقواة وفلايرات للتوزيع.",
    budget: "2,000 – 5,000 ر.س",
    status: "done",
    createdAt: at(10, 15, 16),
    source: "demo",
  },
  {
    id: "q-1008",
    name: "ريم الشهري",
    phone: "0500000108",
    business: "عيادة ابتسامة (تجريبي)",
    service: "commercial-printing",
    details: "تصميم وطباعة مطويات تعريفية وكروت مواعيد.",
    status: "review",
    createdAt: at(10, 12, 10),
    source: "demo",
  },
  {
    id: "q-1007",
    name: "خالد المالكي",
    phone: "0500000107",
    business: "معرض المالكي للأثاث (تجريبي)",
    service: "displays-stands",
    details: "رول أب وأعلام دعائية لافتتاح فرع جديد.",
    budget: "10,000+ ر.س",
    deadline: "2026-12-15",
    status: "new",
    createdAt: at(10, 9, 14),
    source: "demo",
  },
  {
    id: "q-1006",
    name: "هند الحارثي",
    phone: "0500000106",
    business: "مخبز بيت السنابل (تجريبي)",
    service: "stickers-labels",
    details: "ملصقات منتجات للأكياس الورقية مع تاريخ الإنتاج.",
    status: "cancelled",
    createdAt: at(10, 3, 12),
    source: "demo",
  },
  {
    id: "q-1005",
    name: "ماجد السبيعي",
    phone: "0500000105",
    business: "شركة المدار للمقاولات (تجريبي)",
    service: "commercial-printing",
    details: "كروت شخصية لـ 12 موظفًا وبروشور تعريفي.",
    status: "done",
    createdAt: at(9, 27, 9),
    source: "demo",
  },
  {
    id: "q-1004",
    name: "أمل الدوسري",
    phone: "0500000104",
    business: "أكاديمية خطوة (تجريبي)",
    service: "awards-stamps",
    details: "دروع تذكارية لحفل تكريم الطلاب مع ختم للأكاديمية.",
    status: "contacted",
    createdAt: at(9, 20, 15),
    source: "demo",
  },
  {
    id: "q-1003",
    name: "سلطان العتيبي",
    phone: "0500000103",
    business: "محطة الريف (تجريبي)",
    service: "signage",
    details: "لوحات إرشادية داخلية وخارجية.",
    status: "done",
    createdAt: at(9, 11, 11),
    source: "demo",
  },
];

export const demoMessages: ContactMessage[] = [
  {
    id: "m-208",
    name: "منيرة الزهراني",
    phone: "0500000208",
    subject: "استفسار عن الطباعة",
    message:
      "السلام عليكم، أرغب في معرفة الخيارات المتاحة لطباعة بروشورات مطوية بعدد 500 نسخة، وما المدة المتوقعة للتسليم؟",
    createdAt: at(10, 24, 8),
    read: false,
    source: "demo",
  },
  {
    id: "m-207",
    name: "تركي الغامدي",
    phone: "0500000207",
    subject: "لوحة محل",
    message: "هل يمكن زيارة الموقع لأخذ مقاسات الواجهة قبل تصميم اللوحة؟ المحل في المخواة.",
    createdAt: at(10, 23, 17),
    read: false,
    source: "demo",
  },
  {
    id: "m-206",
    name: "لمى القرني",
    phone: "0500000206",
    subject: "تصميم شعار",
    message:
      "أبحث عن تصميم شعار لمشروع منزلي صغير للحلويات، هل تقدمون باقة مختصرة للمشاريع الناشئة؟",
    createdAt: at(10, 20, 12),
    read: true,
    source: "demo",
  },
  {
    id: "m-205",
    name: "بندر الشمراني",
    phone: "0500000205",
    subject: "ملصقات عبوات",
    message: "نحتاج ملصقات مقاومة للماء لعبوات عسل بحجمين مختلفين.",
    createdAt: at(10, 16, 10),
    read: true,
    source: "demo",
  },
  {
    id: "m-204",
    name: "جواهر العمري",
    phone: "0500000204",
    subject: "مواعيد العمل",
    message: "ما هي أوقات العمل؟ وهل يمكن الحضور مساءً لمناقشة التصميم؟",
    createdAt: at(10, 11, 19),
    read: true,
    source: "demo",
  },
  {
    id: "m-203",
    name: "سعد الحربي",
    phone: "0500000203",
    subject: "حملة إعلانية",
    message: "نخطط لحملة إعلانية لافتتاح محل جديد ونرغب في مناقشة الأفكار والتكلفة التقريبية.",
    createdAt: at(10, 5, 14),
    read: false,
    source: "demo",
  },
];

/** Illustrative monthly totals for the dashboard chart (demo only). */
export const demoMonthly = [
  { month: 5, quotes: 9, messages: 6 },
  { month: 6, quotes: 12, messages: 8 },
  { month: 7, quotes: 10, messages: 11 },
  { month: 8, quotes: 15, messages: 9 },
  { month: 9, quotes: 18, messages: 13 },
  { month: 10, quotes: 14, messages: 10 },
];
