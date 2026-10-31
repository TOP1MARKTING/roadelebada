import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useLang } from "@/i18n";
import {
  permissionsForRole,
  type Permission,
  type StaffMember,
  type StaffRole,
} from "@/data/staff";
import { resolveCurrentStaff, staffCan } from "@/lib/admin-auth";
import { useAppData } from "@/store/app-data";
import { matches } from "@/lib/admin-search";
import { isValidEmail } from "@/lib/validation";
import { Modal } from "@/components/site/Modal";
import { Field } from "@/components/site/Field";
import {
  Card,
  ConfirmDialog,
  EmptyState,
  IconButton,
  PageHeader,
  PillBadge,
  SearchInput,
  Switch,
  td,
  th,
} from "@/components/admin/ui";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/admin/_panel/staff")({
  component: StaffAdminPage,
});

type Draft = {
  name: string;
  email: string;
  password: string;
  role: StaffRole;
  active: boolean;
};

const emptyDraft = (): Draft => ({
  name: "",
  email: "",
  password: "",
  role: "editor",
  active: true,
});

function StaffAdminPage() {
  const { t, formatDate } = useLang();
  const { staff, setStaff } = useAppData();
  const me = resolveCurrentStaff(staff);
  const canManage = staffCan(me, "staff");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [toDelete, setToDelete] = useState<StaffMember | null>(null);
  useDocumentTitle(t("admin.staff.title"));

  const filtered = useMemo(
    () =>
      [...staff]
        .sort((a, b) => a.name.localeCompare(b.name, "ar"))
        .filter((s) => matches(q, s.name, s.email, s.role)),
    [staff, q],
  );

  if (!canManage) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="font-bold text-navy">{t("admin.staff.noAccess")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("admin.staff.noAccessDesc")}</p>
      </div>
    );
  }

  function openAdd() {
    setEditing(null);
    setDraft(emptyDraft());
    setErrors({});
    setOpen(true);
  }

  function openEdit(m: StaffMember) {
    setEditing(m.id);
    setDraft({
      name: m.name,
      email: m.email,
      password: m.password,
      role: m.role,
      active: m.active,
    });
    setErrors({});
    setOpen(true);
  }

  function save() {
    const er: Partial<Record<keyof Draft, string>> = {};
    if (!draft.name.trim()) er.name = t("common.required");
    if (!draft.email.trim()) er.email = t("common.required");
    else if (!isValidEmail(draft.email)) er.email = t("form.emailInvalid");
    else {
      const clash = staff.some(
        (s) => s.email.toLowerCase() === draft.email.trim().toLowerCase() && s.id !== editing,
      );
      if (clash) er.email = t("admin.staff.emailTaken");
    }
    if (!draft.password || draft.password.length < 6) er.password = t("admin.passwordShort");
    setErrors(er);
    if (Object.keys(er).length) return;

    const perms = permissionsForRole(draft.role);
    if (editing) {
      setStaff((list) =>
        list.map((s) =>
          s.id === editing
            ? {
                ...s,
                name: draft.name.trim(),
                email: draft.email.trim().toLowerCase(),
                password: draft.password,
                role: draft.role,
                active: draft.active,
                permissions: perms,
              }
            : s,
        ),
      );
    } else {
      const member: StaffMember = {
        id: `staff-${Date.now().toString(36)}`,
        name: draft.name.trim(),
        email: draft.email.trim().toLowerCase(),
        password: draft.password,
        role: draft.role,
        active: draft.active,
        permissions: perms,
        createdAt: new Date().toISOString(),
      };
      setStaff((list) => [member, ...list]);
    }
    toast.success(t("admin.staff.saved"), { description: t("admin.common.savedLocally") });
    setOpen(false);
  }

  const roleLabel = (r: StaffRole) => t(`admin.staff.role.${r}` as "admin.staff.role.owner");
  const permLabel = (p: Permission) => t(`admin.staff.perm.${p}` as "admin.staff.perm.dashboard");

  return (
    <div>
      <PageHeader
        title={t("admin.staff.title")}
        subtitle={t("admin.staff.subtitle")}
        actions={
          <button type="button" className="btn btn-gold btn-sm" onClick={openAdd}>
            <Plus className="size-4" />
            {t("admin.staff.add")}
          </button>
        }
      />
      <Card
        title={t("admin.staff.listTitle")}
        action={<SearchInput value={q} onChange={setQ} placeholder={t("admin.searchPlaceholder")} />}
      >
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title={t("admin.staff.empty")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="border-b bg-[#f8f8f9] text-start">
                  <th className={th}>{t("admin.staff.colName")}</th>
                  <th className={th}>{t("admin.staff.colRole")}</th>
                  <th className={th}>{t("admin.staff.colStatus")}</th>
                  <th className={th}>{t("admin.staff.colCreated")}</th>
                  <th className={th} />
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className={td}>
                      <p className="font-bold text-navy">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </td>
                    <td className={td}>
                      <PillBadge tone="gold">{roleLabel(s.role)}</PillBadge>
                      <p className="mt-1 max-w-[14rem] text-[0.68rem] leading-4 text-muted-foreground">
                        {s.permissions.map(permLabel).join(" · ")}
                      </p>
                    </td>
                    <td className={td}>
                      <PillBadge tone={s.active ? "green" : "gray"}>
                        {s.active ? t("admin.staff.active") : t("admin.staff.inactive")}
                      </PillBadge>
                    </td>
                    <td className={td}>{formatDate(s.createdAt)}</td>
                    <td className={td}>
                      <div className="flex justify-end gap-1">
                        <IconButton label={t("common.edit")} onClick={() => openEdit(s)}>
                          <Pencil className="size-4" />
                        </IconButton>
                        <IconButton
                          label={t("common.delete")}
                          tone="danger"
                          disabled={s.role === "owner" || s.id === me?.id}
                          onClick={() => setToDelete(s)}
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
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? t("admin.staff.edit") : t("admin.staff.add")}
        size="md"
        footer={
          <>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>
              {t("admin.common.cancel")}
            </button>
            <button type="button" className="btn btn-gold btn-sm" onClick={save}>
              {t("admin.common.saveChanges")}
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <Field id="st-name" label={t("admin.staff.name")} error={errors.name}>
            <input
              id="st-name"
              className="field"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
          </Field>
          <Field id="st-email" label={t("admin.email")} error={errors.email}>
            <input
              id="st-email"
              className="field"
              type="email"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
            />
          </Field>
          <Field id="st-pass" label={t("admin.password")} error={errors.password}>
            <input
              id="st-pass"
              className="field"
              type="text"
              value={draft.password}
              onChange={(e) => setDraft((d) => ({ ...d, password: e.target.value }))}
            />
          </Field>
          <Field id="st-role" label={t("admin.staff.roleLabel")}>
            <select
              id="st-role"
              className="field"
              value={draft.role}
              onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value as StaffRole }))}
            >
              {(["owner", "admin", "editor", "sales", "viewer"] as StaffRole[]).map((r) => (
                <option key={r} value={r}>
                  {roleLabel(r)}
                </option>
              ))}
            </select>
          </Field>
          <p className="text-xs text-muted-foreground">
            {t("admin.staff.permsPreview")}: {permissionsForRole(draft.role).map(permLabel).join(" · ")}
          </p>
          <div className="flex items-center justify-between rounded-lg border px-3 py-3">
            <p className="text-sm font-bold text-navy">{t("admin.staff.active")}</p>
            <Switch
              checked={draft.active}
              onChange={(v) => setDraft((d) => ({ ...d, active: v }))}
              label={t("admin.staff.active")}
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title={t("admin.staff.deleteTitle")}
        message={t("admin.staff.deleteConfirm")}
        confirmLabel={t("common.delete")}
        onConfirm={() => {
          if (!toDelete) return;
          setStaff((list) => list.filter((x) => x.id !== toDelete.id));
          toast.success(t("admin.staff.deleted"));
          setToDelete(null);
        }}
      />
    </div>
  );
}
