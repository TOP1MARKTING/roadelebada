import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/i18n";
import { img } from "@/lib/assets";
import { seo } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { useAppData, visibleServices } from "@/store/app-data";
import { SmartImage } from "@/components/site/SmartImage";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  AboutIntro,
  CategoryCircles,
  ContactStrip,
  CtaBand,
  ProcessSteps,
  WhyUs,
} from "@/components/site/sections";
import { useWhatsAppOrder } from "@/components/site/WhatsAppOrder";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

interface HomeSearch {
  order?: string;
}

export const Route = createFileRoute("/_site/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch =>
    typeof search.order === "string" && search.order ? { order: search.order } : {},
  head: () =>
    seo({
      title: siteConfig.nameAr,
      description:
        "تصميم وطباعة الكروت والاستيكرات والهدايا الدعائية واللوحات والاستاندات وكروت المناسبات والدروع والأختام.",
      path: "/",
    }),
  component: HomePage,
});

function Hero() {
  const { t, dir } = useLang();
  const { openOrder } = useWhatsAppOrder();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  /* Big curve on the corner that faces the copy (toward center) */
  const imageCurve =
    dir === "rtl"
      ? "rounded-tr-[3.5rem] sm:rounded-tr-[5.5rem] lg:rounded-tr-[7.5rem] lg:rounded-br-3xl"
      : "rounded-tl-[3.5rem] sm:rounded-tl-[5.5rem] lg:rounded-tl-[7.5rem] lg:rounded-bl-3xl";

  return (
    <section className="relative isolate flex h-[100svh] max-h-[100svh] flex-col overflow-hidden bg-white">
      <div aria-hidden className="h-[3.9rem] shrink-0 sm:h-[5.25rem] lg:h-[6.5rem]" />

      <div className="mx-auto grid min-h-0 w-[calc(100%-0.75rem)] max-w-[76rem] flex-1 grid-rows-[minmax(0,1.4fr)_auto] sm:w-[calc(100%-2rem)] sm:grid-rows-[minmax(0,1.15fr)_auto] lg:grid-cols-2 lg:grid-rows-none lg:items-stretch">
        {/* Copy — right in RTL; compact on phone so whole hero fits one screen */}
        <div className="order-2 flex shrink-0 items-center px-3.5 py-2 sm:px-8 sm:py-6 lg:order-1 lg:px-10 lg:py-8 xl:px-14">
          <div className="animate-fade-up w-full max-w-lg text-start lg:max-w-xl">
            <p className="kicker mb-2 max-w-full !border-gold/35 !bg-gold-soft/80 !px-2.5 !py-1 !text-[0.68rem] !text-gold-strong sm:mb-5 sm:!px-3.5 sm:!py-1.5 sm:!text-[0.78rem]">
              <span className="line-clamp-1">{t("hero.label")}</span>
            </p>
            <h1 className="font-display text-[1.35rem] font-extrabold leading-[1.3] text-navy sm:text-3xl lg:text-[clamp(1.9rem,3.8vh,2.65rem)]">
              {t("hero.title")}
            </h1>
            <p className="mt-1.5 line-clamp-3 text-[0.82rem] leading-6 text-navy/70 sm:mt-4 sm:line-clamp-none sm:text-[0.98rem] sm:leading-8 sm:text-base">
              {t("hero.desc")}
            </p>
            <div className="mt-3.5 flex w-full flex-row gap-2 sm:mt-7 sm:w-auto sm:gap-3">
              <Link
                to="/services"
                className="btn btn-gold group !min-h-10 flex-1 !px-3 !py-2 text-xs sm:w-auto sm:flex-none sm:!min-h-11 sm:!px-5 sm:text-sm"
              >
                {t("hero.cta1")}
                <Arrow className="size-3.5 sm:size-4 transition-transform group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={() => openOrder()}
                className="btn btn-outline !min-h-10 flex-1 !bg-white !px-3 !py-2 text-xs sm:w-auto sm:flex-none sm:!min-h-11 sm:!px-5 sm:text-sm"
              >
                {t("hero.cta2")}
              </button>
            </div>
          </div>
        </div>

        {/* Image — tighter top gap on phone; breathing room on larger screens */}
        <div className="order-1 flex min-h-[48svh] pt-1.5 pb-3 sm:min-h-0 sm:py-6 lg:order-2 lg:min-h-0 lg:py-8">
          <div className={`relative min-h-0 w-full flex-1 overflow-hidden ${imageCurve}`}>
            <SmartImage
              src={img("hero")}
              alt=""
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 size-full object-cover object-[50%_42%] sm:object-[50%_45%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const { t, dir } = useLang();
  const { services } = useAppData();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  useDocumentTitle();

  return (
    <>
      <Hero />

      <section className="relative bg-background py-7 sm:bg-[#E0652E] sm:py-14">
        <div className="container-x relative">
          <div className="hidden sm:block">
            <SectionHeading
              tone="light"
              kicker={t("home.browseKicker")}
              title={t("home.browseTitle")}
              description={t("home.browseDesc")}
              action={
                <Link to="/services" className="btn btn-outline-light bg-white/10">
                  {t("nav.allServices")}
                  <Arrow className="size-4" />
                </Link>
              }
            />
          </div>
          <div className="sm:mt-8">
            <CategoryCircles services={visibleServices(services)} />
          </div>
        </div>
      </section>

      <AboutIntro />
      <WhyUs />
      <ProcessSteps />
      <CtaBand />
      <ContactStrip />
    </>
  );
}
