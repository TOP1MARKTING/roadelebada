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
import { useWhatsAppOrder } from "@/components/site/WhatsAppOrder";
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
  const { openOrder } = useWhatsAppOrder();
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
        <div className="animate-fade-up mt-5 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3 [animation-delay:160ms]">
          <button
            type="button"
            onClick={() => openOrder(service.slug)}
            className="btn btn-gold !min-h-11 w-full !whitespace-normal !px-4 !py-2.5 !text-sm sm:w-auto sm:!min-h-12 sm:!whitespace-nowrap sm:!px-5 sm:!text-[0.95rem]"
          >
            {t("svcDetail.cta")}
            <Arrow className="size-4 shrink-0" />
          </button>
          <a
            href={company.wa(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-light !min-h-11 w-full !whitespace-normal !px-4 !py-2.5 !text-sm sm:w-auto sm:!min-h-12 sm:!whitespace-nowrap sm:!px-5 sm:!text-[0.95rem]"
          >
            <WhatsAppIcon className="size-4 shrink-0" />
            {t("contact.whatsappBtn")}
          </a>
        </div>
      </PageHero>

      <section className="relative overflow-hidden py-10 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gold-soft/40"
          aria-hidden
        />
        <div className="container-x space-y-10 sm:space-y-16">
          {(galleryItems.length > 0 || examples.length > 0) && (
            <Reveal>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-3">
                <div>
                  <p className="text-[0.7rem] font-bold tracking-[0.18em] text-gold-strong uppercase sm:text-xs">
                    {String(galleryItems.length).padStart(2, "0")}
                  </p>
                  <h2 className="mt-1.5 text-xl font-extrabold text-navy sm:mt-2 sm:text-3xl">
                    {t("svc.examplesTitle")}
                  </h2>
                </div>
                <p className="max-w-sm text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                  {t("services.visualNote")}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-4 lg:grid-cols-4">
                {galleryItems.map((g, i) => {
                  const label =
                    examples[i]?.replace(/\.$/, "") || `${t("services.sample")} ${i + 1}`;
                  const featured = i === 0 || i === 5;
                  return (
                    <button
                      key={`${g}-${i}`}
                      type="button"
                      onClick={() => setZoom(g)}
                      className={`group relative overflow-hidden rounded-2xl bg-navy text-start shadow-soft transition duration-500 active:scale-[0.99] sm:rounded-[1.35rem] sm:hover:-translate-y-1 sm:hover:shadow-lift ${
                        featured ? "sm:col-span-2 sm:row-span-2" : ""
                      }`}
                      aria-label={`${t("pf.zoom")} — ${label}`}
                      style={{ transitionDelay: `${Math.min(i, 7) * 40}ms` }}
                    >
                      <SmartImage
                        src={g}
                        alt={label}
                        className={`w-full object-cover transition duration-700 group-hover:scale-[1.06] ${
                          featured ? "aspect-square sm:aspect-square" : "aspect-square"
                        }`}
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />
                      <span className="absolute start-2 top-2 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-md sm:start-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="absolute end-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-navy shadow sm:end-3 sm:top-3 sm:size-9 sm:opacity-0 sm:transition sm:duration-300 sm:group-hover:opacity-100">
                        <Expand className="size-3.5 sm:size-4" />
                      </span>
                      <span className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4">
                        <span className="line-clamp-2 block text-[0.72rem] font-bold leading-4 text-white sm:text-base sm:leading-6">
                          {label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {examples.length > galleryItems.length && (
                <ul className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                  {examples.slice(galleryItems.length).map((ex) => (
                    <li
                      key={ex}
                      className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-navy sm:px-4 sm:py-2 sm:text-sm"
                    >
                      {ex.replace(/\.$/, "")}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          )}

          <Reveal>
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-gold-soft text-gold-strong sm:size-12">
                    <Icon className="size-4 sm:size-5" />
                  </span>
                  <h2 className="text-xl font-extrabold text-navy sm:text-3xl">
                    {t("services.aboutService")}
                  </h2>
                </div>
                <p className="mt-4 max-w-2xl text-[0.95rem] leading-8 text-foreground/80 sm:mt-5 sm:text-[1.08rem] sm:leading-9">
                  {bi(service.detail) || bi(service.short)}
                </p>
              </div>

              {benefits.length > 0 && (
                <div className="lg:col-span-5">
                  <h3 className="text-xs font-bold tracking-[0.14em] text-gold-strong uppercase sm:text-sm">
                    {t("svcDetail.benefitsTitle")}
                  </h3>
                  <ul className="mt-3 grid gap-2.5 sm:mt-4 sm:gap-3">
                    {benefits.slice(0, 4).map((b, i) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 rounded-2xl border border-border/70 bg-card/80 px-3.5 py-3 backdrop-blur-sm transition hover:border-gold/50 sm:gap-3 sm:px-4 sm:py-3.5"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-white sm:size-6">
                          <Check className="size-3 sm:size-3.5" />
                        </span>
                        <span className="text-sm leading-6 text-navy sm:text-[0.95rem] sm:leading-7">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal>
            <div className="relative overflow-hidden rounded-[1.35rem] bg-navy px-4 py-6 text-white shadow-lift sm:rounded-[1.75rem] sm:px-10 sm:py-10">
              <div
                className="pointer-events-none absolute -start-16 top-0 size-56 rounded-full bg-gold/20 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -end-10 bottom-0 size-48 rounded-full bg-orange-500/15 blur-3xl"
                aria-hidden
              />
              <div className="relative grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-8">
                <div>
                  <h2 className="text-xl font-extrabold sm:text-3xl">{t("services.sidebarTitle")}</h2>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-white/70 sm:mt-3 sm:text-base">
                    {t("services.sidebarDesc")}
                  </p>
                </div>
                <div className="grid gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => openOrder(service.slug)}
                    className="btn btn-gold w-full !min-h-11 !whitespace-normal !px-4 !text-sm sm:!min-h-12 sm:!whitespace-nowrap sm:!text-[0.95rem]"
                  >
                    {t("svcDetail.cta")}
                    <Arrow className="size-4 shrink-0" />
                  </button>
                  <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                    <a
                      href={company.wa(waMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-light w-full !min-h-11 !whitespace-normal !px-4 !text-sm sm:!min-h-12 sm:!whitespace-nowrap"
                    >
                      <WhatsAppIcon className="size-4 shrink-0" />
                      {t("contact.whatsappBtn")}
                    </a>
                    <a
                      href={company.tel}
                      className="btn btn-outline-light w-full !min-h-11 !px-4 !text-sm sm:!min-h-12"
                    >
                      <Phone className="size-4 shrink-0" />
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
        <section className="pb-12 sm:pb-20">
          <div className="container-x">
            <h2 className="text-base font-bold text-navy sm:text-lg">{t("svcDetail.otherServices")}</h2>
            <ul className="mt-3 flex flex-wrap gap-2 sm:mt-4">
              {related.map((s) => {
                const RIcon = serviceIcons[s.iconKey] ?? serviceIcons.sparkles;
                return (
                  <li key={s.slug}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-2 text-xs font-semibold text-navy transition hover:border-gold hover:text-gold-strong sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                      <RIcon className="size-3.5 text-gold-strong sm:size-4" />
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
          <div className="flex items-center justify-center p-1">
            <SmartImage
              src={zoom}
              alt={bi(service.title)}
              loading="eager"
              className="max-h-[50vh] w-auto max-w-full rounded-xl object-contain sm:max-h-[55vh]"
            />
          </div>
        )}
      </Modal>
    </>
  );
}
