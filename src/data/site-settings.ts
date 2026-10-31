import { siteConfig, type SocialKey } from "@/config/site";
import type { Bilingual, Lang } from "@/i18n";

export interface CompanySettings {
  nameAr: string;
  nameEn: string;
  shortDesc: Bilingual;
  longDesc: Bilingual;
  phone: string;
  whatsapp: string;
  address: Bilingual;
  postalCode: string;
  mapsUrl: string;
  hours: Bilingual;
  logoUrl: string;
  primaryColor: string;
  socials: Record<SocialKey, string>;
}

export interface WebsiteSettings {
  defaultLanguage: Lang;
  pageTitle: Bilingual;
  metaDescription: Bilingual;
  /** empty = typographic logo */
  headerLogo: string;
  footerDesc: Bilingual;
  showContactButton: boolean;
  showPortfolio: boolean;
  maintenanceMode: boolean;
}

export const defaultCompany: CompanySettings = {
  nameAr: siteConfig.nameAr,
  nameEn: siteConfig.nameEn,
  shortDesc: {
    ar: "وكالة سعودية متخصصة في التصميم والدعاية والإعلان، تقدم حلولًا إبداعية بجودة تنفيذ عالية.",
    en: "A Saudi agency specialized in design, advertising and promotion, delivering creative solutions with high execution quality.",
  },
  longDesc: {
    ar: "تقدم وكالة رواد الإبداع للدعاية والإعلان حلولًا إبداعية في مجال التصميم والدعاية والإعلان، مع الاهتمام بجودة التنفيذ والتفاصيل التي تساعد الأنشطة التجارية على تقديم صورة احترافية أمام عملائها.",
    en: "Creative Pioneers Advertising Agency delivers creative design, advertising and branding solutions — caring for execution quality and the details that help businesses present a professional image to their customers.",
  },
  phone: siteConfig.phone,
  whatsapp: siteConfig.whatsappNumber,
  address: { ar: siteConfig.addressAr, en: siteConfig.addressEn },
  postalCode: siteConfig.postalCode,
  mapsUrl: siteConfig.mapsUrl,
  hours: { ar: siteConfig.hoursAr, en: siteConfig.hoursEn },
  logoUrl: "",
  primaryColor: "#1C1E22",
  socials: Object.fromEntries(siteConfig.socials.map((s) => [s.key, s.url])) as Record<
    SocialKey,
    string
  >,
};

export const defaultWebsite: WebsiteSettings = {
  defaultLanguage: "ar",
  pageTitle: { ar: siteConfig.nameAr, en: siteConfig.nameEn },
  metaDescription: {
    ar: "تصميم وطباعة المطبوعات التجارية والاستيكرات والهدايا الدعائية واللوحات والاستاندات وكروت المناسبات والدروع والأختام.",
    en: "Design and printing of commercial prints, stickers, promo gifts, signs, stands, occasion cards, awards and stamps.",
  },
  headerLogo: "",
  footerDesc: {
    ar: "وكالة سعودية متخصصة في التصميم والدعاية والإعلان، تقدم حلولًا إبداعية بجودة تنفيذ عالية.",
    en: "A Saudi agency specialized in design, advertising and promotion, delivering creative solutions with high execution quality.",
  },
  showContactButton: true,
  showPortfolio: false,
  maintenanceMode: false,
};
