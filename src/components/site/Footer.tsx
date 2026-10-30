import { Link } from "@tanstack/react-router";
import { LockKeyhole, MapPin, Phone } from "lucide-react";
import { useLang } from "@/i18n";
import { formatPhoneDisplay, siteConfig } from "@/config/site";
import { useAppData, useCompany, visibleServices } from "@/store/app-data";
import { Logo } from "./Logo";
import { SocialIcon, WhatsAppIcon, socialLabels } from "./SocialIcon";

export function Footer() {
  const { t, bi, lang } = useLang();
  const { services, website } = useAppData();
  const company = useCompany();
  const year = new Date().getFullYear();
  const name = lang === "ar" ? company.nameAr : company.nameEn;

  const quick = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/services", label: t("nav.services") },
    ...(website.showPortfolio ? [{ to: "/portfolio", label: t("nav.portfolio") }] : []),
    { to: "/blog", label: t("nav.blog") },
    { to: "/contact", label: t("nav.contact") },
    { to: "/quote", label: t("nav.quote") },
  ] as const;

  return (
    <footer className="relative overflow-hidden bg-dark text-white/75">
      <div className="texture-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative grid gap-8 py-10 sm:gap-12 sm:py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="flex w-full min-w-0 flex-col lg:col-span-4">
          <Link to="/" aria-label={t("nav.home")} className="inline-flex w-full max-w-full">
            <Logo className="w-full" />
          </Link>
          <p className="mt-4 hidden max-w-sm text-sm leading-7 text-white/65 sm:mt-5 sm:block">
            {bi(website.footerDesc)}
          </p>
          <a
            href={company.wa(t("common.waGreeting"))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold mt-5 !flex w-full !min-h-12 !justify-center sm:mt-6 sm:!inline-flex sm:w-auto sm:!min-h-[2.375rem]"
          >
            <WhatsAppIcon className="size-5 sm:size-4" />
            {t("footer.whatsappCta")}
          </a>
          <div className="mt-5 w-full sm:mt-7 sm:w-auto">
            <ul
              className="flex w-full items-stretch gap-2 sm:w-auto sm:flex-wrap sm:items-center"
              aria-label={t("footer.socials")}
            >
              {siteConfig.socials.map(({ key }) => {
                const url = company.socials[key];
                const shell =
                  "flex size-12 flex-1 items-center justify-center rounded-xl border border-white/15 text-white/80 transition hover:border-gold hover:text-gold sm:size-10 sm:flex-none";
                return (
                  <li key={key} className="min-w-0 flex-1 sm:flex-none">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={socialLabels[key]}
                        className={shell}
                      >
                        <SocialIcon name={key} />
                      </a>
                    ) : (
                      <span
                        title={`${socialLabels[key]} — ${t("footer.soon")}`}
                        aria-label={`${socialLabels[key]} — ${t("footer.soon")}`}
                        className={`${shell} cursor-default border-dashed text-white/35`}
                      >
                        <SocialIcon name={key} />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            {siteConfig.socials.every(({ key }) => !company.socials[key]) && (
              <p className="mt-3 hidden text-xs text-white/40 sm:block">{t("footer.socialsNote")}</p>
            )}
          </div>

          <a
            href={company.tel}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm transition hover:border-gold hover:text-gold sm:hidden"
          >
            <Phone className="size-4 shrink-0 text-gold" />
            <span dir="ltr" className="font-semibold tracking-wide">
              {formatPhoneDisplay(company.phone)}
            </span>
          </a>
        </div>

        <nav className="hidden lg:col-span-2 md:block" aria-label={t("footer.quickLinks")}>
          <h2 className="text-sm font-bold text-white">{t("footer.quickLinks")}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {quick.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="hidden lg:col-span-3 md:block" aria-label={t("footer.ourServices")}>
          <h2 className="text-sm font-bold text-white">{t("footer.ourServices")}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {visibleServices(services).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="transition hover:text-gold"
                >
                  {bi(s.title)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:col-span-3 md:block">
          <h2 className="text-sm font-bold text-white">{t("footer.contactInfo")}</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href={company.tel} className="flex items-center gap-3 transition hover:text-gold">
                <Phone className="size-4 shrink-0 text-gold" />
                <span dir="ltr">{formatPhoneDisplay(company.phone)}</span>
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 size-4 shrink-0 text-gold" />
              <span className="leading-7">
                {bi(company.address)}
                <span className="block text-white/50">
                  {t("contact.postal")}: {company.postalCode}
                </span>
              </span>
            </li>
            <li>
              <a
                href={company.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline-offset-4 hover:underline"
              >
                {t("contact.mapsBtn")}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-stretch justify-between gap-3 py-4 text-center text-xs text-white/50 sm:flex-row sm:items-center sm:py-5 sm:text-start">
          <p className="w-full sm:w-auto">
            © {year} {name}. {t("footer.rights")}.
          </p>
          <div className="flex w-full items-center justify-center gap-5 sm:w-auto sm:justify-end">
            <Link to="/privacy" className="transition hover:text-gold">
              {t("page.privacyTitle")}
            </Link>
            <Link
              to="/admin/login"
              aria-label={t("footer.adminAccess")}
              title={t("footer.adminAccess")}
              className="flex size-8 items-center justify-center rounded text-white/25 transition hover:bg-white/5 hover:text-gold"
            >
              <LockKeyhole className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
