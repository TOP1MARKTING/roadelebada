import { siteConfig } from "@/config/site";
import { img } from "@/lib/assets";

interface SeoInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}

/** Route `head()` payload with title, description, canonical and Open Graph tags. */
export function seo({ title, description, path, image, noindex }: SeoInput) {
  const fullTitle = title === siteConfig.nameAr ? title : `${title} | ${siteConfig.nameAr}`;
  const url = `${siteConfig.siteUrl}${path}`;
  const ogImage = `${siteConfig.siteUrl}${image ?? img("hero")}`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
