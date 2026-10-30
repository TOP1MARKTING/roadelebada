import type { ReactNode } from "react";
import { useLang } from "@/i18n";
import type { Permission } from "@/data/staff";
import { resolveCurrentStaff, staffCan } from "@/lib/admin-auth";
import { useAppData } from "@/store/app-data";

export function PermissionGate({
  need,
  children,
}: {
  need: Permission;
  children: ReactNode;
}) {
  const { t } = useLang();
  const { staff } = useAppData();
  const me = resolveCurrentStaff(staff);
  if (staffCan(me, need)) return <>{children}</>;
  return (
    <div className="rounded-lg border bg-card p-8 text-center shadow-soft">
      <p className="font-bold text-navy">{t("admin.staff.noAccess")}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t("admin.staff.noAccessDesc")}</p>
    </div>
  );
}

export function useStaffPermission(need: Permission) {
  const { staff } = useAppData();
  const me = resolveCurrentStaff(staff);
  return { me, allowed: staffCan(me, need) };
}
