import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useLang } from "@/i18n";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  /** Hide the default header (for custom layouts like lightboxes) */
  bare?: boolean;
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-[min(96vw,1400px)]",
};

/** Accessible modal dialog: Escape / backdrop to close, focus moved in and restored, body scroll locked. */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  bare,
}: ModalProps) {
  const { t, dir } = useLang();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      const target = panelRef.current?.querySelector<HTMLElement>(
        "[data-autofocus], input:not([type=hidden]), select, textarea, button:not([data-modal-close])",
      );
      (target ?? panelRef.current)?.focus();
    }, 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      dir={dir}
    >
      <div
        className="animate-fade-in absolute inset-0 bg-dark/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          "animate-modal-in relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-xl bg-card shadow-lift outline-none sm:rounded-3xl",
          sizes[size],
          className,
        )}
      >
        {!bare && (
          <div className="flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
            <div className="min-w-0">
              {title && (
                <h2 id={titleId} className="text-lg font-bold text-navy">
                  {title}
                </h2>
              )}
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            <button
              type="button"
              data-modal-close
              onClick={onClose}
              className="-me-2 rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-navy"
              aria-label={t("common.close")}
            >
              <X className="size-5" />
            </button>
          </div>
        )}
        <div className={cn("min-h-0 flex-1 overflow-y-auto", !bare && "px-5 py-5 sm:px-6")}>
          {children}
        </div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/40 px-5 py-3.5 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
