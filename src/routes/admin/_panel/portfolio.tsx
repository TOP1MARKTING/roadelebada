import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, Images, Pencil, Plus, Trash2 } from "lucide-react";
import { useLang } from "@/i18n";
import {
  portfolioCategories,
  portfolioCategoryKey,
  type PortfolioCategory,
  type PortfolioItem,
} from "@/data/portfolio";
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

export const Route = createFileRoute("/admin/_panel/portfolio")({
  validateSearch: validateAdminListSearch,
  component: PortfolioAdmin,
});

interface Draft {
  titleAr: string;
  titleEn: string;
  category: PortfolioCategory;
  descAr: string;
  descEn: string;
  image: string;
  published: boolean;
}

const emptyDraft: Draft = {
  titleAr: "",
  titleEn: "",
  category: "design",
  descAr: "",
  descEn: "",
  image: assetToken("pf-cards"),
  published: true,
};

function PortfolioAdmin() {
  const { t, bi, formatDate } = useLang();
  const { portfolio, setPortfolio } = useAppData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [q, setQ] = useState(search.q ?? "");
  const [category, setCategory] = useState<"all" | PortfolioCategory>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [preview, setPreview] = useState<PortfolioItem | null>(null);
  const [toDelete, setToDelete] = useState<PortfolioItem | null>(null);
  useDocumentTitle(t("admin.portfolio.title"));

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
      [...portfolio]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .filter(
          (p) =>
            matches(q, p.title.ar, p.title.en) && (category === "all" || p.category === category),
        ),
    [portfolio, q, category],
  );

  function openAdd() {
    setEditing(null);
    setDraft(emptyDraft);
    setErrors({});
    setModalOpen(true);
  }

  const openEdit = (p: PortfolioItem) => {
    setEditing(p.id);
    setDraft({
      titleAr: p.title.ar,
      titleEn: p.title.en,
      category: p.category,
      descAr: p.description.ar,
      descEn: p.description.en,
      image: p.image,
      published: p.published,
    });
    setErrors({});
    setModalOpen(true);
  };

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const save = () => {
    const er: Partial<Record<keyof Draft, string>> = {};
    if (!draft.titleAr.trim()) er.titleAr = t("common.required");
    if (!draft.titleEn.trim()) er.titleEn = t("common.required");
    if (!draft.descAr.trim()) er.descAr = t("common.required");
    if (!draft.image) er.image = t("common.required");
    else if (!draft.image.startsWith("asset:") && !isValidUrl(draft.image))
      er.image = t("admin.image.invalid");
    setErrors(er);
    if (Object.keys(er).length) return;

    const base = {
      title: { ar: draft.titleAr.trim(), en: draft.titleEn.trim() },
      category: draft.category,
      description: { ar: draft.descAr.trim(), en: draft.descEn.trim() },
      image: draft.image,
      published: draft.published,
    };
    if (editing) {
      setPortfolio((list) =>
        list.map((p) => (p.id === editing ? { ...p, ...base, frame: p.frame ?? "square" } : p)),
      );
    } else {
      setPortfolio((list) => [
        {
          id: `pf-${Date.now().toString(36)}`,
          createdAt: new Date().toISOString(),
          frame: "square" as const,
          ...base,
        },
        ...list,
      ]);
    }
    setModalOpen(false);
    toast.success(t("admin.portfolio.saved"), { description: t("admin.common.savedLocally") });
  };

  const togglePublished = (p: PortfolioItem) => {
    setPortfolio((list) =>
      list.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x)),
    );
    toast.success(
      p.published ? t("admin.portfolio.unpublishedToast") : t("admin.portfolio.publishedToast"),
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("admin.portfolio.title")}
        subtitle={t("admin.portfolio.subtitle")}
        actions={
          <button type="button" className="btn btn-gold btn-sm" onClick={openAdd}>
            <Plus className="size-4" />
            {t("admin.portfolio.add")}
          </button>
        }
      />
      <DemoNote>
        {t("admin.common.demoStoreNote")} {t("admin.portfolio.sampleNote")}
      </DemoNote>

      <Card bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder={t("admin.portfolio.search")}
            className="lg:max-w-xs lg:flex-1"
          />
          <div className="scrollbar-thin -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:pb-0">
            {(["all", ...portfolioCategories] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  category === c
                    ? "border-navy bg-navy text-white"
                    : "bg-white text-navy/70 hover:border-gold",
                )}
              >
                {c === "all" ? t("pf.filterAll") : t(portfolioCategoryKey(c))}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground lg:ms-auto">
            {t("admin.common.resultsCount", { n: filtered.length })}
          </p>
        </div>

        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className={th}>{t("admin.common.image")}</th>
                  <th className={th}>{t("admin.portfolio.projectTitle")}</th>
                  <th className={th}>{t("admin.common.category")}</th>
                  <th className={th}>{t("admin.portfolio.publication")}</th>
                  <th className={cn(th, "hidden md:table-cell")}>{t("admin.portfolio.created")}</th>
                  <th className={cn(th, "text-end")}>{t("admin.common.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className={td}>
                      <button
                        type="button"
                        onClick={() => setPreview(p)}
                        className="block size-14 overflow-hidden rounded-md bg-muted"
                        aria-label={t("admin.common.preview")}
                      >
                        <SmartImage
                          src={p.image}
                          alt={bi(p.title)}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    </td>
                    <td className={td}>
                      <p className="font-semibold text-navy">{bi(p.title)}</p>
                      <p className="max-w-xs truncate text-xs text-muted-foreground">
                        {bi(p.description)}
                      </p>
                    </td>
                    <td className={td}>
                      <PillBadge tone="gold">{t(portfolioCategoryKey(p.category))}</PillBadge>
                    </td>
                    <td className={td}>
                      <div className="flex items-center gap-2">
                        <Switch
                          size="sm"
                          checked={p.published}
                          onChange={() => togglePublished(p)}
                          label={t("admin.portfolio.publication")}
                        />
                        <PillBadge tone={p.published ? "green" : "gray"}>
                          {p.published
                            ? t("admin.portfolio.published")
                            : t("admin.portfolio.draft")}
                        </PillBadge>
                      </div>
                    </td>
                    <td
                      className={cn(
                        td,
                        "hidden whitespace-nowrap text-muted-foreground md:table-cell",
                      )}
                    >
                      {formatDate(p.createdAt)}
                    </td>
                    <td className={cn(td, "text-end")}>
                      <div className="inline-flex items-center gap-0.5">
                        <IconButton label={t("admin.common.preview")} onClick={() => setPreview(p)}>
                          <Eye className="size-4" />
                        </IconButton>
                        <IconButton label={t("admin.common.edit")} onClick={() => openEdit(p)}>
                          <Pencil className="size-4" />
                        </IconButton>
                        <IconButton
                          label={t("admin.common.delete")}
                          tone="danger"
                          onClick={() => setToDelete(p)}
                        >
                          <Trash2 className="size-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Images}
            title={t("admin.noResults")}
            description={t("admin.noResultsDesc")}
            action={
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setQ("");
                  setCategory("all");
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
        title={editing ? t("admin.portfolio.editTitle") : t("admin.portfolio.addTitle")}
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
          <Field id="p-titleAr" label={t("admin.common.titleAr")} required error={errors.titleAr}>
            <input
              id="p-titleAr"
              className="field"
              dir="rtl"
              value={draft.titleAr}
              aria-invalid={!!errors.titleAr || undefined}
              onChange={(e) => set("titleAr", e.target.value)}
            />
          </Field>
          <Field id="p-titleEn" label={t("admin.common.titleEn")} required error={errors.titleEn}>
            <input
              id="p-titleEn"
              className="field"
              dir="ltr"
              value={draft.titleEn}
              aria-invalid={!!errors.titleEn || undefined}
              onChange={(e) => set("titleEn", e.target.value)}
            />
          </Field>
          <Field id="p-category" label={t("admin.common.category")}>
            <select
              id="p-category"
              className="field"
              value={draft.category}
              onChange={(e) => set("category", e.target.value as PortfolioCategory)}
            >
              {portfolioCategories.map((c) => (
                <option key={c} value={c}>
                  {t(portfolioCategoryKey(c))}
                </option>
              ))}
            </select>
          </Field>
          <div>
            <p className="field-label">{t("admin.portfolio.publication")}</p>
            <div className="flex min-h-[2.875rem] items-center justify-between rounded-md border bg-muted/30 px-4">
              <span className="text-sm text-navy">
                {draft.published ? t("admin.portfolio.published") : t("admin.portfolio.draft")}
              </span>
              <Switch
                checked={draft.published}
                onChange={(v) => set("published", v)}
                label={t("admin.portfolio.publication")}
              />
            </div>
          </div>
          <Field id="p-descAr" label={t("admin.portfolio.descAr")} required error={errors.descAr}>
            <textarea
              id="p-descAr"
              className="field"
              dir="rtl"
              rows={4}
              value={draft.descAr}
              aria-invalid={!!errors.descAr || undefined}
              onChange={(e) => set("descAr", e.target.value)}
            />
          </Field>
          <Field id="p-descEn" label={t("admin.portfolio.descEn")} optional>
            <textarea
              id="p-descEn"
              className="field"
              dir="ltr"
              rows={4}
              value={draft.descEn}
              onChange={(e) => set("descEn", e.target.value)}
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
        </div>
      </Modal>

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        size="lg"
        title={preview ? bi(preview.title) : ""}
      >
        {preview && (
          <div className="space-y-4">
            <SmartImage
              src={preview.image}
              alt={bi(preview.title)}
              className="aspect-[16/10] w-full rounded-md object-cover"
            />
            <div className="flex flex-wrap items-center gap-2">
              <PillBadge tone="gold">{t(portfolioCategoryKey(preview.category))}</PillBadge>
              <PillBadge tone={preview.published ? "green" : "gray"}>
                {preview.published ? t("admin.portfolio.published") : t("admin.portfolio.draft")}
              </PillBadge>
              <span className="text-xs text-muted-foreground">{formatDate(preview.createdAt)}</span>
            </div>
            <p className="leading-8 text-foreground/85">{bi(preview.description)}</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          setPortfolio((list) => list.filter((p) => p.id !== toDelete.id));
          toast.success(t("admin.portfolio.deleted"));
        }}
        message={
          <>
            <p>{t("admin.common.deleteWarning")}</p>
            {toDelete && <p className="mt-2 font-bold text-navy">{bi(toDelete.title)}</p>}
          </>
        }
      />
    </div>
  );
}
