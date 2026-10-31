import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/i18n";
import { assetToken, img } from "@/lib/assets";
import { seo } from "@/lib/seo";
import { useAppData, visibleServices } from "@/store/app-data";
import { PageHero } from "@/components/site/PageHero";
import { ServiceCard } from "@/components/site/ServiceCard";
import { CategoryCircles, HowToOrder } from "@/components/site/sections";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/_site/services/")({
  head: () =>
    seo({
      title: "خدماتنا",
      description:
        "المطبوعات التجارية، الاستيكرات والملصقات، الهدايا والتغليف، اللوحات والحروف، الاستاندات، المناسبات، والدروع والأختام.",
      path: "/services",
      image: img("print-business-cards"),
    }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useLang();
  const { services } = useAppData();
  useDocumentTitle(t("page.servicesTitle"));
  const list = visibleServices(services);

  return (
    <>
      <PageHero
        title={t("page.servicesTitle")}
        description={t("page.servicesDesc")}
        image={assetToken("print-business-cards")}
        imageAlt={t("services.heroAlt")}
        kicker={t("home.servicesKicker")}
        crumbs={[{ label: t("page.servicesTitle") }]}
      />

      <section className="relative overflow-hidden bg-navy py-10 text-white sm:py-16">
        <div
          className="pointer-events-none absolute -start-20 top-0 size-64 rounded-full bg-gold/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -end-16 bottom-0 size-56 rounded-full bg-orange-500/10 blur-3xl"
          aria-hidden
        />
        <div className="container-x relative">
          <SectionHeading
            tone="light"
            kicker={t("home.browseKicker")}
            title={t("home.browseTitle")}
            description={t("home.browseDesc")}
          />
          <div className="mt-8 sm:mt-10">
            <CategoryCircles services={list} labelTone="light" />
          </div>
        </div>
      </section>

      <section className="bg-background py-10 sm:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              kicker={t("home.servicesKicker")}
              title={t("page.servicesTitle")}
              description={t("page.servicesDesc")}
            />
          </Reveal>
          <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-7">
            {list.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground sm:text-sm">
            {t("services.availabilityNote")}
          </p>
        </div>
      </section>

      <HowToOrder />
    </>
  );
}
