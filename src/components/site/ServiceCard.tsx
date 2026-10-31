import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/i18n";
import { serviceIcons, type Service } from "@/data/services";
import { cn } from "@/lib/utils";
import { SmartImage } from "./SmartImage";
import { Reveal } from "./Reveal";
import { useWhatsAppOrder } from "./WhatsAppOrder";

/**
 * Service row: Arabic RTL puts copy on the right and the product
 * panel on the left — matching the brand mockup cards.
 */
export function ServiceCard({
  service,
  index = 0,
  className,
}: {
  service: Service;
  index?: number;
  className?: string;
}) {
  const { t, bi, lang, dir } = useLang();
  const { openOrder } = useWhatsAppOrder();
  const Icon = serviceIcons[service.iconKey] ?? serviceIcons.sparkles;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const examples = (service.examples[lang].length ? service.examples[lang] : service.examples.ar).slice(
    0,
    9,
  );

  return (
    <Reveal delay={(index % 3) * 60} className={cn(className)}>
      <article className="group flex flex-col gap-5 rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-soft transition duration-300 hover:border-gold/40 hover:shadow-lift sm:gap-6 sm:rounded-[1.75rem] sm:p-6 sm:pb-7 lg:flex-row lg:items-stretch lg:gap-8 lg:p-8">
        {/* Image first on phone for a visual lead */}
        <Link
          to="/services/$slug"
          params={{ slug: service.slug }}
          tabIndex={-1}
          aria-hidden
          className="relative order-1 block aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[1.25rem] bg-navy shadow-[0_12px_28px_-12px_rgb(0_0_0/0.35)] transition duration-300 group-hover:-translate-y-0.5 sm:aspect-square sm:mx-auto sm:max-w-[18.5rem] sm:rounded-[1.5rem] lg:order-2 lg:mx-0 lg:aspect-auto lg:h-auto lg:min-h-full lg:w-[min(40%,20rem)] lg:max-w-[20rem] lg:self-stretch"
        >
          <SmartImage
            src={service.image}
            alt=""
            className="absolute inset-0 size-full object-cover object-center transition duration-700 group-hover:scale-[1.04]"
          />
        </Link>

        {/* Copy — right in RTL on desktop */}
        <div className="order-2 flex min-w-0 w-full flex-1 flex-col lg:order-1">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-strong sm:size-12">
              <Icon className="size-4 sm:size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-extrabold leading-snug text-navy sm:text-2xl">
                <Link
                  to="/services/$slug"
                  params={{ slug: service.slug }}
                  className="transition hover:text-gold-strong"
                >
                  {bi(service.title)}
                </Link>
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground sm:mt-2 sm:text-[0.98rem] sm:leading-7">
                {bi(service.short)}
              </p>
            </div>
          </div>

          {examples.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <p className="text-xs font-bold text-navy sm:text-sm">{t("svc.examplesTitle")}</p>
              <ul className="mt-2.5 grid grid-cols-1 gap-x-5 gap-y-2 xs:grid-cols-2 sm:mt-3 sm:grid-cols-3 sm:gap-y-2.5">
                {examples.map((ex) => (
                  <li key={ex} className="flex items-start gap-2 text-[0.8rem] leading-5 text-navy/80 sm:text-sm sm:leading-6">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold sm:mt-2" aria-hidden />
                    <span>{ex.replace(/\.$/, "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-2 pt-5 xs:flex-row sm:gap-2.5 sm:pt-7">
            <button
              type="button"
              onClick={() => openOrder(service.slug)}
              className="btn btn-gold btn-sm w-full !whitespace-normal xs:w-auto"
            >
              {t("common.requestQuote")}
            </button>
            <Link
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="btn btn-outline btn-sm w-full bg-white xs:w-auto"
              aria-label={`${t("services.details")}: ${bi(service.title)}`}
            >
              {t("services.details")}
              <Arrow className="size-4" />
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
