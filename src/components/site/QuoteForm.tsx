import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/i18n";
import { useAppData, useCompany, visibleServices } from "@/store/app-data";
import { cn } from "@/lib/utils";
import { serviceIcons } from "@/data/services";
import { WhatsAppIcon } from "./SocialIcon";

export function QuoteForm({ initialService }: { initialService?: string }) {
  const { t, bi, lang, dir } = useLang();
  const { services } = useAppData();
  const company = useCompany();
  const svc = visibleServices(services);

  const [serviceSlug, setServiceSlug] = useState(initialService ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"service" | "items">(
    initialService && svc.some((s) => s.slug === initialService) ? "items" : "service",
  );

  const Back = dir === "rtl" ? ChevronRight : ChevronLeft;

  useEffect(() => {
    if (!initialService) return;
    if (svc.some((s) => s.slug === initialService)) {
      setServiceSlug(initialService);
      setStep("items");
    }
  }, [initialService, svc]);

  const service = useMemo(
    () => svc.find((s) => s.slug === serviceSlug) ?? null,
    [svc, serviceSlug],
  );

  const examples = useMemo(() => {
    if (!service) return [];
    return (service.examples[lang].length ? service.examples[lang] : service.examples.ar).map(
      (ex) => ex.replace(/\.$/, ""),
    );
  }, [service, lang]);

  const toggle = (item: string) => {
    setSelected((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));
  };

  const pickService = (slug: string) => {
    setServiceSlug(slug);
    setSelected([]);
    setNote("");
    setStep("items");
  };

  const openWhatsApp = () => {
    if (!service || selected.length === 0) return;
    const title = bi(service.title);
    const lines = [
      t("quote.waIntro"),
      "",
      `${t("quote.waService")}: ${title}`,
      `${t("quote.waItems")}:`,
      ...selected.map((item, i) => `${i + 1}. ${item}`),
    ];
    if (note.trim()) {
      lines.push("", `${t("quote.waNote")}:`, note.trim());
    }
    window.open(company.wa(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  if (step === "service") {
    return (
      <div className="rounded-2xl border bg-card p-5 shadow-soft sm:p-8">
        <h2 className="text-xl font-extrabold text-navy sm:text-2xl">{t("quote.pickService")}</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{t("quote.pickServiceHint")}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {svc.map((s) => {
            const Icon = serviceIcons[s.iconKey] ?? serviceIcons.sparkles;
            return (
              <li key={s.slug}>
                <button
                  type="button"
                  onClick={() => pickService(s.slug)}
                  className="group flex w-full items-start gap-3 rounded-2xl border bg-white p-4 text-start transition hover:border-gold/50 hover:shadow-soft"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-strong transition group-hover:bg-gold group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-navy">{bi(s.title)}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {bi(s.short)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft sm:p-8">
      <button
        type="button"
        onClick={() => setStep("service")}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-navy"
      >
        <Back className="size-4" />
        {t("quote.changeService")}
      </button>

      <h2 className="text-xl font-extrabold text-navy sm:text-2xl">
        {t("quote.pickItems")}
        {service ? (
          <span className="mt-1 block text-base font-bold text-gold-strong">{bi(service.title)}</span>
        ) : null}
      </h2>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{t("quote.pickItemsHint")}</p>

      <ul className="mt-6 grid gap-2.5 xs:grid-cols-2">
        {examples.map((item) => {
          const on = selected.includes(item);
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => toggle(item)}
                aria-pressed={on}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-3 text-start text-sm font-semibold transition",
                  on
                    ? "border-gold bg-gold-soft/60 text-navy"
                    : "border-border bg-white text-navy/80 hover:border-gold/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border",
                    on ? "border-gold bg-gold text-white" : "border-border bg-white",
                  )}
                >
                  {on ? <Check className="size-3.5" strokeWidth={3} /> : null}
                </span>
                {item}
              </button>
            </li>
          );
        })}
      </ul>

      <label className="mt-6 block">
        <span className="field-label">{t("quote.waNoteLabel")}</span>
        <textarea
          className="field mt-2 !min-h-24"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("quote.waNotePlaceholder")}
        />
      </label>

      <button
        type="button"
        disabled={selected.length === 0}
        onClick={openWhatsApp}
        className="btn btn-gold mt-6 w-full sm:w-auto"
      >
        <WhatsAppIcon className="size-5" />
        {t("quote.sendWhatsApp")}
      </button>
      {selected.length === 0 && (
        <p className="mt-3 text-xs text-muted-foreground">{t("quote.selectAtLeastOne")}</p>
      )}
    </div>
  );
}
