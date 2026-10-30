const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

/** Convert Arabic-Indic / Persian digits to Latin and strip separators. */
export function normalizePhone(value: string) {
  return value
    .replace(/[٠-٩]/g, (d) => String(arabicDigits.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)))
    .replace(/[\s\-().]/g, "");
}

/** Saudi mobile numbers: 05XXXXXXXX, 5XXXXXXXX, +9665XXXXXXXX, 009665XXXXXXXX. */
export function isValidSaudiMobile(value: string) {
  return /^(?:\+966|00966|966|0)?5\d{8}$/.test(normalizePhone(value));
}

/** Looser check for admin-entered business numbers (landline or mobile, international allowed). */
export function isValidPhoneLoose(value: string) {
  return /^\+?\d{8,15}$/.test(normalizePhone(value));
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isValidUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
