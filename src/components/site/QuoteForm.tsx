import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Info, Loader2, RotateCcw, Send } from "lucide-react";
import { useLang } from "@/i18n";
import { useAppData, visibleServices } from "@/store/app-data";
import { isValidEmail, isValidSaudiMobile, normalizePhone } from "@/lib/validation";
import { Field, errorProps } from "./Field";

interface QuoteValues {
  name: string;
  phone: string;
  business: string;
  email: string;
  service: string;
  details: string;
  deadline: string;
}

const empty: QuoteValues = {
  name: "",
  phone: "",
  business: "",
  email: "",
  service: "",
  details: "",
  deadline: "",
};

type Status = "idle" | "loading" | "success" | "error";

export function QuoteForm({ initialService }: { initialService?: string }) {
  const { t, bi } = useLang();
  const { services, addQuote } = useAppData();
  const [values, setValues] = useState<QuoteValues>({ ...empty, service: initialService ?? "" });
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteValues, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitted, setSubmitted] = useState<QuoteValues | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const svc = visibleServices(services);
  const serviceLabel = (slug: string) =>
    slug === "other" ? t("svc.other") : bi(services.find((s) => s.slug === slug)?.title);

  useEffect(() => {
    if (initialService) setValues((v) => ({ ...v, service: initialService }));
  }, [initialService]);

  const set = (key: keyof QuoteValues) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = (v: QuoteValues) => {
    const er: Partial<Record<keyof QuoteValues, string>> = {};
    if (!v.name.trim()) er.name = t("common.required");
    else if (v.name.trim().length < 3) er.name = t("form.nameShort");
    if (!v.phone.trim()) er.phone = t("common.required");
    else if (!isValidSaudiMobile(v.phone)) er.phone = t("common.phoneInvalid");
    if (!v.business.trim()) er.business = t("common.required");
    if (v.email.trim() && !isValidEmail(v.email)) er.email = t("form.emailInvalid");
    if (!v.service) er.service = t("form.selectRequired");
    if (!v.details.trim()) er.details = t("common.required");
    else if (v.details.trim().length < 15) er.details = t("form.detailsShort");
    return er;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const er = validate(values);
    setErrors(er);
    if (Object.keys(er).length) {
      setStatus("error");
      requestAnimationFrame(() => {
        const first = formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]");
        first?.focus();
      });
      return;
    }
    setStatus("loading");
    try {
      // Simulated latency — no network request is made.
      await new Promise((r) => setTimeout(r, 1100));
      addQuote({
        name: values.name.trim(),
        phone: normalizePhone(values.phone),
        business: values.business.trim(),
        email: values.email.trim() || undefined,
        service: values.service,
        details: values.details.trim(),
        deadline: values.deadline || undefined,
      });
      setSubmitted(values);
      setStatus("success");
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues({ ...empty, service: initialService ?? "" });
    setErrors({});
    setStatus("idle");
    setSubmitted(null);
  };

  if (status === "success" && submitted) {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        className="animate-modal-in rounded-2xl border bg-card p-8 text-center shadow-soft outline-none sm:p-10"
        role="status"
      >
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold text-navy">{t("quote.successTitle")}</h2>
        <p className="mx-auto mt-3 max-w-md leading-7 text-muted-foreground">
          {t("quote.successDesc")}
        </p>
        <dl className="mx-auto mt-7 grid max-w-md gap-3 rounded-xl bg-muted/60 p-5 text-start text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t("quote.name")}</dt>
            <dd className="font-semibold text-navy">{submitted.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t("quote.service")}</dt>
            <dd className="font-semibold text-navy">{serviceLabel(submitted.service)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t("quote.phone")}</dt>
            <dd className="font-semibold text-navy" dir="ltr">
              {submitted.phone}
            </dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-navy">
            <RotateCcw className="size-4" />
            {t("quote.newRequest")}
          </button>
          <Link to="/" className="btn btn-outline">
            {t("common.backHome")}
          </Link>
        </div>
      </div>
    );
  }

  const loading = status === "loading";
  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8"
    >
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-gold/40 bg-gold-soft/40 p-4 text-sm leading-6 text-navy">
        <Info className="mt-0.5 size-4 shrink-0 text-gold-strong" />
        <p>{t("quote.demoNote")}</p>
      </div>

      {status === "error" && errorCount > 0 && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{t("form.fixErrors", { count: errorCount })}</p>
        </div>
      )}
      {status === "error" && errorCount === 0 && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{t("quote.error")}</p>
        </div>
      )}

      <fieldset disabled={loading} className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={t("quote.name")} required error={errors.name}>
          <input
            {...errorProps("name", errors.name)}
            className="field"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
          />
        </Field>
        <Field
          id="phone"
          label={t("quote.phone")}
          required
          error={errors.phone}
          hint={t("form.phoneHint")}
        >
          <input
            {...errorProps("phone", errors.phone)}
            className="field text-start"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="05xxxxxxxx"
            value={values.phone}
            onChange={set("phone")}
          />
        </Field>
        <Field id="business" label={t("quote.business")} required error={errors.business}>
          <input
            {...errorProps("business", errors.business)}
            className="field"
            autoComplete="organization"
            value={values.business}
            onChange={set("business")}
          />
        </Field>
        <Field id="email" label={t("quote.email")} optional error={errors.email}>
          <input
            {...errorProps("email", errors.email)}
            className="field text-start"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder="name@example.com"
            value={values.email}
            onChange={set("email")}
          />
        </Field>
        <Field
          id="service"
          label={t("quote.service")}
          required
          error={errors.service}
          className="sm:col-span-2"
        >
          <select
            {...errorProps("service", errors.service)}
            className="field"
            value={values.service}
            onChange={set("service")}
          >
            <option value="">{t("svc.selectService")}</option>
            {svc.map((s) => (
              <option key={s.slug} value={s.slug}>
                {bi(s.title)}
              </option>
            ))}
            <option value="other">{t("svc.other")}</option>
          </select>
        </Field>
        <Field
          id="details"
          label={t("quote.details")}
          required
          error={errors.details}
          className="sm:col-span-2"
        >
          <textarea
            {...errorProps("details", errors.details)}
            className="field"
            rows={5}
            placeholder={t("quote.detailsPlaceholder")}
            value={values.details}
            onChange={set("details")}
          />
        </Field>
        <Field id="deadline" label={t("quote.deadline")} optional className="sm:col-span-2">
          <input
            id="deadline"
            name="deadline"
            type="date"
            className="field"
            min={new Date().toISOString().slice(0, 10)}
            value={values.deadline}
            onChange={set("deadline")}
          />
        </Field>
      </fieldset>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={reset} disabled={loading} className="btn btn-ghost">
          <RotateCcw className="size-4" />
          {t("form.clear")}
        </button>
        <button type="submit" disabled={loading} className="btn btn-gold min-w-48">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4 rtl:-scale-x-100" />
          )}
          {loading ? t("quote.sending") : t("quote.submit")}
        </button>
      </div>
    </form>
  );
}
