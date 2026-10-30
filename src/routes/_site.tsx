import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/_site")({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});
