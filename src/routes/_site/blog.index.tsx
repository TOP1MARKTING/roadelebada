import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useLang } from "@/i18n";
import { blogCategoryLabel, publishedPosts } from "@/data/blog";
import { img, resolveImage } from "@/lib/assets";
import { seo } from "@/lib/seo";
import { useAppData } from "@/store/app-data";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SmartImage } from "@/components/site/SmartImage";
import { ContactStrip } from "@/components/site/sections";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/_site/blog/")({
  head: () =>
    seo({
      title: "المدونة",
      description: "مقالات عن تصميم المواقع وتحسين محركات البحث من وكالة رواد الإبداع.",
      path: "/blog",
      image: img("pf-cards"),
    }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { t, bi, formatDate, dir } = useLang();
  const { posts } = useAppData();
  const list = publishedPosts(posts);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  useDocumentTitle(t("page.blogTitle"));

  return (
    <>
      <PageHero
        title={t("page.blogTitle")}
        description={t("page.blogDesc")}
        image={img("pf-cards")}
        imageAlt={t("blog.heroAlt")}
        kicker={t("blog.kicker")}
        crumbs={[{ label: t("page.blogTitle") }]}
      />

      <section className="py-16 sm:py-20">
        <div className="container-x">
          {list.length === 0 ? (
            <p className="rounded-2xl border border-dashed bg-white p-10 text-center text-muted-foreground">
              {t("blog.empty")}
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => {
                const cover = resolveImage(p.coverImage) || img("pf-cards");
                return (
                  <Reveal key={p.id} delay={i * 60}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                      <Link to="/blog/$slug" params={{ slug: p.slug }} className="relative block aspect-[16/10] overflow-hidden">
                        <SmartImage
                          src={cover}
                          alt={bi(p.coverAlt) || bi(p.title)}
                          className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                        {p.featured && (
                          <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy/90 px-2.5 py-1 text-[0.7rem] font-bold text-gold">
                            <Star className="size-3 fill-gold" />
                            {t("blog.featured")}
                          </span>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full bg-gold-soft px-2.5 py-0.5 font-semibold text-gold-strong">
                            {bi(blogCategoryLabel[p.category])}
                          </span>
                          {p.publishedAt && <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>}
                        </div>
                        <h2 className="mt-3 text-lg font-extrabold leading-7 text-navy">
                          <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-gold-strong">
                            {bi(p.title)}
                          </Link>
                        </h2>
                        {bi(p.excerpt) && (
                          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground">
                            {bi(p.excerpt)}
                          </p>
                        )}
                        <Link
                          to="/blog/$slug"
                          params={{ slug: p.slug }}
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-gold-strong hover:underline"
                        >
                          {t("common.readMore")}
                          <Arrow className="size-3.5" />
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <ContactStrip />
    </>
  );
}
