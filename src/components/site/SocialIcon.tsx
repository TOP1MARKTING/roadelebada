import { Ghost, Instagram, Music2 } from "lucide-react";
import type { SocialKey } from "@/config/site";

export const socialLabels: Record<SocialKey, string> = {
  twitter: "X (Twitter)",
  instagram: "Instagram",
  snapchat: "Snapchat",
  tiktok: "TikTok",
};

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

export function SocialIcon({
  name,
  className = "size-4",
}: {
  name: SocialKey;
  className?: string;
}) {
  switch (name) {
    case "twitter":
      return <XLogo className={className} />;
    case "instagram":
      return <Instagram className={className} aria-hidden />;
    case "snapchat":
      return <Ghost className={className} aria-hidden />;
    case "tiktok":
      return <Music2 className={className} aria-hidden />;
  }
}

/** Simple WhatsApp-style glyph (speech bubble with handset). */
export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path strokeLinejoin="round" d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.4l-4.5 1.1Z" />
      <path
        fill="currentColor"
        stroke="none"
        d="M9.2 7.6c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.4l.8 1.8c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.4 0 .5.5.9 1.2 1.6 2.1 2.1.2.1.4.1.5 0l.7-.6c.2-.1.4-.2.6-.1l1.8.8c.3.1.4.3.4.5v.5c0 .3-.1.6-.4.8-.5.4-1.1.6-1.8.5-1.2-.2-2.4-.8-3.6-1.9-1.2-1.1-2-2.4-2.3-3.6-.2-.8 0-1.6.4-2.1Z"
      />
    </svg>
  );
}
