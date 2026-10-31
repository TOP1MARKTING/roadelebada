import { useState, type ReactNode } from "react";
import { Wrench, X } from "lucide-react";
import { useLang } from "@/i18n";
import { useAppData } from "@/store/app-data";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { WhatsAppOrderProvider } from "./WhatsAppOrder";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const { website } = useAppData();
  const [dismissed, setDismissed] = useState(false);

  return (
    <WhatsAppOrderProvider>
      <div className="flex min-h-screen flex-col overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[60] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-navy"
        >
          {t("common.skipToContent")}
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        {website.maintenanceMode && !dismissed && (
          <div
            role="status"
            className="fixed inset-x-3 bottom-24 z-40 mx-auto flex max-w-xl items-start gap-3 rounded-2xl border border-gold/40 bg-navy px-4 py-3 text-sm text-white shadow-lift sm:bottom-6"
          >
            <Wrench className="mt-0.5 size-4 shrink-0 text-gold" />
            <p className="flex-1 leading-6">{t("site.maintenanceBanner")}</p>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label={t("common.close")}
              className="rounded p-1 text-white/60 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>
    </WhatsAppOrderProvider>
  );
}
