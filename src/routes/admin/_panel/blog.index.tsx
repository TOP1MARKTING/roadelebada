import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { FilePenLine, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useLang } from "@/i18n";
import { blogCategoryLabel, type BlogPost } from "@/data/blog";
import { useAppData } from "@/store/app-data";
import { matches } from "@/lib/admin-search";
import {
  Card,
  ConfirmDialog,
  EmptyState,
  IconButton,
  PageHeader,
  PillBadge,
  SearchInput,
  td,
  th,
} from "@/components/admin/ui";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";
import { PermissionGate } from "@/components/admin/PermissionGate";

export const Route = createFileRoute("/admin/_panel/blog/")({
  component: BlogAdminList,
});

function BlogAdminList() {
  const { t, bi, formatDate } = useLang();
  const { posts, setPosts } = useAppData();
  const [q, setQ] = useState("");
  const [toDelete, setToDelete] = useState<BlogPost | null>(null);
  useDocumentTitle(t("admin.blog.title"));

  const filtered = useMemo(
    () =>
      [...posts]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .filter((p) => matches(q, p.title.ar, p.title.en, p.slug, p.tags.join(" "))),
    [posts, q],
  );

  return (
    <PermissionGate need="blog">
    <div>
      <PageHeader
        title={t("admin.blog.title")}
        subtitle={t("admin.blog.subtitle")}
        actions={
          <Link to="/admin/blog/$id" params={{ id: "new" }} className="btn btn-gold btn-sm">
            <Plus className="size-4" />
            {t("admin.blog.new")}
          </Link>
        }
      />
      <Card
        title={t("admin.blog.listTitle")}
        action={<SearchInput value={q} onChange={setQ} placeholder={t("admin.searchPlaceholder")} />}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={FilePenLine}
            title={t("admin.blog.empty")}
            action={
              <Link to="/admin/blog/$id" params={{ id: "new" }} className="btn btn-gold btn-sm">
                <Plus className="size-4" />
                {t("admin.blog.new")}
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[42rem] text-sm">
              <thead>
                <tr className="border-b bg-[#f8f8f9] text-start">
                  <th className={th}>{t("admin.blog.colTitle")}</th>
                  <th className={th}>{t("admin.blog.colCategory")}</th>
                  <th className={th}>{t("admin.blog.colStatus")}</th>
                  <th className={th}>{t("admin.blog.colUpdated")}</th>
                  <th className={th} />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className={td}>
                      <div className="flex items-start gap-2">
                        {p.featured && <Star className="mt-0.5 size-3.5 shrink-0 fill-gold text-gold" />}
                        <div className="min-w-0">
                          <p className="font-bold text-navy">{bi(p.title)}</p>
                          <p className="truncate text-xs text-muted-foreground">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className={td}>{bi(blogCategoryLabel[p.category])}</td>
                    <td className={td}>
                      <PillBadge tone={p.status === "published" ? "green" : "gray"}>
                        {p.status === "published" ? t("admin.blog.published") : t("admin.blog.draft")}
                      </PillBadge>
                    </td>
                    <td className={td}>{formatDate(p.updatedAt)}</td>
                    <td className={td}>
                      <div className="flex justify-end gap-1">
                        <Link
                          to="/admin/blog/$id"
                          params={{ id: p.id }}
                          className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-navy"
                          aria-label={t("common.edit")}
                          title={t("common.edit")}
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <IconButton label={t("common.delete")} onClick={() => setToDelete(p)} tone="danger">
                          <Trash2 className="size-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title={t("admin.blog.deleteTitle")}
        message={t("admin.blog.deleteConfirm")}
        confirmLabel={t("common.delete")}
        onConfirm={() => {
          if (!toDelete) return;
          setPosts((list) => list.filter((x) => x.id !== toDelete.id));
          toast.success(t("admin.blog.deleted"));
          setToDelete(null);
        }}
      />
    </div>
    </PermissionGate>
  );
}
