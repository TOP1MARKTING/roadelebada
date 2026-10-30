import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  tone?: "light" | "dark";
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = "start",
  tone = "dark",
  action,
  className,
  as: H = "h2",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-6",
        align === "center"
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {kicker && (
          <p
            className={cn(
              "kicker",
              tone === "light" && "!border-white/35 !bg-white/15 !text-white",
            )}
          >
            {kicker}
          </p>
        )}
        <H
          className={cn(
            "mt-3 text-3xl font-extrabold sm:text-4xl",
            tone === "light" ? "text-white" : "text-navy",
          )}
        >
          {title}
        </H>
        {description && (
          <p
            className={cn(
              "mt-4 text-base leading-8",
              tone === "light" ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
