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

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-8">
            <Reveal className="rounded-3xl border bg-card p-6 shadow-soft sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-gold-soft text-gold-strong">
                  <Icon className="size-5" />
                </span>
                <h2 className="text-xl font-extrabold text-navy sm:text-2xl">
                  {t("services.aboutService")}
                </h2>
              </div>
              <p className="mt-5 text-[1.05rem] leading-8 text-foreground/85">
                {bi(service.detail) || bi(service.short)}
              </p>

              {examples.length > 0 && (
                <>
                  <h3 className="mt-8 font-bold text-navy">{t("svc.examplesTitle")}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {examples.map((ex) => (
                      <li
                        key={ex}
                        className="rounded-full border bg-background px-4 py-2 text-sm font-medium text-navy"
                      >
                        {ex.replace(/\.$/, "")}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {benefits.length > 0 && (
                <>
                  <h3 className="mt-8 font-bold text-navy">{t("svcDetail.benefitsTitle")}</h3>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {benefits.slice(0, 4).map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-[0.95rem] leading-7">
                        <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-white">
                          <Check className="size-3" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Reveal>

            {gallery.length > 0 && (
              <Reveal>
                <div className="grid grid-cols-3 gap-3">
                  {gallery.slice(0, 3).map((g, i) => (
                    <button
                      key={`${g}-${i}`}
                      type="button"
                      onClick={() => setZoom(g)}
                      className="group relative overflow-hidden rounded-2xl bg-navy"
                      aria-label={`${t("pf.zoom")} ${i + 1}`}
                    >
                      <SmartImage
                        src={g}
                        alt={`${bi(service.title)} — ${t("services.sample")} ${i + 1}`}
                        className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <span className="absolute end-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-navy opacity-0 shadow transition group-hover:opacity-100">
                        <Expand className="size-4" />
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{t("services.visualNote")}</p>
              </Reveal>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-3xl bg-navy p-6 text-white shadow-lift lg:sticky lg:top-32 sm:p-7">
              <h2 className="text-xl font-extrabold">{t("services.sidebarTitle")}</h2>
              <p className="mt-2 text-sm leading-7 text-white/70">{t("services.sidebarDesc")}</p>
              <div className="mt-6 grid gap-3">
                <Link to="/quote" search={{ service: service.slug }} className="btn btn-gold w-full">
                  {t("svcDetail.cta")}
                  <Arrow className="size-4" />
                </Link>
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
          </aside>
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

      <Modal open={!!zoom} onClose={() => setZoom(null)} size="xl" title={bi(service.title)}>
        {zoom && (
          <SmartImage
            src={zoom}
            alt={bi(service.title)}
            loading="eager"
            className="w-full rounded-xl object-contain"
          />
        )}
      </Modal>
    </>
  );
}
