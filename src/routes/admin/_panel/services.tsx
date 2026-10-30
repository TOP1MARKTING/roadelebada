import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { useLang } from "@/i18n";
import {
  serviceCategories,
  serviceCategoryKey,
  serviceIcons,
  type Service,
  type ServiceCategory,
  type ServiceIconKey,
} from "@/data/services";
import { assetToken } from "@/lib/assets";
import { useAppData } from "@/store/app-data";
import { matches, validateAdminListSearch } from "@/lib/admin-search";
import { isValidUrl } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/site/Modal";
import { SmartImage } from "@/components/site/SmartImage";
import { Field } from "@/components/site/Field";
import {
  Card,
  ConfirmDialog,
  DemoNote,
  EmptyState,
  IconButton,
  ImagePicker,
  PageHeader,
  PillBadge,
  SearchInput,
  Switch,
  td,
  th,
} from "@/components/admin/ui";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";
import { PermissionGate } from "@/components/admin/PermissionGate";

export const Route = createFileRoute("/admin/_panel/services")({
  validateSearch: validateAdminListSearch,
  component: ServicesAdmin,
});

type Visibility = "all" | "visible" | "hidden";

interface Draft {
  slug: string;
  titleAr: string;
  titleEn: string;
  category: ServiceCategory;
  iconKey: ServiceIconKey;
  shortAr: string;
  shortEn: string;
  detailAr: string;
  detailEn: string;
  examplesAr: string;
  examplesEn: string;
  image: string;
  visible: boolean;
}

const emptyDraft: Draft = {
  slug: "",
  titleAr: "",
  titleEn: "",
  category: "design",
  iconKey: "sparkles",
  shortAr: "",
  shortEn: "",
  detailAr: "",
  detailEn: "",
  examplesAr: "",
  examplesEn: "",
  image: assetToken("svc-design"),
  visible: true,
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const toDraft = (s: Service): Draft => ({
  slug: s.slug,
  titleAr: s.title.ar,
  titleEn: s.title.en,
  category: s.category,
  iconKey: s.iconKey,
  shortAr: s.short.ar,
  shortEn: s.short.en,
  detailAr: s.detail.ar,
  detailEn: s.detail.en,
  examplesAr: s.examples.ar.join("\n"),
  examplesEn: s.examples.en.join("\n"),
  image: s.image,
  visible: s.visible,
});

const lines = (v: string) =>
  v
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function ServicesAdmin() {
  const { t, bi, formatDate } = useLang();
  const { services, setServices } = useAppData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [q, setQ] = useState(search.q ?? "");
  const [visibility, setVisibility] = useState<Visibility>("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [toDelete, setToDelete] = useState<Service | null>(null);
  useDocumentTitle(t("admin.services.title"));

  useEffect(() => {
    if (search.q !== undefined) setQ(search.q);
  }, [search.q]);

  useEffect(() => {
    if (search.new) {
      openAdd();
      navigate({ search: (s) => ({ ...s, new: undefined }), replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.new]);

  const filtered = useMemo(
    () =>
      services.filter(
        (s) =>
          matches(q, s.title.ar, s.title.en, s.slug) &&
          (visibility === "all" || (visibility === "visible" ? s.visible : !s.visible)),
      ),
    [services, q, visibility],
  );

  function openAdd() {
    setEditing(null);
    setDraft(emptyDraft);
    setErrors({});
    setModalOpen(true);
  }

  const openEdit = (s: Service) => {
    setEditing(s.slug);
    setDraft(toDraft(s));
    setErrors({});
    setModalOpen(true);
  };

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => {
      const next = { ...d, [key]: value };
      if (key === "titleEn" && !editing && (d.slug === "" || d.slug === slugify(d.titleEn))) {
        next.slug = slugify(String(value));
      }
      return next;
    });
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const save = () => {
    const er: Partial<Record<keyof Draft, string>> = {};
    if (!draft.titleAr.trim()) er.titleAr = t("common.required");
    if (!draft.titleEn.trim()) er.titleEn = t("common.required");
    if (!draft.shortAr.trim()) er.shortAr = t("common.required");
    if (!draft.slug.trim()) er.slug = t("common.required");
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug))
      er.slug = t("admin.services.slugInvalid");
    else if (services.some((s) => s.slug === draft.slug && s.slug !== editing))
      er.slug = t("admin.services.slugTaken");
    if (!draft.image) er.image = t("common.required");
    else if (!draft.image.startsWith("asset:") && !isValidUrl(draft.image))
      er.image = t("admin.image.invalid");
    setErrors(er);
    if (Object.keys(er).length) return;

    const now = new Date().toISOString();
    const existing = services.find((s) => s.slug === editing);
    const record: Service = {
      slug: draft.slug,
      iconKey: draft.iconKey,
      image: draft.image,
      gallery: existing && existing.image === draft.image ? existing.gallery : [draft.image],
      category: draft.category,
      visible: draft.visible,
      updatedAt: now,
      title: { ar: draft.titleAr.trim(), en: draft.titleEn.trim() },
      short: { ar: draft.shortAr.trim(), en: draft.shortEn.trim() },
      detail: { ar: draft.detailAr.trim(), en: draft.detailEn.trim() },
      examples: { ar: lines(draft.examplesAr), en: lines(draft.examplesEn) },
      benefits: existing?.benefits ?? { ar: [], en: [] },
    };
    setServices((list) =>
      editing ? list.map((s) => (s.slug === editing ? record : s)) : [...list, record],
    );
    setModalOpen(false);
    toast.success(t("admin.services.saved"), { description: t("admin.common.savedLocally") });
  };

  const toggle = (s: Service) => {
    setServices((list) =>
      list.map((x) =>
        x.slug === s.slug ? { ...x, visible: !x.visible, updatedAt: new Date().toISOString() } : x,
      ),
    );
    toast.success(s.visible ? t("admin.services.hiddenToast") : t("admin.services.shownToast"));
  };

  const remove = (s: Service) => {
    setServices((list) => list.filter((x) => x.slug !== s.slug));
    toast.success(t("admin.services.deleted"));
  };

  return (
    <PermissionGate need="services">
    <div className="space-y-5">
      <PageHeader
        title={t("admin.services.title")}
        subtitle={t("admin.services.subtitle")}
        actions={
          <button type="button" className="btn btn-gold btn-sm" onClick={openAdd}>
            <Plus className="size-4" />
            {t("admin.services.add")}
          </button>
        }
      />
      <DemoNote>{t("admin.common.demoStoreNote")}</DemoNote>

      <Card bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder={t("admin.services.search")}
            className="sm:max-w-xs sm:flex-1"
          />
          <div
            role="tablist"
            aria-label={t("admin.common.status")}
            className="inline-flex rounded-md border bg-muted/40 p-0.5 text-sm"
          >
            {(["all", "visible", "hidden"] as Visibility[]).map((v) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={visibility === v}
                onClick={() => setVisibility(v)}
                className={cn(
                  "rounded px-3 py-1.5 font-medium transition",
                  visibility === v
                    ? "bg-white text-navy shadow-sm"
                    : "text-muted-foreground hover:text-navy",
                )}
              >
                {v === "all" ? t("admin.services.filterAll") : t(`admin.common.${v}`)}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground sm:ms-auto">
            {t("admin.common.resultsCount", { n: filtered.length })}
          </p>
        </div>

        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className={th}>{t("admin.common.image")}</th>
                  <th className={th}>{t("admin.common.titleAr")}</th>
                  <th className={cn(th, "hidden md:table-cell")}>{t("admin.common.titleEn")}</th>
                  <th className={th}>{t("admin.common.category")}</th>
                  <th className={th}>{t("admin.common.status")}</th>
                  <th className={cn(th, "hidden lg:table-cell")}>{t("admin.common.updated")}</th>
                  <th className={cn(th, "text-end")}>{t("admin.common.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((s) => {
                  const Icon = serviceIcons[s.iconKey] ?? serviceIcons.sparkles;
                  return (
                    <tr key={s.slug} className="hover:bg-muted/30">
                      <td className={td}>
                        <div className="relative size-14 overflow-hidden rounded-md bg-muted">
                          <SmartImage
                            src={s.image}
                            alt={bi(s.title)}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-0.5 end-0.5 flex size-5 items-center justify-center rounded bg-navy text-gold">
                            <Icon className="size-3" />
                          </span>
                        </div>
                      </td>
                      <td className={td}>
                        <p className="font-semibold text-navy">{s.title.ar}</p>
                        <p className="text-xs text-muted-foreground" dir="ltr">
                          /{s.slug}
                        </p>
                      </td>
                      <td className={cn(td, "hidden text-foreground/80 md:table-cell")} dir="ltr">
                        <span className="block text-start">{s.title.en}</span>
                      </td>
                      <td className={td}>
                        <PillBadge tone="gold">{t(serviceCategoryKey(s.category))}</PillBadge>
                      </td>
                      <td className={td}>
                        <div className="flex items-center gap-2">
                          <Switch
                            size="sm"
                            checked={s.visible}
                            onChange={() => toggle(s)}
                            label={t("admin.services.toggleVisibility")}
                          />
                          <span
                            className={cn(
                              "text-xs font-semibold",
                              s.visible ? "text-emerald-700" : "text-muted-foreground",
                            )}
                          >
                            {s.visible ? t("admin.common.visible") : t("admin.common.hidden")}
                          </span>
                        </div>
                      </td>
                      <td
                        className={cn(
                          td,
                          "hidden whitespace-nowrap text-muted-foreground lg:table-cell",
                        )}
                      >
                        {formatDate(s.updatedAt)}
                      </td>
                      <td className={cn(td, "text-end")}>
                        <div className="inline-flex items-center gap-0.5">
                          <a
                            href={`/services/${s.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-navy",
                              !s.visible && "pointer-events-none opacity-40",
                            )}
                            aria-label={t("admin.common.preview")}
                            title={t("admin.common.preview")}
                          >
                            <Eye className="size-4" />
                          </a>
                          <IconButton label={t("admin.common.edit")} onClick={() => openEdit(s)}>
                            <Pencil className="size-4" />
                          </IconButton>
                          <IconButton
                            label={t("admin.common.delete")}
                            tone="danger"
                            onClick={() => setToDelete(s)}
                          >
                            <Trash2 className="size-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Sparkles}
            title={t("admin.noResults")}
            description={t("admin.noResultsDesc")}
            action={
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setQ("");
                  setVisibility("all");
                }}
              >
                {t("admin.common.clearFilters")}
              </button>
            }
          />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        title={editing ? t("admin.services.editTitle") : t("admin.services.addTitle")}
        description={t("admin.common.demoStoreNote")}
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setModalOpen(false)}
            >
              {t("admin.common.cancel")}
            </button>
            <button type="button" className="btn btn-navy btn-sm" onClick={save}>
              {t("admin.common.save")}
            </button>
          </>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="s-titleAr" label={t("admin.common.titleAr")} required error={errors.titleAr}>
            <input
              id="s-titleAr"
              className="field"
              dir="rtl"
              value={draft.titleAr}
              aria-invalid={!!errors.titleAr || undefined}
              onChange={(e) => set("titleAr", e.target.value)}
            />
          </Field>
          <Field id="s-titleEn" label={t("admin.common.titleEn")} required error={errors.titleEn}>
            <input
              id="s-titleEn"
              className="field"
              dir="ltr"
              value={draft.titleEn}
              aria-invalid={!!errors.titleEn || undefined}
              onChange={(e) => set("titleEn", e.target.value)}
            />
          </Field>
          <Field
            id="s-slug"
            label={t("admin.services.slug")}
            required
            error={errors.slug}
            hint={t("admin.services.slugHint")}
          >
            <input
              id="s-slug"
              className="field font-mono text-sm"
              dir="ltr"
              value={draft.slug}
              aria-invalid={!!errors.slug || undefined}
              onChange={(e) => set("slug", e.target.value.toLowerCase())}
            />
          </Field>
          <Field id="s-category" label={t("admin.common.category")}>
            <select
              id="s-category"
              className="field"
              value={draft.category}
              onChange={(e) => set("category", e.target.value as ServiceCategory)}
            >
              {serviceCategories.map((c) => (
                <option key={c} value={c}>
                  {t(serviceCategoryKey(c))}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <p className="field-label">{t("admin.services.icon")}</p>
            <div
              className="flex flex-wrap gap-2"
              role="radiogroup"
              aria-label={t("admin.services.icon")}
            >
              {(Object.keys(serviceIcons) as ServiceIconKey[]).map((k) => {
                const Icon = serviceIcons[k];
                const active = draft.iconKey === k;
                return (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={k}
                    onClick={() => set("iconKey", k)}
                    className={cn(
                      "flex size-11 items-center justify-center rounded-md border transition",
                      active ? "border-navy bg-navy text-gold" : "text-navy/70 hover:border-gold",
                    )}
                  >
                    <Icon className="size-5" />
                  </button>
                );
              })}
            </div>
          </div>
          <Field id="s-shortAr" label={t("admin.services.descAr")} required error={errors.shortAr}>
            <textarea
              id="s-shortAr"
              className="field !min-h-24"
              dir="rtl"
              rows={3}
              value={draft.shortAr}
              aria-invalid={!!errors.shortAr || undefined}
              onChange={(e) => set("shortAr", e.target.value)}
            />
          </Field>
          <Field id="s-shortEn" label={t("admin.services.descEn")}>
            <textarea
              id="s-shortEn"
              className="field !min-h-24"
              dir="ltr"
              rows={3}
              value={draft.shortEn}
              onChange={(e) => set("shortEn", e.target.value)}
            />
          </Field>
          <Field id="s-detailAr" label={t("admin.services.detailAr")} optional>
            <textarea
              id="s-detailAr"
              className="field"
              dir="rtl"
              rows={4}
              value={draft.detailAr}
              onChange={(e) => set("detailAr", e.target.value)}
            />
          </Field>
          <Field id="s-detailEn" label={t("admin.services.detailEn")} optional>
            <textarea
              id="s-detailEn"
              className="field"
              dir="ltr"
              rows={4}
              value={draft.detailEn}
              onChange={(e) => set("detailEn", e.target.value)}
            />
          </Field>
          <Field
            id="s-exAr"
            label={t("admin.services.examplesAr")}
            optional
            hint={t("admin.services.onePerLine")}
          >
            <textarea
              id="s-exAr"
              className="field !min-h-24"
              dir="rtl"
              rows={3}
              value={draft.examplesAr}
              onChange={(e) => set("examplesAr", e.target.value)}
            />
          </Field>
          <Field
            id="s-exEn"
            label={t("admin.services.examplesEn")}
            optional
            hint={t("admin.services.onePerLine")}
          >
            <textarea
              id="s-exEn"
              className="field !min-h-24"
              dir="ltr"
              rows={3}
              value={draft.examplesEn}
              onChange={(e) => set("examplesEn", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <p className="field-label">{t("admin.common.image")}</p>
            <ImagePicker
              value={draft.image}
              onChange={(v) => set("image", v)}
              error={errors.image}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 px-4 py-3 sm:col-span-2">
            <div>
              <p className="text-sm font-semibold text-navy">{t("admin.services.visibleOnSite")}</p>
              <p className="text-xs text-muted-foreground">
                {draft.visible ? t("admin.common.visible") : t("admin.common.hidden")}
              </p>
            </div>
            <Switch
              checked={draft.visible}
              onChange={(v) => set("visible", v)}
              label={t("admin.services.visibleOnSite")}
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && remove(toDelete)}
        message={
          <>
            <p>{t("admin.common.deleteWarning")}</p>
            {toDelete && <p className="mt-2 font-bold text-navy">{bi(toDelete.title)}</p>}
          </>
        }
      />
    </div>
    </PermissionGate>
  );
}
