import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/i18n";
import { serviceIcons, type Service } from "@/data/services";
import { cn } from "@/lib/utils";
import { SmartImage } from "./SmartImage";
import { Reveal } from "./Reveal";

/**
 * Service row: Arabic RTL puts copy on the right and the orange product
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
  const Icon = serviceIcons[service.iconKey] ?? serviceIcons.sparkles;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const examples = (service.examples[lang].length ? service.examples[lang] : service.examples.ar).slice(
    0,
    9,
  );

  return (
    <Reveal delay={(index % 3) * 60} className={cn(className)}>
      <article className="group flex flex-col items-center gap-6 rounded-[1.75rem] border border-black/5 bg-white p-5 pb-6 shadow-soft transition duration-300 hover:border-gold/40 hover:shadow-lift sm:p-6 sm:pb-7 lg:flex-row lg:items-stretch lg:gap-8 lg:p-8">
        {/* Copy — right in RTL */}
        <div className="flex min-w-0 w-full flex-1 flex-col">
          <div className="flex items-start gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-strong">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-xl font-extrabold leading-snug text-navy sm:text-2xl">
                <Link
                  to="/services/$slug"
                  params={{ slug: service.slug }}
                  className="transition hover:text-gold-strong"
                >
                  {bi(service.title)}
                </Link>
              </h3>
              <p className="mt-2 text-[0.98rem] leading-7 text-muted-foreground">{bi(service.short)}</p>
            </div>
          </div>

          {examples.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-bold text-navy">{t("svc.examplesTitle")}</p>
              <ul className="mt-3 grid grid-cols-1 gap-x-5 gap-y-2.5 xs:grid-cols-2 sm:grid-cols-3">
                {examples.map((ex) => (
                  <li key={ex} className="flex items-start gap-2 text-sm leading-6 text-navy/80">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#E0652E]" aria-hidden />
                    <span>{ex.replace(/\.$/, "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-2.5 pt-7 xs:flex-row">
            <Link to="/quote" search={{ service: service.slug }} className="btn btn-gold btn-sm">
              {t("common.requestQuote")}
            </Link>
            <Link
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="btn btn-outline btn-sm bg-white"
              aria-label={`${t("services.details")}: ${bi(service.title)}`}
            >
              {t("services.details")}
              <Arrow className="size-4" />
            </Link>
          </div>
        </div>

        {/* Product panel — same height as details (top → buttons), like stickers card */}
        <Link
          to="/services/$slug"
          params={{ slug: service.slug }}
          tabIndex={-1}
          aria-hidden
          className="relative block aspect-square w-full max-w-[17rem] shrink-0 overflow-hidden rounded-[1.5rem] bg-[#E0652E] shadow-[0_12px_28px_-12px_rgb(224_101_46/0.45)] transition duration-300 group-hover:-translate-y-0.5 sm:max-w-[18.5rem] lg:aspect-auto lg:h-auto lg:min-h-full lg:w-[min(40%,20rem)] lg:max-w-[20rem] lg:self-stretch"
        >
          <SmartImage
            src={service.image}
            alt=""
            className="absolute inset-0 size-full object-contain object-center transition duration-700 group-hover:scale-[1.02]"
          />
        </Link>
      </article>
    </Reveal>
  );
}
