import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Expand, Eye, X } from "lucide-react";
import { useLang } from "@/i18n";
import {
  frameAspectClass,
  portfolioCategories,
  portfolioCategoryKey,
  type PortfolioCategory,
  type PortfolioFrame,
  type PortfolioItem,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Modal } from "./Modal";
import { SmartImage } from "./SmartImage";
import { Reveal } from "./Reveal";
import { useWhatsAppOrder } from "./WhatsAppOrder";

type Filter = "all" | PortfolioCategory;

interface PortfolioGalleryProps {
  items: PortfolioItem[];
  withFilters?: boolean;
  limit?: number;
  /** Home preview: fixed bento so tall/short photos land in matching tiles */
  layout?: "columns" | "bento";
}

const frameOf = (item: PortfolioItem): PortfolioFrame => item.frame ?? "square";

const categoryToService: Record<PortfolioCategory, string> = {
  design: "commercial-printing",
  branding: "promo-gifts",
  print: "commercial-printing",
  signage: "signage",
  packaging: "stickers-labels",
};

export function PortfolioGallery({
  items,
  withFilters = true,
  limit,
  layout = "columns",
}: PortfolioGalleryProps) {
  const { t, bi } = useLang();
  const { openOrder } = useWhatsAppOrder();
  const [filter, setFilter] = useState<Filter>("all");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const isBento = layout === "bento";

  const filtered = useMemo(() => {
    const list = filter === "all" ? items : items.filter((i) => i.category === filter);
    return limit ? list.slice(0, limit) : list;
  }, [items, filter, limit]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const i of items) c[i.category] = (c[i.category] ?? 0) + 1;
    return c;
  }, [items]);

  const preview = filtered.find((i) => i.id === previewId) ?? null;

  return (
    <div>
      {withFilters && (
        <div
          role="tablist"
          aria-label={t("pf.category")}
          className="scrollbar-thin -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {(["all", ...portfolioCategories] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                filter === f
                  ? "border-navy bg-navy text-white"
                  : "border-border bg-white text-navy/75 hover:border-gold hover:text-navy",
              )}
            >
              {f === "all" ? t("pf.filterAll") : t(portfolioCategoryKey(f))}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[0.7rem] leading-5",
                  filter === f ? "bg-gold text-navy" : "bg-muted text-muted-foreground",
                )}
              >
                {counts[f] ?? 0}
              </span>
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed bg-white p-10 text-center text-muted-foreground">
          {t("pf.noResults")}
        </p>
      ) : (
        <div
          className={cn(
            withFilters && "mt-8",
            isBento
              ? "flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory max-sm:-mx-5 max-sm:px-5 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 sm:snap-none xl:grid-cols-3 xl:gap-6 [&::-webkit-scrollbar]:hidden"
              : "columns-1 gap-5 sm:columns-2 lg:columns-3",
          )}
        >
          {filtered.map((item, i) => {
            const frame = frameOf(item);
            return (
              <Reveal
                key={item.id}
                delay={(i % 3) * 80}
                className={cn(
                  !isBento && "mb-5 break-inside-avoid",
                  isBento && "w-[min(86vw,22rem)] shrink-0 snap-center sm:w-auto sm:min-w-0",
                )}
              >
                <figure
                  className={cn(
                    "group relative overflow-hidden rounded-2xl bg-[#F5F2EE] shadow-soft",
                    isBento
                      ? cn(
                          "aspect-[4/5] min-h-[20rem] sm:min-h-0",
                          frame === "tall" && "sm:aspect-[3/4]",
                          frame === "square" && "sm:aspect-square",
                          frame === "wide" && "sm:aspect-[4/3]",
                        )
                      : frameAspectClass[frame],
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setPreviewId(item.id)}
                    className="absolute inset-0 block size-full text-start"
                    aria-label={`${t("pf.viewProject")}: ${bi(item.title)}`}
                  >
                    <SmartImage
                      src={item.image}
                      alt={bi(item.title)}
                      className="size-full object-contain object-center transition duration-700 group-hover:scale-[1.02]"
                    />
                  </button>
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent p-5 pt-16 text-white transition duration-300 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
                    <span className="text-xs font-semibold text-gold">
                      {t(portfolioCategoryKey(item.category))}
                    </span>
                    <span className="mt-1 block text-lg font-bold leading-snug">
                      {bi(item.title)}
                    </span>
                  </figcaption>
                  <div className="absolute end-3 top-3 flex gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => setLightboxId(item.id)}
                      className="flex size-10 items-center justify-center rounded-full bg-white/90 text-navy shadow transition hover:bg-gold"
                      aria-label={t("pf.zoom")}
                      title={t("pf.zoom")}
                    >
                      <Expand className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewId(item.id)}
                      className="flex size-10 items-center justify-center rounded-full bg-white/90 text-navy shadow transition hover:bg-gold"
                      aria-label={t("pf.viewProject")}
                      title={t("pf.viewProject")}
                    >
                      <Eye className="size-4" />
                    </button>
                  </div>
                </figure>
              </Reveal>
            );
          })}
        </div>
      )}

      <Modal
        open={!!preview}
        onClose={() => setPreviewId(null)}
        size="xl"
        title={preview ? bi(preview.title) : ""}
      >
        {preview && (
          <div className="grid gap-6 md:grid-cols-5">
            <button
              type="button"
              className="group relative overflow-hidden rounded-2xl md:col-span-3"
              onClick={() => setLightboxId(preview.id)}
              aria-label={t("pf.zoom")}
            >
              <SmartImage
                src={preview.image}
                alt={bi(preview.title)}
                className="aspect-[4/3] w-full bg-[#F5F2EE] object-contain"
              />
              <span className="absolute end-3 top-3 flex size-10 items-center justify-center rounded-full bg-white/90 text-navy shadow transition group-hover:bg-gold">
                <Expand className="size-4" />
              </span>
            </button>
            <div className="flex flex-col md:col-span-2">
              <span className="inline-flex w-fit rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-gold-strong">
                {t(portfolioCategoryKey(preview.category))}
              </span>
              <h3 className="mt-4 text-sm font-bold text-muted-foreground">
                {t("pf.projectDetails")}
              </h3>
              <p className="mt-2 leading-8 text-foreground">{bi(preview.description)}</p>
              <p className="mt-5 rounded-xl border border-dashed border-gold/50 bg-gold-soft/30 p-3 text-xs leading-6 text-navy/80">
                {t("home.portfolioNote")}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <button
                  type="button"
                  className="btn btn-gold btn-sm"
                  onClick={() => {
                    openOrder(categoryToService[preview.category]);
                    setPreviewId(null);
                  }}
                >
                  {t("pf.similarCta")}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setLightboxId(preview.id)}
                >
                  <Expand className="size-4" />
                  {t("pf.zoom")}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {lightboxId && (
        <Lightbox items={filtered} startId={lightboxId} onClose={() => setLightboxId(null)} />
      )}
    </div>
  );
}

function Lightbox({
  items,
  startId,
  onClose,
}: {
  items: PortfolioItem[];
  startId: string;
  onClose: () => void;
}) {
  const { t, bi, dir } = useLang();
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      items.findIndex((i) => i.id === startId),
    ),
  );
  const item = items[index];

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + items.length) % items.length),
    [items.length],
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Capture phase + stop: keep an underlying preview modal open
        e.stopPropagation();
        onClose();
      }
      // Visual "next" follows reading direction
      if (e.key === "ArrowLeft") go(dir === "rtl" ? 1 : -1);
      if (e.key === "ArrowRight") go(dir === "rtl" ? -1 : 1);
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey, true);
    };
  }, [go, onClose, dir]);

  if (!item || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-[110] flex flex-col bg-dark/95 text-white"
      role="dialog"
      aria-modal="true"
      aria-label={bi(item.title)}
      dir={dir}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate font-bold">{bi(item.title)}</p>
          <p className="text-xs text-white/60">
            {index + 1} / {items.length}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="flex size-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          aria-label={t("common.close")}
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 sm:px-20">
        <SmartImage
          key={item.id}
          src={item.image}
          alt={bi(item.title)}
          loading="eager"
          className="animate-modal-in max-h-full max-w-full rounded-xl object-contain shadow-2xl"
          fallbackClassName="h-64 w-full max-w-xl rounded-xl"
        />
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute start-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-gold hover:text-navy sm:start-5"
              aria-label={t("common.previous")}
            >
              {dir === "rtl" ? (
                <ChevronRight className="size-6" />
              ) : (
                <ChevronLeft className="size-6" />
              )}
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute end-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-gold hover:text-navy sm:end-5"
              aria-label={t("common.next")}
            >
              {dir === "rtl" ? (
                <ChevronLeft className="size-6" />
              ) : (
                <ChevronRight className="size-6" />
              )}
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
