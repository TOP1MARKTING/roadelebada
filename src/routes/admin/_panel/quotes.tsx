import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, FileText, Phone, Trash2 } from "lucide-react";
import { useLang } from "@/i18n";
import { quoteStatuses, type QuoteRequest, type QuoteStatus } from "@/data/demo";
import { whatsappLink, telLink } from "@/config/site";
import { useAppData } from "@/store/app-data";
import { matches, validateAdminListSearch } from "@/lib/admin-search";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/site/Modal";
import { WhatsAppIcon } from "@/components/site/SocialIcon";
import {
  Card,
  ConfirmDialog,
  DemoNote,
  EmptyState,
  IconButton,
  PageHeader,
  PillBadge,
  QuoteStatusBadge,
  SearchInput,
  td,
  th,
} from "@/components/admin/ui";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/admin/_panel/quotes")({
  validateSearch: validateAdminListSearch,
  component: QuotesAdmin,
});

function QuotesAdmin() {
  const { t, bi, formatDate } = useLang();
  const { quotes, setQuotes, services } = useAppData();
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q ?? "");
  const [status, setStatus] = useState<"all" | QuoteStatus>("all");
  const [viewId, setViewId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<QuoteRequest | null>(null);
  useDocumentTitle(t("admin.quotes.title"));

  useEffect(() => {
    if (search.q !== undefined) setQ(search.q);
  }, [search.q]);

  const serviceName = (slug: string) =>
    slug === "other" ? t("svc.other") : bi(services.find((s) => s.slug === slug)?.title) || slug;

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: quotes.length };
    for (const x of quotes) c[x.status] = (c[x.status] ?? 0) + 1;
    return c;
  }, [quotes]);

  const filtered = useMemo(
    () =>
      [...quotes]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .filter((x) => matches(q, x.name, x.business) && (status === "all" || x.status === status)),
    [quotes, q, status],
  );

  const viewing = quotes.find((x) => x.id === viewId) ?? null;

  const changeStatus = (id: string, s: QuoteStatus) => {
    setQuotes((list) => list.map((x) => (x.id === id ? { ...x, status: s } : x)));
    toast.success(t("admin.quotes.statusUpdated"), { description: t(`admin.status.${s}`) });
  };

  const StatusSelect = ({ item, className }: { item: QuoteRequest; className?: string }) => (
    <select
      value={item.status}
      onChange={(e) => changeStatus(item.id, e.target.value as QuoteStatus)}
      aria-label={t("admin.quotes.changeStatus")}
      className={cn("field !min-h-9 !py-1.5 text-xs", className)}
    >
      {quoteStatuses.map((s) => (
        <option key={s} value={s}>
          {t(`admin.status.${s}`)}
        </option>
      ))}
    </select>
  );

  return (
    <div className="space-y-5">
      <PageHeader title={t("admin.quotes.title")} subtitle={t("admin.quotes.subtitle")} />
      <DemoNote>{t("admin.quotes.demoNote")}</DemoNote>

      <Card bodyClassName="p-0">
        <div className="space-y-3 border-b p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={q}
              onChange={setQ}
              placeholder={t("admin.quotes.search")}
              className="sm:max-w-xs sm:flex-1"
            />
            <p className="text-xs text-muted-foreground sm:ms-auto">
              {t("admin.common.resultsCount", { n: filtered.length })}
            </p>
          </div>
          <div className="scrollbar-thin -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
            {(["all", ...quoteStatuses] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                aria-pressed={status === s}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  status === s
                    ? "border-navy bg-navy text-white"
                    : "bg-white text-navy/70 hover:border-gold",
                )}
              >
                {s === "all" ? t("admin.quotes.filterAll") : t(`admin.status.${s}`)}
                <span
                  className={cn(
                    "rounded-full px-1.5 leading-4",
                    status === s ? "bg-gold text-navy" : "bg-muted",
                  )}
                >
                  {counts[s] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className={th}>{t("admin.quotes.customer")}</th>
                  <th className={th}>{t("admin.quotes.business")}</th>
                  <th className={th}>{t("admin.quotes.service")}</th>
                  <th className={th}>{t("admin.quotes.phone")}</th>
                  <th className={th}>{t("admin.quotes.date")}</th>
                  <th className={th}>{t("admin.quotes.status")}</th>
                  <th className={cn(th, "text-end")}>{t("admin.common.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((x) => (
                  <tr key={x.id} className="hover:bg-muted/30">
                    <td className={td}>
                      <p className="font-semibold text-navy">{x.name}</p>
                      <p className="mt-0.5">
                        {x.source === "demo" ? (
                          <span className="text-[0.68rem] text-muted-foreground">
                            {t("admin.common.sampleRow")}
                          </span>
                        ) : (
                          <PillBadge tone="blue">{t("admin.common.fromLocalForm")}</PillBadge>
                        )}
                      </p>
                    </td>
                    <td className={cn(td, "text-foreground/80")}>{x.business}</td>
                    <td className={cn(td, "text-foreground/80")}>{serviceName(x.service)}</td>
                    <td className={td}>
                      <a
                        href={telLink(x.phone)}
                        dir="ltr"
                        className="whitespace-nowrap text-navy hover:text-gold-strong"
                      >
                        {x.phone}
                      </a>
                    </td>
                    <td className={cn(td, "whitespace-nowrap text-muted-foreground")}>
                      {formatDate(x.createdAt)}
                    </td>
                    <td className={td}>
                      <div className="flex flex-col items-start gap-1.5">
                        <QuoteStatusBadge status={x.status} />
                      </div>
                    </td>
                    <td className={cn(td, "text-end")}>
                      <div className="inline-flex items-center gap-1">
                        <StatusSelect item={x} className="w-32" />
                        <IconButton
                          label={t("admin.quotes.detailsTitle")}
                          onClick={() => setViewId(x.id)}
                        >
                          <Eye className="size-4" />
                        </IconButton>
                        <IconButton
                          label={t("admin.common.delete")}
                          tone="danger"
                          onClick={() => setToDelete(x)}
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
            icon={FileText}
            title={t("admin.noResults")}
            description={t("admin.noResultsDesc")}
            action={
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setQ("");
                  setStatus("all");
                }}
              >
                {t("admin.common.clearFilters")}
              </button>
            }
          />
        )}
      </Card>

      <Modal
        open={!!viewing}
        onClose={() => setViewId(null)}
        size="lg"
        title={t("admin.quotes.detailsTitle")}
        description={viewing ? `#${viewing.id}` : undefined}
        footer={
          viewing && (
            <>
              <button
                type="button"
                className="btn btn-outline btn-sm me-auto text-red-700"
                onClick={() => {
                  setToDelete(viewing);
                  setViewId(null);
                }}
              >
                <Trash2 className="size-4" />
                {t("admin.common.delete")}
              </button>
              <button type="button" className="btn btn-navy btn-sm" onClick={() => setViewId(null)}>
                {t("admin.common.close")}
              </button>
            </>
          )
        }
      >
        {viewing && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-navy">{viewing.name}</p>
                <p className="text-sm text-muted-foreground">{viewing.business}</p>
              </div>
              <QuoteStatusBadge status={viewing.status} />
            </div>
            <dl className="grid gap-4 rounded-md bg-muted/50 p-4 text-sm sm:grid-cols-2">
              <Detail label={t("admin.quotes.service")} value={serviceName(viewing.service)} />
              <Detail
                label={t("admin.quotes.phone")}
                value={<span dir="ltr">{viewing.phone}</span>}
              />
              <Detail
                label={t("admin.quotes.fieldEmail")}
                value={viewing.email ? <span dir="ltr">{viewing.email}</span> : "—"}
              />
              <Detail
                label={t("admin.quotes.date")}
                value={formatDate(viewing.createdAt, { hour: "2-digit", minute: "2-digit" })}
              />
              <Detail label={t("admin.quotes.fieldBudget")} value={viewing.budget || "—"} />
              <Detail
                label={t("admin.quotes.fieldDeadline")}
                value={viewing.deadline ? formatDate(viewing.deadline) : "—"}
              />
            </dl>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                {t("admin.quotes.fieldDetails")}
              </p>
              <p className="mt-2 whitespace-pre-line rounded-md border p-4 leading-7">
                {viewing.details}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="q-status">
                  {t("admin.quotes.changeStatus")}
                </label>
                <select
                  id="q-status"
                  className="field"
                  value={viewing.status}
                  onChange={(e) => changeStatus(viewing.id, e.target.value as QuoteStatus)}
                >
                  {quoteStatuses.map((s) => (
                    <option key={s} value={s}>
                      {t(`admin.status.${s}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="field-label">{t("admin.quotes.contactCustomer")}</p>
                <div className="flex gap-2">
                  <a
                    href={telLink(viewing.phone)}
                    className="btn btn-outline btn-sm flex-1 !min-h-[2.875rem]"
                  >
                    <Phone className="size-4" />
                    {t("common.call")}
                  </a>
                  <a
                    href={whatsappLink(viewing.phone.replace(/^0/, "966"))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm flex-1 !min-h-[2.875rem]"
                  >
                    <WhatsAppIcon className="size-4" />
                    {t("common.whatsapp")}
                  </a>
                </div>
              </div>
            </div>
            {viewing.source === "demo" && <DemoNote>{t("admin.quotes.sampleEntry")}</DemoNote>}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          setQuotes((list) => list.filter((x) => x.id !== toDelete.id));
          toast.success(t("admin.quotes.deleted"));
        }}
        message={
          <>
            <p>{t("admin.common.deleteWarning")}</p>
            {toDelete && (
              <p className="mt-2 font-bold text-navy">
                {toDelete.name} — {toDelete.business}
              </p>
            )}
          </>
        }
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold text-navy">{value}</dd>
    </div>
  );
}
