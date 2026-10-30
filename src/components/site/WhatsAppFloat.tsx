import { useEffect, useState } from "react";
import { useLang } from "@/i18n";
import { useCompany } from "@/store/app-data";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./SocialIcon";

export function WhatsAppFloat() {
  const { t } = useLang();
  const company = useCompany();
  const [showOnPhone, setShowOnPhone] = useState(false);

  useEffect(() => {
    const update = () => {
      const phone = window.matchMedia("(max-width: 639px)").matches;
      // Past the first screen so the float never covers the hero CTAs.
      setShowOnPhone(!phone || window.scrollY > window.innerHeight * 0.55);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a
      href={company.wa(t("common.waGreeting"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("contact.whatsappBtn")}
      title={t("contact.whatsappBtn")}
      aria-hidden={!showOnPhone || undefined}
      tabIndex={showOnPhone ? undefined : -1}
      className={cn(
        "group fixed z-40 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-6px_rgb(37_211_102/0.65),0_4px_12px_-4px_rgb(0_0_0/0.25)] ring-4 ring-white/90 transition duration-300 hover:scale-110 hover:bg-[#1ebe57] hover:shadow-[0_14px_34px_-6px_rgb(37_211_102/0.75)] focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-gold",
        // Phone + desktop: bottom-right
        "bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] left-auto size-12",
        "sm:bottom-6 sm:right-6 sm:size-16",
        showOnPhone
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0 sm:pointer-events-auto sm:translate-y-0 sm:opacity-100",
      )}
    >
      <span
        className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/35 opacity-40 [animation-duration:2.4s]"
        aria-hidden
      />
      <WhatsAppIcon className="relative size-7 sm:size-9" />
    </a>
  );
}
