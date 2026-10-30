import { createFileRoute } from "@tanstack/react-router";
import { Building2, Clock, ExternalLink, MapPin, Navigation, Phone } from "lucide-react";
import { useLang } from "@/i18n";
import { img } from "@/lib/assets";
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
      image: img("storefront-sign"),
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
        image={img("storefront-sign")}
        imageAlt={t("contact.heroAlt")}
        kicker={t("contact.kicker")}
        crumbs={[{ label: t("page.contactTitle") }]}
      />

      <section className="py-16 sm:py-24">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-3">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={i * 80}>
                <div className="flex h-full items-start gap-4 rounded-2xl border bg-card p-6 shadow-soft">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
                    <c.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground">{c.label}</p>
                    <div className="mt-1.5 font-bold leading-7 text-navy">{c.value}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
                <h2 className="text-2xl font-extrabold text-navy">{t("contact.formTitle")}</h2>
                <p className="mb-7 mt-2 text-sm leading-6 text-muted-foreground">
                  {t("contact.formDesc")}
                </p>
                <ContactForm />
              </div>
            </Reveal>

            <div className="space-y-6 lg:col-span-5">
              <Reveal delay={80}>
                <div className="rounded-2xl bg-navy p-6 text-white sm:p-8">
                  <h2 className="text-xl font-bold">{t("contact.directTitle")}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">{t("contact.directDesc")}</p>
                  <div className="mt-6 grid gap-3 xs:grid-cols-2">
                    <a
                      href={company.wa(t("common.waGreeting"))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-gold"
                    >
                      <WhatsAppIcon className="size-4" />
                      {t("contact.whatsappBtn")}
                    </a>
                    <a href={company.tel} className="btn btn-outline-light">
                      <Phone className="size-4" />
                      {t("common.call")}
                    </a>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-white/50">{t("contact.waNote")}</p>
                </div>
              </Reveal>

              <Reveal delay={140}>
                <div className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
                  <div className="flex items-center gap-3">
                    <Clock className="size-5 text-gold-strong" />
                    <h2 className="text-xl font-bold text-navy">{t("contact.hoursTitle")}</h2>
                  </div>
                  {hours ? (
                    <p className="mt-4 whitespace-pre-line leading-8 text-foreground">{hours}</p>
                  ) : (
                    <p className="mt-4 leading-7 text-muted-foreground">{t("contact.hoursNote")}</p>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-x">
          <Reveal className="overflow-hidden rounded-3xl border bg-card shadow-soft">
            <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h2 className="text-2xl font-extrabold text-navy">{t("contact.mapTitle")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{bi(company.address)}</p>
              </div>
              <a
                href={company.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-navy shrink-0"
              >
                <Navigation className="size-4" />
                {t("contact.mapsBtn")}
              </a>
            </div>
            {siteConfig.mapsEmbedUrl ? (
              <iframe
                title={t("contact.mapTitle")}
                src={siteConfig.mapsEmbedUrl}
                className="h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <MapPlaceholder href={company.mapsUrl} />
            )}
          </Reveal>
          <p className="mt-4 text-center text-xs text-muted-foreground">
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
    <div className="relative h-[380px] overflow-hidden bg-[#eef0f2]">
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
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <span className="relative flex size-16 items-center justify-center rounded-full bg-navy text-gold shadow-lift">
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/30 motion-reduce:hidden" />
          <MapPin className="relative size-7" />
        </span>
        <p className="mt-5 max-w-sm rounded-xl bg-white/90 px-4 py-2 text-sm text-navy shadow-soft">
          {t("contact.mapPlaceholder")}
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-gold btn-sm mt-4"
        >
          <ExternalLink className="size-4" />
          {t("contact.mapsBtn")}
        </a>
      </div>
    </div>
  );
}
