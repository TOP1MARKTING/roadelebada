import { useEffect } from "react";
import { useLang } from "@/i18n";
import { useAppData } from "@/store/app-data";

/** Keeps `document.title` in the active language (route `head()` provides the Arabic SSR default). */
export function useDocumentTitle(title?: string) {
  const { lang } = useLang();
  const { company } = useAppData();
  useEffect(() => {
    const brand = lang === "ar" ? company.nameAr : company.nameEn;
    document.title = title ? `${title} | ${brand}` : brand;
  }, [title, lang, company.nameAr, company.nameEn]);
}
