export const permissions = [
  "dashboard",
  "services",
  "portfolio",
  "quotes",
  "messages",
  "company",
  "settings",
  "blog",
  "staff",
] as const;

export type Permission = (typeof permissions)[number];

export type StaffRole = "owner" | "admin" | "editor" | "sales" | "viewer";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  /** Demo-only plaintext password for local prototype */
  password: string;
  role: StaffRole;
  active: boolean;
  permissions: Permission[];
  createdAt: string;
}

export const rolePermissions: Record<StaffRole, Permission[]> = {
  owner: [...permissions],
  admin: ["dashboard", "services", "portfolio", "quotes", "messages", "company", "settings", "blog"],
  editor: ["dashboard", "portfolio", "blog", "services"],
  sales: ["dashboard", "quotes", "messages", "services"],
  viewer: ["dashboard"],
};

export const defaultStaff: StaffMember[] = [
  {
    id: "staff-owner",
    name: "مدير النظام",
    email: "admin@roadelebada.com",
    password: "Demo123!",
    role: "owner",
    active: true,
    permissions: [...permissions],
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

export function permissionsForRole(role: StaffRole): Permission[] {
  return [...rolePermissions[role]];
}

export function hasPermission(member: StaffMember | null | undefined, need: Permission) {
  if (!member || !member.active) return false;
  if (member.role === "owner") return true;
  return member.permissions.includes(need);
}
