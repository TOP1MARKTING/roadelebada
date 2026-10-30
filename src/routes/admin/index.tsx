import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { hasDemoSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: AdminIndex,
});

function AdminIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: hasDemoSession() ? "/admin/dashboard" : "/admin/login", replace: true });
  }, [navigate]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy">
      <Loader2 className="size-6 animate-spin text-gold" />
    </div>
  );
}
