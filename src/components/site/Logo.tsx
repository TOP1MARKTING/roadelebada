import { useLang } from "@/i18n";
import { useAppData } from "@/store/app-data";
import { img, resolveImage } from "@/lib/assets";
import { cn } from "@/lib/utils";

/** Official circular company logo. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={img("logo")}
      alt=""
      aria-hidden
      width={48}
      height={48}
      className={cn("size-14 shrink-0 rounded-full bg-white object-contain shadow-sm", className)}
    />
  );
}

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  compact?: boolean;
  markClassName?: string;
}

export function Logo({ variant = "light", className, compact, markClassName }: LogoProps) {
  const { lang } = useLang();
  const { website, company } = useAppData();
  const customLogo = resolveImage(website.headerLogo || company.logoUrl);
  const name = lang === "ar" ? company.nameAr : company.nameEn;
  const [first, ...rest] =
    lang === "ar"
      ? ["رواد الإبداع", "للدعاية والإعلان"]
      : ["Creative Pioneers", "Advertising Agency"];
  const useDefaultName =
    name ===
    (lang === "ar"
      ? "وكالة رواد الإبداع للدعاية والإعلان"
      : "Creative Pioneers Advertising Agency");

  return (
    <span className={cn("flex items-center gap-3", className)}>
      {customLogo ? (
        <img src={customLogo} alt={name} className="h-11 w-auto max-w-[9rem] object-contain" />
      ) : (
        <LogoMark className={cn("transition-all duration-300", markClassName)} />
      )}
      {!compact && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span
            className={cn(
              "truncate font-display text-[1.05rem] font-extrabold",
              variant === "light" ? "text-white" : "text-navy",
            )}
          >
            {useDefaultName ? first : name}
          </span>
          {useDefaultName && (
            <span className="truncate text-[0.72rem] font-medium tracking-wide text-gold">
              {rest.join(" ")}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
