import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/i18n";
import { blogCategoryLabel, publishedPosts } from "@/data/blog";
import { img, resolveImage } from "@/lib/assets";
import { prepareBlogHtml } from "@/lib/blog-html";
import { seo } from "@/lib/seo";
import { useAppData } from "@/store/app-data";
import { SmartImage } from "@/components/site/SmartImage";
import { ContactStrip } from "@/components/site/sections";
import { useDocumentTitle } from "@/components/site/useDocumentTitle";

export const Route = createFileRoute("/_site/blog/$slug")({
  head: ({ params }) =>
    seo({
      title: "مقال",
      description: "مقال من مدونة وكالة رواد الإبداع.",
      path: `/blog/${params.slug}`,
      image: img("pf-cards"),
    }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { t, bi, formatDate, dir } = useLang();
  const { posts, staff, hydrated } = useAppData();
  const post = publishedPosts(posts).find((p) => p.slug === slug);
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const title = post ? bi(post.metaTitle) || bi(post.title) : t("blog.notFound");
  useDocumentTitle(title);

  if (!post) {
    return (
      <section className="bg-navy py-24 text-center text-white">
        <div className="container-x">
          <h1 className="text-3xl font-extrabold">{hydrated ? t("blog.notFound") : "…"}</h1>
          {hydrated && (
            <>
              <p className="mx-auto mt-3 max-w-md text-white/70">{t("blog.notFoundDesc")}</p>
              <Link to="/blog" className="btn btn-gold btn-sm mt-8">
                {t("blog.backToList")}
              </Link>
            </>
          )}
        </div>
      </section>
    );
  }

  const cover = resolveImage(post.coverImage) || img("pf-cards");
  const author = post.authorId ? staff.find((s) => s.id === post.authorId) : null;
  const html = prepareBlogHtml(bi(post.contentHtml) || post.contentHtml.en);

  return (
    <>
      <article>
        <header className="relative overflow-hidden bg-navy text-white">
          <div className="absolute inset-0">
            <SmartImage src={cover} alt="" className="size-full object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/50" />
          </div>
          <div className="container-x relative pb-10 pt-[5.5rem] sm:py-24">
            <nav className="mb-4 text-xs text-white/70 sm:mb-6 sm:text-sm" aria-label={t("common.breadcrumb")}>
              <Link to="/" className="hover:text-gold">
                {t("nav.home")}
              </Link>
              <span className="mx-2 opacity-50">/</span>
              <Link to="/blog" className="hover:text-gold">
                {t("nav.blog")}
              </Link>
            </nav>
            <p className="inline-flex rounded-full bg-gold-soft/20 px-3 py-1 text-[0.7rem] font-bold text-gold sm:text-xs">
              {bi(blogCategoryLabel[post.category])}
            </p>
            <h1 className="mt-3 max-w-3xl text-[1.7rem] font-extrabold leading-tight sm:mt-4 sm:text-4xl lg:text-5xl">
              {bi(post.title)}
            </h1>
            {bi(post.excerpt) && (
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:mt-4 sm:text-lg sm:leading-8">
                {bi(post.excerpt)}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/65 sm:mt-6 sm:text-sm">
              {author && <span>{author.name}</span>}
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              )}
            </div>
          </div>
        </header>

        <div className="container-x py-8 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <SmartImage
              src={cover}
              alt={bi(post.coverAlt) || bi(post.title)}
              className="mb-6 aspect-[16/9] w-full rounded-2xl object-cover shadow-lift sm:mb-10"
            />
            <div
              className="prose-blog text-[0.98rem] leading-7 text-foreground/90 sm:text-[1.05rem] sm:leading-8 [&_a]:font-semibold [&_a]:text-gold-strong [&_a]:underline-offset-2 hover:[&_a]:underline [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-muted-foreground [&_figure]:my-6 sm:[&_figure]:my-8 [&_h2]:mt-8 [&_h2]:scroll-mt-28 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-navy sm:[&_h2]:mt-10 sm:[&_h2]:text-2xl [&_h3]:mt-6 [&_h3]:scroll-mt-28 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-navy sm:[&_h3]:mt-8 sm:[&_h3]:text-xl [&_img]:my-4 [&_img]:rounded-xl [&_p]:my-3.5 sm:[&_p]:my-4 [&_strong]:text-navy"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            {post.tags.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2 border-t pt-6 sm:mt-12 sm:pt-8" aria-label={t("blog.tags")}>
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border bg-muted/60 px-3 py-1 text-xs font-semibold text-navy"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10">
              <Link to="/blog" className="btn btn-outline btn-sm">
                <Arrow className="size-4" />
                {t("blog.backToList")}
              </Link>
            </div>
          </div>
        </div>
      </article>
      <ContactStrip />
    </>
  );
}
