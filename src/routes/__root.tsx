import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider, useLang } from "@/i18n";
import { AppDataProvider } from "@/store/app-data";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";
import { siteConfig } from "@/config/site";
import { img } from "@/lib/assets";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  const { t } = useLang();
  useDocumentTitle(t("notFound.title"));
  return (
    <SiteLayout>
      <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-navy pt-24 text-white">
        <div className="texture-grid absolute inset-0 -z-10 opacity-60" aria-hidden />
        <div className="container-x text-center">
          <p className="font-display text-8xl font-extrabold text-gold sm:text-9xl">404</p>
          <h1 className="mt-4 text-3xl font-extrabold">{t("notFound.title")}</h1>
          <p className="mx-auto mt-3 max-w-md leading-7 text-white/70">{t("notFound.desc")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn btn-gold">
              {t("common.backHome")}
            </Link>
            <Link to="/services" className="btn btn-outline-light">
              {t("nav.services")}
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" dir="rtl">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">تعذر تحميل الصفحة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          حدث خطأ غير متوقع. يمكنك المحاولة مرة أخرى أو العودة للرئيسية.
        </p>
        <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
          This page didn't load. Please try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn btn-navy btn-sm"
          >
            حاول مرة أخرى
          </button>
          <a href="/" className="btn btn-outline btn-sm">
            العودة للرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

const defaultDescription =
  "وكالة رواد الإبداع للدعاية والإعلان: تصميم وطباعة الكروت والاستيكرات والهدايا الدعائية واللوحات والاستاندات وكروت المناسبات والدروع والأختام.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: siteConfig.nameAr },
      { name: "description", content: defaultDescription },
      { name: "theme-color", content: "#1C1E22" },
      { property: "og:site_name", content: siteConfig.nameAr },
      { property: "og:title", content: siteConfig.nameAr },
      { property: "og:description", content: defaultDescription },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ar_SA" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:image", content: `${siteConfig.siteUrl}${img("hero")}` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Tajawal:wght@500;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function LanguageBridge({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

function ThemedToaster() {
  const { dir } = useLang();
  return <Toaster position="top-center" dir={dir} richColors closeButton />;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppDataProvider>
        <LanguageBridge>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <ThemedToaster />
        </LanguageBridge>
      </AppDataProvider>
    </QueryClientProvider>
  );
}
