import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  FlaskConical,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useLang } from "@/i18n";
import { img } from "@/lib/assets";
import { seo } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { isValidEmail } from "@/lib/validation";
import {
  findStaffByCredentials,
  hasDemoSession,
  rememberedEmail,
  signInAdmin,
  startDemoSession,
} from "@/lib/admin-auth";
import { useAppData } from "@/store/app-data";
import { Logo } from "@/components/site/Logo";
import { SmartImage } from "@/components/site/SmartImage";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/admin/login")({
  head: () =>
    seo({
      title: "تسجيل الدخول — لوحة التحكم",
      description: "لوحة تحكم تجريبية.",
      path: "/admin/login",
      noindex: true,
    }),
  component: LoginPage,
});

function LoginPage() {
  const { t, dir } = useLang();
  const { staff, seedCloud } = useAppData();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  useDocumentTitle(t("admin.loginTitle"));
  const Back = dir === "rtl" ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (hasDemoSession()) navigate({ to: "/admin/dashboard", replace: true });
    const saved = rememberedEmail();
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (!email.trim()) er.email = t("common.required");
    else if (!isValidEmail(email)) er.email = t("form.emailInvalid");
    if (!password) er.password = t("common.required");
    else if (password.length < 6) er.password = t("admin.passwordShort");
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      await signInAdmin(email, password);
      const member = findStaffByCredentials(staff, email, password);
      startDemoSession({
        rememberEmail: remember ? email.trim() : "",
        staffId: member?.id ?? "staff-owner",
      });
      try {
        await seedCloud();
      } catch {
        /* seed may already exist or rules not deployed yet */
      }
      navigate({ to: "/admin/dashboard", replace: true });
    } catch {
      setErrors({ form: t("admin.invalidCredentials") });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(siteConfig.demoAdmin.email);
    setPassword(siteConfig.demoAdmin.password);
    setErrors({});
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy lg:block">
        <SmartImage
          src={img("studio-press")}
          alt=""
          aria-hidden
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-navy/70 to-navy/30" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo />
          <div>
            <p className="kicker !text-gold">{t("admin.dash.title")}</p>
            <h2 className="mt-4 max-w-md text-4xl font-extrabold leading-tight">
              {t("admin.loginHeadline")}
            </h2>
            <p className="mt-4 max-w-md leading-7 text-white/70">{t("admin.loginSub")}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy"
          >
            <Back className="size-4" />
            {t("admin.backToSite")}
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="lg:hidden">
            <Logo variant="dark" />
          </div>
          <h1 className="mt-8 text-3xl font-extrabold text-navy lg:mt-0">
            {t("admin.loginTitle")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("admin.loginDesc")}</p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            {errors.form && (
              <div
                role="alert"
                className="animate-drop-in flex items-center gap-2.5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                <AlertCircle className="size-4 shrink-0" />
                {errors.form}
              </div>
            )}
            <div>
              <label htmlFor="email" className="field-label">
                {t("admin.email")}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  dir="ltr"
                  autoComplete="username"
                  className="field ps-10 text-start"
                  placeholder="admin@demo.local"
                  value={email}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((er) => ({ ...er, email: undefined, form: undefined }));
                  }}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="field-error">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="field-label">
                {t("admin.password")}
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  dir="ltr"
                  autoComplete="current-password"
                  className="field pe-11 ps-10 text-start"
                  value={password}
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((er) => ({ ...er, password: undefined, form: undefined }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute end-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:text-navy"
                  aria-label={show ? t("admin.hide") : t("admin.show")}
                  aria-pressed={show}
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="field-error">
                  {errors.password}
                </p>
              )}
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-navy">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 rounded border-border accent-[#1C1E22]"
              />
              {t("admin.remember")}
            </label>
            <button type="submit" disabled={loading} className="btn btn-navy w-full">
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? t("admin.loggingIn") : t("admin.loginBtn")}
            </button>
          </form>

          <div className="mt-8 rounded-lg border border-dashed border-gold/60 bg-gold-soft/30 p-4">
            <div className="flex items-start gap-3">
              <FlaskConical className="mt-0.5 size-4 shrink-0 text-gold-strong" />
              <div className="text-sm leading-6 text-navy">
                <p className="font-semibold">{t("admin.demoBoxTitle")}</p>
                <p className="mt-1 text-xs text-navy/75">{t("admin.demoAuthNote")}</p>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                  <dt className="text-muted-foreground">{t("admin.email")}</dt>
                  <dd dir="ltr" className="text-start font-mono text-navy">
                    {siteConfig.demoAdmin.email}
                  </dd>
                  <dt className="text-muted-foreground">{t("admin.password")}</dt>
                  <dd dir="ltr" className="text-start font-mono text-navy">
                    {siteConfig.demoAdmin.password}
                  </dd>
                </dl>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="mt-3 text-xs font-semibold text-gold-strong hover:underline"
                >
                  {t("admin.fillDemo")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
