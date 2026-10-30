import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useLang } from "@/i18n";
import { img } from "@/lib/assets";
import { seo } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/_site/privacy")({
  head: () =>
    seo({
      title: "سياسة الخصوصية",
      description:
        "سياسة الخصوصية لموقع وكالة رواد الإبداع للدعاية والإعلان وكيفية التعامل مع البيانات.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

const sections = [1, 2, 3, 4, 5, 6] as const;

function PrivacyPage() {
  const { t } = useLang();
  useDocumentTitle(t("page.privacyTitle"));

  return (
    <>
      <PageHero
        title={t("page.privacyTitle")}
        description={t("page.privacyDesc")}
        image={img("business-cards")}
        imageAlt={t("quote.heroAlt")}
        crumbs={[{ label: t("page.privacyTitle") }]}
      />
      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <nav
              className="sticky top-24 rounded-2xl border bg-card p-5 shadow-soft"
              aria-label={t("privacy.toc")}
            >
              <p className="text-sm font-bold text-navy">{t("privacy.toc")}</p>
              <ol className="mt-3 space-y-2 text-sm">
                {sections.map((n) => (
                  <li key={n}>
                    <a
                      href={`#s${n}`}
                      className="text-muted-foreground transition hover:text-gold-strong"
                    >
                      {n}. {t(`privacy.s${n}t`)}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <article className="lg:col-span-9">
            <Reveal className="flex items-start gap-4 rounded-2xl bg-navy p-6 text-white sm:p-8">
              <ShieldCheck className="size-8 shrink-0 text-gold" />
              <div>
                <p className="leading-8 text-white/85">{t("privacy.intro")}</p>
                <p className="mt-2 text-xs text-white/50">{t("privacy.updated")}</p>
              </div>
            </Reveal>
            <div className="mt-10 space-y-10">
              {sections.map((n) => (
                <Reveal key={n} as="section">
                  <h2
                    id={`s${n}`}
                    className="scroll-mt-28 text-xl font-extrabold text-navy sm:text-2xl"
                  >
                    <span className="me-2 text-gold-strong">{String(n).padStart(2, "0")}</span>
                    {t(`privacy.s${n}t`)}
                  </h2>
                  <p className="mt-4 leading-8 text-foreground/80">{t(`privacy.s${n}`)}</p>
                </Reveal>
              ))}
            </div>
            <p className="mt-12 border-t pt-6 text-sm text-muted-foreground">
              {t("privacy.contactLine")}{" "}
              <Link to="/contact" className="font-semibold text-gold-strong hover:underline">
                {t("page.contactTitle")}
              </Link>
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
