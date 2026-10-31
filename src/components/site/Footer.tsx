import { Link } from "@tanstack/react-router";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import { useLang } from "@/i18n";
import { formatPhoneDisplay, siteConfig } from "@/config/site";
import { useAppData, useCompany, visibleServices } from "@/store/app-data";
import top1Logo from "@/assets/top1markting-logo.png";
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
    <footer className="relative overflow-hidden bg-dark pb-20 text-white/75 sm:pb-0">
      <div className="texture-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative grid gap-8 py-10 sm:gap-12 sm:py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="flex w-full min-w-0 flex-col pe-14 sm:pe-0 lg:col-span-4">
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

        <div className="lg:col-span-3">
          <h2 className="text-sm font-bold text-white">{t("footer.contactInfo")}</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="hidden sm:block">
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
            <li className="pt-1 text-xs leading-6 text-white/50">
              <Link
                to="/admin/login"
                aria-label={t("footer.adminAccess")}
                title={t("footer.adminAccess")}
                className="inline transition hover:text-gold"
              >
                ©
              </Link>{" "}
              {year} {name}. {t("footer.rights")}.
            </li>
            <li>
              <Link to="/privacy" className="text-xs transition hover:text-gold">
                {t("page.privacyTitle")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex justify-center py-5">
          <a
            href="https://www.top1markting.com/"
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            aria-label="Top1Markting — تنفيذ"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-3.5 py-1.5 shadow-[0_4px_16px_-4px_rgb(0_0_0/0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-4px_rgb(0_0_0/0.5)]"
          >
            <ExternalLink className="size-3.5 shrink-0 text-[#0A1F4D]" strokeWidth={2.5} />
            <span className="text-[0.8rem] font-bold tracking-tight text-[#0A1F4D]">
              Top<span className="text-[#E5B41F]">1</span>Markting
            </span>
            <span className="text-[0.8rem] font-extrabold text-[#E5B41F]">تنفيذ</span>
            <img
              src={top1Logo}
              alt=""
              aria-hidden
              className="h-7 w-auto shrink-0 object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
