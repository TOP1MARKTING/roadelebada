import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/i18n";
import { img } from "@/lib/assets";
import { seo } from "@/lib/seo";
import { useAppData, visibleServices } from "@/store/app-data";
import { PageHero } from "@/components/site/PageHero";
import { ServiceCard } from "@/components/site/ServiceCard";
import { CategoryCircles, HowToOrder } from "@/components/site/sections";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/_site/services/")({
  head: () =>
    seo({
      title: "خدماتنا",
      description:
        "المطبوعات التجارية، الاستيكرات والملصقات، الهدايا والتغليف، اللوحات والحروف، الاستاندات، المناسبات، والدروع والأختام.",
      path: "/services",
      image: img("cat-print"),
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
        image={img("cat-print")}
        imageAlt={t("services.heroAlt")}
        kicker={t("home.servicesKicker")}
        crumbs={[{ label: t("page.servicesTitle") }]}
      />

      <section className="relative bg-[#E0652E] py-16 sm:py-20">
        <div className="container-x relative">
          <SectionHeading
            tone="light"
            kicker={t("home.browseKicker")}
            title={t("home.browseTitle")}
            description={t("home.browseDesc")}
          />
          <div className="mt-10 sm:mt-12">
            <CategoryCircles services={list} labelTone="light" />
          </div>
        </div>
      </section>

      <section className="bg-[#f9f7f2] py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            kicker={t("home.servicesKicker")}
            title={t("page.servicesTitle")}
            description={t("page.servicesDesc")}
          />
          <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-7">
            {list.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("services.availabilityNote")}
          </p>
        </div>
      </section>

      <HowToOrder />
    </>
  );
}
