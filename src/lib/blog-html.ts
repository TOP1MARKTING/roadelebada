import { slugify } from "@/data/blog";

/** Light sanitize for admin-authored HTML shown on the public blog. */
export function sanitizeBlogHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");
}

/** Ensure h2/h3 have stable ids so in-article anchors work. */
export function withHeadingIds(html: string) {
  const used = new Set<string>();
  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_full, level, attrs, inner) => {
    const text = String(inner).replace(/<[^>]+>/g, "").trim();
    let id = /id\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1] || slugify(text) || "section";
    let base = id;
    let n = 2;
    while (used.has(id)) {
      id = `${base}-${n++}`;
    }
    used.add(id);
    const cleaned = String(attrs).replace(/\s*id\s*=\s*["'][^"']*["']/i, "");
    return `<h${level}${cleaned} id="${id}">${inner}</h${level}>`;
  });
}

export function prepareBlogHtml(html: string) {
  return withHeadingIds(sanitizeBlogHtml(html || ""));
}
