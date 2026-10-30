export interface AdminListSearch {
  q?: string;
  new?: boolean;
}

/** `?q=` prefilled search and `?new=1` to open the add modal on admin list pages. */
export function validateAdminListSearch(s: Record<string, unknown>): AdminListSearch {
  const out: AdminListSearch = {};
  if (typeof s.q === "string" && s.q.trim()) out.q = s.q;
  if (s.new === true || s.new === 1 || s.new === "1" || s.new === "true") out.new = true;
  return out;
}

export const matches = (term: string, ...values: (string | undefined)[]) => {
  const t = term.trim().toLowerCase();
  return !t || values.some((v) => v?.toLowerCase().includes(t));
};
