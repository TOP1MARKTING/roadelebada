import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/i18n";
import { useAppData, useCompany, visibleServices } from "@/store/app-data";
import { cn } from "@/lib/utils";
import { serviceIcons } from "@/data/services";
import { isValidSaudiMobile, normalizePhone } from "@/lib/validation";
import { Field, errorProps } from "./Field";
import { WhatsAppIcon } from "./SocialIcon";

export function QuoteForm({
  initialService,
  onSent,
}: {
  initialService?: string;
  onSent?: () => void;
}) {
  const { t, bi, lang, dir } = useLang();
  const { services } = useAppData();
  const company = useCompany();
  const svc = visibleServices(services);

  const [serviceSlug, setServiceSlug] = useState(initialService ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"name" | "phone" | "address", string>>>({});
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
    setErrors({});
    setStep("items");
  };

  const openWhatsApp = () => {
    if (!service || selected.length === 0) return;

    const er: Partial<Record<"name" | "phone" | "address", string>> = {};
    if (!name.trim() || name.trim().length < 2) er.name = t("form.nameShort");
    if (!phone.trim()) er.phone = t("common.required");
    else if (!isValidSaudiMobile(phone)) er.phone = t("common.phoneInvalid");
    if (!address.trim() || address.trim().length < 5) er.address = t("quote.addressShort");
    setErrors(er);
    if (Object.keys(er).length) return;

    const title = bi(service.title);
    const lines = [
      t("quote.waIntro"),
      "",
      `${t("quote.waName")}: ${name.trim()}`,
      `${t("quote.waPhone")}: ${normalizePhone(phone)}`,
      `${t("quote.waAddress")}: ${address.trim()}`,
      "",
      `${t("quote.waService")}: ${title}`,
      `${t("quote.waItems")}:`,
      ...selected.map((item, i) => `${i + 1}. ${item}`),
    ];
    if (note.trim()) {
      lines.push("", `${t("quote.waNote")}:`, note.trim());
    }
    window.open(company.wa(lines.join("\n")), "_blank", "noopener,noreferrer");
    onSent?.();
  };

  if (step === "service") {
    return (
      <div>
        <h3 className="text-lg font-extrabold text-navy sm:text-xl">{t("quote.pickService")}</h3>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{t("quote.pickServiceHint")}</p>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {svc.map((s) => {
            const Icon = serviceIcons[s.iconKey] ?? serviceIcons.sparkles;
            return (
              <li key={s.slug}>
                <button
                  type="button"
                  onClick={() => pickService(s.slug)}
                  className="group flex w-full items-start gap-3 rounded-2xl border bg-white p-3.5 text-start transition hover:border-gold/50 hover:shadow-soft sm:p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-strong transition group-hover:bg-gold group-hover:text-white sm:size-11">
                    <Icon className="size-4 sm:size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-navy sm:text-base">
                      {bi(s.title)}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
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
    <div>
      <button
        type="button"
        onClick={() => setStep("service")}
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-navy"
      >
        <Back className="size-4" />
        {t("quote.changeService")}
      </button>

      <h3 className="text-lg font-extrabold text-navy sm:text-xl">
        {t("quote.pickItems")}
        {service ? (
          <span className="mt-1 block text-sm font-bold text-gold-strong sm:text-base">
            {bi(service.title)}
          </span>
        ) : null}
      </h3>
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{t("quote.pickItemsHint")}</p>

      <ul className="mt-5 grid gap-2 xs:grid-cols-2">
        {examples.map((item) => {
          const on = selected.includes(item);
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => toggle(item)}
                aria-pressed={on}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-start text-sm font-semibold transition sm:px-3.5 sm:py-3",
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

      <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
        <Field id="wa-name" label={t("quote.name")} required error={errors.name}>
          <input
            id="wa-name"
            className="field"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
            }}
            autoComplete="name"
            {...errorProps(!!errors.name)}
          />
        </Field>
        <Field id="wa-phone" label={t("quote.phone")} required error={errors.phone}>
          <input
            id="wa-phone"
            className="field"
            inputMode="tel"
            dir="ltr"
            placeholder="05xxxxxxxx"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((er) => ({ ...er, phone: undefined }));
            }}
            autoComplete="tel"
            {...errorProps(!!errors.phone)}
          />
        </Field>
        <Field
          id="wa-address"
          label={t("quote.address")}
          required
          error={errors.address}
          className="sm:col-span-2"
        >
          <input
            id="wa-address"
            className="field"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (errors.address) setErrors((er) => ({ ...er, address: undefined }));
            }}
            autoComplete="street-address"
            {...errorProps(!!errors.address)}
          />
        </Field>
      </div>

      <label className="mt-4 block sm:mt-5">
        <span className="field-label">{t("quote.waNoteLabel")}</span>
        <textarea
          className="field mt-2 !min-h-20"
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
        className="btn btn-gold mt-5 w-full !min-h-11 !whitespace-normal sm:mt-6 sm:w-auto sm:!min-h-12"
      >
        <WhatsAppIcon className="size-5 shrink-0" />
        {t("quote.sendWhatsApp")}
      </button>
      {selected.length === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">{t("quote.selectAtLeastOne")}</p>
      )}
    </div>
  );
}
