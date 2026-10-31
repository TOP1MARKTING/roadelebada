import { createFileRoute, redirect } from "@tanstack/react-router";

interface QuoteSearch {
  service?: string;
}

export const Route = createFileRoute("/_site/quote")({
  validateSearch: (search: Record<string, unknown>): QuoteSearch =>
    typeof search.service === "string" && search.service ? { service: search.service } : {},
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/",
      search: { order: search.service ?? "1" },
      replace: true,
    });
  },
});
