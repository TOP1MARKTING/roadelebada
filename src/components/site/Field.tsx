import type { ReactNode } from "react";
import { useLang } from "@/i18n";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export function Field({
  id,
  label,
  required,
  optional,
  error,
  hint,
  className,
  children,
}: FieldProps) {
  const { t } = useLang();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span className="ms-1 text-[#b42318]" aria-hidden>
            *
          </span>
        )}
        {optional && (
          <span className="ms-1.5 text-xs font-normal text-muted-foreground">
            ({t("common.optional")})
          </span>
        )}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className={cn("field-error")}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Props wiring an input to its Field error message. */
export const errorProps = (id: string, error?: string) => ({
  id,
  name: id,
  "aria-invalid": error ? (true as const) : undefined,
  "aria-describedby": error ? `${id}-error` : undefined,
});
