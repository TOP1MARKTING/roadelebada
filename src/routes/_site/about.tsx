import { createFileRoute } from "@tanstack/react-router";
import { Compass, Eye, Handshake } from "lucide-react";
import { useLang } from "@/i18n";
import { img } from "@/lib/assets";
import { seo } from "@/lib/seo";
import { useAppData } from "@/store/app-data";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SmartImage } from "@/components/site/SmartImage";
import { Reveal } from "@/components/site/Reveal";
import { AboutIntro, CtaBand, ProcessSteps, ValueCards, WhyUs } from "@/components/site/sections";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/_site/about")({
  head: () =>
    seo({
      title: "من نحن",
      description:
        "تعرف على وكالة رواد الإبداع للدعاية والإعلان ونهجنا في تقديم الحلول الإبداعية في التصميم والطباعة واللوحات الإعلانية.",
      path: "/about",
      image: img("about-signage"),
    }),
  component: AboutPage,
});

function AboutPage() {
  const { t, bi } = useLang();
  const { company } = useAppData();
  useDocumentTitle(t("page.aboutTitle"));

  const pillars = [
    { icon: Eye, title: t("about.visionTitle"), desc: t("about.vision") },
    { icon: Compass, title: t("about.missionTitle"), desc: t("about.mission") },
    { icon: Handshake, title: t("about.promiseTitle"), desc: t("about.promise") },
  ];

  return (
    <>
      <PageHero
        title={t("page.aboutTitle")}
        description={t("page.aboutDesc")}
        image={img("about-signage")}
        imageAlt={t("about.img2Alt")}
        kicker={t("home.aboutKicker")}
        crumbs={[{ label: t("page.aboutTitle") }]}
      />

      <AboutIntro withLink={false} />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            align="center"
            kicker={t("about.valuesKicker")}
            title={t("about.valuesTitle")}
            description={bi(company.shortDesc)}
          />
          <div className="mt-14">
            <ValueCards />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading kicker={t("about.storyKicker")} title={t("about.storyTitle")} />
            <Reveal delay={80}>
              <p className="mt-6 leading-8 text-muted-foreground">{bi(company.longDesc)}</p>
              <p className="mt-4 leading-8 text-muted-foreground">{t("about.storyP2")}</p>
            </Reveal>
          </div>
          <div className="grid gap-5 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-1 xl:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="h-full rounded-2xl border-t-2 border-gold bg-card p-6 shadow-soft">
                  <p.icon className="size-6 text-gold-strong" />
                  <h3 className="mt-4 text-lg font-bold text-navy">{p.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-7 text-muted-foreground">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="grid sm:grid-cols-3">
          {(["svc-design", "printing-press", "storefront-sign"] as const).map((k, i) => (
            <Reveal key={k} delay={i * 80} className="overflow-hidden">
              <SmartImage
                src={img(k)}
                alt={t(`about.strip${i + 1}Alt`)}
                className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
              />
            </Reveal>
          ))}
        </div>
      </section>

      <ProcessSteps tone="dark" />
      <WhyUs />
      <CtaBand />
    </>
  );
}
