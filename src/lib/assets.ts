import about1 from "@/assets/about-1.jpg";
import about2 from "@/assets/about-2.jpg";
import businessCards from "@/assets/business-cards.jpg";
import catAwards from "@/assets/cat-awards.png";
import catDisplays from "@/assets/cat-displays.png";
import catGifts from "@/assets/cat-gifts.png";
import catOccasions from "@/assets/cat-occasions.png";
import catPrint from "@/assets/cat-print.png";
import catSignage from "@/assets/cat-signage.png";
import catStickers from "@/assets/cat-stickers.png";
import hero from "@/assets/hero.jpg";
import largeFormat from "@/assets/large-format.jpg";
import logo from "@/assets/logo.png";
import packaging from "@/assets/packaging.jpg";
import pfApparel from "@/assets/pf-apparel.jpg";
import pfBanner from "@/assets/pf-banner.jpg";
import pfBoxes from "@/assets/pf-boxes.jpg";
import pfCards from "@/assets/pf-cards.jpg";
import pfCardsDesk from "@/assets/pf-cards-desk.jpg";
import pfCardsGold from "@/assets/pf-cards-gold.jpg";
import pfMerch from "@/assets/pf-merch.jpg";
import pfPackaging from "@/assets/pf-packaging.jpg";
import pfTote from "@/assets/pf-tote.jpg";
import pfWorkspace from "@/assets/pf-workspace.jpg";
import printingPress from "@/assets/printing-press.jpg";
import storefrontSign from "@/assets/storefront-sign.jpg";
import studioPress from "@/assets/studio-press.jpg";
import svcAds from "@/assets/svc-ads.jpg";
import svcBranding from "@/assets/svc-branding.jpg";
import svcDesign from "@/assets/svc-design.jpg";
import svcPrint from "@/assets/svc-print.jpg";
import svcSignage from "@/assets/svc-signage.jpg";
import svcStickers from "@/assets/svc-stickers.jpg";

/**
 * Bundled image library. Records saved in localStorage reference these by
 * `asset:<key>` tokens instead of hashed build URLs, so saved prototype data
 * keeps working across rebuilds.
 * Category circle photos: orange-studio set (2026-10-27).
 */
export const assetLibrary = {
  logo,
  hero,
  "studio-press": studioPress,
  "about-designer": about1,
  "about-signage": about2,
  "svc-design": svcDesign,
  "svc-print": svcPrint,
  "svc-signage": svcSignage,
  "svc-stickers": svcStickers,
  "svc-branding": svcBranding,
  "svc-ads": svcAds,
  "pf-banner": pfBanner,
  "pf-cards": pfCards,
  "pf-packaging": pfPackaging,
  "pf-apparel": pfApparel,
  "pf-merch": pfMerch,
  "pf-boxes": pfBoxes,
  "pf-cards-desk": pfCardsDesk,
  "pf-cards-gold": pfCardsGold,
  "pf-workspace": pfWorkspace,
  "pf-tote": pfTote,
  "printing-press": printingPress,
  "large-format": largeFormat,
  "business-cards": businessCards,
  "storefront-sign": storefrontSign,
  packaging,
  "cat-print": catPrint,
  "cat-stickers": catStickers,
  "cat-gifts": catGifts,
  "cat-signage": catSignage,
  "cat-displays": catDisplays,
  "cat-occasions": catOccasions,
  "cat-awards": catAwards,
} as const;

export type AssetKey = keyof typeof assetLibrary;

export const assetToken = (key: AssetKey) => `asset:${key}`;

export const assetKeys = Object.keys(assetLibrary) as AssetKey[];

/** Resolve an `asset:<key>` token or pass a plain URL through. */
export function resolveImage(src: string | undefined | null): string {
  if (!src) return "";
  if (src.startsWith("asset:")) {
    const key = src.slice(6) as AssetKey;
    return assetLibrary[key] ?? "";
  }
  return src;
}

export const img = (key: AssetKey) => assetLibrary[key];
