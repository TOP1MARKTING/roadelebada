/**
 * Central business configuration — edit these values in one place.
 * Contact details below are supplied business information that must be
 * verified by the agency owner before production use.
 * The admin dashboard "company information" page can override these
 * locally (prototype only) via localStorage.
 */
export const siteConfig = {
  // Placeholder: replace with the real domain before publishing (used for canonical / Open Graph URLs).
  siteUrl: "https://www.example.com",
  nameAr: "وكالة رواد الإبداع للدعاية والإعلان",
  nameEn: "Creative Pioneers Advertising Agency",
  shortAr: "رواد الإبداع",
  shortEn: "Creative Pioneers",
  phone: "+966500971012",
  phoneDisplay: "+966 50 097 1012",
  // Not confirmed to be registered on WhatsApp — verify before production.
  whatsappNumber: "966500971012",
  addressAr: "طريق السوق، المخواة، منطقة الباحة، المملكة العربية السعودية.",
  addressEn: "Souq Road, Al Mikhwah, Al Baha Region, Saudi Arabia.",
  postalCode: "65311",
  mapsUrl: "https://maps.app.goo.gl/5nT61qZa2VSJnEdJ6",
  // Optional Google Maps embed URL (Share → Embed a map). Empty shows a styled placeholder.
  mapsEmbedUrl: "",
  // Not provided by the business — intentionally empty. Do not invent.
  email: null as string | null,
  // Not provided by the business — intentionally empty. Do not invent.
  hoursAr: "",
  hoursEn: "",
  socials: [
    { key: "facebook", url: "https://www.facebook.com/share/1Ex7DDtJHU/" },
    { key: "twitter", url: "https://x.com/rowadelebda3" },
    { key: "instagram", url: "https://www.instagram.com/rowadelebda3" },
    { key: "youtube", url: "https://youtube.com/@rowadelebda3" },
    { key: "tiktok", url: "https://www.tiktok.com/@rowadelebda3" },
    { key: "snapchat", url: "https://snapchat.com/t/xzrXrvLv" },
  ],
  // Prototype-only mock admin credentials. NOT secure authentication.
  demoAdmin: {
    email: "admin@roadelebada.com",
    password: "Demo123!",
  },
} as const;

export type SocialKey = (typeof siteConfig.socials)[number]["key"];

export const formatPhoneDisplay = (phone: string) => {
  const digits = phone.replace(/[^\d+]/g, "");
  const m = digits.match(/^\+966(\d{2})(\d{3})(\d{4})$/);
  return m ? `+966 ${m[1]} ${m[2]} ${m[3]}` : phone;
};

export const whatsappLink = (number: string, message?: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
