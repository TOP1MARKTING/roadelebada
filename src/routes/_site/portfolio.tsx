import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { useLang } from "@/i18n";
import { img } from "@/lib/assets";
import { seo } from "@/lib/seo";
import { publishedPortfolio, useAppData } from "@/store/app-data";
import { PageHero } from "@/components/site/PageHero";
import { PortfolioGallery } from "@/components/site/PortfolioGallery";
import { SmartImage } from "@/components/site/SmartImage";
import { Reveal } from "@/components/site/Reveal";
import { ContactStrip } from "@/components/site/sections";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/_site/portfolio")({
  head: () =>
    seo({
      title: "أعمالنا",
      description:
        "معرض توضيحي لنماذج التصميم في الهوية البصرية والطباعة واللوحات الإعلانية والتغليف.",
      path: "/portfolio",
      image: img("pf-packaging"),
    }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { t, dir } = useLang();
  const { portfolio, website } = useAppData();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  useDocumentTitle(t("page.portfolioTitle"));

  return (
    <>
      <PageHero
        title={t("page.portfolioTitle")}
        description={t("page.portfolioDesc")}
        image={img("pf-packaging")}
        imageAlt={t("portfolio.heroAlt")}
        kicker={t("home.portfolioKicker")}
        crumbs={[{ label: t("page.portfolioTitle") }]}
      />

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <Reveal className="mb-8 flex items-start gap-3 rounded-xl border border-gold/40 bg-gold-soft/40 p-4 text-sm leading-6 text-navy">
            <Info className="mt-0.5 size-4 shrink-0 text-gold-strong" />
            <p>{t("home.portfolioNote")}</p>
          </Reveal>
          {website.showPortfolio ? (
            <PortfolioGallery items={publishedPortfolio(portfolio)} />
          ) : (
            <p className="rounded-2xl border border-dashed bg-white p-10 text-center text-muted-foreground">
              {t("portfolio.hidden")}
            </p>
          )}
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-x">
          <Reveal className="grid overflow-hidden rounded-3xl bg-navy text-white lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="kicker !text-gold">{t("portfolio.customKicker")}</p>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">{t("pf.customTitle")}</h2>
              <p className="mt-4 leading-8 text-white/75">{t("pf.customDesc")}</p>
              <div className="mt-8 flex flex-col gap-3 xs:flex-row">
                <Link to="/quote" className="btn btn-gold">
                  {t("pf.customCta")}
                  <Arrow className="size-4" />
                </Link>
                <Link to="/services" className="btn btn-outline-light">
                  {t("hero.cta1")}
                </Link>
              </div>
            </div>
            <SmartImage
              src={img("about-designer")}
              alt={t("about.img1Alt")}
              className="h-full min-h-64 w-full object-cover"
            />
          </Reveal>
        </div>
      </section>
      <ContactStrip />
    </>
  );
}
