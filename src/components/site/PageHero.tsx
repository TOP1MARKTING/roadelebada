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
    <section className="relative isolate overflow-hidden bg-dark pb-16 pt-[7.5rem] text-white sm:pb-24 sm:pt-[9.5rem] lg:pt-[10.5rem]">
      <SmartImage
        src={image}
        alt={imageAlt}
        loading="eager"
        className="animate-slow-zoom absolute inset-0 -z-20 h-full w-full object-cover object-[center_20%] opacity-70"
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
          className="animate-fade-in glass mb-7 inline-flex rounded-full px-4 py-1.5 text-sm text-white/60"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="transition hover:text-gold">
                {t("nav.home")}
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <Sep className="size-3.5 opacity-60" aria-hidden />
                {c.to ? (
                  <Link to={c.to} className="transition hover:text-gold">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white/90">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {kicker && (
          <div>
            <p className="kicker animate-fade-up !text-gold">{kicker}</p>
          </div>
        )}
        <h1 className="animate-fade-up mt-5 max-w-3xl text-4xl font-extrabold sm:text-5xl lg:text-[3.4rem]">
          {title}
        </h1>
        {description && (
          <p className="animate-fade-up mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg [animation-delay:80ms]">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
