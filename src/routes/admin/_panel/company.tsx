import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { RotateCcw, Save } from "lucide-react";
import { useLang } from "@/i18n";
import { siteConfig, type SocialKey } from "@/config/site";
import { defaultCompany, useAppData, type CompanySettings } from "@/store/app-data";
import { isValidPhoneLoose, isValidUrl, normalizePhone } from "@/lib/validation";
import { Field } from "@/components/site/Field";
import { SocialIcon, socialLabels } from "@/components/site/SocialIcon";
import { Card, ConfirmDialog, ImagePicker, PageHeader } from "@/components/admin/ui";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/admin/_panel/company")({
  component: CompanyAdmin,
});

type Errors = Partial<Record<string, string>>;

const socialKeys = siteConfig.socials.map((s) => s.key) as SocialKey[];

function CompanyAdmin() {
  const { t } = useLang();
  const { company, setCompany, hydrated } = useAppData();
  const [draft, setDraft] = useState<CompanySettings>(company);
  const [errors, setErrors] = useState<Errors>({});
  const [confirmReset, setConfirmReset] = useState(false);
  useDocumentTitle(t("admin.company.title"));

  useEffect(() => {
    if (hydrated) setDraft(company);
  }, [hydrated, company]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(company);

  const set = <K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const setBi = (
    key: "shortDesc" | "longDesc" | "address" | "hours",
    side: "ar" | "en",
    value: string,
  ) => {
    setDraft((d) => ({ ...d, [key]: { ...d[key], [side]: value } }));
    setErrors((e) => ({ ...e, [`${key}.${side}`]: undefined }));
  };
  const setSocial = (key: SocialKey, value: string) => {
    setDraft((d) => ({ ...d, socials: { ...d.socials, [key]: value } }));
    setErrors((e) => ({ ...e, [`social.${key}`]: undefined }));
  };

  const save = () => {
    const er: Errors = {};
    const req = t("common.required");
    if (!draft.nameAr.trim()) er.nameAr = req;
    if (!draft.nameEn.trim()) er.nameEn = req;
    if (!draft.shortDesc.ar.trim()) er["shortDesc.ar"] = req;
    if (!draft.address.ar.trim()) er["address.ar"] = req;
    if (!draft.phone.trim()) er.phone = req;
    else if (!isValidPhoneLoose(draft.phone)) er.phone = t("admin.company.phoneInvalid");
    if (
      draft.whatsapp.trim() &&
      !/^\d{8,15}$/.test(normalizePhone(draft.whatsapp).replace(/^\+/, ""))
    )
      er.whatsapp = t("admin.company.whatsappInvalid");
    if (draft.postalCode.trim() && !/^\d{5}$/.test(draft.postalCode.trim()))
      er.postalCode = t("admin.company.postalInvalid");
    if (draft.mapsUrl.trim() && !isValidUrl(draft.mapsUrl.trim()))
      er.mapsUrl = t("admin.common.urlInvalid");
    if (draft.logoUrl && !draft.logoUrl.startsWith("asset:") && !isValidUrl(draft.logoUrl))
      er.logoUrl = t("admin.image.invalid");
    if (!/^#[0-9a-fA-F]{6}$/.test(draft.primaryColor))
      er.primaryColor = t("admin.company.colorInvalid");
    for (const k of socialKeys) {
      const v = draft.socials[k]?.trim();
      if (v && !isValidUrl(v)) er[`social.${k}`] = t("admin.common.urlInvalid");
    }
    setErrors(er);
    const count = Object.keys(er).length;
    if (count) {
      toast.error(t("form.fixErrors", { count }));
      return;
    }
    const clean: CompanySettings = {
      ...draft,
      nameAr: draft.nameAr.trim(),
      nameEn: draft.nameEn.trim(),
      phone: normalizePhone(draft.phone),
      whatsapp: normalizePhone(draft.whatsapp).replace(/^\+/, ""),
      postalCode: draft.postalCode.trim(),
      mapsUrl: draft.mapsUrl.trim(),
      socials: Object.fromEntries(
        socialKeys.map((k) => [k, draft.socials[k]?.trim() ?? ""]),
      ) as Record<SocialKey, string>,
    };
    setCompany(clean);
    setDraft(clean);
    toast.success(t("admin.company.saved"), { description: t("admin.common.savedLocally") });
  };

  const err = (k: string) => errors[k];

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("admin.company.title")}
        subtitle={t("admin.company.subtitle")}
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setConfirmReset(true)}
            >
              <RotateCcw className="size-4" />
              {t("admin.common.reset")}
            </button>
            <button type="button" className="btn btn-gold btn-sm" onClick={save} disabled={!dirty}>
              <Save className="size-4" />
              {t("admin.common.saveChanges")}
            </button>
          </>
        }
      />
      <div className="space-y-5">
        <Card title={t("admin.company.identity")}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="c-nameAr" label={t("admin.company.nameAr")} required error={err("nameAr")}>
              <input
                id="c-nameAr"
                className="field"
                dir="rtl"
                value={draft.nameAr}
                aria-invalid={!!err("nameAr") || undefined}
                onChange={(e) => set("nameAr", e.target.value)}
              />
            </Field>
            <Field id="c-nameEn" label={t("admin.company.nameEn")} required error={err("nameEn")}>
              <input
                id="c-nameEn"
                className="field"
                dir="ltr"
                value={draft.nameEn}
                aria-invalid={!!err("nameEn") || undefined}
                onChange={(e) => set("nameEn", e.target.value)}
              />
            </Field>
            <Field
              id="c-shortAr"
              label={t("admin.company.shortAr")}
              required
              error={err("shortDesc.ar")}
            >
              <textarea
                id="c-shortAr"
                className="field !min-h-24"
                dir="rtl"
                rows={3}
                value={draft.shortDesc.ar}
                aria-invalid={!!err("shortDesc.ar") || undefined}
                onChange={(e) => setBi("shortDesc", "ar", e.target.value)}
              />
            </Field>
            <Field id="c-shortEn" label={t("admin.company.shortEn")} optional>
              <textarea
                id="c-shortEn"
                className="field !min-h-24"
                dir="ltr"
                rows={3}
                value={draft.shortDesc.en}
                onChange={(e) => setBi("shortDesc", "en", e.target.value)}
              />
            </Field>
            <Field id="c-longAr" label={t("admin.company.longAr")} optional>
              <textarea
                id="c-longAr"
                className="field"
                dir="rtl"
                rows={5}
                value={draft.longDesc.ar}
                onChange={(e) => setBi("longDesc", "ar", e.target.value)}
              />
            </Field>
            <Field id="c-longEn" label={t("admin.company.longEn")} optional>
              <textarea
                id="c-longEn"
                className="field"
                dir="ltr"
                rows={5}
                value={draft.longDesc.en}
                onChange={(e) => setBi("longDesc", "en", e.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card title={t("admin.company.contact")}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="c-phone" label={t("admin.company.phone")} required error={err("phone")}>
              <input
                id="c-phone"
                type="tel"
                className="field text-start"
                dir="ltr"
                value={draft.phone}
                aria-invalid={!!err("phone") || undefined}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
            <Field
              id="c-wa"
              label={t("admin.company.whatsapp")}
              optional
              error={err("whatsapp")}
              hint={t("admin.company.whatsappHint")}
            >
              <input
                id="c-wa"
                type="tel"
                className="field text-start"
                dir="ltr"
                value={draft.whatsapp}
                aria-invalid={!!err("whatsapp") || undefined}
                onChange={(e) => set("whatsapp", e.target.value)}
              />
            </Field>
            <Field
              id="c-addrAr"
              label={t("admin.company.addressAr")}
              required
              error={err("address.ar")}
            >
              <input
                id="c-addrAr"
                className="field"
                dir="rtl"
                value={draft.address.ar}
                aria-invalid={!!err("address.ar") || undefined}
                onChange={(e) => setBi("address", "ar", e.target.value)}
              />
            </Field>
            <Field id="c-addrEn" label={t("admin.company.addressEn")} optional>
              <input
                id="c-addrEn"
                className="field"
                dir="ltr"
                value={draft.address.en}
                onChange={(e) => setBi("address", "en", e.target.value)}
              />
            </Field>
            <Field id="c-postal" label={t("contact.postal")} optional error={err("postalCode")}>
              <input
                id="c-postal"
                inputMode="numeric"
                className="field text-start"
                dir="ltr"
                value={draft.postalCode}
                aria-invalid={!!err("postalCode") || undefined}
                onChange={(e) => set("postalCode", e.target.value)}
              />
            </Field>
            <Field id="c-maps" label={t("admin.company.mapsUrl")} optional error={err("mapsUrl")}>
              <input
                id="c-maps"
                type="url"
                className="field text-start"
                dir="ltr"
                value={draft.mapsUrl}
                aria-invalid={!!err("mapsUrl") || undefined}
                onChange={(e) => set("mapsUrl", e.target.value)}
              />
            </Field>
            <Field
              id="c-hoursAr"
              label={t("admin.company.hoursAr")}
              optional
              hint={t("admin.company.hoursHint")}
            >
              <input
                id="c-hoursAr"
                className="field"
                dir="rtl"
                value={draft.hours.ar}
                onChange={(e) => setBi("hours", "ar", e.target.value)}
              />
            </Field>
            <Field id="c-hoursEn" label={t("admin.company.hoursEn")} optional>
              <input
                id="c-hoursEn"
                className="field"
                dir="ltr"
                value={draft.hours.en}
                onChange={(e) => setBi("hours", "en", e.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card title={t("admin.company.socials")}>
          <p className="-mt-1 mb-4 text-xs text-muted-foreground">
            {t("admin.company.socialsHint")}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {socialKeys.map((k) => (
              <Field
                key={k}
                id={`c-s-${k}`}
                label={socialLabels[k]}
                optional
                error={err(`social.${k}`)}
              >
                <div className="relative">
                  <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <SocialIcon name={k} />
                  </span>
                  <input
                    id={`c-s-${k}`}
                    type="url"
                    dir="ltr"
                    className="field ps-10 text-start"
                    placeholder="https://"
                    value={draft.socials[k] ?? ""}
                    aria-invalid={!!err(`social.${k}`) || undefined}
                    onChange={(e) => setSocial(k, e.target.value)}
                  />
                </div>
              </Field>
            ))}
          </div>
        </Card>

        <Card title={t("admin.company.branding")}>
          <div className="space-y-5">
            <div>
              <p className="field-label">{t("admin.company.logo")}</p>
              <ImagePicker
                value={draft.logoUrl}
                onChange={(v) => set("logoUrl", v)}
                error={err("logoUrl")}
              />
              {draft.logoUrl && (
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-gold-strong hover:underline"
                  onClick={() => set("logoUrl", "")}
                >
                  {t("admin.company.useDefaultLogo")}
                </button>
              )}
            </div>
            <Field
              id="c-color"
              label={t("admin.company.primaryColor")}
              error={err("primaryColor")}
              hint={t("admin.company.colorHint")}
            >
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  aria-label={t("admin.company.primaryColor")}
                  value={
                    /^#[0-9a-fA-F]{6}$/.test(draft.primaryColor) ? draft.primaryColor : "#1C1E22"
                  }
                  onChange={(e) => set("primaryColor", e.target.value.toUpperCase())}
                  className="h-11 w-14 cursor-pointer rounded-md border bg-white p-1"
                />
                <input
                  id="c-color"
                  className="field max-w-[9rem] font-mono text-sm"
                  dir="ltr"
                  value={draft.primaryColor}
                  aria-invalid={!!err("primaryColor") || undefined}
                  onChange={(e) => set("primaryColor", e.target.value)}
                />
                {draft.primaryColor.toUpperCase() !== defaultCompany.primaryColor && (
                  <button
                    type="button"
                    className="text-xs font-semibold text-gold-strong hover:underline"
                    onClick={() => set("primaryColor", defaultCompany.primaryColor)}
                  >
                    {t("admin.common.reset")}
                  </button>
                )}
              </div>
            </Field>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title={t("admin.company.resetTitle")}
        message={t("admin.company.resetDesc")}
        confirmLabel={t("admin.common.reset")}
        onConfirm={() => {
          setCompany(defaultCompany);
          setDraft(defaultCompany);
          setErrors({});
          toast.success(t("admin.company.resetDone"));
        }}
      />
    </div>
  );
}
