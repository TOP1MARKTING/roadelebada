import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Modal } from "./Modal";
import { QuoteForm } from "./QuoteForm";
import { useLang } from "@/i18n";

type WhatsAppOrderContextValue = {
  open: boolean;
  serviceSlug?: string;
  openOrder: (serviceSlug?: string) => void;
  closeOrder: () => void;
};

const WhatsAppOrderContext = createContext<WhatsAppOrderContextValue | null>(null);

export function WhatsAppOrderProvider({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [serviceSlug, setServiceSlug] = useState<string | undefined>();
  const handledOrderRef = useRef<string | null>(null);

  const orderParam = useRouterState({
    select: (s) => {
      const search = s.location.search as { order?: unknown };
      return typeof search?.order === "string" && search.order ? search.order : undefined;
    },
  });

  const openOrder = useCallback((slug?: string) => {
    setServiceSlug(slug);
    setOpen(true);
  }, []);

  const closeOrder = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!orderParam || handledOrderRef.current === orderParam) return;
    handledOrderRef.current = orderParam;
    setServiceSlug(orderParam === "1" ? undefined : orderParam);
    setOpen(true);
    void navigate({ to: "/", search: {}, replace: true });
  }, [navigate, orderParam]);

  const value = useMemo(
    () => ({ open, serviceSlug, openOrder, closeOrder }),
    [open, serviceSlug, openOrder, closeOrder],
  );

  return (
    <WhatsAppOrderContext.Provider value={value}>
      {children}
      <Modal
        open={open}
        onClose={closeOrder}
        size="lg"
        title={t("nav.quote")}
        description={t("quote.modalDesc")}
        className="max-h-[92vh]"
      >
        <QuoteForm
          key={serviceSlug ?? "all"}
          initialService={serviceSlug}
          onSent={closeOrder}
        />
      </Modal>
    </WhatsAppOrderContext.Provider>
  );
}

export function useWhatsAppOrder() {
  const ctx = useContext(WhatsAppOrderContext);
  if (!ctx) {
    throw new Error("useWhatsAppOrder must be used within WhatsAppOrderProvider");
  }
  return ctx;
}
