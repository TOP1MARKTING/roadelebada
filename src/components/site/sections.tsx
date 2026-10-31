import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronsLeft,
  ChevronsRight,
  Gem,
  HeartHandshake,
  Layers,
  Lightbulb,
  MapPin,
  MousePointerClick,
  PenTool,
  Phone,
  Ruler,
  ScanEye,
  Sparkles,
  Target,
} from "lucide-react";
import { useLang } from "@/i18n";
import { img } from "@/lib/assets";
import { formatPhoneDisplay } from "@/config/site";
import { useAppData, useCompany, visibleServices } from "@/store/app-data";
import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SmartImage } from "./SmartImage";
import { WhatsAppIcon } from "./SocialIcon";
import { useWhatsAppOrder } from "./WhatsAppOrder";

/* ------------------------------------------------------------ About intro */

export function AboutIntro({ withLink = true }: { withLink?: boolean }) {
  const { t, dir } = useLang();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const approach = [t("about.approach1"), t("about.approach2"), t("about.approach3"), t("about.approach4")];

  return (
    <section className="py-20 sm:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-last lg:order-first">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift sm:aspect-[5/5] lg:me-16">
            <SmartImage
              src={img("about-designer")}
              alt={t("about.img1Alt")}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="animate-float absolute -bottom-10 end-0 hidden w-[48%] overflow-hidden rounded-3xl border-[6px] border-background shadow-lift sm:block">
            <SmartImage
              src={img("printing-press")}
              alt={t("about.img2Alt")}
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
          <div className="glow-orange absolute -top-10 start-0 -z-10 hidden size-56 opacity-50 sm:block" aria-hidden />
        </Reveal>

        <div>
          <SectionHeading kicker={t("home.aboutKicker")} title={t("home.aboutTitle")} description={t("home.aboutDesc")} />
          <Reveal delay={100} className="mt-8 rounded-2xl border bg-white p-5 shadow-soft">
            <h3 className="text-lg font-bold text-navy">{t("home.approachTitle")}</h3>
            <p className="mt-2 leading-8 text-muted-foreground">{t("home.approachDesc")}</p>
          </Reveal>
          <Reveal delay={160}>
            <ul className="mt-7 grid grid-cols-2 gap-x-3 gap-y-4">
              {approach.map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm leading-6 text-foreground sm:gap-3 sm:text-[0.95rem] sm:leading-7">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-strong">
                    <Check className="size-3.5" />
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          {withLink && (
            <Reveal delay={220} className="mt-9">
              <Link to="/about" className="btn btn-navy">
                {t("about.more")}
                <Arrow className="size-4" />
              </Link>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Value cards */

export function ValueCards() {
  const { t } = useLang();
  const values = [
    { icon: PenTool, title: t("home.aboutV1"), desc: t("home.aboutV1d") },
    { icon: Gem, title: t("home.aboutV2"), desc: t("home.aboutV2d") },
    { icon: HeartHandshake, title: t("home.aboutV3"), desc: t("home.aboutV3d") },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {values.map((v, i) => (
        <Reveal key={v.title} delay={i * 100}>
          <div className="group h-full rounded-3xl border bg-card p-8 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lift">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-navy text-gold transition group-hover:bg-gold group-hover:text-white">
              <v.icon className="size-6" />
            </span>
            <h3 className="mt-6 text-xl font-bold text-navy">{v.title}</h3>
            <p className="mt-3 leading-7 text-muted-foreground">{v.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ------------------------------------------------------- Process steps */

export function ProcessSteps({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { t } = useLang();
  const steps = [
    { icon: Target, title: t("process.s1"), desc: t("process.s1d") },
    { icon: Lightbulb, title: t("process.s2"), desc: t("process.s2d") },
    { icon: Ruler, title: t("process.s3"), desc: t("process.s3d") },
    { icon: Layers, title: t("process.s4"), desc: t("process.s4d") },
  ];
  const dark = tone === "dark";
  return (
    <section className={cn("py-20 sm:py-28", dark ? "bg-navy text-white" : "bg-white")}>
      <div className="container-x">
        <SectionHeading
          kicker={t("process.kicker")}
          title={t("process.title")}
          description={t("process.desc")}
          tone={dark ? "light" : "dark"}
        />
        <ol className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <span
            className="absolute inset-x-[12%] top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent lg:block"
            aria-hidden
          />
          {steps.map((s, i) => (
            <li
              key={s.title}
              className={cn(
                "group relative rounded-3xl border transition duration-300 hover:-translate-y-1",
                dark
                  ? "border-white/10 bg-white/[0.03] hover:border-gold/40"
                  : "bg-card shadow-soft hover:shadow-lift",
              )}
            >
              <Reveal delay={i * 90} className="h-full p-7">
                <div className="flex items-center justify-between">
                  <span className="relative flex size-12 items-center justify-center rounded-2xl bg-gold text-white shadow-[0_10px_24px_-10px_rgb(224_101_46/0.8)]">
                    <s.icon className="size-5" />
                  </span>
                  <span
                    className={cn(
                      "font-display text-5xl font-extrabold",
                      dark ? "text-white/10" : "text-navy/[0.07]",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className={cn("mt-6 text-lg font-bold", dark ? "text-white" : "text-navy")}>{s.title}</h3>
                <p className={cn("mt-2 text-[0.95rem] leading-7", dark ? "text-white/65" : "text-muted-foreground")}>
                  {s.desc}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Why us */

export function WhyUs() {
  const { t } = useLang();
  const items = [
    { icon: ScanEye, title: t("home.why1"), desc: t("home.why1d") },
    { icon: Sparkles, title: t("home.why2"), desc: t("home.why2d") },
    { icon: Gem, title: t("home.why3"), desc: t("home.why3d") },
    { icon: MousePointerClick, title: t("home.why4"), desc: t("home.why4d") },
  ];
  return (
    <section className="relative isolate overflow-hidden bg-dark py-20 text-white sm:py-28">
      <div className="texture-grid absolute inset-0 -z-10 opacity-70" aria-hidden />
      <div
        className="absolute -top-40 start-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl rtl:translate-x-1/2"
        aria-hidden
      />
      <div className="container-x">
        <SectionHeading
          align="center"
          tone="light"
          kicker={t("why.kicker")}
          title={t("home.whyTitle")}
          description={t("home.whyDesc")}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 90} className="h-full">
              <div className="glass group relative h-full overflow-hidden rounded-3xl p-7 transition duration-300 hover:-translate-y-1 hover:border-gold/40">
                <div
                  className="glow-orange absolute -end-16 -top-16 size-40 opacity-0 transition-opacity duration-500 group-hover:opacity-60"
                  aria-hidden
                />
                <span className="relative flex size-12 items-center justify-center rounded-2xl bg-gold/15 text-gold transition group-hover:bg-gold group-hover:text-white">
                  <it.icon className="size-5" />
                </span>
                <h3 className="mt-6 text-lg font-bold">{it.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-7 text-white/65">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ CTA band */

export function CtaBand({
  title,
  description,
  cta,
  service,
}: {
  title?: string;
  description?: string;
  cta?: string;
  service?: string;
}) {
  const { t, dir } = useLang();
  const company = useCompany();
  const { openOrder } = useWhatsAppOrder();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  return (
    <section className="py-16 sm:py-20">
      <div className="container-x">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-navy px-6 py-12 text-white sm:px-14 sm:py-16">
          <SmartImage
            src={img("studio-press")}
            alt=""
            aria-hidden
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-l from-navy via-navy/90 to-navy/60 ltr:bg-gradient-to-r"
            aria-hidden
          />
          <div className="glow-orange absolute -bottom-40 end-[-10%] -z-10 size-[32rem] opacity-70" aria-hidden />
          <div className="texture-grid absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_left,black,transparent)]" aria-hidden />
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold sm:text-4xl">{title ?? t("home.ctaTitle")}</h2>
              <p className="mt-4 leading-8 text-white/75">{description ?? t("home.ctaDesc")}</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button type="button" onClick={() => openOrder(service)} className="btn btn-gold">
                {cta ?? t("common.requestQuote")}
                <Arrow className="size-4" />
              </button>
              <a href={company.wa(t("common.waGreeting"))} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                <WhatsAppIcon className="size-4" />
                {t("common.whatsapp")}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- Category circles */

/** Circular product tiles — a modern “browse by category” strip. */
export function CategoryCircles({
  services: servicesProp,
  className,
  /** light = white labels (orange section); dark = navy on phone / white on sm+ */
  labelTone = "dark",
}: {
  services?: Service[];
  className?: string;
  labelTone?: "dark" | "light";
}) {
  const { bi, t, dir } = useLang();
  const { services: storeServices } = useAppData();
  const list = servicesProp ?? visibleServices(storeServices);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canSwipe, setCanSwipe] = useState(false);
  const isRtl = dir === "rtl";
  const HintChevron = isRtl ? ChevronsLeft : ChevronsRight;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !list.length) return;

    const phoneMq = window.matchMedia("(max-width: 639px)");
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measure = () => {
      setCanSwipe(phoneMq.matches && el.scrollWidth > el.clientWidth + 8);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    phoneMq.addEventListener("change", measure);

    let raf = 0;
    let cancelled = false;
    let paused = false;
    let resumeTimer = 0;
    let direction = 1;
    let holdUntil = 0;
    let lastTs = 0;
    /** Continuous glide — ~22 px/sec feels calm but not sticky */
    const PX_PER_SEC = 22;
    let pos = Math.min(Math.abs(el.scrollLeft), Math.max(0, el.scrollWidth - el.clientWidth));

    const syncPos = () => {
      pos = Math.min(Math.abs(el.scrollLeft), Math.max(0, el.scrollWidth - el.clientWidth));
    };

    const pause = () => {
      paused = true;
      syncPos();
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        syncPos();
        paused = false;
        lastTs = 0;
      }, 4500);
    };

    const frame = (now: number) => {
      if (cancelled) return;

      if (phoneMq.matches && !reducedMq.matches && !paused && now >= holdUntil) {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 8) {
          const dt = lastTs ? Math.min((now - lastTs) / 1000, 0.05) : 1 / 60;
          lastTs = now;
          pos += direction * PX_PER_SEC * dt;

          if (pos >= max) {
            pos = max;
            direction = -1;
            holdUntil = now + 1400;
            lastTs = 0;
          } else if (pos <= 0) {
            pos = 0;
            direction = 1;
            holdUntil = now + 1400;
            lastTs = 0;
          }

          el.scrollLeft = isRtl ? -pos : pos;
        }
      } else {
        lastTs = 0;
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    el.addEventListener("pointerdown", pause, { passive: true });
    el.addEventListener("wheel", pause, { passive: true });
    el.addEventListener("touchstart", pause, { passive: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resumeTimer);
      ro.disconnect();
      phoneMq.removeEventListener("change", measure);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("wheel", pause);
      el.removeEventListener("touchstart", pause);
    };
  }, [isRtl, list.length]);

  if (!list.length) return null;

  return (
    <div
      className={cn(
        "relative w-full",
        /* Full-bleed swipe strip on phone */
        "max-sm:-mx-5 max-sm:w-[calc(100%+2.5rem)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        data-category-scroller
        className={cn(
          "flex flex-nowrap items-center",
          /* phone: spaced circles, swipe — no overlap */
          "gap-4 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          /* no mandatory snap — it fights the slow auto-crawl */
          "py-1 ps-4 pe-6",
          /* PC: equal circles overlapping the previous one */
          "sm:gap-0 sm:overflow-visible sm:scroll-auto sm:justify-center sm:py-0 sm:ps-0 sm:pe-0",
        )}
      >
        {list.map((s, i) => (
          <li
            key={s.slug}
            /* rightmost (first in RTL) sits on top of the next — desktop only */
            style={{ zIndex: list.length - i }}
            className={cn(
              "relative w-[10.75rem] shrink-0 transition-[z-index] hover:z-40 sm:w-auto sm:min-w-0 sm:flex-1 sm:basis-0",
              /* overlap on desktop only */
              i > 0 && "sm:-ms-6 lg:-ms-7",
            )}
          >
            <Reveal delay={Math.min(i * 40, 240)}>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                aria-label={bi(s.title)}
                className="group mx-auto flex w-[10.75rem] flex-col items-center sm:w-full"
              >
                <span className="relative block aspect-square w-full overflow-hidden rounded-2xl bg-navy ring-[3px] ring-white shadow-[0_10px_24px_-10px_rgb(0_0_0/0.35)] transition duration-300 active:scale-[0.98] group-hover:-translate-y-1 group-hover:shadow-[0_16px_32px_-12px_rgb(0_0_0/0.45)]">
                  <SmartImage
                    src={s.image}
                    alt=""
                    className="size-full object-cover object-center transition duration-500 group-hover:scale-[1.04]"
                  />
                </span>
                <span
                  className={cn(
                    "mt-2 line-clamp-2 text-center text-[0.82rem] font-extrabold leading-[1.25] sm:text-[0.75rem] lg:text-[0.82rem] xl:text-[0.9rem]",
                    labelTone === "light" ? "text-white" : "text-navy sm:text-white",
                  )}
                >
                  {bi(s.title)}
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
        <li className="w-2 shrink-0 sm:hidden" aria-hidden />
      </ul>

      {canSwipe ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 z-[5] flex w-14 items-center justify-center sm:hidden",
            "end-0",
            labelTone === "light"
              ? "bg-gradient-to-l from-navy via-navy/80 to-transparent"
              : "bg-gradient-to-l from-background via-background/90 to-transparent",
          )}
          aria-hidden
        >
          <span className="animate-category-nudge mb-8 flex size-9 items-center justify-center rounded-full bg-navy text-white shadow-lg ring-2 ring-white/80">
            <HintChevron className="size-5" strokeWidth={2.5} />
          </span>
        </div>
      ) : null}

      {canSwipe ? (
        <p
          className={cn(
            "mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-semibold sm:hidden",
            labelTone === "light" ? "text-white/85" : "text-navy/55",
          )}
        >
          <HintChevron className="size-3.5 shrink-0 opacity-80" aria-hidden />
          {t("home.browseSwipe")}
        </p>
      ) : null}
    </div>
  );
}
/* -------------------------------------------------------- How to order */

/** Three plain steps + direct contact — the shortest path for a customer. */
export function HowToOrder({ service }: { service?: string }) {
  const { t, dir } = useLang();
  const company = useCompany();
  const { openOrder } = useWhatsAppOrder();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const steps = [t("order.s1"), t("order.s2"), t("order.s3")];

  return (
    <section className="pb-16 sm:pb-20">
      <div className="container-x">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-navy px-6 py-10 text-white sm:px-12 sm:py-12">
          <div className="glow-orange absolute -bottom-40 end-[-10%] -z-10 size-[30rem] opacity-60" aria-hidden />
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">{t("order.title")}</h2>
              <ol className="mt-7 grid gap-4 sm:grid-cols-3">
                {steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold font-display text-lg font-extrabold text-white">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-white/90">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button type="button" onClick={() => openOrder(service)} className="btn btn-gold">
                {t("common.requestQuote")}
                <Arrow className="size-4" />
              </button>
              <a
                href={company.wa(t("common.waGreeting"))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light"
              >
                <WhatsAppIcon className="size-4" />
                {t("common.whatsapp")}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Contact strip */

export function ContactStrip() {
  const { t, bi } = useLang();
  const company = useCompany();
  const items = [
    {
      icon: Phone,
      label: t("contact.phone"),
      value: <span dir="ltr">{formatPhoneDisplay(company.phone)}</span>,
      href: company.tel,
    },
    {
      icon: WhatsAppIcon,
      label: t("common.whatsapp"),
      value: t("contact.whatsappBtn"),
      href: company.wa(t("common.waGreeting")),
      external: true,
    },
    {
      icon: MapPin,
      label: t("contact.location"),
      value: bi(company.address),
      href: company.mapsUrl,
      external: true,
    },
  ];
  return (
    <section className="pb-20 sm:pb-20">
      <div className="container-x grid gap-3 sm:gap-4 md:grid-cols-3">
        {items.map((it) => (
          <a
            key={it.label}
            href={it.href}
            {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex min-w-0 items-start gap-3 rounded-2xl border bg-white p-4 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lift sm:items-center sm:gap-4 sm:rounded-3xl sm:p-5"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gold-soft text-gold-strong transition group-hover:bg-gold group-hover:text-white sm:size-12">
              <it.icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-muted-foreground">{it.label}</span>
              <span className="mt-1 block break-words text-[0.95rem] font-semibold leading-6 text-navy group-hover:text-gold-strong sm:text-base sm:leading-7">
                {it.value}
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
