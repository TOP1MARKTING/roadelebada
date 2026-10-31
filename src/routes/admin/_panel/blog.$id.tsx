import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useLang } from "@/i18n";
import {
  blogCategories,
  blogCategoryLabel,
  slugify,
  type BlogCategory,
  type BlogPost,
  type BlogStatus,
} from "@/data/blog";
import { useAppData } from "@/store/app-data";
import { cn } from "@/lib/utils";
import { Field } from "@/components/site/Field";
import { Card, ImagePicker, PageHeader, Switch } from "@/components/admin/ui";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";
import { PermissionGate } from "@/components/admin/PermissionGate";

export const Route = createFileRoute("/admin/_panel/blog/$id")({
  component: BlogEditorPage,
});

type Draft = {
  titleAr: string;
  titleEn: string;
  slug: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  category: BlogCategory;
  authorId: string;
  tags: string;
  status: BlogStatus;
  featured: boolean;
  coverImage: string;
  coverImageEn: string;
  coverAltAr: string;
  coverAltEn: string;
  metaTitleAr: string;
  metaTitleEn: string;
  metaDescAr: string;
  metaDescEn: string;
  linkText: string;
  linkUrl: string;
  imageAlt: string;
  imageCaption: string;
  imageUrl: string;
};

const emptyDraft = (): Draft => ({
  titleAr: "",
  titleEn: "",
  slug: "",
  excerptAr: "",
  excerptEn: "",
  contentAr: "<p></p>",
  contentEn: "<p></p>",
  category: "web-design",
  authorId: "",
  tags: "",
  status: "draft",
  featured: false,
  coverImage: "",
  coverImageEn: "",
  coverAltAr: "",
  coverAltEn: "",
  metaTitleAr: "",
  metaTitleEn: "",
  metaDescAr: "",
  metaDescEn: "",
  linkText: "",
  linkUrl: "",
  imageAlt: "",
  imageCaption: "",
  imageUrl: "",
});

function postToDraft(p: BlogPost): Draft {
  return {
    titleAr: p.title.ar,
    titleEn: p.title.en,
    slug: p.slug,
    excerptAr: p.excerpt.ar,
    excerptEn: p.excerpt.en,
    contentAr: p.contentHtml.ar,
    contentEn: p.contentHtml.en,
    category: p.category,
    authorId: p.authorId ?? "",
    tags: p.tags.join(", "),
    status: p.status,
    featured: p.featured,
    coverImage: p.coverImage,
    coverImageEn: p.coverImageEn,
    coverAltAr: p.coverAlt.ar,
    coverAltEn: p.coverAlt.en,
    metaTitleAr: p.metaTitle.ar,
    metaTitleEn: p.metaTitle.en,
    metaDescAr: p.metaDescription.ar,
    metaDescEn: p.metaDescription.en,
    linkText: "",
    linkUrl: "",
    imageAlt: "",
    imageCaption: "",
    imageUrl: "",
  };
}

function BlogEditorPage() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const { t, bi, dir } = useLang();
  const { posts, setPosts, staff } = useAppData();
  const navigate = useNavigate();
  const Back = dir === "rtl" ? ArrowRight : ArrowLeft;
  const arRef = useRef<HTMLTextAreaElement>(null);
  const enRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [langTab, setLangTab] = useState<"ar" | "en">("ar");
  useDocumentTitle(isNew ? t("admin.blog.new") : t("admin.blog.edit"));

  useEffect(() => {
    if (isNew) {
      setDraft(emptyDraft());
      return;
    }
    const found = posts.find((p) => p.id === id);
    if (found) setDraft(postToDraft(found));
  }, [id, isNew, posts]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const headings = useMemoHeadings(langTab === "ar" ? draft.contentAr : draft.contentEn);

  function insertAtCursor(ref: HTMLTextAreaElement | null, html: string, field: "contentAr" | "contentEn") {
    if (!ref) {
      set(field, (draft[field] || "") + html);
      return;
    }
    const start = ref.selectionStart ?? ref.value.length;
    const end = ref.selectionEnd ?? start;
    const next = ref.value.slice(0, start) + html + ref.value.slice(end);
    set(field, next);
    requestAnimationFrame(() => {
      ref.focus();
      const pos = start + html.length;
      ref.setSelectionRange(pos, pos);
    });
  }

  function wrapSelection(ref: HTMLTextAreaElement | null, before: string, after: string, field: "contentAr" | "contentEn") {
    if (!ref) return;
    const start = ref.selectionStart ?? 0;
    const end = ref.selectionEnd ?? 0;
    const selected = ref.value.slice(start, end) || draft.linkText || "نص";
    const html = `${before}${selected}${after}`;
    const next = ref.value.slice(0, start) + html + ref.value.slice(end);
    set(field, next);
  }

  function insertExternalLink() {
    const ref = langTab === "ar" ? arRef.current : enRef.current;
    const field = langTab === "ar" ? "contentAr" : "contentEn";
    if (!draft.linkUrl.trim()) {
      toast.error(t("admin.blog.linkRequired"));
      return;
    }
    const label = draft.linkText.trim();
    if (ref && ref.selectionStart !== ref.selectionEnd) {
      wrapSelection(ref, `<a href="${draft.linkUrl.trim()}" target="_blank" rel="noopener noreferrer">`, "</a>", field);
    } else {
      const text = label || draft.linkUrl.trim();
      insertAtCursor(
        ref,
        `<a href="${draft.linkUrl.trim()}" target="_blank" rel="noopener noreferrer">${text}</a>`,
        field,
      );
    }
    set("linkText", "");
    set("linkUrl", "");
    toast.success(t("admin.blog.linkInserted"));
  }

  function insertInternalLink(anchor: string) {
    const ref = langTab === "ar" ? arRef.current : enRef.current;
    const field = langTab === "ar" ? "contentAr" : "contentEn";
    const label = draft.linkText.trim() || anchor;
    if (ref && ref.selectionStart !== ref.selectionEnd) {
      wrapSelection(ref, `<a href="#${anchor}">`, "</a>", field);
    } else {
      insertAtCursor(ref, `<a href="#${anchor}">${label}</a>`, field);
    }
    toast.success(t("admin.blog.linkInserted"));
  }

  function insertImage(at: "cursor" | "end") {
    const ref = langTab === "ar" ? arRef.current : enRef.current;
    const field = langTab === "ar" ? "contentAr" : "contentEn";
    if (!draft.imageUrl.trim()) {
      toast.error(t("admin.blog.imageRequired"));
      return;
    }
    const alt = draft.imageAlt.trim() || "image";
    const caption = draft.imageCaption.trim();
    const html = caption
      ? `<figure><img src="${draft.imageUrl.trim()}" alt="${alt}" /><figcaption>${caption}</figcaption></figure>`
      : `<p><img src="${draft.imageUrl.trim()}" alt="${alt}" /></p>`;
    if (at === "end") set(field, `${draft[field]}\n${html}`);
    else insertAtCursor(ref, html, field);
    toast.success(t("admin.blog.imageInserted"));
  }

  function validate() {
    const er: Partial<Record<keyof Draft, string>> = {};
    if (!draft.titleAr.trim()) er.titleAr = t("common.required");
    if (!draft.slug.trim()) er.slug = t("common.required");
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) er.slug = t("admin.blog.slugInvalid");
    else {
      const clash = posts.some((p) => p.slug === draft.slug && (isNew || p.id !== id));
      if (clash) er.slug = t("admin.blog.slugTaken");
    }
    if (!draft.contentAr.trim() || draft.contentAr.trim() === "<p></p>") er.contentAr = t("common.required");
    setErrors(er);
    return Object.keys(er).length === 0;
  }

  function save(e?: FormEvent) {
    e?.preventDefault();
    if (!validate()) {
      toast.error(t("admin.blog.fixErrors"));
      return;
    }
    const now = new Date().toISOString();
    const tags = draft.tags
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const payload: Omit<BlogPost, "id" | "createdAt"> = {
      slug: draft.slug.trim(),
      title: { ar: draft.titleAr.trim(), en: draft.titleEn.trim() },
      excerpt: { ar: draft.excerptAr.trim(), en: draft.excerptEn.trim() },
      contentHtml: { ar: draft.contentAr, en: draft.contentEn },
      category: draft.category,
      authorId: draft.authorId || null,
      tags,
      status: draft.status,
      featured: draft.featured,
      coverImage: draft.coverImage.trim(),
      coverImageEn: draft.coverImageEn.trim(),
      coverAlt: { ar: draft.coverAltAr.trim(), en: draft.coverAltEn.trim() },
      metaTitle: { ar: draft.metaTitleAr.trim(), en: draft.metaTitleEn.trim() },
      metaDescription: { ar: draft.metaDescAr.trim(), en: draft.metaDescEn.trim() },
      updatedAt: now,
      publishedAt: draft.status === "published" ? now : null,
    };

    if (isNew) {
      const created: BlogPost = {
        ...payload,
        id: `post-${Date.now().toString(36)}`,
        createdAt: now,
        publishedAt: draft.status === "published" ? now : null,
      };
      setPosts((list) => [created, ...list]);
      toast.success(t("admin.blog.saved"), { description: t("admin.common.savedLocally") });
      navigate({ to: "/admin/blog/$id", params: { id: created.id }, replace: true });
    } else {
      setPosts((list) =>
        list.map((p) =>
          p.id === id
            ? {
                ...p,
                ...payload,
                createdAt: p.createdAt,
                publishedAt:
                  draft.status === "published" ? (p.publishedAt ?? now) : null,
              }
            : p,
        ),
      );
      toast.success(t("admin.blog.saved"), { description: t("admin.common.savedLocally") });
    }
  }

  if (!isNew && !posts.some((p) => p.id === id)) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="font-bold text-navy">{t("admin.blog.notFound")}</p>
        <Link to="/admin/blog" className="btn btn-outline btn-sm mt-4">
          {t("admin.blog.back")}
        </Link>
      </div>
    );
  }

  const contentField = langTab === "ar" ? "contentAr" : "contentEn";
  const contentRef = langTab === "ar" ? arRef : enRef;

  return (
    <PermissionGate need="blog">
    <form onSubmit={save}>
      <PageHeader
        title={isNew ? t("admin.blog.new") : t("admin.blog.edit")}
        subtitle={t("admin.blog.editorSubtitle")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/blog" className="btn btn-outline btn-sm">
              <Back className="size-4" />
              {t("admin.blog.back")}
            </Link>
            <button type="submit" className="btn btn-gold btn-sm">
              <Save className="size-4" />
              {t("admin.blog.save")}
            </button>
          </div>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <Card title={t("admin.blog.basics")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="b-title-ar" label={t("admin.blog.titleAr")} error={errors.titleAr}>
                <input
                  id="b-title-ar"
                  className="field"
                  value={draft.titleAr}
                  onChange={(e) => {
                    set("titleAr", e.target.value);
                    if (isNew && !draft.slug) set("slug", slugify(e.target.value) || slugify(draft.titleEn));
                  }}
                />
              </Field>
              <Field id="b-title-en" label={t("admin.blog.titleEn")} optional>
                <input
                  id="b-title-en"
                  className="field"
                  value={draft.titleEn}
                  onChange={(e) => {
                    set("titleEn", e.target.value);
                    if (isNew && !draft.slug) set("slug", slugify(e.target.value) || slugify(draft.titleAr));
                  }}
                />
              </Field>
              <Field id="b-slug" label={t("admin.blog.slug")} error={errors.slug} hint={t("admin.blog.slugHint")}>
                <input
                  id="b-slug"
                  className="field font-mono text-sm"
                  value={draft.slug}
                  onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                />
              </Field>
              <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                <Field id="b-ex-ar" label={t("admin.blog.excerptAr")} optional>
                  <textarea
                    id="b-ex-ar"
                    className="field min-h-24"
                    value={draft.excerptAr}
                    onChange={(e) => set("excerptAr", e.target.value)}
                  />
                </Field>
                <Field id="b-ex-en" label={t("admin.blog.excerptEn")} optional>
                  <textarea
                    id="b-ex-en"
                    className="field min-h-24"
                    value={draft.excerptEn}
                    onChange={(e) => set("excerptEn", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </Card>

          <Card
            title={t("admin.blog.content")}
            action={
              <div className="flex gap-1 rounded-md border p-0.5">
                {(["ar", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={cn(
                      "rounded px-2.5 py-1 text-xs font-bold",
                      langTab === l ? "bg-navy text-white" : "text-muted-foreground hover:bg-muted",
                    )}
                    onClick={() => setLangTab(l)}
                  >
                    {l === "ar" ? "عربي" : "EN"}
                  </button>
                ))}
              </div>
            }
          >
            <div className="space-y-4">
              <p className="text-xs leading-5 text-muted-foreground">{t("admin.blog.contentHint")}</p>
              <Field
                id={`b-content-${langTab}`}
                label={langTab === "ar" ? t("admin.blog.contentAr") : t("admin.blog.contentEn")}
                error={langTab === "ar" ? errors.contentAr : undefined}
              >
                <textarea
                  id={`b-content-${langTab}`}
                  ref={contentRef}
                  className="field min-h-[18rem] font-mono text-[0.85rem] leading-6"
                  value={draft[contentField]}
                  onChange={(e) => set(contentField, e.target.value)}
                  dir={langTab === "ar" ? "rtl" : "ltr"}
                />
              </Field>

              <div className="rounded-lg border bg-[#fafafa] p-4">
                <p className="text-sm font-bold text-navy">{t("admin.blog.extLinks")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("admin.blog.extLinksHint")}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    className="field"
                    placeholder={t("admin.blog.linkLabel")}
                    value={draft.linkText}
                    onChange={(e) => set("linkText", e.target.value)}
                  />
                  <input
                    className="field"
                    placeholder="https://"
                    value={draft.linkUrl}
                    onChange={(e) => set("linkUrl", e.target.value)}
                  />
                  <button type="button" className="btn btn-outline btn-sm" onClick={insertExternalLink}>
                    {t("admin.blog.insertLink")}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border bg-[#fafafa] p-4">
                <p className="text-sm font-bold text-navy">{t("admin.blog.intLinks")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("admin.blog.intLinksHint")}</p>
                {headings.length === 0 ? (
                  <p className="mt-3 text-xs text-muted-foreground">{t("admin.blog.noHeadings")}</p>
                ) : (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <button
                          type="button"
                          className="rounded-full border bg-white px-3 py-1 text-xs font-semibold text-navy hover:border-gold"
                          onClick={() => insertInternalLink(h.id)}
                        >
                          {h.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-lg border bg-[#fafafa] p-4">
                <p className="text-sm font-bold text-navy">{t("admin.blog.inlineImages")}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field id="img-alt" label={t("admin.blog.imageAlt")} optional>
                    <input className="field" value={draft.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} />
                  </Field>
                  <Field id="img-cap" label={t("admin.blog.imageCaption")} optional>
                    <input
                      className="field"
                      value={draft.imageCaption}
                      onChange={(e) => set("imageCaption", e.target.value)}
                    />
                  </Field>
                </div>
                <div className="mt-3">
                  <p className="field-label">{t("admin.blog.imageUrl")}</p>
                  <ImagePicker value={draft.imageUrl} onChange={(v) => set("imageUrl", v)} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => insertImage("cursor")}>
                    {t("admin.blog.insertAtCursor")}
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => insertImage("end")}>
                    {t("admin.blog.insertAtEnd")}
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card title={t("admin.blog.seo")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="mt-ar" label={t("admin.blog.metaTitleAr")} optional>
                <input className="field" value={draft.metaTitleAr} onChange={(e) => set("metaTitleAr", e.target.value)} />
              </Field>
              <Field id="mt-en" label={t("admin.blog.metaTitleEn")} optional>
                <input className="field" value={draft.metaTitleEn} onChange={(e) => set("metaTitleEn", e.target.value)} />
              </Field>
              <Field id="md-ar" label={t("admin.blog.metaDescAr")} optional>
                <textarea className="field min-h-24" value={draft.metaDescAr} onChange={(e) => set("metaDescAr", e.target.value)} />
              </Field>
              <Field id="md-en" label={t("admin.blog.metaDescEn")} optional>
                <textarea className="field min-h-24" value={draft.metaDescEn} onChange={(e) => set("metaDescEn", e.target.value)} />
              </Field>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title={t("admin.blog.publish")}>
            <div className="space-y-4">
              <Field id="b-cat" label={t("admin.blog.category")}>
                <select
                  id="b-cat"
                  className="field"
                  value={draft.category}
                  onChange={(e) => set("category", e.target.value as BlogCategory)}
                >
                  {blogCategories.map((c) => (
                    <option key={c} value={c}>
                      {bi(blogCategoryLabel[c])}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="b-author" label={t("admin.blog.author")} optional>
                <select
                  id="b-author"
                  className="field"
                  value={draft.authorId}
                  onChange={(e) => set("authorId", e.target.value)}
                >
                  <option value="">{t("admin.blog.noAuthor")}</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="b-tags" label={t("admin.blog.tags")} optional hint={t("admin.blog.tagsHint")}>
                <input className="field" value={draft.tags} onChange={(e) => set("tags", e.target.value)} />
              </Field>
              <Field id="b-status" label={t("admin.blog.status")}>
                <select
                  id="b-status"
                  className="field"
                  value={draft.status}
                  onChange={(e) => set("status", e.target.value as BlogStatus)}
                >
                  <option value="draft">{t("admin.blog.draft")}</option>
                  <option value="published">{t("admin.blog.published")}</option>
                </select>
              </Field>
              <div className="flex items-start justify-between gap-3 rounded-lg border px-3 py-3">
                <div>
                  <p className="text-sm font-bold text-navy">{t("admin.blog.featured")}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t("admin.blog.featuredDesc")}</p>
                </div>
                <Switch
                  checked={draft.featured}
                  onChange={(v) => set("featured", v)}
                  label={t("admin.blog.featured")}
                />
              </div>
            </div>
          </Card>

          <Card title={t("admin.blog.cover")}>
            <div className="space-y-4">
              <div>
                <p className="field-label">{t("admin.blog.coverAr")}</p>
                <ImagePicker value={draft.coverImage} onChange={(v) => set("coverImage", v)} />
              </div>
              <div>
                <p className="field-label">{t("admin.blog.coverEn")}</p>
                <ImagePicker value={draft.coverImageEn} onChange={(v) => set("coverImageEn", v)} />
              </div>
              <Field id="ca-ar" label={t("admin.blog.coverAltAr")} optional>
                <input className="field" value={draft.coverAltAr} onChange={(e) => set("coverAltAr", e.target.value)} />
              </Field>
              <Field id="ca-en" label={t("admin.blog.coverAltEn")} optional>
                <input className="field" value={draft.coverAltEn} onChange={(e) => set("coverAltEn", e.target.value)} />
              </Field>
            </div>
          </Card>

          <button type="submit" className="btn btn-gold w-full">
            <Save className="size-4" />
            {t("admin.blog.save")}
          </button>
        </div>
      </div>
    </form>
    </PermissionGate>
  );
}

function useMemoHeadings(html: string) {
  return useMemo(() => {
    const matches = [...html.matchAll(/<h([23])[^>]*>(.*?)<\/h\1>/gi)];
    return matches.map((m, i) => {
      const text = m[2].replace(/<[^>]+>/g, "").trim();
      const id = slugify(text) || `section-${i + 1}`;
      return { id, text: text || `H${m[1]}` };
    });
  }, [html]);
}
