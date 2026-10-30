import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, type LinkProps } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FilePenLine,
  FileText,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelRightClose,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useLang } from "@/i18n";
import type { Permission } from "@/data/staff";
import { useAppData } from "@/store/app-data";
import { endDemoSession, resolveCurrentStaff, staffCan } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/site/Logo";
import { Dropdown } from "./ui";

type AdminPath = Extract<
  LinkProps["to"],
  | "/admin/dashboard"
  | "/admin/services"
  | "/admin/portfolio"
  | "/admin/quotes"
  | "/admin/messages"
  | "/admin/blog"
  | "/admin/staff"
  | "/admin/company"
  | "/admin/settings"
>;

const nav: {
  to: AdminPath;
  key: string;
  icon: typeof LayoutDashboard;
  permission: Permission;
}[] = [
  { to: "/admin/dashboard", key: "admin.menu.dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { to: "/admin/services", key: "admin.menu.services", icon: Sparkles, permission: "services" },
  { to: "/admin/portfolio", key: "admin.menu.portfolio", icon: Images, permission: "portfolio" },
  { to: "/admin/blog", key: "admin.menu.blog", icon: FilePenLine, permission: "blog" },
  { to: "/admin/quotes", key: "admin.menu.quotes", icon: FileText, permission: "quotes" },
  { to: "/admin/messages", key: "admin.menu.messages", icon: Inbox, permission: "messages" },
  { to: "/admin/staff", key: "admin.menu.staff", icon: Users, permission: "staff" },
  { to: "/admin/company", key: "admin.menu.company", icon: Building2, permission: "company" },
  { to: "/admin/settings", key: "admin.menu.website", icon: Settings, permission: "settings" },
];

const COLLAPSE_KEY = "rowad.admin.sidebarCollapsed";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { t, dir } = useLang();
  const { quotes, messages, staff } = useAppData();
  const me = resolveCurrentStaff(staff);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleNav = useMemo(
    () => nav.filter((n) => staffCan(me, n.permission)),
    [me],
  );

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = () =>
    setCollapsed((c) => {
      try {
        window.localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      } catch {
        /* ignore */
      }
      return !c;
    });

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const logout = () => {
    void endDemoSession().then(() => {
      navigate({ to: "/admin/login", replace: true });
    });
  };

  const counts: Partial<Record<AdminPath, number>> = {
    "/admin/quotes": quotes.filter((q) => q.status === "new").length,
    "/admin/messages": messages.filter((m) => !m.read).length,
  };

  const current = visibleNav.find((n) => location.pathname.startsWith(n.to));
  const Sep = dir === "rtl" ? ChevronLeft : ChevronRight;
  const CollapseIcon = dir === "rtl" ? PanelRightClose : PanelLeftClose;

  const sidebar = (isMobile: boolean) => {
    const compact = collapsed && !isMobile;
    return (
      <div className="flex h-full flex-col">
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-white/10",
            compact ? "justify-center px-2" : "justify-between px-4",
          )}
        >
          <Link to="/admin/dashboard" className="flex min-w-0 items-center gap-2.5">
            <LogoMark className="size-10" />
            {!compact && (
              <span className="min-w-0 leading-tight">
                <span className="block truncate font-display text-sm font-extrabold text-white">
                  {t("admin.brand")}
                </span>
                <span className="block truncate text-[0.68rem] text-gold">
                  {t("admin.dash.title")}
                </span>
              </span>
            )}
          </Link>
          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded p-2 text-white/70 hover:bg-white/10"
              aria-label={t("common.close")}
            >
              <X className="size-5" />
            </button>
          )}
        </div>
        <nav
          className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4"
          aria-label={t("admin.sidebar")}
        >
          <ul className="space-y-1">
            {visibleNav.map((n) => {
              const count = counts[n.to];
              return (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    title={compact ? t(n.key) : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white",
                      "data-[status=active]:bg-white/[0.08] data-[status=active]:text-white",
                      compact && "justify-center px-0",
                    )}
                  >
                    <span className="absolute inset-y-1.5 start-0 w-[3px] rounded-full bg-gold opacity-0 transition group-data-[status=active]:opacity-100" />
                    <n.icon className="size-[1.15rem] shrink-0 group-data-[status=active]:text-gold" />
                    {!compact && <span className="flex-1 truncate">{t(n.key)}</span>}
                    {!!count && (
                      <span
                        className={cn(
                          "flex min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[0.68rem] font-bold leading-5 text-navy",
                          compact && "absolute end-1.5 top-1 min-w-4 px-1 text-[0.6rem] leading-4",
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={compact ? t("admin.viewSite") : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white",
              compact && "justify-center px-0",
            )}
          >
            <ExternalLink className="size-[1.15rem] shrink-0" />
            {!compact && t("admin.viewSite")}
          </a>
          <button
            type="button"
            onClick={logout}
            title={compact ? t("admin.logout") : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/70 transition hover:bg-red-500/10 hover:text-red-300",
              compact && "justify-center px-0",
            )}
          >
            <LogOut className="size-[1.15rem] shrink-0 rtl:-scale-x-100" />
            {!compact && t("admin.logout")}
          </button>
          {!isMobile && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className={cn(
                "mt-2 hidden w-full items-center gap-3 rounded-md px-3 py-2 text-xs text-white/45 transition hover:text-white lg:flex",
                compact && "justify-center px-0",
              )}
              aria-label={collapsed ? t("admin.expandSidebar") : t("admin.collapseSidebar")}
              aria-pressed={collapsed}
            >
              <CollapseIcon
                className={cn("size-4 shrink-0 transition", collapsed && "rotate-180")}
              />
              {!compact && t("admin.collapseSidebar")}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-40 hidden bg-navy transition-[width] duration-300 lg:block",
          collapsed ? "w-[4.75rem]" : "w-64",
        )}
      >
        {sidebar(false)}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-dark/60 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={cn(
            "absolute inset-y-0 start-0 w-72 max-w-[85vw] bg-navy shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full",
          )}
          inert={!mobileOpen}
        >
          {sidebar(true)}
        </aside>
      </div>

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-300",
          collapsed ? "lg:ps-[4.75rem]" : "lg:ps-64",
        )}
      >
        <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-md text-navy hover:bg-muted lg:hidden"
              aria-label={t("nav.openMenu")}
            >
              <Menu className="size-5" />
            </button>
            <nav
              aria-label={t("common.breadcrumb")}
              className="hidden min-w-0 items-center gap-1.5 text-sm md:flex"
            >
              <Link to="/admin/dashboard" className="text-muted-foreground hover:text-navy">
                {t("admin.breadcrumbHome")}
              </Link>
              {current && current.to !== "/admin/dashboard" && (
                <>
                  <Sep className="size-3.5 text-muted-foreground/60" />
                  <span className="truncate font-semibold text-navy" aria-current="page">
                    {t(current.key)}
                  </span>
                </>
              )}
            </nav>
            <span className="truncate text-sm font-bold text-navy md:hidden">
              {current ? t(current.key) : ""}
            </span>
            <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
              <GlobalSearch />
              <Notifications />
              <ProfileMenu onLogout={logout} meName={me?.name} meEmail={me?.email} />
            </div>
          </div>
        </header>
        <main className="flex-1 px-3 py-6 sm:px-6 lg:px-8">{children}</main>
        <footer className="px-6 pb-6 text-center text-xs text-muted-foreground">
          {t("admin.demoAuthNote")}
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Search */

function GlobalSearch() {
  const { t, bi } = useLang();
  const { services, portfolio, quotes, messages, posts } = useAppData();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [mobile, setMobile] = useState(false);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const has = (...v: (string | undefined)[]) => v.some((x) => x?.toLowerCase().includes(term));
    return [
      ...services
        .filter((s) => has(s.title.ar, s.title.en))
        .map((s) => ({
          id: s.slug,
          label: bi(s.title),
          group: t("admin.menu.services"),
          to: "/admin/services" as const,
        })),
      ...portfolio
        .filter((p) => has(p.title.ar, p.title.en))
        .map((p) => ({
          id: p.id,
          label: bi(p.title),
          group: t("admin.menu.portfolio"),
          to: "/admin/portfolio" as const,
        })),
      ...posts
        .filter((p) => has(p.title.ar, p.title.en, p.slug))
        .map((p) => ({
          id: p.id,
          label: bi(p.title),
          group: t("admin.menu.blog"),
          to: "/admin/blog" as const,
        })),
      ...quotes
        .filter((x) => has(x.name, x.business))
        .map((x) => ({
          id: x.id,
          label: `${x.name} — ${x.business}`,
          group: t("admin.menu.quotes"),
          to: "/admin/quotes" as const,
        })),
      ...messages
        .filter((m) => has(m.name, m.subject))
        .map((m) => ({
          id: m.id,
          label: `${m.name} — ${m.subject}`,
          group: t("admin.menu.messages"),
          to: "/admin/messages" as const,
        })),
    ].slice(0, 8);
  }, [q, services, portfolio, posts, quotes, messages, bi, t]);

  const go = (to: (typeof results)[number]["to"]) => {
    navigate({ to, search: { q: q.trim() } });
    setQ("");
    setFocused(false);
    setMobile(false);
  };

  const box = (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results[0]) go(results[0].to);
          if (e.key === "Escape") {
            setQ("");
            setMobile(false);
          }
        }}
        placeholder={t("admin.searchPlaceholder")}
        aria-label={t("admin.searchPlaceholder")}
        autoFocus={mobile}
        className="h-10 w-full rounded-md border bg-muted/50 ps-9 pe-3 text-sm outline-none transition focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/20"
      />
      {focused && q.trim().length >= 2 && (
        <div className="animate-drop-in absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-lg border bg-card shadow-lift">
          {results.length ? (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r) => (
                <li key={`${r.group}-${r.id}`}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => go(r.to)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-start text-sm hover:bg-muted"
                  >
                    <span className="truncate text-navy">{r.label}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{r.group}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-center text-sm text-muted-foreground">
              {t("admin.noResults")}
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden w-56 md:block lg:w-72">{box}</div>
      <button
        type="button"
        onClick={() => setMobile(true)}
        className="inline-flex size-10 items-center justify-center rounded-md text-navy hover:bg-muted md:hidden"
        aria-label={t("admin.searchPlaceholder")}
      >
        <Search className="size-5" />
      </button>
      {mobile && (
        <div className="animate-drop-in fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-2 border-b bg-white px-3 md:hidden">
          {box}
          <button
            type="button"
            onClick={() => setMobile(false)}
            className="rounded p-2 text-muted-foreground"
            aria-label={t("common.close")}
          >
            <X className="size-5" />
          </button>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------ Notifications */

function Notifications() {
  const { t, formatDate } = useLang();
  const { quotes, messages, setMessages } = useAppData();
  const [seen, setSeen] = useState<string[]>([]);
  const navigate = useNavigate();

  const items = [
    ...quotes
      .filter((q) => q.status === "new" && !seen.includes(q.id))
      .map((q) => ({
        id: q.id,
        text: t("admin.notif.quotes", { name: q.name }),
        at: q.createdAt,
        to: "/admin/quotes" as const,
        icon: FileText,
        q: q.name,
      })),
    ...messages
      .filter((m) => !m.read && !seen.includes(m.id))
      .map((m) => ({
        id: m.id,
        text: t("admin.notif.messages", { name: m.name }),
        at: m.createdAt,
        to: "/admin/messages" as const,
        icon: Inbox,
        q: m.name,
      })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <Dropdown
      label={t("admin.notifications")}
      className="w-[min(22rem,calc(100vw-1.5rem))]"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={`${t("admin.notifications")} (${items.length})`}
          className="relative inline-flex size-10 items-center justify-center rounded-md text-navy hover:bg-muted"
        >
          <Bell className="size-5" />
          {items.length > 0 && (
            <span className="absolute end-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[0.6rem] font-bold leading-4 text-white">
              {items.length}
            </span>
          )}
        </button>
      )}
    >
      {(close) => (
        <div>
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-bold text-navy">{t("admin.notifications")}</p>
            {items.length > 0 && (
              <button
                type="button"
                className="text-xs font-semibold text-gold-strong hover:underline"
                onClick={() => {
                  setSeen((s) => [...s, ...items.map((i) => i.id)]);
                  setMessages((list) => list.map((m) => ({ ...m, read: true })));
                }}
              >
                {t("admin.notif.markAll")}
              </button>
            )}
          </div>
          {items.length ? (
            <ul className="max-h-80 divide-y overflow-y-auto">
              {items.slice(0, 8).map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      close();
                      navigate({ to: n.to, search: { q: n.q } });
                    }}
                    className="flex w-full items-start gap-3 px-4 py-3 text-start hover:bg-muted/60"
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-strong">
                      <n.icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-navy">{n.text}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {formatDate(n.at, { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              {t("admin.noNotifications")}
            </p>
          )}
          <p className="border-t bg-muted/40 px-4 py-2 text-center text-[0.7rem] text-muted-foreground">
            {t("admin.notif.demo")}
          </p>
        </div>
      )}
    </Dropdown>
  );
}

/* -------------------------------------------------------------- Profile */

function ProfileMenu({
  onLogout,
  meName,
  meEmail,
}: {
  onLogout: () => void;
  meName?: string;
  meEmail?: string;
}) {
  const { t } = useLang();
  const initial = (meName || t("admin.profileName")).trim().charAt(0) || "م";
  return (
    <Dropdown
      label={t("admin.profile")}
      className="w-60"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={t("admin.profile")}
          className="flex items-center gap-2 rounded-md p-1 hover:bg-muted"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-gold">
            {initial}
          </span>
        </button>
      )}
    >
      {(close) => (
        <div>
          <div className="border-b px-4 py-3">
            <p className="text-sm font-bold text-navy">{meName || t("admin.profileName")}</p>
            <p className="truncate text-xs text-muted-foreground" dir="ltr">
              {meEmail || ""}
            </p>
          </div>
          <div className="py-1 text-sm">
            <Link
              to="/admin/company"
              onClick={close}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2.5 text-navy hover:bg-muted"
            >
              <Building2 className="size-4 text-muted-foreground" />
              {t("admin.menu.company")}
            </Link>
            <Link
              to="/admin/staff"
              onClick={close}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2.5 text-navy hover:bg-muted"
            >
              <Users className="size-4 text-muted-foreground" />
              {t("admin.menu.staff")}
            </Link>
            <Link
              to="/admin/settings"
              onClick={close}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2.5 text-navy hover:bg-muted"
            >
              <Settings className="size-4 text-muted-foreground" />
              {t("admin.menu.website")}
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2.5 text-navy hover:bg-muted"
            >
              <ExternalLink className="size-4 text-muted-foreground" />
              {t("admin.viewSite")}
            </a>
          </div>
          <div className="border-t py-1">
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50"
            >
              <LogOut className="size-4 rtl:-scale-x-100" />
              {t("admin.logout")}
            </button>
          </div>
        </div>
      )}
    </Dropdown>
  );
}
