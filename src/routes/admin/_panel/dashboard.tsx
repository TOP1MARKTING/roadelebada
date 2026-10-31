import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ExternalLink,
  FilePenLine,
  FileText,
  ImagePlus,
  Images,
  Inbox,
  Plus,
  Sparkles,
} from "lucide-react";
import { useLang } from "@/i18n";
import { demoMonthly } from "@/data/demo";
import { publishedPosts } from "@/data/blog";
import { useAppData } from "@/store/app-data";
import { cn } from "@/lib/utils";
import {
  Card,
  DemoBadge,
  PageHeader,
  QuoteStatusBadge,
  td,
  th,
} from "@/components/admin/ui";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/admin/_panel/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { t, bi, formatDate, dir } = useLang();
  const { services, portfolio, quotes, messages, posts } = useAppData();
  useDocumentTitle(t("admin.dash.title"));
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const serviceName = (slug: string) =>
    slug === "other" ? t("svc.other") : bi(services.find((s) => s.slug === slug)?.title) || slug;

  const stats = [
    {
      label: t("admin.dash.statServices"),
      value: services.length,
      sub: t("admin.dash.visibleCount", { n: services.filter((s) => s.visible).length }),
      icon: Sparkles,
      to: "/admin/services" as const,
      accent: "bg-navy text-gold",
    },
    {
      label: t("admin.dash.statPortfolio"),
      value: portfolio.filter((p) => p.published).length,
      sub: t("admin.dash.totalCount", { n: portfolio.length }),
      icon: Images,
      to: "/admin/portfolio" as const,
      accent: "bg-gold-soft text-gold-strong",
    },
    {
      label: t("admin.menu.blog"),
      value: publishedPosts(posts).length,
      sub: t("admin.dash.totalCount", { n: posts.length }),
      icon: FilePenLine,
      to: "/admin/blog" as const,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      label: t("admin.dash.statQuotes"),
      value: quotes.length,
      sub: t("admin.dash.newCount", { n: quotes.filter((q) => q.status === "new").length }),
      icon: FileText,
      to: "/admin/quotes" as const,
      accent: "bg-sky-50 text-sky-700",
    },
    {
      label: t("admin.dash.statMessages"),
      value: messages.length,
      sub: t("admin.dash.unreadCount", { n: messages.filter((m) => !m.read).length }),
      icon: Inbox,
      to: "/admin/messages" as const,
      accent: "bg-emerald-50 text-emerald-700",
    },
  ];

  const monthly = demoMonthly.map((m) => ({
    month: t(`admin.month${m.month}`),
    [t("admin.dash.seriesQuotes")]: m.quotes,
    [t("admin.dash.seriesMessages")]: m.messages,
  }));

  const popular = useMemo(() => {
    const counts = new Map<string, number>();
    for (const q of quotes) counts.set(q.service, (counts.get(q.service) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([slug, count]) => ({ name: serviceName(slug), count }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotes, services, bi]);

  const recentQuotes = [...quotes]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
  const recentMessages = [...messages]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);

  const quickActions = [
    {
      label: t("admin.services.add"),
      icon: Plus,
      to: "/admin/services" as const,
      search: { new: true },
    },
    {
      label: t("admin.portfolio.add"),
      icon: ImagePlus,
      to: "/admin/portfolio" as const,
      search: { new: true },
    },
    {
      label: t("admin.blog.new"),
      icon: FilePenLine,
      to: "/admin/blog" as const,
      search: {},
    },
    {
      label: t("admin.dash.reviewQuotes"),
      icon: FileText,
      to: "/admin/quotes" as const,
      search: {},
    },
    { label: t("admin.menu.company"), icon: Building2, to: "/admin/company" as const, search: {} },
  ];

  const seriesQ = t("admin.dash.seriesQuotes");
  const seriesM = t("admin.dash.seriesMessages");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("admin.dash.title")}
        subtitle={t("admin.dash.subtitle")}
        actions={<DemoBadge />}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="group rounded-lg border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-2 font-display text-3xl font-extrabold text-navy">{s.value}</p>
              </div>
              <span className={cn("flex size-11 items-center justify-center rounded-md", s.accent)}>
                <s.icon className="size-5" />
              </span>
            </div>
            <p className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              {s.sub}
              <Arrow className="size-3.5 opacity-0 transition group-hover:opacity-100" />
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title={t("admin.dash.monthlyChart")} action={<DemoBadge />} className="xl:col-span-2">
          <div className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E0652E" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#E0652E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1C1E22" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#1C1E22" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  reversed={dir === "rtl"}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  orientation={dir === "rtl" ? "right" : "left"}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: "#e5e7eb",
                    fontFamily: "inherit",
                    fontSize: 13,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey={seriesQ}
                  stroke="#E0652E"
                  strokeWidth={2.5}
                  fill="url(#gq)"
                />
                <Area
                  type="monotone"
                  dataKey={seriesM}
                  stroke="#1C1E22"
                  strokeWidth={2}
                  fill="url(#gm)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title={t("admin.dash.popularServices")} action={<DemoBadge />}>
          {popular.length ? (
            <div className="h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={popular}
                  layout="vertical"
                  margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    reversed={dir === "rtl"}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={118}
                    tick={{ fontSize: 11, fill: "#1F2328" }}
                    axisLine={false}
                    tickLine={false}
                    orientation={dir === "rtl" ? "right" : "left"}
                  />
                  <Tooltip
                    cursor={{ fill: "rgb(213 166 74 / 0.08)" }}
                    contentStyle={{ borderRadius: 8, fontSize: 13 }}
                    formatter={(v) => [v, seriesQ]}
                  />
                  <Bar dataKey="count" fill="#1C1E22" radius={[4, 4, 4, 4]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-20 text-center text-sm text-muted-foreground">{t("admin.noData")}</p>
          )}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card
          title={t("admin.dash.recentQuotes")}
          className="xl:col-span-2"
          bodyClassName="p-0"
          action={
            <Link
              to="/admin/quotes"
              className="text-xs font-semibold text-gold-strong hover:underline"
            >
              {t("admin.dash.viewAll")}
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className={th}>{t("admin.quotes.customer")}</th>
                  <th className={th}>{t("admin.quotes.service")}</th>
                  <th className={th}>{t("admin.common.date")}</th>
                  <th className={th}>{t("admin.common.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-muted/30">
                    <td className={td}>
                      <p className="font-semibold text-navy">{q.name}</p>
                      <p className="text-xs text-muted-foreground">{q.business}</p>
                    </td>
                    <td className={cn(td, "text-foreground/80")}>{serviceName(q.service)}</td>
                    <td className={cn(td, "whitespace-nowrap text-muted-foreground")}>
                      {formatDate(q.createdAt)}
                    </td>
                    <td className={td}>
                      <QuoteStatusBadge status={q.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title={t("admin.dash.recentMessages")}
          bodyClassName="p-0"
          action={
            <Link
              to="/admin/messages"
              className="text-xs font-semibold text-gold-strong hover:underline"
            >
              {t("admin.dash.viewAll")}
            </Link>
          }
        >
          <ul className="divide-y">
            {recentMessages.map((m) => (
              <li key={m.id}>
                <Link
                  to="/admin/messages"
                  search={{ q: m.name }}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/30"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-gold">
                    {m.name.trim().charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={cn("truncate text-sm text-navy", !m.read && "font-bold")}>
                        {m.name}
                      </span>
                      {!m.read && (
                        <span
                          className="size-2 shrink-0 rounded-full bg-gold"
                          aria-label={t("admin.status.unread")}
                        />
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {m.subject}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title={t("admin.dash.quickActions")}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              search={a.search}
              className="flex items-center gap-3 rounded-md border px-4 py-3.5 text-sm font-semibold text-navy transition hover:border-gold hover:bg-gold-soft/30"
            >
              <a.icon className="size-4 text-gold-strong" />
              {a.label}
            </Link>
          ))}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md border px-4 py-3.5 text-sm font-semibold text-navy transition hover:border-gold hover:bg-gold-soft/30"
          >
            <ExternalLink className="size-4 text-gold-strong" />
            {t("admin.viewSite")}
          </a>
        </div>
      </Card>
    </div>
  );
}
