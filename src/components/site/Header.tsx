import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useLang } from "@/i18n";
import { serviceIcons } from "@/data/services";
import { useAppData, useCompany, visibleServices } from "@/store/app-data";
import { formatPhoneDisplay } from "@/config/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { SmartImage } from "./SmartImage";
import { WhatsAppIcon } from "./SocialIcon";
import { useWhatsAppOrder } from "./WhatsAppOrder";

export function Header() {
  const { t, bi, lang } = useLang();
  const { services, website } = useAppData();
  const company = useCompany();
  const { openOrder } = useWhatsAppOrder();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const svc = visibleServices(services);
  const onHome = location.pathname.replace(/\/$/, "") === "" || location.pathname === "/";
  /* Always the compact floating pill bar (especially on phone). */
  const showServicesBar = location.pathname.replace(/\/$/, "") !== "/services";
  const heroUnderBar = onHome && !scrolled && !open;

  const links = [
    { to: "/", label: t("nav.home"), exact: true },
    { to: "/about", label: t("nav.about") },
    { to: "/services", label: t("nav.services"), dropdown: true },
    ...(website.showPortfolio ? [{ to: "/portfolio", label: t("nav.portfolio") }] : []),
    { to: "/blog", label: t("nav.blog") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  const navLinkClass =
    "relative rounded-full px-3.5 py-2 text-[0.92rem] font-medium text-white/75 transition hover:bg-white/[0.07] hover:text-white data-[status=active]:bg-white/10 data-[status=active]:text-white";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pt-2 transition-[padding] duration-300 sm:pt-3">
        <div
          className={cn(
            "mx-auto w-[calc(100%-1rem)] max-w-[76rem] rounded-full border border-white/10 px-3 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.7)] backdrop-blur-xl transition-all duration-300 sm:w-[calc(100%-2rem)] sm:px-5 lg:rounded-[1.75rem]",
            /* phone: always solid; desktop home top slightly glassier */
            heroUnderBar ? "bg-navy/85 lg:bg-navy/55" : "bg-navy/85",
          )}
        >
          <div className="flex h-[3.75rem] items-center justify-between gap-4 transition-all duration-300 lg:h-14">
            <Link to="/" className="min-w-0 shrink" aria-label={t("nav.home")}>
              <Logo markClassName="size-11" />
            </Link>

            <nav className="hidden items-center lg:flex" aria-label={t("nav.mainMenu")}>
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  activeOptions={{ exact: "exact" in l ? l.exact : false }}
                  className={navLinkClass}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {website.showContactButton && (
                <button
                  type="button"
                  onClick={() => openOrder()}
                  className="btn btn-gold btn-sm hidden md:inline-flex"
                >
                  {t("nav.quote")}
                </button>
              )}
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white/10 lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t("common.close") : t("nav.openMenu")}
              >
                {open ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>

          <nav
            aria-label={t("nav.servicesMenu")}
            className={cn(
              "relative hidden border-t border-white/10",
              showServicesBar && "lg:block",
            )}
          >
            <ul className="flex h-11 items-center justify-center gap-0.5">
              {svc.map((s) => {
                const Icon = serviceIcons[s.iconKey] ?? serviceIcons.sparkles;
                const examples = s.examples[lang].length ? s.examples[lang] : s.examples.ar;
                return (
                  <li key={s.slug} className="group">
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1.5 text-[0.8rem] font-semibold text-white/75 transition hover:bg-white/[0.07] hover:text-white group-hover:bg-white/[0.07] group-hover:text-white data-[status=active]:text-gold xl:px-3 xl:text-[0.85rem]"
                    >
                      <Icon className="hidden size-4 text-gold xl:block" />
                      {bi(s.title)}
                      <ChevronDown className="size-3.5 opacity-60 transition group-hover:rotate-180 group-focus-within:rotate-180" />
                    </Link>
                    <div className="invisible absolute inset-x-0 top-full z-10 mx-auto max-w-[56rem] translate-y-2 pt-2 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="grid grid-cols-[1fr_16rem] gap-2 rounded-3xl border border-black/5 bg-white p-2 shadow-lift">
                        <div className="p-5">
                          <div className="flex items-center gap-3">
                            <span className="flex size-11 items-center justify-center rounded-2xl bg-gold-soft text-gold-strong">
                              <Icon className="size-5" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-lg font-extrabold text-navy">{bi(s.title)}</p>
                              <p className="line-clamp-1 text-sm text-muted-foreground">
                                {bi(s.short)}
                              </p>
                            </div>
                          </div>
                          <p className="mt-5 text-xs font-bold text-muted-foreground">
                            {t("svc.examplesTitle")}
                          </p>
                          <ul
                            className={cn(
                              "mt-2 grid gap-1",
                              examples.length > 6 ? "grid-cols-3" : "grid-cols-2",
                            )}
                          >
                            {examples.map((ex) => (
                              <li key={ex}>
                                <Link
                                  to="/services/$slug"
                                  params={{ slug: s.slug }}
                                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold-soft/60"
                                >
                                  <span className="size-1.5 shrink-0 rounded-full bg-gold" />
                                  {ex.replace(/\.$/, "")}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-5 flex gap-2">
                            <button
                              type="button"
                              onClick={() => openOrder(s.slug)}
                              className="btn btn-gold btn-sm"
                            >
                              {t("nav.quote")}
                            </button>
                            <Link
                              to="/services/$slug"
                              params={{ slug: s.slug }}
                              className="btn btn-outline btn-sm"
                            >
                              {t("services.details")}
                            </Link>
                          </div>
                        </div>
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-navy">
                          <SmartImage
                            src={s.image}
                            alt=""
                            className="absolute inset-0 size-full object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile drawer (outside <header>: its backdrop-filter would trap fixed children) */}
      <div
        className={cn(
          "fixed inset-0 top-[4.75rem] z-[45] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-dark/60 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <nav
          id="mobile-menu"
          aria-label={t("nav.mainMenu")}
          className={cn(
            "absolute inset-y-2 start-2 flex w-[min(22rem,calc(100vw-1rem))] flex-col overflow-y-auto rounded-3xl border border-white/10 bg-navy/95 px-5 pb-8 pt-4 shadow-2xl backdrop-blur-xl transition-transform duration-300",
            open ? "translate-x-0" : "ltr:-translate-x-[110%] rtl:translate-x-[110%]",
          )}
          inert={!open}
        >
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.to} className="border-b border-white/10">
                {"dropdown" in l ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Link
                        to={l.to}
                        className="flex-1 py-4 text-base font-semibold text-white data-[status=active]:text-gold"
                      >
                        {l.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMobileServices((v) => !v)}
                        aria-expanded={mobileServices}
                        aria-label={t("nav.allServices")}
                        className="flex size-11 items-center justify-center text-white/70"
                      >
                        <ChevronDown
                          className={cn("size-5 transition", mobileServices && "rotate-180")}
                        />
                      </button>
                    </div>
                    {mobileServices && (
                      <ul className="animate-drop-in mb-3 space-y-1 border-s border-gold/30 ps-4">
                        {svc.map((s) => (
                          <li key={s.slug}>
                            <Link
                              to="/services/$slug"
                              params={{ slug: s.slug }}
                              className="block py-2 text-sm text-white/75 hover:text-gold"
                            >
                              {bi(s.title)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={l.to}
                    activeOptions={{ exact: "exact" in l ? l.exact : false }}
                    className="block py-4 text-base font-semibold text-white data-[status=active]:text-gold"
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openOrder();
            }}
            className="btn btn-gold mt-6 w-full"
          >
            {t("nav.quote")}
          </button>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href={company.tel} className="btn btn-outline-light btn-sm">
              <Phone className="size-4" />
              <span dir="ltr">{t("common.call")}</span>
            </a>
            <a
              href={company.wa()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light btn-sm"
            >
              <WhatsAppIcon className="size-4" />
              {t("common.whatsapp")}
            </a>
          </div>
          <p className="mt-6 text-center text-xs text-white/50" dir="ltr">
            {formatPhoneDisplay(company.phone)}
          </p>
        </nav>
      </div>
    </>
  );
}
