import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, MessageSquareText, Phone, Sparkles } from "lucide-react";
import { useLang } from "@/i18n";
import { img } from "@/lib/assets";
import { seo } from "@/lib/seo";
import { formatPhoneDisplay } from "@/config/site";
import { useCompany } from "@/store/app-data";
import { PageHero } from "@/components/site/PageHero";
import { QuoteForm } from "@/components/site/QuoteForm";
import { Reveal } from "@/components/site/Reveal";
import { WhatsAppIcon } from "@/components/site/SocialIcon";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

interface QuoteSearch {
  service?: string;
}

export const Route = createFileRoute("/_site/quote")({
  validateSearch: (search: Record<string, unknown>): QuoteSearch =>
    typeof search.service === "string" && search.service ? { service: search.service } : {},
  head: () =>
    seo({
      title: "طلب عرض سعر",
      description:
        "اطلب عرض سعر لخدمات التصميم والطباعة والاستيكرات والهدايا الدعائية واللوحات من وكالة رواد الإبداع.",
      path: "/quote",
      image: img("business-cards"),
    }),
  component: QuotePage,
});

function QuotePage() {
  const { t } = useLang();
  const { service } = Route.useSearch();
  const company = useCompany();
  useDocumentTitle(t("page.quoteTitle"));

  const steps = [
    { icon: ClipboardList, title: t("quote.step1"), desc: t("quote.step1d") },
    { icon: MessageSquareText, title: t("quote.step2"), desc: t("quote.step2d") },
    { icon: Sparkles, title: t("quote.step3"), desc: t("quote.step3d") },
  ];

  return (
    <>
      <PageHero
        title={t("page.quoteTitle")}
        description={t("page.quoteDesc")}
        image={img("business-cards")}
        imageAlt={t("quote.heroAlt")}
        kicker={t("quote.kicker")}
        crumbs={[{ label: t("page.quoteTitle") }]}
      />
      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <QuoteForm initialService={service} />
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <Reveal>
              <div className="rounded-2xl border bg-card p-6 shadow-soft sm:p-7">
                <h2 className="text-lg font-bold text-navy">{t("quote.nextTitle")}</h2>
                <ol className="mt-6 space-y-6">
                  {steps.map((s, i) => (
                    <li key={s.title} className="relative flex gap-4">
                      {i < steps.length - 1 && (
                        <span
                          className="absolute start-5 top-11 h-[calc(100%-1.25rem)] w-px bg-border"
                          aria-hidden
                        />
                      )}
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-strong">
                        <s.icon className="size-4.5" />
                      </span>
                      <div>
                        <h3 className="font-bold text-navy">{s.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-2xl bg-navy p-6 text-white sm:p-7">
                <h2 className="text-lg font-bold">{t("quote.preferTalk")}</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">{t("quote.preferTalkDesc")}</p>
                <div className="mt-5 grid gap-3">
                  <a
                    href={company.wa(t("common.waGreeting"))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold"
                  >
                    <WhatsAppIcon className="size-4" />
                    {t("contact.whatsappBtn")}
                  </a>
                  <a href={company.tel} className="btn btn-outline-light">
                    <Phone className="size-4" />
                    <span dir="ltr">{formatPhoneDisplay(company.phone)}</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
