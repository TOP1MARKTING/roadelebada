import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CloudUpload, RotateCcw, Save } from "lucide-react";
import { useLang } from "@/i18n";
import { useAppData, type WebsiteSettings } from "@/store/app-data";
import { firebaseProjectId } from "@/lib/firebase";
import { isValidUrl } from "@/lib/validation";
import {
  Card,
  ConfirmDialog,
  ImagePicker,
  PageHeader,
} from "@/components/admin/ui";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/admin/_panel/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const { t } = useLang();
  const {
    website,
    setWebsite,
    hydrated,
    firebaseReady,
    firebaseError,
    seedCloud,
  } = useAppData();
  const [draft, setDraft] = useState<WebsiteSettings>(website);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [confirmSave, setConfirmSave] = useState(false);
  const [seeding, setSeeding] = useState(false);
  useDocumentTitle(t("admin.settings.title"));

  useEffect(() => {
    if (hydrated) setDraft(website);
  }, [hydrated, website]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(website);

  const set = <K extends keyof WebsiteSettings>(key: K, value: WebsiteSettings[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const er: Partial<Record<string, string>> = {};
    if (draft.headerLogo && !draft.headerLogo.startsWith("asset:") && !isValidUrl(draft.headerLogo))
      er.headerLogo = t("admin.image.invalid");
    setErrors(er);
    const count = Object.keys(er).length;
    if (count) toast.error(t("form.fixErrors", { count }));
    return count === 0;
  };

  const applySave = () => {
    setWebsite(draft);
    toast.success(t("admin.settings.saved"), {
      description: firebaseReady ? "Firestore" : t("admin.common.savedLocally"),
    });
  };

  const err = (k: string) => errors[k];

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("admin.settings.title")}
        subtitle={t("admin.settings.subtitle")}
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setDraft(website);
                setErrors({});
              }}
              disabled={!dirty}
            >
              <RotateCcw className="size-4" />
              {t("admin.settings.discard")}
            </button>
            <button
              type="button"
              className="btn btn-gold btn-sm"
              onClick={() => validate() && setConfirmSave(true)}
              disabled={!dirty}
            >
              <Save className="size-4" />
              {t("admin.common.saveChanges")}
            </button>
          </>
        }
      />
      <Card title="Firebase">
        <div className="space-y-3 text-sm">
          <p>
            <span className="text-muted-foreground">Project: </span>
            <span className="font-mono font-semibold text-navy" dir="ltr">
              {firebaseProjectId}
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Status: </span>
            {firebaseReady ? (
              <span className="font-semibold text-emerald-600">متصل بـ Firestore</span>
            ) : (
              <span className="font-semibold text-amber-600">غير متصل / يستخدم القيم المحلية</span>
            )}
          </p>
          {firebaseError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700">
              {firebaseError}
            </p>
          )}
          <button
            type="button"
            className="btn btn-navy btn-sm"
            disabled={seeding}
            onClick={async () => {
              setSeeding(true);
              try {
                await seedCloud();
                toast.success("تم رفع البيانات الافتراضية إلى Firebase");
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "فشل الرفع");
              } finally {
                setSeeding(false);
              }
            }}
          >
            <CloudUpload className="size-4" />
            {seeding ? "جاري الرفع…" : "رفع الخدمات والبيانات إلى Firebase"}
          </button>
          <p className="text-xs leading-6 text-muted-foreground">
            يرفع الشركة، الهاتف، الواتساب، الخدمات والتفاصيل، الأعمال، المدونة والموظفين حسب قواعد
            Firestore. فعّل Authentication (Email/Password) وانشر{" "}
            <code className="font-mono">firestore.rules</code> من مجلد المشروع.
          </p>
        </div>
      </Card>

      <Card title={t("admin.settings.general")}>
        <div className="space-y-5">
          <div>
            <p className="field-label">{t("admin.settings.headerLogo")}</p>
            <ImagePicker
              value={draft.headerLogo}
              onChange={(v) => set("headerLogo", v)}
              error={err("headerLogo")}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {draft.headerLogo ? (
                <button
                  type="button"
                  className="font-semibold text-gold-strong hover:underline"
                  onClick={() => set("headerLogo", "")}
                >
                  {t("admin.company.useDefaultLogo")}
                </button>
              ) : (
                t("admin.settings.headerLogoHint")
              )}
            </p>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmSave}
        onClose={() => setConfirmSave(false)}
        title={t("admin.settings.confirmSaveTitle")}
        message={t("admin.settings.confirmSaveDesc")}
        confirmLabel={t("admin.common.saveChanges")}
        onConfirm={applySave}
      />
    </div>
  );
}
