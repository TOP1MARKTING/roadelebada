import { useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, Check, FlaskConical, ImagePlus, Search, X } from "lucide-react";
import { useLang } from "@/i18n";
import { assetKeys, assetToken, resolveImage } from "@/lib/assets";
import type { QuoteStatus } from "@/data/demo";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/site/Modal";
import { SmartImage } from "@/components/site/SmartImage";

/* ---------------------------------------------------------- Page header */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold text-navy sm:text-[1.75rem]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ------------------------------------------------------------ Demo note */

export function DemoNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-md border border-gold/40 bg-gold-soft/40 px-3.5 py-2.5 text-xs leading-5 text-navy",
        className,
      )}
    >
      <FlaskConical className="mt-0.5 size-3.5 shrink-0 text-gold-strong" />
      <div>{children}</div>
    </div>
  );
}

export function DemoBadge() {
  const { t } = useLang();
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2 py-0.5 text-[0.68rem] font-semibold text-gold-strong">
      <FlaskConical className="size-3" />
      {t("admin.dash.demoBadge")}
    </span>
  );
}

/* --------------------------------------------------------------- Card */

export function Card({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-lg border bg-card shadow-soft", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b px-5 py-3.5">
          {title && <h2 className="text-[0.95rem] font-bold text-navy">{title}</h2>}
          {action}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/* ---------------------------------------------------------- Search box */

export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  const { t } = useLang();
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="field !min-h-10 !py-2 ps-9 pe-9 text-sm [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-navy"
          aria-label={t("admin.common.clearSearch")}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- Switch */

export function Switch({
  checked,
  onChange,
  label,
  disabled,
  size = "md",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
        size === "sm" ? "h-5 w-9" : "h-6 w-11",
        checked ? "bg-emerald-600" : "bg-slate-300",
      )}
    >
      <span
        className={cn(
          "inline-block rounded-full bg-white shadow transition-transform",
          size === "sm" ? "size-4" : "size-5",
          checked
            ? size === "sm"
              ? "ltr:translate-x-[1.125rem] rtl:-translate-x-[1.125rem]"
              : "ltr:translate-x-[1.375rem] rtl:-translate-x-[1.375rem]"
            : "ltr:translate-x-0.5 rtl:-translate-x-0.5",
        )}
      />
    </button>
  );
}

/* ------------------------------------------------------- Status badges */

const quoteStatusStyles: Record<QuoteStatus, string> = {
  new: "bg-sky-50 text-sky-700 ring-sky-600/20",
  review: "bg-amber-50 text-amber-800 ring-amber-600/25",
  contacted: "bg-violet-50 text-violet-700 ring-violet-600/20",
  done: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const quoteStatusDot: Record<QuoteStatus, string> = {
  new: "bg-sky-500",
  review: "bg-amber-500",
  contacted: "bg-violet-500",
  done: "bg-emerald-500",
  cancelled: "bg-slate-400",
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const { t } = useLang();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        quoteStatusStyles[status],
      )}
    >
      <span className={cn("size-1.5 rounded-full", quoteStatusDot[status])} />
      {t(`admin.status.${status}`)}
    </span>
  );
}

export function PillBadge({
  tone,
  children,
}: {
  tone: "green" | "gray" | "gold" | "blue";
  children: ReactNode;
}) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    gray: "bg-slate-100 text-slate-600 ring-slate-500/20",
    gold: "bg-gold-soft text-gold-strong ring-gold/30",
    blue: "bg-sky-50 text-sky-700 ring-sky-600/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        styles[tone],
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------------------------------------- Icon button */

export function IconButton({
  label,
  onClick,
  children,
  tone = "default",
  disabled,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  tone?: "default" | "danger";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition disabled:opacity-40",
        tone === "danger" ? "hover:bg-red-50 hover:text-red-700" : "hover:bg-muted hover:text-navy",
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------- Confirm dialog */

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: ReactNode;
  confirmLabel?: string;
}) {
  const { t } = useLang();
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title={title ?? t("admin.common.confirmDelete")}
      footer={
        <>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose} data-autofocus>
            {t("admin.common.cancel")}
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel ?? t("admin.common.yesDelete")}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="size-5" />
        </span>
        <div className="text-sm leading-6 text-foreground/80">
          {message ?? t("admin.common.deleteWarning")}
        </div>
      </div>
    </Modal>
  );
}

/* ----------------------------------------------------------- Dropdown */

export function Dropdown({
  trigger,
  children,
  align = "end",
  className,
  label,
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "start" | "end";
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      {open && (
        <div
          role="menu"
          aria-label={label}
          className={cn(
            "animate-drop-in absolute top-full z-50 mt-2 overflow-hidden rounded-lg border bg-card shadow-lift",
            align === "end" ? "end-0" : "start-0",
            className,
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------- Empty state */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" />
      </span>
      <p className="mt-4 font-bold text-navy">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* --------------------------------------------------------- Image picker */

export function ImagePicker({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const { t } = useLang();
  const isAsset = value.startsWith("asset:");
  const [url, setUrl] = useState(isAsset ? "" : value);

  useEffect(() => {
    if (!value.startsWith("asset:")) setUrl(value);
  }, [value]);

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="size-20 shrink-0 overflow-hidden rounded-md border bg-muted">
          {resolveImage(value) ? (
            <SmartImage src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImagePlus className="size-6" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            type="url"
            dir="ltr"
            className="field text-start text-sm"
            placeholder="https://images.example.com/photo.jpg"
            value={url}
            aria-invalid={error ? true : undefined}
            onChange={(e) => {
              setUrl(e.target.value);
              onChange(e.target.value.trim());
            }}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {isAsset ? t("admin.image.fromLibrary") : t("admin.image.urlHint")}
          </p>
          {error && <p className="field-error">{error}</p>}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          {t("admin.image.library")}
        </p>
        <div className="scrollbar-thin grid max-h-40 grid-cols-6 gap-2 overflow-y-auto pe-1 sm:grid-cols-9">
          {assetKeys.map((k) => {
            const token = assetToken(k);
            const selected = value === token;
            return (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setUrl("");
                  onChange(token);
                }}
                aria-label={k}
                aria-pressed={selected}
                className={cn(
                  "relative aspect-square overflow-hidden rounded border-2 transition",
                  selected ? "border-gold" : "border-transparent hover:border-gold/50",
                )}
              >
                <SmartImage src={token} alt="" className="h-full w-full object-cover" />
                {selected && (
                  <span className="absolute inset-0 flex items-center justify-center bg-navy/50 text-gold">
                    <Check className="size-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Shared table header cell / cell classes */
export const th =
  "whitespace-nowrap px-4 py-3 text-start text-xs font-semibold text-muted-foreground";
export const td = "px-4 py-3 align-middle";
