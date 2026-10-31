import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, Inbox, Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import { useLang } from "@/i18n";
import type { ContactMessage } from "@/data/demo";
import { telLink, whatsappLink } from "@/config/site";
import { useAppData } from "@/store/app-data";
import { matches, validateAdminListSearch } from "@/lib/admin-search";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/site/Modal";
import { WhatsAppIcon } from "@/components/site/SocialIcon";
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

export const Route = createFileRoute("/admin/_panel/messages")({
  validateSearch: validateAdminListSearch,
  component: MessagesAdmin,
});

type ReadFilter = "all" | "unread" | "read";

function MessagesAdmin() {
  const { t, formatDate } = useLang();
  const { messages, setMessages } = useAppData();
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q ?? "");
  const [filter, setFilter] = useState<ReadFilter>("all");
  const [viewId, setViewId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);
  useDocumentTitle(t("admin.messages.title"));

  useEffect(() => {
    if (search.q !== undefined) setQ(search.q);
  }, [search.q]);

  const filtered = useMemo(
    () =>
      [...messages]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .filter(
          (m) =>
            matches(q, m.name, m.subject, m.message, m.phone) &&
            (filter === "all" || (filter === "unread" ? !m.read : m.read)),
        ),
    [messages, q, filter],
  );

  const unread = messages.filter((m) => !m.read).length;
  const viewing = messages.find((m) => m.id === viewId) ?? null;

  const setRead = (id: string, read: boolean, notify = true) => {
    setMessages((list) => list.map((m) => (m.id === id ? { ...m, read } : m)));
    if (notify)
      toast.success(read ? t("admin.messages.markedRead") : t("admin.messages.markedUnread"));
  };

  const open = (m: ContactMessage) => {
    setViewId(m.id);
    if (!m.read) setRead(m.id, true, false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("admin.messages.title")}
        subtitle={t("admin.messages.subtitle")}
        actions={
          unread > 0 && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setMessages((list) => list.map((m) => ({ ...m, read: true })));
                toast.success(t("admin.messages.allRead"));
              }}
            >
              <MailOpen className="size-4" />
              {t("admin.notif.markAll")}
            </button>
          )
        }
      />
      <Card bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder={t("admin.messages.search")}
            className="sm:max-w-xs sm:flex-1"
          />
          <div role="tablist" className="inline-flex rounded-md border bg-muted/40 p-0.5 text-sm">
            {(["all", "unread", "read"] as ReadFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded px-3 py-1.5 font-medium transition",
                  filter === f
                    ? "bg-white text-navy shadow-sm"
                    : "text-muted-foreground hover:text-navy",
                )}
              >
                {f === "all" ? t("admin.messages.filterAll") : t(`admin.status.${f}`)}
                {f === "unread" && unread > 0 && (
                  <span className="ms-1.5 rounded-full bg-gold px-1.5 text-[0.65rem] font-bold text-navy">
                    {unread}
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground sm:ms-auto">
            {t("admin.common.resultsCount", { n: filtered.length })}
          </p>
        </div>

        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className={cn(th, "w-8")}>
                    <span className="sr-only">{t("admin.common.status")}</span>
                  </th>
                  <th className={th}>{t("admin.messages.customer")}</th>
                  <th className={th}>{t("admin.messages.phone")}</th>
                  <th className={th}>{t("admin.messages.subject")}</th>
                  <th className={cn(th, "hidden lg:table-cell")}>{t("admin.messages.message")}</th>
                  <th className={th}>{t("admin.common.date")}</th>
                  <th className={cn(th, "text-end")}>{t("admin.common.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    className={cn("cursor-pointer hover:bg-muted/30", !m.read && "bg-gold-soft/20")}
                    onClick={() => open(m)}
                  >
                    <td className={td}>
                      <span
                        className={cn(
                          "block size-2.5 rounded-full",
                          m.read ? "bg-slate-300" : "bg-gold",
                        )}
                        title={m.read ? t("admin.status.read") : t("admin.status.unread")}
                      />
                      <span className="sr-only">
                        {m.read ? t("admin.status.read") : t("admin.status.unread")}
                      </span>
                    </td>
                    <td className={td}>
                      <p className={cn("text-navy", !m.read ? "font-bold" : "font-medium")}>
                        {m.name}
                      </p>
                      {m.source === "form" && (
                        <PillBadge tone="blue">{t("admin.common.fromLocalForm")}</PillBadge>
                      )}
                    </td>
                    <td className={td}>
                      <span dir="ltr" className="whitespace-nowrap text-foreground/80">
                        {m.phone}
                      </span>
                    </td>
                    <td
                      className={cn(td, !m.read ? "font-semibold text-navy" : "text-foreground/80")}
                    >
                      {m.subject}
                    </td>
                    <td className={cn(td, "hidden max-w-xs lg:table-cell")}>
                      <p className="truncate text-muted-foreground">{m.message}</p>
                    </td>
                    <td className={cn(td, "whitespace-nowrap text-muted-foreground")}>
                      {formatDate(m.createdAt)}
                    </td>
                    <td className={cn(td, "text-end")} onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-0.5">
                        <IconButton label={t("admin.messages.viewMessage")} onClick={() => open(m)}>
                          <Eye className="size-4" />
                        </IconButton>
                        <IconButton
                          label={
                            m.read ? t("admin.messages.markUnread") : t("admin.messages.markRead")
                          }
                          onClick={() => setRead(m.id, !m.read)}
                        >
                          {m.read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                        </IconButton>
                        <IconButton
                          label={t("admin.common.delete")}
                          tone="danger"
                          onClick={() => setToDelete(m)}
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
            icon={Inbox}
            title={t("admin.noResults")}
            description={t("admin.noResultsDesc")}
            action={
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setQ("");
                  setFilter("all");
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
        size="md"
        title={viewing?.subject}
        description={
          viewing
            ? formatDate(viewing.createdAt, { hour: "2-digit", minute: "2-digit" })
            : undefined
        }
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
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setRead(viewing.id, !viewing.read)}
              >
                {viewing.read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                {viewing.read ? t("admin.messages.markUnread") : t("admin.messages.markRead")}
              </button>
            </>
          )
        }
      >
        {viewing && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-navy font-display font-bold text-gold">
                {viewing.name.trim().charAt(0)}
              </span>
              <div>
                <p className="font-bold text-navy">{viewing.name}</p>
                <p className="text-sm text-muted-foreground" dir="ltr">
                  {viewing.phone}
                </p>
              </div>
            </div>
            <p className="whitespace-pre-line rounded-md bg-muted/50 p-4 leading-8">
              {viewing.message}
            </p>
            <div className="flex gap-2">
              <a href={telLink(viewing.phone)} className="btn btn-outline btn-sm flex-1">
                <Phone className="size-4" />
                {t("common.call")}
              </a>
              <a
                href={whatsappLink(viewing.phone.replace(/^0/, "966"))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm flex-1"
              >
                <WhatsAppIcon className="size-4" />
                {t("common.whatsapp")}
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          setMessages((list) => list.filter((m) => m.id !== toDelete.id));
          toast.success(t("admin.messages.deleted"));
        }}
        message={
          <>
            <p>{t("admin.common.deleteWarning")}</p>
            {toDelete && (
              <p className="mt-2 font-bold text-navy">
                {toDelete.name} — {toDelete.subject}
              </p>
            )}
          </>
        }
      />
    </div>
  );
}
