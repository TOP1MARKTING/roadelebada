import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Expand, Phone } from "lucide-react";
import { useLang } from "@/i18n";
import { defaultServices, serviceIcons } from "@/data/services";
import { resolveImage } from "@/lib/assets";
import { seo } from "@/lib/seo";
import { formatPhoneDisplay } from "@/config/site";
import { useAppData, useCompany, visibleServices } from "@/store/app-data";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/site/SmartImage";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { WhatsAppIcon } from "@/components/site/SocialIcon";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/_site/services/$slug")({
  head: ({ params }) => {
    const s = defaultServices.find((x) => x.slug === params.slug);
    return seo({
      title: s?.title.ar ?? "تفاصيل الخدمة",
      description: s?.short.ar ?? "تفاصيل خدمات وكالة رواد الإبداع للدعاية والإعلان.",
      path: `/services/${params.slug}`,
      image: s ? resolveImage(s.image) : undefined,
    });
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const { t, bi, lang, dir } = useLang();
  const { services, hydrated } = useAppData();
  const company = useCompany();
  const [zoom, setZoom] = useState<string | null>(null);
  const service = services.find((s) => s.slug === slug && s.visible);
  useDocumentTitle(service ? bi(service.title) : t("notFound.title"));
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  if (!service) {
    return (
      <section className="flex min-h-[70vh] items-center bg-navy pt-24 text-white">
        <div className="container-x text-center">
          <h1 className="text-3xl font-extrabold">{hydrated ? t("services.notFound") : "…"}</h1>
          {hydrated && (
            <>
              <p className="mx-auto mt-3 max-w-md text-white/70">{t("services.notFoundDesc")}</p>
              <Link to="/services" className="btn btn-gold mt-8">
                {t("nav.allServices")}
              </Link>
            </>
          )}
        </div>
      </section>
    );
  }

  const Icon = serviceIcons[service.iconKey] ?? serviceIcons.sparkles;
  const related = visibleServices(services).filter((s) => s.slug !== service.slug);
  const examples = service.examples[lang].length ? service.examples[lang] : service.examples.ar;
  const benefits = service.benefits[lang].length ? service.benefits[lang] : service.benefits.ar;
  const gallery = service.gallery.length ? service.gallery : [service.image];
  const waMessage = t("services.waMessage", { service: bi(service.title) });
  const galleryItems = gallery.length ? gallery : [service.image];

  return (
    <>
      <PageHero
        title={bi(service.title)}
        description={bi(service.short)}
        image={service.image}
        imageAlt={bi(service.title)}
        kicker={t("page.svcDetailKicker")}
        crumbs={[{ label: t("page.servicesTitle"), to: "/services" }, { label: bi(service.title) }]}
      >
        <div className="animate-fade-up mt-8 flex flex-col gap-3 xs:flex-row [animation-delay:160ms]">
          <Link to="/quote" search={{ service: service.slug }} className="btn btn-gold">
            {t("svcDetail.cta")}
            <Arrow className="size-4" />
          </Link>
          <a
            href={company.wa(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-light"
          >
            <WhatsAppIcon className="size-4" />
            {t("contact.whatsappBtn")}
          </a>
        </div>
      </PageHero>

      <section className="relative overflow-hidden py-14 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gold-soft/40"
          aria-hidden
        />
        <div className="container-x space-y-14 sm:space-y-16">
          {(galleryItems.length > 0 || examples.length > 0) && (
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-gold-strong uppercase">
                    {String(galleryItems.length).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">
                    {t("svc.examplesTitle")}
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  {t("services.visualNote")}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {galleryItems.map((g, i) => {
                  const label =
                    examples[i]?.replace(/\.$/, "") || `${t("services.sample")} ${i + 1}`;
                  const featured = i === 0 || i === 5;
                  return (
                    <button
                      key={`${g}-${i}`}
                      type="button"
                      onClick={() => setZoom(g)}
                      className={`group relative overflow-hidden rounded-[1.35rem] bg-navy text-start shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift ${
                        featured ? "sm:col-span-2 sm:row-span-2" : ""
                      }`}
                      aria-label={`${t("pf.zoom")} — ${label}`}
                      style={{ transitionDelay: `${Math.min(i, 7) * 40}ms` }}
                    >
                      <SmartImage
                        src={g}
                        alt={label}
                        className={`w-full object-cover transition duration-700 group-hover:scale-[1.06] ${
                          featured ? "aspect-[4/3] sm:aspect-square" : "aspect-square"
                        }`}
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/15 to-transparent opacity-90 transition group-hover:opacity-100" />
                      <span className="absolute start-3 top-3 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur-md">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="absolute end-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-navy opacity-0 shadow transition duration-300 group-hover:opacity-100">
                        <Expand className="size-4" />
                      </span>
                      <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                        <span className="block text-sm font-bold text-white sm:text-base">
                          {label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {examples.length > galleryItems.length && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {examples.slice(galleryItems.length).map((ex) => (
                    <li
                      key={ex}
                      className="rounded-full border bg-background px-4 py-2 text-sm font-medium text-navy"
                    >
                      {ex.replace(/\.$/, "")}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          )}

          <Reveal>
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-gold-soft text-gold-strong">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="text-2xl font-extrabold text-navy sm:text-3xl">
                    {t("services.aboutService")}
                  </h2>
                </div>
                <p className="mt-5 max-w-2xl text-[1.08rem] leading-9 text-foreground/80">
                  {bi(service.detail) || bi(service.short)}
                </p>
              </div>

              {benefits.length > 0 && (
                <div className="lg:col-span-5">
                  <h3 className="text-sm font-bold tracking-[0.14em] text-gold-strong uppercase">
                    {t("svcDetail.benefitsTitle")}
                  </h3>
                  <ul className="mt-4 grid gap-3">
                    {benefits.slice(0, 4).map((b, i) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-3.5 backdrop-blur-sm transition hover:border-gold/50"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold text-white">
                          <Check className="size-3.5" />
                        </span>
                        <span className="text-[0.95rem] leading-7 text-navy">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-navy px-6 py-8 text-white shadow-lift sm:px-10 sm:py-10">
              <div
                className="pointer-events-none absolute -start-16 top-0 size-56 rounded-full bg-gold/20 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -end-10 bottom-0 size-48 rounded-full bg-orange-500/15 blur-3xl"
                aria-hidden
              />
              <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                <div>
                  <h2 className="text-2xl font-extrabold sm:text-3xl">{t("services.sidebarTitle")}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                    {t("services.sidebarDesc")}
                  </p>
                </div>
                <div className="grid gap-3">
                  <Link to="/quote" search={{ service: service.slug }} className="btn btn-gold w-full">
                    {t("svcDetail.cta")}
                    <Arrow className="size-4" />
                  </Link>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                      href={company.wa(waMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-light w-full"
                    >
                      <WhatsAppIcon className="size-4" />
                      {t("contact.whatsappBtn")}
                    </a>
                    <a href={company.tel} className="btn btn-outline-light w-full">
                      <Phone className="size-4" />
                      <span dir="ltr">{formatPhoneDisplay(company.phone)}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="pb-16 sm:pb-20">
          <div className="container-x">
            <h2 className="text-lg font-bold text-navy">{t("svcDetail.otherServices")}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((s) => {
                const RIcon = serviceIcons[s.iconKey] ?? serviceIcons.sparkles;
                return (
                  <li key={s.slug}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:border-gold hover:text-gold-strong"
                    >
                      <RIcon className="size-4 text-gold-strong" />
                      {bi(s.title)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <Modal open={!!zoom} onClose={() => setZoom(null)} size="sm" title={bi(service.title)}>
        {zoom && (
          <div className="flex items-center justify-center">
            <SmartImage
              src={zoom}
              alt={bi(service.title)}
              loading="eager"
              className="max-h-[55vh] w-auto max-w-full rounded-xl object-contain"
            />
          </div>
        )}
      </Modal>
    </>
  );
}
