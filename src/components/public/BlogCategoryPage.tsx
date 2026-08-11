import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";
import { getTranslations } from "next-intl/server";

interface Props {
  locale: string;
  categorySlug: string;
  categoryKey: string; // key in blogCategory i18n namespace
}

export default async function BlogCategoryPage({ locale, categorySlug, categoryKey }: Props) {
  const t = await getTranslations({ locale, namespace: "blogCategory" });
  const isJa = locale === "ja";

  const categoryTitle = t(`${categoryKey}.title`);
  const categoryDesc = t(`${categoryKey}.desc`);

  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true, category: categorySlug },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Hero */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] font-medium mb-4">
            BLOG
          </p>
          <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-light text-[var(--ink)] leading-[1.2] mb-4">
            {categoryTitle}
          </h1>
          <p className="text-[var(--ink-muted)] text-[15px] leading-[1.8] max-w-[500px] mx-auto">
            {categoryDesc}
          </p>
        </div>
      </section>

      {/* Category navigation */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 mb-10">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/${locale}/blogs`} className="px-4 py-2 rounded-full text-[12px] font-medium tracking-wide uppercase bg-white text-gray-500 border border-[var(--line)] hover:text-[#111] transition-colors">
            {isJa ? "すべて" : "All"}
          </Link>
          {[
            { slug: "case-study", key: "caseStudy", route: "case-study" },
            { slug: "technique", key: "technique", route: "tips" },
            { slug: "knowledge", key: "knowledge", route: "knowledge" },
            { slug: "ai", key: "ai", route: "ai-feature" },
            { slug: "life-gallery", key: "lifeGallery", route: "life-gallery" },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/${locale}/blogs/${cat.route}`}
              className={`px-4 py-2 rounded-full text-[12px] font-medium tracking-wide transition-colors ${
                cat.slug === categorySlug
                  ? "bg-[#111] text-white"
                  : "bg-white text-gray-500 border border-[var(--line)] hover:text-[#111]"
              }`}
            >
              {t(`${cat.key}.title`)}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 pb-20">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/blogs/${post.slug}`}
                className="group block bg-white border border-[var(--line)] rounded-sm overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {(post.coverImage || post.heroImage) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={post.coverImage || post.heroImage}
                      alt={post.title.replace(/<[^>]*>/g, "")}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1e1b14] to-[#2a2318]" />
                  )}
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[var(--accent)] text-[11px] uppercase tracking-[0.16em] font-medium">
                      {categoryTitle}
                    </span>
                    <span className="text-[var(--ink-muted)] text-[11px]">·</span>
                    <span className="text-[var(--ink-muted)] text-[11px]">
                      {post.publishedAt ? formatDate(post.publishedAt) : ""}
                    </span>
                  </div>
                  <h3
                    className="font-serif text-[18px] sm:text-[20px] font-normal text-[var(--ink)] leading-[1.4] mb-3"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title) }}
                  />
                  {post.excerpt && (
                    <p className="text-[14px] text-[var(--ink-light)] leading-[1.7] line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="text-[var(--accent)] text-[12px] font-medium tracking-wider uppercase group-hover:underline">
                    {isJa ? "続きを読む →" : "Read more →"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty state with design */
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#fafaf8] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gray-300">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <p className="font-serif text-[24px] text-[var(--ink-muted)] font-light mb-3">
              {t("emptyState")}
            </p>
            <Link href={`/${locale}/blogs`} className="text-[var(--accent)] text-sm font-medium hover:underline">
              {isJa ? "すべての記事を見る →" : "View all articles →"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
