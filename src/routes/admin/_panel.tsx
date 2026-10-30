import { useEffect, useState } from "react";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { hasDemoSession } from "@/lib/admin-auth";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/_panel")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: PanelGuard,
});

/** Client-side mock guard: redirects to the demo login when no demo session flag exists. */
function PanelGuard() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (hasDemoSession()) setAllowed(true);
    else navigate({ to: "/admin/login", replace: true });
  }, [navigate]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6]">
        <Loader2 className="size-6 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
