import type { ReactNode } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/i18n";
import { SmartImage } from "./SmartImage";

interface Crumb {
  label: string;
  to?: LinkProps["to"];
}

interface PageHeroProps {
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
  kicker?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
}

/** Inner-page hero: photo with navy overlay, breadcrumb and heading. */
export function PageHero({
  title,
  description,
  image,
  imageAlt,
  kicker,
  crumbs = [],
  children,
}: PageHeroProps) {
  const { t, dir } = useLang();
  const Sep = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <section className="relative isolate overflow-hidden bg-dark pb-10 pt-[5.5rem] text-white sm:pb-20 sm:pt-[9rem] lg:pb-24 lg:pt-[10.5rem]">
      <SmartImage
        src={image}
        alt={imageAlt}
        loading="eager"
        className="animate-slow-zoom absolute inset-0 -z-20 h-full w-full object-cover object-[center_28%] sm:object-[center_20%] opacity-70"
      />
      {/* Soft top so the photo reads under the fixed nav; darker only toward the title */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-dark/35 via-dark/55 to-dark/92"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-dark via-dark/40 to-transparent"
        aria-hidden
      />
      <div
        className="texture-grid absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        aria-hidden
      />
      <div className="glow-orange absolute -top-40 end-[-5%] -z-10 size-[34rem] opacity-40" aria-hidden />
      <div className="container-x">
        <nav
          aria-label={t("common.breadcrumb")}
          className="animate-fade-in glass mb-4 inline-flex max-w-full rounded-full px-3 py-1.5 text-[0.72rem] text-white/60 sm:mb-7 sm:px-4 sm:text-sm"
        >
          <ol className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            <li>
              <Link to="/" className="transition hover:text-gold">
                {t("nav.home")}
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex min-w-0 items-center gap-1 sm:gap-1.5">
                <Sep className="size-3 shrink-0 opacity-60 sm:size-3.5" aria-hidden />
                {c.to ? (
                  <Link to={c.to} className="truncate transition hover:text-gold">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="truncate text-white/90">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {kicker && (
          <div>
            <p className="kicker animate-fade-up !px-2.5 !py-1 !text-[0.68rem] !text-gold sm:!px-3.5 sm:!py-1.5 sm:!text-[0.78rem]">
              {kicker}
            </p>
          </div>
        )}
        <h1 className="animate-fade-up mt-3 max-w-3xl text-[1.7rem] font-extrabold leading-[1.25] sm:mt-5 sm:text-5xl lg:text-[3.4rem]">
          {title}
        </h1>
        {description && (
          <p className="animate-fade-up mt-3 max-w-2xl text-sm leading-7 text-white/75 sm:mt-5 sm:text-lg sm:leading-8 [animation-delay:80ms]">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
