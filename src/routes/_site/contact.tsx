import { createFileRoute } from "@tanstack/react-router";
import { Building2, Clock, ExternalLink, MapPin, Navigation, Phone } from "lucide-react";
import { useLang } from "@/i18n";
import { assetToken, img } from "@/lib/assets";
import { seo } from "@/lib/seo";
import { formatPhoneDisplay, siteConfig } from "@/config/site";
import { useCompany } from "@/store/app-data";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/site/ContactForm";
import { Reveal } from "@/components/site/Reveal";
import { WhatsAppIcon } from "@/components/site/SocialIcon";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/_site/contact")({
  head: () =>
    seo({
      title: "تواصل معنا",
      description:
        "تواصل مع وكالة رواد الإبداع للدعاية والإعلان — طريق السوق، المخواة، منطقة الباحة.",
      path: "/contact",
      image: img("sign-steel-letters"),
    }),
  component: ContactPage,
});

function ContactPage() {
  const { t, bi, lang } = useLang();
  const company = useCompany();
  useDocumentTitle(t("page.contactTitle"));
  const hours = bi(company.hours);

  const cards = [
    {
      icon: Building2,
      label: t("contact.company"),
      value: lang === "ar" ? company.nameAr : company.nameEn,
    },
    {
      icon: Phone,
      label: t("contact.phone"),
      value: (
        <a href={company.tel} dir="ltr" className="hover:text-gold-strong">
          {formatPhoneDisplay(company.phone)}
        </a>
      ),
    },
    {
      icon: MapPin,
      label: t("contact.location"),
      value: (
        <>
          {bi(company.address)}
          <span className="mt-1 block text-sm font-normal text-muted-foreground">
            {t("contact.postal")}: {company.postalCode}
          </span>
        </>
      ),
    },
  ];

  return (
    <>
      <PageHero
        title={t("page.contactTitle")}
        description={t("page.contactDesc")}
        image={assetToken("sign-steel-letters")}
        imageAlt={t("contact.heroAlt")}
        kicker={t("contact.kicker")}
        crumbs={[{ label: t("page.contactTitle") }]}
      >
        <div className="animate-fade-up mt-5 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3 [animation-delay:160ms]">
          <a
            href={company.wa(t("common.waGreeting"))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold !min-h-11 w-full !whitespace-normal !px-4 !text-sm sm:w-auto sm:!min-h-12 sm:!whitespace-nowrap"
          >
            <WhatsAppIcon className="size-4 shrink-0" />
            {t("contact.whatsappBtn")}
          </a>
          <a
            href={company.tel}
            className="btn btn-outline-light !min-h-11 w-full !px-4 !text-sm sm:w-auto sm:!min-h-12"
          >
            <Phone className="size-4 shrink-0" />
            <span dir="ltr">{formatPhoneDisplay(company.phone)}</span>
          </a>
        </div>
      </PageHero>

      <section className="py-10 sm:py-20">
        <div className="container-x space-y-8 sm:space-y-10">
          <div className="grid gap-3 sm:gap-5 md:grid-cols-3">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={i * 80}>
                <div className="flex h-full items-start gap-3.5 rounded-2xl border bg-card p-4 shadow-soft sm:gap-4 sm:p-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy text-gold sm:size-12">
                    <c.icon className="size-4 sm:size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-semibold text-muted-foreground sm:text-xs">
                      {c.label}
                    </p>
                    <div className="mt-1 text-sm font-bold leading-6 text-navy sm:mt-1.5 sm:text-base sm:leading-7">
                      {c.value}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <Reveal className="order-2 lg:order-1 lg:col-span-7">
              <div className="rounded-[1.35rem] border bg-card p-5 shadow-soft sm:rounded-2xl sm:p-8">
                <h2 className="text-xl font-extrabold text-navy sm:text-2xl">
                  {t("contact.formTitle")}
                </h2>
                <p className="mb-5 mt-2 text-sm leading-6 text-muted-foreground sm:mb-7">
                  {t("contact.formDesc")}
                </p>
                <ContactForm />
              </div>
            </Reveal>

            <div className="order-1 space-y-4 sm:space-y-6 lg:order-2 lg:col-span-5">
              <Reveal delay={80}>
                <div className="relative overflow-hidden rounded-[1.35rem] bg-navy p-5 text-white shadow-lift sm:rounded-2xl sm:p-8">
                  <div
                    className="pointer-events-none absolute -start-12 top-0 size-40 rounded-full bg-gold/20 blur-3xl"
                    aria-hidden
                  />
                  <div className="relative">
                    <h2 className="text-lg font-bold sm:text-xl">{t("contact.directTitle")}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/70">{t("contact.directDesc")}</p>
                    <div className="mt-5 grid gap-2.5 sm:mt-6 sm:gap-3">
                      <a
                        href={company.wa(t("common.waGreeting"))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-gold w-full !min-h-11 !whitespace-normal !px-4 !text-sm sm:!min-h-12"
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
                    <p className="mt-3 text-xs leading-5 text-white/50 sm:mt-4">
                      {t("contact.waNote")}
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={140}>
                <div className="rounded-[1.35rem] border bg-card p-5 shadow-soft sm:rounded-2xl sm:p-8">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <Clock className="size-4 text-gold-strong sm:size-5" />
                    <h2 className="text-lg font-bold text-navy sm:text-xl">
                      {t("contact.hoursTitle")}
                    </h2>
                  </div>
                  {hours ? (
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground sm:mt-4 sm:leading-8">
                      {hours}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm leading-7 text-muted-foreground sm:mt-4">
                      {t("contact.hoursNote")}
                    </p>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-24">
        <div className="container-x">
          <Reveal className="overflow-hidden rounded-[1.35rem] border bg-card shadow-soft sm:rounded-3xl">
            <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-8">
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold text-navy sm:text-2xl">
                  {t("contact.mapTitle")}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {bi(company.address)}
                </p>
              </div>
              <a
                href={company.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-navy w-full !min-h-11 !whitespace-normal !px-4 !text-sm sm:w-auto sm:shrink-0 sm:!min-h-12 sm:!whitespace-nowrap"
              >
                <Navigation className="size-4 shrink-0" />
                {t("contact.mapsBtn")}
              </a>
            </div>
            {siteConfig.mapsEmbedUrl ? (
              <iframe
                title={t("contact.mapTitle")}
                src={siteConfig.mapsEmbedUrl}
                className="h-[280px] w-full border-0 sm:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <MapPlaceholder href={company.mapsUrl} />
            )}
          </Reveal>
          <p className="mt-3 text-center text-[0.7rem] text-muted-foreground sm:mt-4 sm:text-xs">
            {t("contact.verifyNote")}
          </p>
        </div>
      </section>
    </>
  );
}

function MapPlaceholder({ href }: { href: string }) {
  const { t } = useLang();
  return (
    <div className="relative h-[260px] overflow-hidden bg-[#eef0f2] sm:h-[380px]">
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 380"
        aria-hidden
      >
        <defs>
          <pattern id="blocks" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="#eef0f2" />
            <rect x="6" y="6" width="48" height="48" rx="4" fill="#e3e6ea" />
          </pattern>
        </defs>
        <rect width="800" height="380" fill="url(#blocks)" />
        <path
          d="M-20 250 C 160 210, 300 300, 460 220 S 720 120, 840 160"
          stroke="#ffffff"
          strokeWidth="22"
          fill="none"
        />
        <path
          d="M-20 250 C 160 210, 300 300, 460 220 S 720 120, 840 160"
          stroke="#e0652e"
          strokeOpacity="0.55"
          strokeWidth="3"
          fill="none"
          strokeDasharray="10 10"
        />
        <path d="M380 -20 L 420 400" stroke="#ffffff" strokeWidth="14" />
        <path d="M120 -20 L 210 400" stroke="#ffffff" strokeWidth="8" />
        <path d="M640 -20 L 600 400" stroke="#ffffff" strokeWidth="8" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center sm:p-6">
        <span className="relative flex size-14 items-center justify-center rounded-full bg-navy text-gold shadow-lift sm:size-16">
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/30 motion-reduce:hidden" />
          <MapPin className="relative size-6 sm:size-7" />
        </span>
        <p className="mt-4 max-w-sm rounded-xl bg-white/90 px-4 py-2 text-xs text-navy shadow-soft sm:mt-5 sm:text-sm">
          {t("contact.mapPlaceholder")}
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-gold btn-sm mt-3 sm:mt-4"
        >
          <ExternalLink className="size-4" />
          {t("contact.mapsBtn")}
        </a>
      </div>
    </div>
  );
}
