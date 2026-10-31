import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useLang } from "@/i18n";
import { useAppData } from "@/store/app-data";
import { isValidSaudiMobile, normalizePhone } from "@/lib/validation";
import { Field, errorProps } from "./Field";

interface Values {
  name: string;
  phone: string;
  subject: string;
  message: string;
}

const empty: Values = { name: "", phone: "", subject: "", message: "" };

export function ContactForm() {
  const { t } = useLang();
  const { addMessage } = useAppData();
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const set = (key: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    if (status === "success") setStatus("idle");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<keyof Values, string>> = {};
    if (!values.name.trim()) er.name = t("common.required");
    if (!values.phone.trim()) er.phone = t("common.required");
    else if (!isValidSaudiMobile(values.phone)) er.phone = t("common.phoneInvalid");
    if (!values.subject.trim()) er.subject = t("common.required");
    if (!values.message.trim()) er.message = t("common.required");
    else if (values.message.trim().length < 10) er.message = t("form.messageShort");
    setErrors(er);
    if (Object.keys(er).length) {
      setStatus("error");
      requestAnimationFrame(() =>
        formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus(),
      );
      return;
    }
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 900));
      addMessage({
        name: values.name.trim(),
        phone: normalizePhone(values.phone),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setValues(empty);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const loading = status === "loading";
  const hasFieldErrors = Object.values(errors).some(Boolean);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      {status === "success" && (
        <div
          role="status"
          className="animate-drop-in flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <p>{t("contact.success")}</p>
        </div>
      )}
      {status === "error" && (
        <div
          role="alert"
          className="animate-drop-in flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>
            {hasFieldErrors
              ? t("form.fixErrors", { count: Object.values(errors).filter(Boolean).length })
              : t("contact.error")}
          </p>
        </div>
      )}
      <fieldset disabled={loading} className="grid gap-5 sm:grid-cols-2">
        <Field id="c-name" label={t("contact.name")} required error={errors.name}>
          <input
            {...errorProps("c-name", errors.name)}
            className="field"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
          />
        </Field>
        <Field id="c-phone" label={t("contact.yourPhone")} required error={errors.phone}>
          <input
            {...errorProps("c-phone", errors.phone)}
            className="field text-start"
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder="05xxxxxxxx"
            value={values.phone}
            onChange={set("phone")}
          />
        </Field>
        <Field
          id="c-subject"
          label={t("contact.subject")}
          required
          error={errors.subject}
          className="sm:col-span-2"
        >
          <input
            {...errorProps("c-subject", errors.subject)}
            className="field"
            value={values.subject}
            onChange={set("subject")}
          />
        </Field>
        <Field
          id="c-message"
          label={t("contact.message")}
          required
          error={errors.message}
          className="sm:col-span-2"
        >
          <textarea
            {...errorProps("c-message", errors.message)}
            className="field"
            rows={5}
            value={values.message}
            onChange={set("message")}
          />
        </Field>
      </fieldset>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button type="submit" disabled={loading} className="btn btn-navy shrink-0">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4 rtl:-scale-x-100" />
          )}
          {loading ? t("contact.sending") : t("contact.sendBtn")}
        </button>
      </div>
    </form>
  );
}
