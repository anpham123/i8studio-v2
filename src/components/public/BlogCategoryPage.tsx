import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";
import { BLOG_CATEGORIES, getCategoryAliases, getCategoryBySlugOrRoute } from "@/lib/blog-categories";

interface Props {
  locale: string;
  categorySlug: string;
  categoryKey: string;
}

export default async function BlogCategoryPage({ locale, categorySlug, categoryKey }: Props) {
  const isJa = locale === "ja";
  const catDef = getCategoryBySlugOrRoute(categorySlug);
  const aliases = getCategoryAliases(categorySlug);

  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      category: { in: aliases },
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Hero header - identical to main Blog page */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] font-medium mb-4">
            i8 STUDIO
          </p>
          <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-light text-[var(--ink)] leading-[1.2] mb-4">
            Blog
          </h1>
          <p className="text-[var(--ink-muted)] text-[15px] leading-[1.8] max-w-[500px] mx-auto">
            {isJa
              ? "制作プロセス、技術的インサイト、建築CG業界のトレンド"
              : "Production process, technical insights, and architectural CG trends."}
          </p>
        </div>
      </section>

      {/* Category navigation pills */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 mb-10">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/${locale}/blogs`}
            className="px-4 py-2 rounded-full text-[12px] font-medium tracking-wide uppercase bg-white text-gray-500 border border-[var(--line)] hover:text-[#111] transition-colors"
          >
            {isJa ? "すべて" : "All"}
          </Link>
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = cat.slug === categorySlug || cat.route === categorySlug || cat.key === categoryKey;
            return (
              <Link
                key={cat.slug}
                href={`/${locale}/blogs/${cat.route}`}
                className={`px-4 py-2 rounded-full text-[12px] font-medium tracking-wide transition-colors ${
                  isActive
                    ? "bg-[#111] text-white"
                    : "bg-white text-gray-500 border border-[var(--line)] hover:text-[#111]"
                }`}
              >
                {isJa ? cat.nameJa : cat.nameEn}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Posts Grid */}
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
                      {isJa ? (catDef?.nameJa || post.category) : (catDef?.nameEn || post.category)}
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
          <div className="text-center py-20">
            <p className="font-serif text-[24px] text-[var(--ink-muted)] font-light mb-4">
              {isJa ? "このカテゴリの記事はまだありません" : "No articles in this category yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
